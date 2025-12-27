'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { PROJECT_DATA } from '../constants';
import { IconClose, IconArrow } from './Icons';

interface MobileTerminalProps {
    onExit: () => void;
    onSelectProject: (project: Project) => void;
}

const MobileTerminal: React.FC<MobileTerminalProps> = ({ onExit, onSelectProject }) => {
    // Sort projects: NOVA -> WEG -> Chronological
    const projects = Object.values(PROJECT_DATA).sort((a, b) => {
        if (a.id === 'nova') return -1;
        if (b.id === 'nova') return 1;
        if (a.id === 'weg') return -1;
        if (b.id === 'weg') return 1;
        return b.year - a.year;
    });

    const [bootSequence, setBootSequence] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setBootSequence(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black text-green-500 font-mono overflow-hidden flex flex-col"
        >
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]" />

            {/* Header */}
            <header className="p-4 border-b border-green-500/30 flex justify-between items-center relative z-30 bg-black/90 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
                    <span className="text-xs font-bold tracking-widest text-green-400">SECURE_LINK // V.2.0</span>
                </div>
                <button
                    onClick={onExit}
                    className="border border-green-500/50 text-green-500 px-3 py-1 text-xs hover:bg-green-500 hover:text-black transition-colors"
                >
                    [DISCONNECT]
                </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 relative z-30">
                <AnimatePresence>
                    {bootSequence ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col justify-center items-center text-center gap-4"
                        >
                            <span className="text-green-500 animate-pulse text-sm">ESTABLISHING UPLINK...</span>
                            <div className="w-48 h-1 bg-green-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-green-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-4 pb-20">
                            <div className="mb-6">
                                <h2 className="text-xs text-green-700 mb-2 uppercase tracking-widest">Directory Listing</h2>
                                <div className="h-px w-full bg-green-900" />
                            </div>

                            {/* Project List */}
                            {projects.map((project, i) => (
                                <motion.button
                                    key={project.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => onSelectProject(project)}
                                    className="w-full text-left group relative"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 transform scale-y-0 group-active:scale-y-100 transition-transform origin-top" />

                                    <div className="border border-green-900 bg-green-900/10 p-4 active:bg-green-500/20 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-bold text-green-400 group-active:text-white">
                                                {project.title.toUpperCase()}
                                            </span>
                                            <span className="text-[10px] text-green-700 font-mono">
                                                {project.year}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] text-green-600 font-mono uppercase">
                                                {project.id === 'nova' ? '★★ AWARD WINNER' : `ID: ${project.id.toUpperCase()}`}
                                            </span>
                                            <span className="text-xs text-green-500 opacity-0 group-active:opacity-100 transition-opacity">
                                                [OPEN] &gt;
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}

                            <div className="pt-8 text-center opacity-50">
                                <p className="text-[10px] text-green-800">
                                    END OF STREAM <br />
                                    UNAUTHORIZED ACCESS PROHIBITED
                                </p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Actions Footer (Optional) */}
            <div className="p-4 border-t border-green-900 bg-black z-30 flex justify-between gap-4 text-[10px] text-green-600 font-bold">
                <span>LOC: 43.6532° N, 79.3832° W</span>
                <span className="animate-pulse">SIGNAL: 100%</span>
            </div>
        </motion.div>
    );
};

export default MobileTerminal;
