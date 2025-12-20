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
  title: 'Pamimo Akinjide | Strategy & Systems',
  description: 'A high-fidelity port of the Pamimo Akinjide portfolio website featuring dark mode, custom canvas animations, and interactive project showcases.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${syne.variable} ${jetbrains.variable}`}>
      <body className="bg-cream text-ink dark:bg-charcoal dark:text-cream antialiased overflow-x-hidden selection:bg-pop selection:text-white">
        {children}
      </body>
    </html>
  );
}