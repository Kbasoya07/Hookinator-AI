'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex-grow bg-black flex flex-col items-center justify-center min-h-[70vh]">
      
      {/* Self-contained CSS keyframes definition for sliding bar */}
      <style>{`
        @keyframes loading-slide {
          0% { left: -40%; }
          50% { left: 100%; }
          100% { left: -40%; }
        }
        .infinite-loader-bar {
          position: absolute;
          height: 100%;
          width: 40%;
          border-radius: 9999px;
          animation: loading-slide 1.8s infinite ease-in-out;
        }
      `}</style>

      <div className="flex flex-col items-center gap-5">
        
        {/* Pulsating Horseshoe Magnet Logo */}
        <div className="relative animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-14 w-14 animate-bounce"
            style={{
              stroke: 'var(--accent-color)',
              filter: 'drop-shadow(0 0 10px var(--accent-color-glow))',
            }}
          >
            {/* U-Shape Magnet Outline */}
            <path d="M 6,8 L 10,8 L 10,14 A 2 2 0 0 0 14,14 L 14,8 L 18,8 L 18,14 A 6 6 0 0 1 6,14 Z" />
            {/* Metal Pole Separators */}
            <line x1="6" y1="11" x2="10" y2="11" />
            <line x1="14" y1="11" x2="18" y2="11" />
            {/* Magnetic Sparks / Lightning Bolts */}
            <path d="M 9.5,1.5 L 7,3.5 L 9.5,3.5 L 7,6" />
            <path d="M 17,1.5 L 14.5,3.5 L 17,3.5 L 14.5,6" />
          </svg>
        </div>

        {/* Text Loading Feedback & Progress Slider */}
        <div className="flex flex-col items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
            Loading Hookinator
          </span>
          <div className="h-1 w-24 bg-zinc-950 rounded-full overflow-hidden relative border border-zinc-900">
            <div
              className="infinite-loader-bar"
              style={{
                backgroundColor: 'var(--accent-color)',
                boxShadow: '0 0 8px var(--accent-color)',
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
