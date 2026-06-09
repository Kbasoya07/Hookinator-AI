'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useTheme, AccentColor } from '@/components/theme-provider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User, Palette, ShieldAlert, CreditCard, Trash, ShieldX, X, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { accentColor, setAccentColor } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  const [totalUsed, setTotalUsed] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch total optimizations used by this user from Supabase optimizations table
  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const { count, error } = await supabase
          .from('optimizations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (!error && count !== null) {
          setTotalUsed(count);
        }
      } catch (err) {
        console.error('Failed to query optimizations count:', err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, [user, supabase]);

  // Execute account deletion via server API route
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account.');
      }

      // Deletion successful. Sign out user locally and redirect to landing page.
      await signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'An error occurred during account deletion.');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex-grow bg-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        
        {/* Header */}
        <div className="mb-8 border-b border-zinc-900 pb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="h-8 w-8" style={{ color: 'var(--accent-color)' }} />
            Profile Settings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your account preferences, visual theme, and active plan details.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1: Account info */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-zinc-500" />
              Account Info
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block tracking-wider">Email Address</span>
                <span className="text-white text-sm font-medium mt-0.5 block">{user?.email ?? 'Loading...'}</span>
              </div>
              <div className="border-t border-zinc-850 pt-3">
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block tracking-wider">Total Optimizations Run</span>
                <span className="text-white text-sm font-semibold mt-0.5 block">
                  {loadingStats ? (
                    <span className="text-zinc-600 animate-pulse">Checking records...</span>
                  ) : (
                    `${totalUsed} generations`
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Accent Theme Dropdown */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-zinc-500" />
              Visual Style Theme
            </h2>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Select a custom color accent. This setting updates immediately and is persisted to your Supabase profile record.
            </p>
            <div className="relative max-w-xs">
              <select
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value as AccentColor)}
                className="w-full rounded-xl border border-zinc-850 bg-zinc-950 p-3.5 pr-10 text-sm text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-color)] cursor-pointer appearance-none"
              >
                <option value="pink">Pink Accent</option>
                <option value="blue">Blue Accent</option>
                <option value="green">Green Accent</option>
                <option value="cyan">Cyan Accent</option>
                <option value="orange">Orange Accent</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Section 3: Plan details */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-zinc-500" />
              Active Plan details
            </h2>
            <div className="flex justify-between items-center bg-zinc-950/50 p-4 rounded-xl border border-zinc-850">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">Current Level</span>
                <p className="text-base font-bold text-white capitalize mt-0.5">
                  {profile?.plan ?? 'free'} tier
                </p>
              </div>
              <span className="rounded-full bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 text-xs text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                Active
              </span>
            </div>
          </div>

          {/* Section 4: Danger Zone */}
          <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-6">
            <h2 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Danger Zone
            </h2>
            <p className="text-xs text-red-500/60 mb-4 leading-relaxed">
              Permanently delete your user login rows and purge all history records. This action is irreversible.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 rounded-xl border border-red-550/20 bg-red-950/40 hover:bg-red-900/30 px-5 py-3 text-xs font-semibold text-red-400 transition-colors cursor-pointer"
            >
              <Trash className="h-3.5 w-3.5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Styled Delete Confirmation Overlay Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl border border-red-500/30 bg-zinc-950 p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] space-y-4 relative">
            <button
              disabled={deleting}
              onClick={() => setShowDeleteModal(false)}
              className="absolute right-4 top-4 p-1 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
              <ShieldX className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Permanently delete account?</h3>
              <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
                This cannot be undone. All data will be lost. This will permanently clear your profile data, credits, and optimization logs from our servers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    Purging Account...
                  </>
                ) : (
                  'Yes, Delete My Account'
                )}
              </button>
              <button
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white font-semibold py-2.5 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline replacement chevron helper
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
