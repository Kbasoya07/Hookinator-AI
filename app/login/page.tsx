'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { MagnetIcon as Magnet } from '@/components/icons';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Determine redirection target (defaults to /dashboard)
  const redirectedFrom = searchParams.get('redirectedFrom') || '/dashboard';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      if (data.user) {
        router.push(redirectedFrom);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-zinc-700 bg-zinc-900 p-2 shadow-2xl">
      <CardHeader className="flex flex-col items-center pb-6">
        <div className="flex items-center justify-center mb-4 transition-transform hover:scale-105">
          <Magnet
            className="h-10 w-10 transition-colors duration-300"
            style={{
              stroke: 'var(--accent-color)',
              filter: 'drop-shadow(0 0 8px var(--accent-color-glow))',
            }}
          />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white font-sans">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-400 text-xs mt-1">
          Sign in to optimize your YouTube channels
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 font-sans leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                style={{
                  '--ring': 'var(--accent-color)',
                } as React.CSSProperties}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                style={{
                  '--ring': 'var(--accent-color)',
                } as React.CSSProperties}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-black transition-colors border-none mt-6 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-color)',
              boxShadow: '0 0 14px var(--accent-color-glow)',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 text-black" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Hiding Google Login for now as requested; can be revived in the future
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          variant="outline"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 py-3 text-sm font-semibold text-white hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </Button>
        */}
      </CardContent>

      <CardFooter className="flex justify-center pt-2 pb-4">
        <p className="text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-white hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-grow items-center justify-center bg-black px-4 py-12">
      <Suspense fallback={
        <Card className="w-full max-w-md border-zinc-700 bg-zinc-900 p-8 shadow-2xl flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" style={{ color: 'var(--accent-color)' }} />
        </Card>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
