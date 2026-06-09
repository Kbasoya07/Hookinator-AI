import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Hookinator AI',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
