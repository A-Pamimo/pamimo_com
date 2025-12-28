'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameBlogPlaceholderProps {
    onBack: () => void;
    initialBounds?: { x: number, y: number, w: number, h: number } | null;
}

const GameBlogPlaceholder: React.FC<GameBlogPlaceholderProps> = ({ onBack, initialBounds }) => {
    const isInitialParamsValid = initialBounds && initialBounds.x !== undefined;

    return (
        <motion.div
            initial={isInitialParamsValid && initialBounds ? {
                opacity: 0,
                left: initialBounds.x,
                top: initialBounds.y,
                width: initialBounds.w,
                height: initialBounds.h,
                scale: 0.1,
                borderRadius: 20
            } : { opacity: 0, scale: 0.98, left: 0, top: 0, width: '100%', height: '100%' }}
            animate={{
                opacity: 1,
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                scale: 1,
                borderRadius: 0,
                transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] }
            }}
            exit={isInitialParamsValid && initialBounds ? {
                opacity: 0,
                left: initialBounds.x,
                top: initialBounds.y,
                width: initialBounds.w,
                height: initialBounds.h,
                scale: 0.1,
                borderRadius: 20,
                transition: { duration: 0.4, ease: "easeInOut" }
            } : { opacity: 0, scale: 0.98 }}
            className="fixed z-[200] flex items-center justify-center p-0 pointer-events-auto bg-black/95 backdrop-blur-sm overflow-hidden origin-top-left"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-full max-w-lg border-2 border-purple-500/50 bg-black relative shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col p-12 text-center overflow-hidden">

                <div className="mb-6 relative z-10">
                    <div className="w-16 h-16 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50 animate-pulse">
                        <span className="font-mono text-2xl font-bold">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-purple-500 font-mono tracking-widest mb-2">ACCESS_DENIED</h2>
                    <p className="text-purple-300/70 font-mono text-sm">
                        Node "BLOG_ARCHIVE" is currently under construction.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="bg-purple-900/10 border border-purple-500/30 p-4 mb-8">
                        <p className="text-xs font-mono text-purple-400">ESTIMATED COMPLETION: Q1 2026</p>
                    </div>

                    <button
                        onClick={onBack}
                        className="bg-purple-600 hover:bg-purple-500 text-black font-bold py-3 px-8 uppercase tracking-widest text-sm transition-colors border border-purple-400"
                    >
                        [RETURN]
                    </button>
                </div>

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
        </motion.div>
    );
};

export default GameBlogPlaceholder;
