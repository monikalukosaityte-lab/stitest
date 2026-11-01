import './globals.css';

import type { Metadata } from 'next';
import {
  JetBrains_Mono,
  Libre_Baskerville,
  Montserrat,
} from 'next/font/google';
import localFont from 'next/font/local';

import CookieConsent from '@/components/layout/cookie-consent';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

const montserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
});

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
});

// Logo font (OFL), self-hosted from the Test Discreet storefront theme.
const interTight = localFont({
  src: '../fonts/inter-tight-latin.woff2',
  weight: '500 600',
  variable: '--font-inter-tight',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.stitestkit.co.uk'),
  title: {
    default: 'Home STI Test Kits UK – 15 Minute Results | STI Test Kit',
    template: '%s | STI Test Kit',
  },
  description:
    'Private home STI test kits for HIV, syphilis, chlamydia, gonorrhoea, herpes and hepatitis. Results in 15 minutes, discreet UK delivery.',
  authors: [{ name: 'STI Test Kit' }],
  creator: 'STI Test Kit',
  publisher: 'STI Test Kit',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/favicon/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.stitestkit.co.uk',
    siteName: 'STI Test Kit',
    title: 'Home STI Test Kits UK – 15 Minute Results | STI Test Kit',
    description:
      'Private home STI test kits for HIV, syphilis, chlamydia, gonorrhoea, herpes and hepatitis. Results in 15 minutes, discreet UK delivery.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'STI Test Kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home STI Test Kits UK – 15 Minute Results | STI Test Kit',
    description:
      'Private home STI test kits for HIV, syphilis, chlamydia, gonorrhoea, herpes and hepatitis. Results in 15 minutes, discreet UK delivery.',
    images: ['/og-image.jpg'],
    creator: '@testdiscreet',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col antialiased',
          montserrat.variable,
          libreBaskerville.variable,
          interTight.variable,
          jetbrainsMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
