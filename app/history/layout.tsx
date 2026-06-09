import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Optimization History | Hookinator AI',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
