// Added missing React import for React.ReactNode type
import React from 'react';
import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://pamimoakinjide.com'),
  title: {
    default: 'Pamimo Akinjide | Product Strategy & Engineering',
    template: '%s | Pamimo Akinjide'
  },
  description: 'Pamimo Akinjide is a Product Strategist, Economist, and Systems Builder specializing in AI strategy, data analytics, and community development. Award-winning work at RBC, World Food Programme, and more.',
  keywords: [
    'Pamimo Akinjide',
    'Product Strategist',
    'Economist',
    'Data Analyst',
    'AI Strategy',
    'Agentic AI',
    'RBC Amplify',
    'World Food Programme',
    'Economic Consulting',
    'Systems Builder',
    'Toronto Product Manager',
    'Strategy Consultant',
    'Community Leadership',
    'Oluwapamimo Akinjide',
    'Oluwapamimo',
    'Pamimo'
  ],
  authors: [{ name: 'Pamimo Akinjide', url: 'https://pamimoakinjide.com' }],
  creator: 'Pamimo Akinjide',
  publisher: 'Pamimo Akinjide',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pamimoakinjide.com',
    title: 'Pamimo Akinjide | Product Strategy & Engineering',
    description: 'Award-winning Product Strategist and Economist specializing in AI strategy, data analytics, and systems design. $20K RBC Amplify winner, WFP researcher, community builder.',
    siteName: 'Pamimo Akinjide Portfolio',
    images: [
      {
        url: '/og-image.png', // You'll need to create this
        width: 1200,
        height: 630,
        alt: 'Pamimo Akinjide | Product Management | Strategy | Building'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pamimo Akinjide | Product Management | Strategy | Building',
    description: 'Award-winning strategist at the intersection of AI, data, and community. RBC Amplify winner | WFP Researcher | Systems Builder',
    images: ['/og-image.png'],
    creator: '@pamimo' // Replace with your actual Twitter handle if you have one
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
  verification: {
    // google: 'your-google-verification-code', // Add after setting up Google Search Console
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://pamimoakinjide.com',
  },
};

import { LazyMotion, domAnimation } from "framer-motion"
import CustomCursor from '../components/ui/CustomCursor';
import ScrollToTop from '../components/ui/ScrollToTop';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${syne.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="canonical" href="https://pamimoakinjide.com" />
        <meta name="author" content="Pamimo Akinjide" />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Toronto" />
      </head>
      <body className="text-ink dark:text-cream antialiased overflow-x-hidden selection:bg-pop selection:text-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-pop focus:text-white focus:font-bold focus:shadow-lg focus:outline-none">
          Skip to Content
        </a>

        <CustomCursor />
        <ScrollToTop />

        <LazyMotion features={domAnimation}>
          <div id="main-content">
            {children}
          </div>
        </LazyMotion>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Pamimo Akinjide",
              "alternateName": ["Oluwapamimo Akinjide", "Oluwapamimo"],
              "url": "https://pamimoakinjide.com",
              "image": "https://pamimoakinjide.com/og-image.png",
              "sameAs": [
                "https://www.linkedin.com/in/pamimo",
                "https://github.com/pamimo" // Add if you have one
              ],
              "jobTitle": "Product Strategist & Economist",
              "worksFor": {
                "@type": "Organization",
                "name": "World's Edge Group"
              },
              "alumniOf": [
                {
                  "@type": "Organization",
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
              "description": "Product Strategist, Economist, and Systems Builder specializing in AI strategy, data analytics, and community development. Award-winning work at RBC, World Food Programme, and more.",
              "award": [
                "RBC Amplify Best Business Value - $20,000 Prize"
              ],
              "knowsAbout": [
                "Product Strategy",
                "Agentic AI",
                "Economic Analysis",
                "Data Analytics",
                "Strategic Planning",
                "Community Building"
              ]
            })
          }
          }
        />
      </body >
    </html >
  );
}