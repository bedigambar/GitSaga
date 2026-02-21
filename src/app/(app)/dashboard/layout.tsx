import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Browse your GitHub repositories and generate epic AI-narrated stories from your commit history.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
