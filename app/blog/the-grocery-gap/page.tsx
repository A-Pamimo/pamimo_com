'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import GroceryGapApp from '@/components/apps/grocery-gap/GroceryGapApp';
import { RegionProvider } from '@/components/apps/grocery-gap/context/RegionContext';

// Import the scoped theme
import '@/components/apps/grocery-gap/theme.css';

import Navbar from '@/components/layout/Navbar';

export default function GroceryGapPage() {
    return (
        <div className="grocery-gap-app-theme min-h-screen">
            <div className="h-20" /> {/* Spacer */}
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <RegionProvider>
                    <Navbar variant="blog" />
                    <GroceryGapApp />
                </RegionProvider>
            </Suspense>
        </div>
    );
}
