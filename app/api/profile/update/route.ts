import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

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

    // 2. Parse body parameters
    const body = await request.json();
    const { accentColor } = body;

    const validColors = ['pink', 'blue', 'green', 'cyan', 'orange'];
    if (!accentColor || !validColors.includes(accentColor)) {
      return NextResponse.json({ error: 'Invalid accent color' }, { status: 400 });
    }

    // 3. Update the accent color in the profiles table using adminClient to ensure it updates securely
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('profiles')
      .update({ accent_color: accentColor })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to update profile accent color on server:', error);
      return NextResponse.json({ error: 'Failed to update visual theme.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API profile update server crash:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error occurred' },
      { status: 500 }
    );
  }
}
