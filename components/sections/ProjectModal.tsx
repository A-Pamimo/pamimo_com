'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Project } from '../../types';
import { IconClose, IconCheck } from '../ui/Icons';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import CaseStudy from './CaseStudy';
import { SPRING } from '../../lib/motion';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

const TITLE_ID = 'project-modal-title';

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const reduce = useReducedMotion();
    const trapRef = useFocusTrap<HTMLDivElement>(!!project, onClose);

    useEffect(() => {
        document.body.style.overflow = project ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [project]);

    return (
        <AnimatePresence>
            {project && (
                <div className="fixed inset-0 z-[9000] flex items-end justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={reduce ? { opacity: 0 } : { opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, backdropFilter: 'blur(8px)' }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.4 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-ink/60 dark:bg-black/70 pointer-events-auto"
                    />

                    {/* Modal Sheet */}
                    <motion.div
                        ref={trapRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={TITLE_ID}
                        tabIndex={-1}
                        initial={reduce ? { opacity: 0 } : { y: '100%', scale: 0.97 }}
                        animate={reduce ? { opacity: 1 } : { y: '0%', scale: 1 }}
                        exit={reduce ? { opacity: 0 } : { y: '100%', scale: 0.97 }}
                        transition={reduce ? { duration: 0.2 } : SPRING}
                        className="relative w-full max-w-7xl h-[90vh] bg-cream dark:bg-charcoal border-2 border-ink dark:border-cream rounded-none overflow-hidden pointer-events-auto flex flex-col shadow-hard-xl focus:outline-none"
                    >
                        {/* Close Button */}
                        <div className="absolute top-6 right-6 z-50">
                            <button
                                onClick={onClose}
                                aria-label="Close case study"
                                className="bg-ink text-cream dark:bg-cream dark:text-ink w-12 h-12 rounded-none flex items-center justify-center hover:bg-pop hover:text-white transition-colors shadow-hard cursor-hoverable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink"
                            >
                                <IconClose className="w-5 h-5 pixel-icon" />
                            </button>
                        </div>

                        {/* Mobile Bottom Sticky Close */}
                        <div className="md:hidden absolute bottom-6 right-6 z-[60]">
                            <button
                                onClick={onClose}
                                aria-label="Close case study"
                                className="bg-pop text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                            >
                                <IconClose className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12">
                            <div className="max-w-6xl mx-auto">
                                {/* Title / Masthead */}
                                <div className="mb-12 pt-8 border-b-2 border-ink/10 dark:border-white/10 pb-10">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="font-mono text-label font-bold bg-pop text-white px-3 py-1 uppercase">CASE STUDY</span>
                                                {project.status && (
                                                    <span className="font-mono text-label font-bold border border-ink dark:border-cream px-3 py-1 uppercase">
                                                        {project.status}
                                                    </span>
                                                )}
                                                {project.case?.result.metricType === 'award' && (
                                                    <span className="font-mono text-label font-bold border border-ink dark:border-cream px-3 py-1 uppercase">
                                                        Award
                                                    </span>
                                                )}
                                            </div>
                                            <h2 id={TITLE_ID} className="font-display font-extrabold text-display-1 mb-4">
                                                {project.title}
                                            </h2>
                                            <p className="font-mono text-lg text-pop-ink dark:text-pop uppercase tracking-widest font-bold">
                                                {project.subtitle}
                                            </p>
                                        </div>

                                        <div className="shrink-0 flex flex-col md:items-end gap-2">
                                            <span className="font-mono text-label-sm opacity-60">PROJECT_ID: {project.id.toUpperCase()}</span>
                                            <span className="font-mono text-label-sm opacity-60">YEAR: {project.year}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                    {/* Sidebar */}
                                    <div className="space-y-12">
                                        {(project.video || project.image) && (
                                            <div className="relative rounded-none overflow-hidden border-2 border-ink dark:border-cream aspect-video bg-ink/5 dark:bg-white/5 group">
                                                {project.video ? (
                                                    <video src={project.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                                ) : (
                                                    <Image src={project.image!} alt={project.title} fill className="object-cover" />
                                                )}
                                                {project.imageCaption && (
                                                    <div className="absolute bottom-0 left-0 w-full bg-ink/90 text-cream p-4 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                        <p className="font-mono text-xs uppercase tracking-widest text-center">{project.imageCaption}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="font-mono text-label text-pop-ink dark:text-pop font-bold mb-4 uppercase flex items-center gap-3">
                                                <span className="w-2 h-2 bg-pop" aria-hidden="true" /> CONTEXT
                                            </h3>
                                            <p className="font-sans opacity-80 leading-relaxed text-lg">{project.context}</p>
                                        </div>

                                        <div>
                                            <h3 className="font-mono text-label font-bold mb-4 uppercase flex items-center gap-3">
                                                <span className="w-2 h-2 bg-ink dark:bg-cream" aria-hidden="true" /> TECH STACK
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.stack.map(tech => (
                                                    <span key={tech} className="border border-current/50 px-3 py-1 text-xs font-mono font-bold">{tech}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {((project.links && project.links.length > 0) || project.link) && (
                                            <div>
                                                <h3 className="font-mono text-label text-pop-ink dark:text-pop font-bold mb-4 uppercase flex items-center gap-3">
                                                    <span className="w-2 h-2 bg-pop" aria-hidden="true" /> LINKS
                                                </h3>
                                                <div className="flex flex-col gap-2">
                                                    {(project.links ?? (project.link ? [{ label: 'View project', url: project.link }] : [])).map(l => (
                                                        <a
                                                            key={l.url}
                                                            href={l.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-mono text-sm font-bold text-pop-ink dark:text-pop hover:underline inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-pop-ink focus-visible:outline-none"
                                                        >
                                                            {l.label} ↗
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-12 lg:pl-8 lg:border-l-2 border-ink/10 dark:border-white/10">
                                        {project.case ? (
                                            <CaseStudy project={project} />
                                        ) : (
                                            <>
                                                <div>
                                                    <h3 className="font-mono text-label text-pop-ink dark:text-pop font-bold mb-3 uppercase">01. What I Built</h3>
                                                    <p className="font-display text-display-3 font-bold leading-tight">{project.what}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-mono text-label text-pop-ink dark:text-pop font-bold mb-3 uppercase">02. How It Works</h3>
                                                    <div className="prose prose-xl dark:prose-invert font-sans opacity-90 leading-relaxed"><p>{project.how}</p></div>
                                                </div>
                                                <div className="bg-ink text-cream dark:bg-cream dark:text-ink p-8 md:p-10 shadow-hard-lg">
                                                    <h3 className="font-mono text-label text-pop font-bold mb-4 uppercase flex items-center gap-2">
                                                        <IconCheck className="w-4 h-4" /> The Outcome
                                                    </h3>
                                                    <p className="font-display text-2xl md:text-3xl font-bold">{project.impact}</p>
                                                </div>
                                            </>
                                        )}

                                        {/* Shareable permalink */}
                                        <div className="pt-8 border-t-2 border-ink/10 dark:border-white/10">
                                            <a
                                                href={`/work/${project.id}`}
                                                className="inline-flex items-center gap-2 font-mono text-label font-bold text-pop-ink dark:text-pop hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink"
                                            >
                                                Open as full page ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
