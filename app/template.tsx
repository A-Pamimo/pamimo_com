'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Simplified page transitions for better performance
// Removed filter: blur() which causes expensive repaints
export default function Template({ children }: { children: React.ReactNode }) {
    // The home page has its own single motion moment (the PA intro) and must be
    // visible at first paint, so it skips the shared fade-in used by the blog
    const pathname = usePathname();
    if (pathname === '/') return <>{children}</>;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

