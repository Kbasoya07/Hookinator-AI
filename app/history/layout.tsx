import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'History - Hookinator AI',
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
