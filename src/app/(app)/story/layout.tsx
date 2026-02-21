import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Story',
  description:
    'Read your repository commit history retold as an epic, chapter-based AI narrative.',
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
