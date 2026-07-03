import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = rawUrl && rawUrl.startsWith('http') ? rawUrl : 'https://placeholder-project.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch (error) {
    console.error('Middleware session fetch error:', error);
  }

  const nextUrl = request.nextUrl.clone();
  const path = request.nextUrl.pathname;

  // Protected routes
  const isProtectedRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/optimizer') ||
    path.startsWith('/history') ||
    path.startsWith('/profile');

  // Auth routes (redirect to dashboard if logged in)
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  if (isProtectedRoute && !user) {
    nextUrl.pathname = '/login';
    nextUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(nextUrl);
  }

  if (isAuthRoute && user) {
    nextUrl.pathname = '/dashboard';
    return NextResponse.redirect(nextUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
