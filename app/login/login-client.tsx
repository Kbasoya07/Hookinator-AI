'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let active = true;

    // 10-second timeout handler to prevent hanging indefinitely
    const timeoutId = setTimeout(() => {
      if (active) {
        active = false;
        setError("Connection slow. Please check your internet and try again.");
        setLoading(false);
      }
    }, 10000);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!active) return;
      clearTimeout(timeoutId);

      if (loginError) {
        throw loginError;
      }

      if (data.user) {
        // Redirect directly to /dashboard immediately
        router.push('/dashboard');
      }
    } catch (err) {
      if (!active) return;
      clearTimeout(timeoutId);
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
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 text-black" />
                Sign In
              </>
            )}
          </Button>
        </form>
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

export default function LoginClient() {
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
