import type { Metadata } from 'next';
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const useClerk = clerkKey.startsWith('pk_test_') && !clerkKey.includes('placeholder') && clerkKey.length > 20;

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VarmanAI — Armor for your AI',
    template: '%s | VarmanAI',
  },
  description: 'VarmanAI scans every message you send to ChatGPT, Gemini, and Claude — blocking prompt injection, harmful content, and data leaks. Built for India, in Hindi, Hinglish & English.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://varmanai.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'VarmanAI',
    title: 'VarmanAI — Armor for your AI',
    description: 'Scan every prompt. Block every threat. Built for India.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VarmanAI — Armor for your AI',
    description: 'Scan every prompt. Block every threat. Built for India.',
  },
  robots: { index: true, follow: true },
  alternates: {
    languages: { 'en': '/', 'hi-IN': '/' },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en" className={`${sora.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );

  if (!useClerk) {
    return body;
  }

  const { ClerkProvider } = await import('@clerk/nextjs');
  return <ClerkProvider>{body}</ClerkProvider>;
}
