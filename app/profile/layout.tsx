import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Hookinator AI',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
