'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types';
import { IconCheck, IconTrophy } from '../Icons';

interface GameProjectConsoleProps {
    project: Project;
    onBack: () => void;
    onOpenStandard?: () => void; // Optional now, effectively unused but kept for type compat if needed
}

const GameProjectConsole: React.FC<GameProjectConsoleProps> = ({ project, onBack, initialBounds }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Auto-focus content for immediate scrolling via keyboard
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
    }, []);

    const isInitialParamsValid = initialBounds && initialBounds.x !== undefined;

    return (
        <motion.div
            initial={isInitialParamsValid && initialBounds ? {
                opacity: 0,
                left: initialBounds.x,
                top: initialBounds.y,
                width: initialBounds.w,
                height: initialBounds.h,
                scale: 0.1, // Start smaller to ensure it expands OUT
                borderRadius: 20,
            } : { opacity: 0, scale: 0.98, left: 0, top: 0, width: '100%', height: '100%' }}
            animate={{
                opacity: 1,
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                scale: 1,
                borderRadius: 0,
                transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] } // "Expo.out" for snappiness
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
            className="fixed z-[200] flex items-center justify-center p-0 md:p-8 pointer-events-auto bg-black/95 backdrop-blur-sm overflow-hidden origin-top-left"
        >
            {/* CRT Power-On Flash */}
            <motion.div
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: 1, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute inset-x-0 top-1/2 h-2 bg-white z-[60] pointer-events-none shadow-[0_0_50px_white]"
            />

            {/* Monitor Frame */}
            <div className="w-full max-w-5xl h-[85vh] bg-black border-4 border-[#333] rounded-lg relative overflow-hidden shadow-2xl flex flex-col">

                {/* Screen Content */}
                <div
                    ref={contentRef}
                    tabIndex={-1}
                    className="relative flex-1 p-8 md:p-12 overflow-y-auto font-mono text-[#33ff00] selection:bg-[#33ff00] selection:text-black scrollbar-hide focus:outline-none"
                >

                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-[#33ff00]/30 pb-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold uppercase mb-2 tracking-tighter">
                                {project.title}
                            </h1>
                            <div className="text-xs opacity-70 flex gap-4">
                                <span>ID: {project.id.toUpperCase()}</span>
                                <span>YEAR: {project.year}</span>
                                <span>STATUS: ARCHIVED</span>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-xs border border-[#33ff00] px-2 py-1 inline-block mb-1">MEM: 64KB OK</div>
                            <div className="text-[10px] opacity-50">ENCRYPTION: NONE</div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Main Data */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xs bg-[#33ff00] text-black inline-block px-2 py-0.5 mb-2 font-bold">&gt; MISSION_OBJECTIVE</h3>
                                <p className="text-lg opacity-90 leading-relaxed">
                                    {project.what}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs border border-[#33ff00]/50 inline-block px-2 py-0.5 mb-2 opacity-70">&gt; EXECUTION_PROTOCOL</h3>
                                <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">
                                    {project.how}
                                </p>
                            </div>

                            <div className="border border-[#33ff00]/30 p-4 bg-[#33ff00]/5">
                                <h3 className="text-xs font-bold mb-2 flex items-center gap-2">
                                    <IconCheck className="w-4 h-4" /> SYSTEM_OUTCOME
                                </h3>
                                <p className="text-xl font-bold">{project.impact}</p>
                                {project.id === 'nova' && (
                                    <div className="mt-2 text-xs text-[#FFD700] flex items-center gap-2">
                                        <IconTrophy className="w-3 h-3" /> AWARD_DETECTED
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Specs */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs opacity-50 mb-2">STACK_TRACE</h3>
                                <ul className="space-y-1 text-sm">
                                    {project.stack.map((s, i) => (
                                        <li key={s}>[{i}] {s}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xs opacity-50 mb-2">CATEGORY</h3>
                                <div className="flex gap-2">
                                    {project.category.map(c => (
                                        <span key={c} className="text-xs border border-[#33ff00]/30 px-2 py-1 uppercase">{c}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scanlines Overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                        backgroundSize: '100% 2px, 3px 100%'
                    }} />
                </div>

                {/* Footer Controls */}
                <div className="bg-[#111] border-t border-[#333] p-4 flex justify-between items-center text-xs font-mono text-[#33ff00]">
                    <span className="animate-pulse">_CURSOR_ACTIVE</span>
                    <div className="flex gap-4">
                        <button onClick={onBack} className="bg-[#33ff00] text-black px-4 py-2 font-bold hover:bg-white transition-colors uppercase">
                            [CLOSE_FILE]
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GameProjectConsole;