'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrow } from './Icons';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const SHOW_AFTER = 500;
const HIDE_BELOW = 420;

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const reduce = useReducedMotion();

    // Show once the reader is well down the page, and stay up until they are
    // clearly back near the top, so it doesn't flicker around the threshold.
    useEffect(() => {
        let visible = false;
        const toggleVisibility = () => {
            const next = visible ? window.scrollY > HIDE_BELOW : window.scrollY > SHOW_AFTER;
            if (next === visible) return;
            visible = next;
            setIsVisible(next);
        };

        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility, { passive: true });
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
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.2 }}
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
