'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured dashboard crash error:', error);
  }, [error]);

  return (
    <div className="flex-grow bg-black flex flex-col items-center justify-center p-4 min-h-[60vh]">
      <div className="max-w-md w-full rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center shadow-[0_0_30px_rgba(239,68,68,0.05)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-white font-sans">Dashboard Error</h2>
        <p className="text-xs text-zinc-400 mt-2 mb-6 leading-relaxed">
          An unexpected error occurred while loading your dashboard stats.
          <span className="block mt-2.5 font-mono text-[10px] text-red-400 bg-black/40 border border-red-500/10 p-2.5 rounded max-h-24 overflow-y-auto">
            {error.message || 'Unknown runtime crash'}
          </span>
        </p>
        <button
          onClick={() => reset()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-4 py-3.5 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reload Workspace
        </button>
      </div>
    </div>
  );
}
