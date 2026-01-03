'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
                transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1], // Custom easing for "premium" feel
                }}
                className="min-h-screen"
            >
                {/* Subtle Flash Overlay for that "CRT Turn On" feel */}
                <motion.div
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="fixed inset-0 bg-white pointer-events-none z-[9999] mix-blend-overlay"
                />

                {children}
            </motion.div>
        </AnimatePresence>
    );
}
