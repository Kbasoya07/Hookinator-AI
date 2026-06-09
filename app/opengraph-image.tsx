import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Hookinator AI';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glowing Ambient Background shapes */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Center Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed rgba(236, 72, 153, 0.3)',
            borderRadius: '32px',
            padding: '48px 64px',
            backgroundColor: 'rgba(9, 9, 11, 0.9)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(236, 72, 153, 0.15)',
          }}
        >
          {/* Logo Brand Title */}
          <span
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            Hookinator<span style={{ color: '#ec4899' }}>AI</span>
          </span>
          
          {/* Tagline */}
          <span
            style={{
              fontSize: '24px',
              color: '#71717a',
              marginTop: '16px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '4px',
            }}
          >
            YouTube Hook Optimizer
          </span>
        </div>

        {/* Bottom border decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(to right, #ec4899, #3b82f6, #22c55e, #06b6d4, #f97316)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
