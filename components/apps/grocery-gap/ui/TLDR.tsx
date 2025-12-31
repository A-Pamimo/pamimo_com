'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TLDRProps {
    children: React.ReactNode;
}

export default function TLDR({ children }: TLDRProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-6 border-l-2 border-pop/50 pl-4 py-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-pop uppercase hover:opacity-80 transition-opacity"
            >
                <span>{isOpen ? '[-]' : '[+]'}</span>
                <span>TL;DR (For Humans)</span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="mt-2 text-sm text-ink/70 dark:text-cream/70 leading-relaxed font-medium">
                            {children}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
