'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types';
import { useProjectData } from '../../hooks/useProjectData';
import { IconCheck, IconTrophy } from '../ui/Icons';

interface MobileTerminalProps {
    onExit: () => void;
    onSelectProject: (project: Project) => void;
}

const MobileTerminal: React.FC<MobileTerminalProps> = ({ onExit }) => {
    // Sort projects using shared hook
    const { projects } = useProjectData();

    const [bootSequence, setBootSequence] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            {/* CRT Scanline Overlay - Persistent */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]" />

            {/* Header - Persistent */}
            <header className="p-4 border-b border-green-500/30 flex justify-between items-center relative z-30 bg-black/90 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
                    <span className="text-xs font-bold tracking-widest text-green-400">
                        {selectedProject ? 'SECURE_ACCESS // GRANTED' : 'SECURE_LINK // V.2.0'}
                    </span>
                </div>
                <button
                    onClick={onExit}
                    className="border border-red-500/50 text-red-500 px-3 py-1 text-xs hover:bg-red-500 hover:text-black transition-colors"
                >
                    [DISCONNECT]
                </button>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto relative z-30 scrollbar-hide">
                <AnimatePresence mode="wait">
                    {bootSequence ? (
                        <motion.div
                            key="boot"
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
                    ) : selectedProject ? (
                        // --- DETAILS VIEW ---
                        <motion.div
                            key="details"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-4 min-h-full flex flex-col"
                        >
                            <div className="mb-6 sticky top-0 bg-black/80 backdrop-blur-sm z-40 pb-4 border-b border-green-900/50">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-[10px] uppercase tracking-widest text-green-700 mb-4 hover:text-green-400 transition-colors flex items-center gap-1"
                                >
                                    &lt; RETURN TO DIRECTORY
                                </button>

                                {/* Shared Element Title */}
                                <motion.h2
                                    layoutId={`title-${selectedProject.id}`}
                                    className="text-2xl font-black text-green-400 uppercase leading-none mb-1"
                                >
                                    {selectedProject.title}
                                </motion.h2>
                                <motion.div
                                    layoutId={`meta-${selectedProject.id}`}
                                    className="flex items-center gap-3 text-xs text-green-700 font-bold"
                                >
                                    <span>{selectedProject.year}</span>
                                    <span>ID: {selectedProject.id.toUpperCase()}</span>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-8 pb-12"
                            >
                                <div>
                                    <div className="text-[10px] text-green-800 mb-1 font-bold">&gt; MISSION_OBJECTIVE</div>
                                    <p className="text-sm leading-relaxed text-green-400/90">{selectedProject.what}</p>
                                </div>

                                <div>
                                    <div className="text-[10px] text-green-800 mb-1 font-bold">&gt; EXECUTION_PROTOCOL</div>
                                    <p className="text-xs leading-relaxed text-green-500/80">{selectedProject.how}</p>
                                </div>

                                <div className="border border-green-500/20 bg-green-900/10 p-4 rounded-sm">
                                    <div className="text-[10px] text-green-400 mb-2 font-bold flex items-center gap-2">
                                        <IconCheck className="w-3 h-3" /> SYSTEM_OUTCOME
                                    </div>
                                    <p className="text-sm font-bold text-green-400">{selectedProject.impact}</p>
                                    {selectedProject.id === 'nova' && (
                                        <div className="mt-2 text-[10px] text-yellow-500 flex items-center gap-1">
                                            <IconTrophy className="w-3 h-3" /> AWARD_DETECTED
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="text-[10px] text-green-800 mb-2 font-bold">&gt; TECH_STACK</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.stack.map(s => (
                                            <span key={s} className="text-[10px] border border-green-900 text-green-600 px-2 py-1 rounded-sm">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        // --- LIST VIEW ---
                        <div key="list" className="p-4 space-y-4 pb-20">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mb-6"
                            >
                                <h2 className="text-xs text-green-700 mb-2 uppercase tracking-widest">Directory Listing</h2>
                                <div className="h-px w-full bg-green-900" />
                            </motion.div>

                            {projects.map((project, i) => (
                                <motion.div
                                    layoutId={`card-${project.id}`}
                                    key={project.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelectedProject(project)}
                                    className="w-full text-left group relative cursor-pointer"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 transform scale-y-0 group-active:scale-y-100 transition-transform origin-top" />

                                    <div className="border border-green-900 bg-green-900/10 p-4 active:bg-green-500/20 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <motion.span
                                                layoutId={`title-${project.id}`}
                                                className="text-sm font-bold text-green-400 group-active:text-white"
                                            >
                                                {project.title.toUpperCase()}
                                            </motion.span>
                                            <motion.span
                                                layoutId={`meta-${project.id}`}
                                                className="text-[10px] text-green-700 font-mono"
                                            >
                                                {project.year}
                                            </motion.span>
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
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="pt-8 text-center opacity-50"
                            >
                                <p className="text-[10px] text-green-800">
                                    END OF STREAM <br />
                                    UNAUTHORIZED ACCESS PROHIBITED
                                </p>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-4 border-t border-green-900 bg-black z-30 flex justify-between gap-4 text-[10px] text-green-600 font-bold shrink-0">
                <span>LOC: 43.6532° N, 79.3832° W</span>
                <span className="animate-pulse">SIGNAL: 100%</span>
            </div>
        </motion.div>
    );
};

export default MobileTerminal;
