import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Hookinator AI',
  description: 'Log in to your Hookinator account to access your dashboard and optimize your YouTube content.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
