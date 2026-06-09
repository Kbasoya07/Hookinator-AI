import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Optimizer - Hookinator AI',
};

export default function OptimizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
