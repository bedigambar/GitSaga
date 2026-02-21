import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'GitSaga — Your Code, As Legend',
  description: 'Turn your GitHub commit history into an epic AI-narrated story. Every commit is a chapter. Every repo is a saga.',
  keywords: ['github', 'commits', 'ai story', 'git history', 'developer tool'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        {children}
        <Toaster theme="dark" richColors />
      </body>
    </html>
  );
}
