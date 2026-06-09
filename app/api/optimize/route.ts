export const runtime = 'edge';
export const preferredRegion = 'bom1';
export const maxDuration = 30;

import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { optimizeHook, generateMetadata } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    // 1. Authorize the user session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse input parameters
    const body = await request.json();
    const { toolType, currentTitle, currentDescription, topic, genre } = body;

    if (!toolType || (toolType !== 'optimize' && toolType !== 'generate')) {
      return NextResponse.json({ error: 'Invalid tool type' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // 3. Apply Database Rate Limiting (Max 10 calls per minute)
    const { data: withinLimit, error: rateLimitError } = await adminClient
      .rpc('check_rate_limit', {
        p_user_id: user.id,
        p_max_requests: 10,
        p_window_minutes: 1,
      });

    if (rateLimitError) {
      console.error('Rate limit RPC failed:', rateLimitError);
      // We continue to avoid completely locking users out if the rate limiter glitches
    } else if (withinLimit === false) {
      return NextResponse.json(
        { error: 'Too many requests. Slow down.' },
        { status: 429 }
      );
    }

    // 4. Deduct credit (try RPC first, fallback to JS queries if missing)
    let creditDeducted = false;

    const { data: rpcData, error: rpcError } = await adminClient
      .rpc('deduct_credit', {
        user_id: user.id,
        tool_type: toolType,
      });

    if (!rpcError) {
      creditDeducted = !!rpcData;
    } else {
      console.warn('RPC credit deduction failed, trying JS fallback:', rpcError.message);

      // Fallback: SELECT current credits
      const { data: profile, error: selectError } = await adminClient
        .from('profiles')
        .select('monthly_credits, top_up_credits, optimizations_left, generations_left, hashtags_left')
        .eq('id', user.id)
        .single();

      if (selectError || !profile) {
        console.error('JS select fallback failed:', selectError);
        return NextResponse.json(
          { error: 'Failed to process account limits.' },
          { status: 500 }
        );
      }

      let updateData: Record<string, number> = {};
      let hasCredit = false;

      if ((profile.monthly_credits ?? 0) > 0) {
        updateData = { monthly_credits: profile.monthly_credits - 1 };
        hasCredit = true;
      } else if ((profile.top_up_credits ?? 0) > 0) {
        updateData = { top_up_credits: profile.top_up_credits - 1 };
        hasCredit = true;
      } else {
        if (toolType === 'optimize') {
          if ((profile.optimizations_left ?? 0) > 0) {
            updateData = { optimizations_left: profile.optimizations_left - 1 };
            hasCredit = true;
          }
        } else if (toolType === 'generate') {
          if ((profile.generations_left ?? 0) > 0 && (profile.hashtags_left ?? 0) >= 7) {
            updateData = {
              generations_left: profile.generations_left - 1,
              hashtags_left: profile.hashtags_left - 7,
            };
            hasCredit = true;
          }
        }
      }

      if (!hasCredit) {
        return NextResponse.json(
          { error: 'Limit reached. Upgrade to Pro.' },
          { status: 403 }
        );
      }

      // UPDATE the profile with deducted credits
      const { error: updateError } = await adminClient
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        console.error('JS update fallback failed:', updateError);
        return NextResponse.json(
          { error: 'Failed to process account limits.' },
          { status: 500 }
        );
      }

      creditDeducted = true;
    }

    if (!creditDeducted) {
      return NextResponse.json(
        { error: 'Limit reached. Upgrade to Pro.' },
        { status: 403 }
      );
    }

    // 5. Execute Gemini AI Content Generation
    let outputTitle = '';
    let outputDescription = '';
    let hashtagsResult: string[] = [];

    if (toolType === 'optimize') {
      if (!currentTitle || !currentDescription) {
        return NextResponse.json(
          { error: 'Title and description are required for optimization.' },
          { status: 400 }
        );
      }
      const aiResponse = await optimizeHook(currentTitle, currentDescription);
      outputTitle = aiResponse.optimizedTitle;
      outputDescription = aiResponse.optimizedDescription;
      hashtagsResult = aiResponse.hashtags;
    } else {
      if (!topic || !genre) {
        return NextResponse.json(
          { error: 'Topic and genre are required for generation.' },
          { status: 400 }
        );
      }
      const aiResponse = await generateMetadata(topic, genre);
      outputTitle = aiResponse.title;
      outputDescription = aiResponse.description;
      hashtagsResult = aiResponse.hashtags;
    }

    // 6. Log the transaction in the optimizations table
    const { data: insertedData, error: logError } = await adminClient
      .from('optimizations')
      .insert({
        user_id: user.id,
        tool_type: toolType,
        input_title: currentTitle || topic || null,
        input_description: currentDescription || genre || null,
        output_title: outputTitle,
        output_description: outputDescription,
        hashtags: hashtagsResult,
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Failed to log optimization history:', logError);
      // We continue since the user shouldn't be penalized with a 500 error if history logging glitches
    }

    // 7. Return response back to frontend
    return NextResponse.json({
      id: insertedData?.id || null,
      title: outputTitle,
      description: outputDescription,
      hashtags: hashtagsResult,
    });
  } catch (error) {
    console.error('API optimization server crash:', error);
    
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('status 429')) {
      return NextResponse.json(
        { error: 'AI service rate limit exceeded. Please wait a few seconds and try again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error occurred' },
      { status: 500 }
    );
  }
}
