'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrow } from './Icons';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 z-50 flex items-center gap-2 px-3 py-3 md:px-4 md:py-2 bg-pop text-white border-2 border-transparent hover:bg-black hover:border-pop hover:text-pop transition-colors shadow-hard group right-6 md:right-8"
                    aria-label="Scroll to top"
                >
                    <span className="hidden md:block font-mono text-xs font-bold tracking-widest uppercase">
                        SKIP TO TOP
                    </span>
                    <IconArrow className="w-5 h-5 transform -rotate-90 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
