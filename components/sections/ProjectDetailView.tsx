'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '../../types';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import CustomCursor from '../ui/CustomCursor';
import BackgroundCanvas from '../ui/BackgroundCanvas';
import CaseStudy from './CaseStudy';
import { IconCheck, IconArrow } from '../ui/Icons';

interface ProjectDetailViewProps {
    project: Project;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project }) => {
    return (
        <>
            <CustomCursor />
            <BackgroundCanvas simulationMode={false} />
            <Navbar />

            <main className="pt-32 pb-24 min-h-screen bg-bg transition-colors">
                <div className="max-w-7xl mx-auto px-6 md:px-12">

                    {/* Back Link */}
                    <Link href="/work" className="inline-flex items-center gap-2 text-label font-mono font-bold text-ink/70 dark:text-cream/70 hover:text-pop-ink dark:hover:text-pop transition-all mb-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink">
                        <IconArrow className="w-4 h-4 rotate-180" /> Back to Index
                    </Link>

                    {/* Header / Masthead */}
                    <div className="mb-16 border-b-2 border-edge pb-10">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="font-mono text-label font-bold bg-pop text-white px-3 py-1 uppercase">CASE STUDY</span>
                                    {project.status && (
                                        <span className="font-mono text-label font-bold border border-ink dark:border-cream px-3 py-1 uppercase">{project.status}</span>
                                    )}
                                    {project.case?.result.metricType === 'award' && (
                                        <span className="font-mono text-label font-bold border border-ink dark:border-cream px-3 py-1 uppercase">Award</span>
                                    )}
                                </div>
                                <h1 className="font-display font-extrabold text-display-1 mb-6">
                                    {project.title}
                                </h1>
                                <p className="font-mono text-lg md:text-xl text-pop-ink dark:text-pop uppercase tracking-widest font-bold">
                                    {project.subtitle}
                                </p>
                            </div>

                            <div className="shrink-0 flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                                <span className="font-mono text-label-sm opacity-60">PROJECT_ID: {project.id.toUpperCase()}</span>
                                <span className="font-mono text-label-sm opacity-60">YEAR: {project.year}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Sidebar */}
                        <div className="space-y-12">
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
                                            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-bold text-pop-ink dark:text-pop hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink">{l.label} ↗</a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-16 lg:pl-8 lg:border-l-2 border-ink/10 dark:border-white/10">
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
                                        <div className="prose prose-xl dark:prose-invert font-sans opacity-90 leading-relaxed max-w-none"><p>{project.how}</p></div>
                                    </div>

                                    <div className="bg-ink text-cream dark:bg-cream dark:text-ink p-8 md:p-12 shadow-hard-lg">
                                        <h3 className="font-mono text-label text-pop font-bold mb-4 uppercase flex items-center gap-2">
                                            <IconCheck className="w-4 h-4" /> The Outcome
                                        </h3>
                                        <p className="font-display text-2xl md:text-4xl font-bold">{project.impact}</p>
                                    </div>
                                </>
                            )}

                            {project.testimonial && (
                                <div className="border-l-4 border-pop pl-6 py-2">
                                    <blockquote className="font-display text-xl md:text-2xl font-bold italic mb-4">
                                        &ldquo;{project.testimonial}&rdquo;
                                    </blockquote>
                                    <cite className="font-mono text-xs opacity-70 not-italic uppercase tracking-widest block">
                                        — {project.testimonialAuthor || 'Verified Client'}
                                    </cite>
                                </div>
                            )}

                            {project.image && (
                                <div className="relative group overflow-hidden border-2 border-ink dark:border-cream">
                                    <Image
                                        src={project.image!}
                                        alt={project.imageCaption || project.title}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full h-auto object-cover"
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                    {project.imageCaption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-ink/90 text-cream p-4 backdrop-blur-sm">
                                            <p className="font-mono text-xs">{project.imageCaption}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {project.blog && (
                                <div>
                                    <h3 className="font-mono text-label text-pop-ink dark:text-pop font-bold mb-6 uppercase">The Full Story</h3>
                                    <div className="prose prose-lg dark:prose-invert font-sans opacity-90 leading-relaxed max-w-none">
                                        {project.blog.split('\n\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-6">{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProjectDetailView;
