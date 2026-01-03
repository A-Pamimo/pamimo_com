'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    // Portal Logic
    const [mounted, setMounted] = useState(false);
    const [show, setShow] = useState(true);

    useEffect(() => {
        setMounted(true);
        // Check session storage
        const hasSeenIntro = sessionStorage.getItem('intro_seen_v3');

        if (hasSeenIntro) {
            setShow(false);
            onComplete();
            return;
        }

        // Sequence:
        // 1. 0s: Start
        // 2. 0.5s: Text Fade In
        // 3. 1.5s: Slide Up Start
        // 4. 2.3s: Complete
        // NEW: Extended to 3500ms -> Reduced to 1750ms -> Reduced to 1000ms (1s)
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onComplete, 800); // Wait for exit animation
            sessionStorage.setItem('intro_seen_v3', 'true');
        }, 1000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!mounted) return null;

    const content = (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 bg-ink dark:bg-zinc flex items-center justify-center pointer-events-none"
                    style={{ zIndex: 99999 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <h1 className="font-display font-bold text-6xl md:text-9xl text-cream dark:text-white tracking-tighter">
                            PAMIMO<span className="text-pop">.</span>
                        </h1>
                        <div className="absolute -bottom-4 left-0 w-full overflow-hidden h-1">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                                className="w-full h-full bg-pop"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
};

export default Preloader;
