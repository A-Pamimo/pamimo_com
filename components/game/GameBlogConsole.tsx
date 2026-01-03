'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconArrow } from '../ui/Icons';
import CRTOverlay from './ui/CRTOverlay';

interface GameBlogConsoleProps {
    onBack: () => void;
}

const GameBlogConsole: React.FC<GameBlogConsoleProps> = ({ onBack }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-sm font-mono text-green-500"
        >
            <div className="w-full max-w-3xl border-2 border-green-900 bg-black relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-green-900 bg-green-900/10 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 animate-pulse rounded-full" />
                        <span className="text-sm font-bold tracking-widest">TRANSMISSION_RECEIVED // BLOG_001</span>
                    </div>
                    <button
                        onClick={onBack}
                        className="border border-red-500/50 text-red-500 px-3 py-1 text-xs hover:bg-red-500 hover:text-black transition-colors uppercase font-bold"
                    >
                        [DISCONNECT]
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 overflow-y-auto relative z-10 flex-1 scrollbar-hide">
                    <div className="max-w-prose mx-auto space-y-8">

                        <div className="text-center space-y-4 pb-8 border-b border-green-900/50">
                            <h1 className="text-3xl md:text-4xl font-black uppercase text-green-400 leading-tight">
                                The Grocery Gap
                            </h1>
                            <div className="text-xs text-green-700 font-bold tracking-widest opacity-80">
                                BEHAVIORAL_ECONOMICS // INFLATION // Q1_2026
                            </div>
                        </div>

                        <div className="space-y-6 text-sm md:text-base leading-relaxed text-green-300/90">
                            <p>
                                <strong className="text-green-400">ABSTRACT:</strong> Why does the official CPI (2.9%) feel like a lie?
                                New telemetry indicates a massive divergence between "StatCan Reality" and "Consumer Reality."
                            </p>
                            <p>
                                This divergence is not an error. It is a psychological feature driven by three variables:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-green-600">
                                <li><strong>Frequency Bias:</strong> You weigh frequent purchases (milk) 4x heavier than rare ones (TVs).</li>
                                <li><strong>Loss Aversion:</strong> Price hikes feel 2.5x more painful than drops feel good.</li>
                                <li><strong>Shrinkflation:</strong> The hidden tax of vanishing ounces.</li>
                            </ul>
                            <div className="p-4 border border-green-500/30 bg-green-500/5 text-xs text-green-400">
                                &gt; CONCLUSION: Your "Personal Inflation Rate" is likely 12-15%.
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col items-center gap-4">
                            <a
                                href="/blog/the-grocery-gap"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-black font-bold text-lg uppercase tracking-wider hover:bg-green-400 transition-all hover:scale-105"
                            >
                                <span className="absolute inset-0 border-2 border-green-400 transform scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                <span>[EXECUTE_SIMULATION]</span>
                                <IconArrow className="w-5 h-5 transform -rotate-45 group-hover:rotate-0 transition-transform" />
                            </a>
                            <span className="text-[10px] text-green-700">
                                CAUTION: ACTIVATES HIGH-FIDELITY RENDER MODE (ARTICLE)
                            </span>
                        </div>

                    </div>
                </div>

                {/* Scanlines */}
                <CRTOverlay />

                {/* Footer */}
                <div className="p-3 bg-green-900/10 border-t border-green-900 text-[10px] text-green-700 flex justify-between shrink-0">
                    <span>READ_TIME: ~7 MIN</span>
                    <span>AUTHOR: OLU</span>
                </div>
            </div>
        </motion.div>
    );
};

export default GameBlogConsole;
