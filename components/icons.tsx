import React from 'react';

export function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function MagnetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
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
  );
}
