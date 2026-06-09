import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-grow bg-black flex flex-col items-center justify-center p-4 min-h-[70vh]">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Animated Custom Magnet Icon with question symbol */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-850 animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-zinc-500"
          >
            <path d="M 6,8 L 10,8 L 10,14 A 2 2 0 0 0 14,14 L 14,8 L 18,8 L 18,14 A 6 6 0 0 1 6,14 Z" />
            <line x1="6" y1="11" x2="10" y2="11" />
            <line x1="14" y1="11" x2="18" y2="11" />
          </svg>
          
          <span 
            className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-extrabold"
            style={{ color: 'var(--accent-color)', boxShadow: '0 0 8px var(--accent-color-glow)' }}
          >
            ?
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
          <h2 className="text-sm font-bold text-zinc-400 mt-1 uppercase tracking-wider">Page Not Found</h2>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed max-w-xs mx-auto">
            The page you are looking for doesn&apos;t exist, or has been relocated to another workspace.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black px-6 py-3 text-xs font-semibold transition-colors cursor-pointer"
        >
          {/* Arrow Left helper */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
