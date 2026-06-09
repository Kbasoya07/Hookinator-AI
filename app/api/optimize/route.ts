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

    // 4. Deduct credit atomically using DB-level RPC function
    const { data: creditDeducted, error: rpcError } = await adminClient
      .rpc('deduct_credit', {
        user_id: user.id,
        tool_type: toolType,
      });

    if (rpcError) {
      console.error('RPC credit deduction failed:', rpcError);
      return NextResponse.json(
        { error: 'Failed to process account limits.' },
        { status: 500 }
      );
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
