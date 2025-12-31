'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

            <div className="w-full max-w-2xl border-2 border-emerald-500/50 bg-black relative shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden min-h-[500px]">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-emerald-500/30 bg-emerald-900/10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 animate-pulse rounded-full" />
                        <span className="font-mono text-emerald-500 font-bold tracking-widest text-sm">CONTACT TERMINAL</span>
                    </div>
                    <button
                        onClick={onBack}
                        className="text-emerald-700 hover:text-emerald-400 font-mono text-xs uppercase"
                    >
                        [CLOSE]
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 font-mono relative overflow-y-auto">

                    {/* Primary Contact Options */}
                    <div className="mb-12">
                        <h2 className="text-emerald-500 mb-6 text-sm tracking-widest border-b border-emerald-900/50 pb-2">DIRECT_CHANNELS</h2>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <a href="https://linkedin.com/in/pamimo" target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-500 text-black hover:bg-white hover:text-black font-bold p-4 text-center transition-all flex flex-col items-center justify-center gap-2 group">
                                <Image
                                    src="/linkedin_logo.png"
                                    alt="LinkedIn"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                                <span>LINKEDIN</span>
                            </a>
                            <a href="https://github.com/A-Pamimo" target="_blank" rel="noopener noreferrer" className="flex-1 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black font-bold p-4 text-center transition-all flex flex-col items-center justify-center gap-2 group">
                                <Image
                                    src="/github-logo-pixel-art-github-technology_grande.webp"
                                    alt="GitHub"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-contain"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                                <span>GITHUB</span>
                            </a>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-center bg-emerald-900/10 p-6 border border-emerald-500/20">
                            <div className="flex-1 w-full">
                                <p className="text-emerald-700 text-xs mb-2">EMAIL FREQUENCY:</p>
                                <div className="flex items-center gap-2">
                                    <code className="text-emerald-400 font-bold bg-black px-2 py-1 border border-emerald-900">{CONTACT_EMAIL}</code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(CONTACT_EMAIL);
                                            // Optional feedback could go here
                                        }}
                                        className="text-emerald-600 hover:text-emerald-400 text-xs bracket-btn"
                                    >
                                        [COPY]
                                    </button>
                                </div>
                            </div>
                            <a href={`mailto:${CONTACT_EMAIL}`} className="w-full md:w-auto bg-emerald-900/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/50 text-emerald-500 px-8 py-3 font-bold transition-all text-center">
                                CONTACT ME
                            </a>
                        </div>
                    </div>

                    {/* Secure Transmission (Secondary) */}
                    <div>
                        <h2 className="text-emerald-800 mb-4 text-xs tracking-widest border-b border-emerald-900/30 pb-2">SECURE_TRANSMISSION // ENCRYPTED_MESSAGE</h2>

                        <AnimatePresence mode="wait">
                            {step === 'compose' && (
                                <motion.div
                                    key="compose"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col"
                                >
                                    <textarea
                                        ref={textareaRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your message..."
                                        maxLength={5000}
                                        className="w-full bg-black border border-emerald-900/50 p-4 text-emerald-500 focus:outline-none focus:border-emerald-500/50 resize-vertical min-h-[100px] mb-4 placeholder-emerald-900/50 text-sm"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleTransmit}
                                            disabled={!message.trim()}
                                            className="text-emerald-500 hover:text-emerald-400 border border-emerald-900 hover:border-emerald-500 px-6 py-2 text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            [DRAFT EMAIL]
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
                                    className="py-12 flex flex-col items-center justify-center text-center bg-black/50 border border-emerald-900/30"
                                >
                                    <div className="mb-4 font-bold text-emerald-500 text-sm animate-pulse">
                                        ENCRYPTING...
                                    </div>
                                    <div className="w-48 h-1 bg-emerald-900/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-emerald-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2, ease: "linear" }}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-8 text-center"
                                >
                                    <h3 className="text-emerald-400 font-bold mb-1">Message ready to send.</h3>
                                    <p className="text-emerald-700 text-xs">Opening mail client...</p>
                                    <button
                                        onClick={() => setStep('compose')}
                                        className="mt-4 text-emerald-800 hover:text-emerald-500 text-xs underline"
                                    >
                                        [RESET]
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Scanlines inside simulation */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                </div>
            </div>
        </motion.div>
    );
};

export default GameContactTerminal;
