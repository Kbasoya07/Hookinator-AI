'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, Sparkles, History, Cpu, FileText, Hash, BadgeAlert, Coins } from 'lucide-react';
import Link from 'next/link';

interface OptimizationLog {
  id: string;
  tool_type: 'optimize' | 'generate';
  input_title: string;
  created_at: string;
  output_title: string;
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [activity, setActivity] = useState<OptimizationLog[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const supabase = createClient();

  // Fetch recent activity
  const fetchRecentActivity = useCallback(async () => {
    if (!user) return;
    setActivityLoading(true);
    try {
      const { data, error } = await supabase
        .from('optimizations')
        .select('id, tool_type, input_title, output_title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching activity log:', error);
      } else {
        setActivity(data || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setActivityLoading(false);
    }
  }, [user, supabase]);

  // Sync profile data and activity logs
  useEffect(() => {
    if (user) {
      refreshProfile();
      fetchRecentActivity();
    }
  }, [user, fetchRecentActivity, refreshProfile]);

  const totalCredits = (profile?.monthly_credits ?? 0) + (profile?.top_up_credits ?? 0);

  return (
    <div className="flex-grow bg-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8" style={{ color: 'var(--accent-color)' }} />
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, {user?.email || 'Creator'}!
            </p>
          </div>
          <Link
            href="/optimizer"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-102 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-color)',
              boxShadow: '0 0 10px var(--accent-color-glow)',
            }}
          >
            <Sparkles className="h-4 w-4" />
            Optimize New Hook
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Optimizations Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Optimizations Left</span>
              <Cpu className="h-4 w-4 text-zinc-500" />
            </div>
            {authLoading ? (
              <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded-md mt-2"></div>
            ) : (
              <p className="text-3xl font-extrabold text-white mt-2">
                {profile?.optimizations_left ?? 0} <span className="text-sm font-normal text-zinc-500">/ 50</span>
              </p>
            )}
            <span className="text-[10px] text-zinc-500 mt-2 block">Deducts on title adjustments</span>
          </div>

          {/* Generations Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Generations Left</span>
              <FileText className="h-4 w-4 text-zinc-500" />
            </div>
            {authLoading ? (
              <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded-md mt-2"></div>
            ) : (
              <p className="text-3xl font-extrabold text-white mt-2">
                {profile?.generations_left ?? 0} <span className="text-sm font-normal text-zinc-500">/ 30</span>
              </p>
            )}
            <span className="text-[10px] text-zinc-500 mt-2 block">Deducts on scratch builds</span>
          </div>

          {/* Hashtags Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hashtags Left</span>
              <Hash className="h-4 w-4 text-zinc-500" />
            </div>
            {authLoading ? (
              <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded-md mt-2"></div>
            ) : (
              <p className="text-3xl font-extrabold text-white mt-2">
                {profile?.hashtags_left ?? 0} <span className="text-sm font-normal text-zinc-500">/ 70</span>
              </p>
            )}
            <span className="text-[10px] text-zinc-500 mt-2 block">Reflects metadata outputs</span>
          </div>

          {/* Total Credits Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Credits</span>
              <Coins className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
            </div>
            {authLoading ? (
              <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded-md mt-2"></div>
            ) : (
              <p className="text-3xl font-extrabold mt-2" style={{ color: 'var(--accent-color)' }}>
                {totalCredits}
              </p>
            )}
            <span className="text-[10px] text-zinc-500 mt-2 block">Monthly + top-up balances</span>
          </div>
        </div>

        {/* Lower Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Recent Activity Table */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-gray-400" />
                Recent Activity
              </h2>

              {activityLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="h-12 w-full bg-zinc-900/80 border border-zinc-850 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-sm text-gray-500">
                  No optimization history logged yet. Start generating video hooks!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-400">
                    <thead className="text-[10px] uppercase tracking-wider border-b border-zinc-800 text-zinc-500">
                      <tr>
                        <th className="pb-3 font-semibold">Video Hook / Topic</th>
                        <th className="pb-3 font-semibold">Tool Type</th>
                        <th className="pb-3 font-semibold">Optimized Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {activity.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-3 font-medium text-white max-w-[240px] truncate">
                            {item.tool_type === 'optimize' ? item.input_title : item.output_title}
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium bg-zinc-800 text-zinc-300 capitalize">
                              {item.tool_type}
                            </span>
                          </td>
                          <td className="py-3 text-[10px] text-zinc-500">
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <Link 
              href="/history" 
              className="text-xs font-semibold hover:underline mt-6 inline-flex items-center gap-1 text-gray-400 hover:text-white"
            >
              View Full History <History className="h-3 w-3" />
            </Link>
          </div>

          {/* Credits Meter panel */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BadgeAlert className="h-5 w-5 text-gray-400" />
              Credits Breakdown
            </h2>
            <div className="space-y-6 mt-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-400">Monthly Billing Balance</span>
                  <span className="text-white">{profile?.monthly_credits ?? 0} remaining</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${profile?.monthly_credits ? Math.min(100, (profile.monthly_credits / 50) * 100) : 0}%`,
                      backgroundColor: 'var(--accent-color)'
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-400">Top-up Credits Balance</span>
                  <span className="text-white">{profile?.top_up_credits ?? 0} remaining</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${profile?.top_up_credits ? Math.min(100, (profile.top_up_credits / 50) * 100) : 0}%`,
                      backgroundColor: 'var(--accent-color)'
                    }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 pt-2 leading-relaxed">
                Deductions flow in strict order: Monthly billing credits first, followed by manual Top-up credits, and finally daily Free tier limits.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
