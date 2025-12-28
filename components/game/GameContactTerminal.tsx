'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { CONTACT_EMAIL } from '../../constants';

interface GameContactTerminalProps {
    onBack: () => void;
    initialBounds?: { x: number, y: number, w: number, h: number } | null;
}

const GameContactTerminal: React.FC<GameContactTerminalProps> = ({ onBack, initialBounds }) => {
    const [step, setStep] = useState<'compose' | 'sending' | 'success'>('compose');
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (step === 'compose' && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [step]);

    const handleTransmit = () => {
        if (!message.trim()) return;
        setStep('sending');

        // Simulation of transmission
        setTimeout(() => {
            setStep('success');
            // Fallback: actually open mailto after "transmission" so it's functional
            const truncatedBody = message.length > 1500 ? message.substring(0, 1500) + '...' : message;
            window.location.href = `mailto:${CONTACT_EMAIL}?body=${encodeURIComponent(truncatedBody)}`;
        }, 2500);
    };

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
            {/* CRT Power-On Flash */}
            <motion.div
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: 1, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute inset-x-0 top-1/2 h-1 bg-white z-[60] pointer-events-none"
            />

            <div className="w-full max-w-2xl border-2 border-emerald-500/50 bg-black relative shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden min-h-[400px]">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-emerald-500/30 bg-emerald-900/10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 animate-pulse rounded-full" />
                        <span className="font-mono text-emerald-500 font-bold tracking-widest text-sm">SECURE_UPLINK // V.1.0</span>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-emerald-700 hover:text-emerald-400 font-mono text-xs uppercase"
                    >
                        [ABORT_TRANSMISSION]
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 font-mono relative">
                    <AnimatePresence mode="wait">
                        {step === 'compose' && (
                            <motion.div
                                key="compose"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col"
                            >
                                <p className="text-emerald-600 text-xs mb-4">
                                    &gt; ESTABLISHING CONNECTION TO: <span className="text-emerald-400 font-bold">PAMIMO_CORE</span>
                                    <br />
                                    &gt; ENCRYPTION: <span className="text-emerald-400">ENABLED</span>
                                </p>
                                <textarea
                                    ref={textareaRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="ENTER TRANSMISSION DATA..."
                                    maxLength={5000}
                                    className="flex-1 bg-transparent border border-emerald-900/50 p-4 text-emerald-500 focus:outline-none focus:border-emerald-500/50 resize-none mb-6 placeholder-emerald-900"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleTransmit}
                                        disabled={!message.trim()}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        [INITIATE_UPLOAD]
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'sending' && (
                            <motion.div
                                key="sending"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center"
                            >
                                <div className="mb-8 font-bold text-emerald-500 text-xl animate-pulse">
                                    UPLOADING_PACKET...
                                </div>
                                <div className="w-64 h-2 bg-emerald-900/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "linear" }}
                                    />
                                </div>
                                <div className="mt-4 text-xs text-emerald-700 font-mono">
                                    ROUTING VIA PROXY 192.168.X.X
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center"
                            >
                                <div className="text-4xl mb-4">✅</div>
                                <h3 className="text-2xl font-bold text-emerald-400 mb-2">TRANSMISSION SENT</h3>
                                <p className="text-emerald-700 text-sm mb-8">
                                    Subject has been notified. Expect response within 24h.
                                </p>

                                <div className="flex gap-4 mb-8">
                                    <a href="https://linkedin.com/in/pamimo" target="_blank" rel="noopener noreferrer" className="bg-emerald-900/30 text-emerald-500 hover:bg-emerald-500 hover:text-black px-4 py-2 text-xs uppercase transition-colors">
                                        LINKEDIN
                                    </a>
                                    <a href="https://github.com/hxdxri" target="_blank" rel="noopener noreferrer" className="bg-emerald-900/30 text-emerald-500 hover:bg-emerald-500 hover:text-black px-4 py-2 text-xs uppercase transition-colors">
                                        GITHUB
                                    </a>
                                </div>

                                <div className="w-full border-t border-emerald-900/30 pt-6 mb-6">
                                    <p className="text-emerald-700 text-xs mb-2">DIRECT LINE:</p>
                                    <div className="flex justify-center items-center gap-2">
                                        <code className="bg-emerald-900/20 text-emerald-500 px-2 py-1">{CONTACT_EMAIL}</code>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(CONTACT_EMAIL)}
                                            className="text-emerald-700 hover:text-emerald-500 text-xs uppercase"
                                        >
                                            [COPY]
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={onBack}
                                    className="border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-black px-6 py-2 text-sm uppercase transition-colors"
                                >
                                    [CLOSE_TERMINAL]
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Scanlines inside simulation */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                </div>
            </div>
        </motion.div>
    );
};

export default GameContactTerminal;
