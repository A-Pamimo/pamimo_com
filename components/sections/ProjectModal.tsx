'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Project } from '../../types';
import { IconClose, IconTrophy, IconCheck } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

// Helper to highlight "$20,000" or other currency amounts
const highlightText = (text: string) => {
    const parts = text.split(/(\$20,000)/g);
    return parts.map((part, i) =>
        part === '$20,000' ? (
            <span key={i} className="text-pop font-bold inline-block transform hover:scale-110 transition-transform cursor-default">
                {part}
            </span>
        ) : (
            part
        )
    );
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    // Handle body lock and escape key
    useEffect(() => {
        if (project) {
            document.body.style.overflow = 'hidden';

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEscape);

            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('keydown', handleEscape);
            };
        } else {
            document.body.style.overflow = '';
        }
    }, [project, onClose]);

    if (!project) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-[9000] flex items-end justify-center pointer-events-none"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >

                {/* Backdrop - Blur & Fade */}
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.4 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-ink/60 dark:bg-black/60 pointer-events-auto"
                />

                {/* Modal Sheet - Spring Physics */}
                <motion.div
                    initial={{ y: '100%', scale: 0.95 }}
                    animate={{ y: '0%', scale: 1 }}
                    exit={{ y: '100%', scale: 0.95 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                    className="relative w-full max-w-7xl h-[90vh] bg-cream dark:bg-zinc rounded-none overflow-hidden pointer-events-auto flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)]"
                >
                    {/* Header / Close Button */}
                    <div className="absolute top-6 right-6 z-50">
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="bg-ink text-cream dark:bg-white dark:text-ink w-12 h-12 rounded-none flex items-center justify-center hover:bg-pop hover:text-white dark:hover:bg-pop dark:hover:text-white transition-colors shadow-lg cursor-hoverable"
                        >
                            <IconClose className="w-5 h-5 pixel-icon" />
                        </button>
                    </div>

                    {/* Mobile Bottom Sticky Close Button */}
                    <div className="md:hidden absolute bottom-6 right-6 z-[60]">
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="bg-pop text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                        >
                            <IconClose className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12">
                        <div className="max-w-6xl mx-auto">
                            {/* Title Section */}
                            <div className="mb-12 pt-8 border-b border-ink/10 dark:border-white/10 pb-10">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                    <div className="flex-1">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="flex flex-wrap gap-2 mb-6"
                                        >
                                            <span className="font-mono text-xs font-bold bg-pop text-white px-3 py-1 rounded-none uppercase tracking-wider">CASE STUDY</span>
                                            {project.id === 'nova' && (
                                                <span className="font-mono text-xs font-bold bg-gold text-ink px-3 py-1 rounded-none inline-flex items-center gap-2 uppercase tracking-wider">
                                                    <IconTrophy className="w-3 h-3 pixel-icon" /> AWARD WINNER
                                                </span>
                                            )}
                                        </motion.div>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            id="modal-title"
                                            className="font-display font-bold text-5xl md:text-7xl leading-[0.9] mb-4 tracking-tight"
                                        >
                                            {project.title}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="font-mono text-lg text-pop uppercase tracking-widest font-bold"
                                        >
                                            {project.subtitle}
                                        </motion.p>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-end gap-2">
                                        <span className="font-mono text-xs opacity-40">PROJECT_ID: {project.id.toUpperCase()}</span>
                                        <span className="font-mono text-xs opacity-40">YEAR: {project.year}</span>
                                    </div>
                                </div>
                            </div>



                            {/* Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                {/* Sidebar Stats */}
                                <div className="space-y-12">
                                    {/* Project Media (Sidebar) */}
                                    {(project.video || project.image) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <div className="relative rounded-none overflow-hidden shadow-2xl border border-ink/10 dark:border-white/10 aspect-video bg-ink/5 dark:bg-white/5 group">
                                                {project.video ? (
                                                    <video
                                                        src={project.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={project.image!}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}

                                                {/* Caption Overlay */}
                                                {project.imageCaption && (
                                                    <div className="absolute bottom-0 left-0 w-full bg-ink/90 text-cream p-4 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                        <p className="font-mono text-xs uppercase tracking-widest text-center">
                                                            {highlightText(project.imageCaption)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-pop rounded-none"></span>
                                            CONTEXT
                                        </h3>
                                        <p className="font-sans opacity-80 leading-relaxed text-lg">{project.context}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-ink dark:bg-white rounded-none"></span>
                                            TECH STACK
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.stack.map(tech => (
                                                <span key={tech} className="border border-current opacity-60 px-3 py-1 text-xs font-mono rounded-none font-bold hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink transition-colors cursor-default">{tech}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-12 lg:pl-8 lg:border-l border-ink/10 dark:border-white/10">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <h3 className="font-mono text-xs text-pop font-bold mb-3 uppercase tracking-widest">01. What I Built</h3>
                                        <p className="font-display text-3xl font-bold leading-tight">{project.what}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h3 className="font-mono text-xs text-pop font-bold mb-3 uppercase tracking-widest">02. How It Works</h3>
                                        <div className="prose prose-xl dark:prose-invert font-sans opacity-90 leading-relaxed">
                                            <p>{project.how}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="bg-ink text-cream dark:bg-white dark:text-ink p-8 md:p-10 rounded-none shadow-xl relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-pop opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                        <div className="relative z-10">
                                            <h3 className="font-mono text-xs text-pop font-bold mb-4 uppercase flex items-center gap-2">
                                                <IconCheck className="w-4 h-4" /> The Outcome
                                            </h3>
                                            <p className="font-display text-2xl md:text-3xl font-bold">{highlightText(project.impact)}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
};

export default ProjectModal;