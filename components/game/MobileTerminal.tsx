'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types';
import { useProjectData } from '../../hooks/useProjectData';
import { IconCheck, IconTrophy } from '../ui/Icons';
import CRTOverlay from './ui/CRTOverlay';

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
            className="fixed inset-0 z-[100] bg-term-bg text-term-accent font-mono overflow-hidden flex flex-col"
        >
            {/* CRT Scanline Overlay - Persistent */}
            <CRTOverlay />

            {/* Header - Persistent */}
            <header className="p-4 border-b border-term-accent/30 flex justify-between items-center relative z-30 bg-term-bg/90 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-term-accent animate-pulse rounded-full" />
                    <span className="text-xs font-bold tracking-widest text-term-accent">
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
                            <span className="text-term-accent animate-pulse text-sm">ESTABLISHING UPLINK...</span>
                            <div className="w-48 h-1 bg-term-dim rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-term-accent"
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
                            <div className="mb-6 sticky top-0 bg-term-bg/80 backdrop-blur-sm z-40 pb-4 border-b border-term-accent/50">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-[10px] uppercase tracking-widest text-term-accent/70 mb-4 hover:text-term-accent transition-colors flex items-center gap-1"
                                >
                                    &lt; RETURN TO DIRECTORY
                                </button>

                                {/* Shared Element Title */}
                                <motion.h2
                                    layoutId={`title-${selectedProject.id}`}
                                    className="text-2xl font-black text-term-accent uppercase leading-none mb-1"
                                >
                                    {selectedProject.title}
                                </motion.h2>
                                <motion.div
                                    layoutId={`meta-${selectedProject.id}`}
                                    className="flex items-center gap-3 text-xs text-term-accent/70 font-bold"
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
                                    <div className="text-[10px] text-term-accent/80 mb-1 font-bold">&gt; MISSION_OBJECTIVE</div>
                                    <p className="text-sm leading-relaxed text-term-accent/90">{selectedProject.what}</p>
                                </div>

                                <div>
                                    <div className="text-[10px] text-term-accent/80 mb-1 font-bold">&gt; EXECUTION_PROTOCOL</div>
                                    <p className="text-xs leading-relaxed text-term-accent/80">{selectedProject.how}</p>
                                </div>

                                <div className="border border-term-accent/20 bg-term-accent/10 p-4 rounded-sm">
                                    <div className="text-[10px] text-term-accent mb-2 font-bold flex items-center gap-2">
                                        <IconCheck className="w-3 h-3" /> SYSTEM_OUTCOME
                                    </div>
                                    <p className="text-sm font-bold text-term-accent">{selectedProject.impact}</p>
                                    {selectedProject.id === 'nova' && (
                                        <div className="mt-2 text-[10px] text-yellow-500 flex items-center gap-1">
                                            <IconTrophy className="w-3 h-3" /> AWARD_DETECTED
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="text-[10px] text-term-accent/80 mb-2 font-bold">&gt; TECH_STACK</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.stack.map(s => (
                                            <span key={s} className="text-[10px] border border-term-dim text-term-accent/80 px-2 py-1 rounded-sm">
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
                                <h2 className="text-xs text-term-accent/70 mb-2 uppercase tracking-widest">Directory Listing</h2>
                                <div className="h-px w-full bg-term-dim" />
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
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-term-accent transform scale-y-0 group-active:scale-y-100 transition-transform origin-top" />

                                    <div className="border border-term-dim bg-term-accent/5 p-4 active:bg-term-accent/20 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <motion.span
                                                layoutId={`title-${project.id}`}
                                                className="text-sm font-bold text-term-accent group-active:text-white"
                                            >
                                                {project.title.toUpperCase()}
                                            </motion.span>
                                            <motion.span
                                                layoutId={`meta-${project.id}`}
                                                className="text-[10px] text-term-accent/70 font-mono"
                                            >
                                                {project.year}
                                            </motion.span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] text-term-accent/60 font-mono uppercase">
                                                {project.id === 'nova' ? '★★ AWARD WINNER' : `ID: ${project.id.toUpperCase()}`}
                                            </span>
                                            <span className="text-xs text-term-accent opacity-0 group-active:opacity-100 transition-opacity">
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
                                <p className="text-[10px] text-term-accent/80">
                                    END OF STREAM <br />
                                    UNAUTHORIZED ACCESS PROHIBITED
                                </p>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-4 border-t border-term-dim bg-term-bg z-30 flex justify-between gap-4 text-[10px] text-term-accent/60 font-bold shrink-0">
                <span>LOC: 43.6532° N, 79.3832° W</span>
                <span className="animate-pulse">SIGNAL: 100%</span>
            </div>
        </motion.div>
    );
};

export default MobileTerminal;
