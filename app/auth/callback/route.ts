import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  try {
    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        // Ensure a profile row exists for this user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email!,
              plan: 'free',
              optimizations_left: 50,
              generations_left: 30,
              hashtags_left: 70,
              monthly_credits: 0,
              top_up_credits: 0,
              accent_color: 'pink',
            });

          if (profileError) {
            console.warn('Profile sync warning in callback:', profileError.message);
          }
        }
        
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalHost = origin.includes('localhost');
        
        if (forwardedHost && !isLocalHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        }
        
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  } catch (error) {
    console.error('Auth callback error:', error);
  }

  // Redirect to login with error state
  return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
}
