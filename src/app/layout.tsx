import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

const SITE_NAME = 'GitSaga';
const SITE_DESCRIPTION =
  'Turn your GitHub commit history into an epic AI-narrated story. Every commit is a chapter. Every repo is a saga.';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://git-saga.vercel.app',
  ),
  title: {
    default: 'GitSaga — Your Code, As Legend',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'github',
    'commits',
    'ai story',
    'git history',
    'developer tool',
    'code narrative',
    'git visualization',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: 'GitSaga — Your Code, As Legend',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitSaga — Your Code, As Legend',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
