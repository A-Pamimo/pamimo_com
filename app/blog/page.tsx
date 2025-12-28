'use client';

import React from 'react';
import Link from 'next/link';
import { IconArrow } from '../../components/ui/Icons';

export default function BlogComingSoon() {
    return (
        <div className="min-h-screen bg-cream dark:bg-charcoal text-ink dark:text-cream flex flex-col items-center justify-center p-6 relative font-mono selection:bg-pop selection:text-white transition-colors duration-500">
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold tracking-widest opacity-60 hover:opacity-100 hover:text-pop transition-all group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">
                    <IconArrow className="w-4 h-4 rotate-180" />
                </span>
                BACK TO INDEX
            </Link>

            <div className="max-w-xl text-center z-10">
                <div className="flex justify-center mb-8 opacity-80">
                    <div className="w-16 h-16 border-2 border-dashed border-ink dark:border-white rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
                        <div className="w-2 h-2 bg-pop rounded-sm animate-pulse" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                    ARCHIVE <span className="text-pop">LOCKED</span>
                </h1>

                <p className="text-sm md:text-base font-serif italic opacity-70 mb-10 max-w-md mx-auto leading-relaxed">
                    "We shape our tools and thereafter our tools shape us." <br />— Marshall McLuhan
                </p>

                <div className="flex flex-col gap-2 items-center">
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-pop to-transparent opacity-80"></div>
                    <p className="font-mono text-[10px] tracking-[0.2em] opacity-50 uppercase">
                        System Status: Compiling Assets
                    </p>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>
        </div>
    );
}
