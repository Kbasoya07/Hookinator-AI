import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { OrganizationSchema, SoftwareApplicationSchema } from '@/components/structured-data';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hookinator AI | Optimize YouTube Titles & Descriptions',
  description: 'AI-powered YouTube title optimizer, SEO description generator, and hashtag tool for creators. Optimize CTR, build hooks, and grow your views.',
  metadataBase: new URL('https://hookinator.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': 'https://hookinator.com/?lang=en-in',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hookinator.com',
    title: 'Hookinator AI | Optimize YouTube Titles & Descriptions',
    description: 'AI-powered YouTube title optimizer, SEO description generator, and hashtag tool for creators. Optimize CTR, build hooks, and grow your views.',
    siteName: 'Hookinator AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hookinator AI | Optimize YouTube Titles & Descriptions',
    description: 'AI-powered YouTube title optimizer, SEO description generator, and hashtag tool for creators. Optimize CTR, build hooks, and grow your views.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-black text-white min-h-screen flex flex-col font-mono`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
