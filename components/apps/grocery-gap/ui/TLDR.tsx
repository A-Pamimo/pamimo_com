'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TLDRProps {
    children: React.ReactNode;
    inverted?: boolean;
    source?: string;
    sourceLink?: string;
}

export default function TLDR({ children, inverted = false, source, sourceLink }: TLDRProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`my-6 border-l-2 border-pop/50 pl-4 py-1 ${inverted ? 'border-white/30' : ''}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase hover:opacity-80 transition-opacity ${inverted ? 'text-orange-400' : 'text-pop'}`}
            >
                <span>{isOpen ? '[-]' : '[+]'}</span>
                <span>Show the explanation</span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className={`mt-2 text-sm leading-relaxed font-medium ${inverted ? 'text-white/80' : 'text-theme-text/70'}`}>
                            {children}
                        </p>
                        {source && (
                            <p className={`mt-2 text-[10px] uppercase tracking-widest opacity-50 font-mono ${inverted ? 'text-white' : ''}`}>
                                Source: {sourceLink ? (
                                    <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {source}
                                    </a>
                                ) : (
                                    source
                                )}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
