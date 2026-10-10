import React from 'react';
import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono, Bricolage_Grotesque, Source_Serif_4, Reenie_Beanie } from 'next/font/google';
import { LazyMotion, domAnimation } from 'framer-motion';
import { PREPAINT_SCRIPT } from '../lib/visit';
import './globals.css';

// Fonts used by the blog and the Grocery Gap app
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '700', '800']
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Fonts for the home page: headings, reading text and the hand-written PA
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-text',
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

const reenie = Reenie_Beanie({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'block',
  weight: '400',
});

const DESCRIPTION =
  "Pamimo Akinjide is a Product Manager at the Royal Bank of Canada and the founder of World’s Edge Group, working where economics, Asia and Africa trade, and applied artificial intelligence meet.";

export const metadata: Metadata = {
  // [CONFIRM] domain
  metadataBase: new URL('https://pamimoakinjide.com'),
  title: {
    default: 'Pamimo Akinjide',
    template: '%s | Pamimo Akinjide'
  },
  description: DESCRIPTION,
  keywords: [
    'Pamimo Akinjide',
    'Oluwapamimo Akinjide',
    'Product Manager',
    'Economist',
    'Royal Bank of Canada',
    "World's Edge Group",
    'Cansbridge Fellow',
    'Development economics',
    'Africa and Asia trade',
    'Applied artificial intelligence',
    'University of Saskatchewan',
    'Toronto',
  ],
  authors: [{ name: 'Pamimo Akinjide', url: 'https://pamimoakinjide.com' }],
  creator: 'Pamimo Akinjide',
  publisher: 'Pamimo Akinjide',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://pamimoakinjide.com',
    title: 'Pamimo Akinjide',
    description: DESCRIPTION,
    siteName: 'Pamimo Akinjide',
    images: [
      {
        url: 'https://pamimoakinjide.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pamimo Akinjide, Product Manager and economist'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pamimo Akinjide',
    description: DESCRIPTION,
    images: ['https://pamimoakinjide.com/og-image.png'],
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  alternates: {
    canonical: 'https://pamimoakinjide.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en-CA"
      className={`scroll-smooth ${inter.variable} ${syne.variable} ${jetbrains.variable} ${bricolage.variable} ${sourceSerif.variable} ${reenie.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="author" content="Pamimo Akinjide" />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Toronto" />
        {/* Sets time-of-day palette and full or simple mode before first paint */}
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="text-ink dark:text-cream antialiased overflow-x-hidden selection:bg-pop selection:text-white" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-pop focus:text-white focus:font-bold focus:shadow-lg focus:outline-none">
          Skip to Content
        </a>

        <LazyMotion features={domAnimation}>
          <div id="main-content">
            {children}
          </div>
        </LazyMotion>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Pamimo Akinjide",
              "alternateName": ["Oluwapamimo Akinjide", "Oluwapamimo Oluwadamisinuola Akinjide"],
              "url": "https://pamimoakinjide.com",
              "image": "https://pamimoakinjide.com/og-image.png",
              "sameAs": [
                "https://www.linkedin.com/in/pamimo",
                "https://worldsedgegroup.com"
              ],
              "jobTitle": "Product Manager",
              "worksFor": {
                "@type": "Organization",
                "name": "Royal Bank of Canada"
              },
              "founder": {
                "@type": "Organization",
                "name": "World's Edge Group",
                "url": "https://worldsedgegroup.com"
              },
              "alumniOf": [
                {
                  "@type": "CollegeOrUniversity",
                  "name": "University of Saskatchewan"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Toronto",
                "addressRegion": "ON",
                "addressCountry": "CA"
              },
              "email": "oluwapamimoakinjide@gmail.com",
              "description": DESCRIPTION,
              "award": [
                "Best Business Value Award, RBC Amplify"
              ],
              "knowsAbout": [
                "Product management",
                "Development economics",
                "New Structural Economics",
                "Africa and Asia trade corridors",
                "Applied artificial intelligence"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
