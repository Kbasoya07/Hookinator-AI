import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    // 1. Authorize the user session using client cookies
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // 2. Cascade delete user records (STRICT ORDER to handle foreign keys)
    
    // First, delete optimizations history associated with the user
    const { error: optErr } = await adminClient
      .from('optimizations')
      .delete()
      .eq('user_id', user.id);

    if (optErr) {
      console.error('Failed to cascade delete optimizations:', optErr);
      return NextResponse.json(
        { error: 'Failed to clear user optimization history.' },
        { status: 500 }
      );
    }

    // Second, delete the user profile row
    const { error: profileErr } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileErr) {
      console.error('Failed to cascade delete profile:', profileErr);
      return NextResponse.json(
        { error: 'Failed to clear user profile settings.' },
        { status: 500 }
      );
    }

    // Third, delete the auth user record from Supabase Auth admin panel
    const { error: authErr } = await adminClient.auth.admin.deleteUser(user.id);

    if (authErr) {
      console.error('Failed to delete user account from Auth:', authErr);
      return NextResponse.json(
        { error: 'Failed to delete authentication user.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion handler exception:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error occurred' },
      { status: 500 }
    );
  }
}
