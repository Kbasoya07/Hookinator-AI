'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import { MagnetIcon as Magnet } from '@/components/icons';

export default function RegisterClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Sign up user via Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Redirect to dashboard on success (MVP skips email confirmation check)
        router.push('/dashboard');
        router.refresh();
      } else {
        throw new Error('Sign up completed but no user data returned.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-grow items-center justify-center bg-black px-4 py-12">
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
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs mt-1">
            Get started with Hookinator AI
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 font-sans leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
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

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Confirm Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 text-black" />
                  Sign Up
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pt-2 pb-4">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-white hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
