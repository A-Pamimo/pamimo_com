'use client';

import React from 'react';
import { Project } from '../types';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import BackgroundCanvas from './BackgroundCanvas';
import { IconTrophy, IconCheck, IconArrow } from './Icons';

interface ProjectDetailViewProps {
  project: Project;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project }) => {
  return (
    <>
      <CustomCursor />
      <BackgroundCanvas simulationMode={false} />
      <Navbar />
      
      <main className="pt-32 pb-24 min-h-screen bg-cream dark:bg-charcoal transition-colors">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            {/* Back Link */}
            <a href="/work" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-pop transition-all mb-12">
                <IconArrow className="w-4 h-4 rotate-180" /> Back to Index
            </a>

            {/* Header */}
            <div className="mb-16 border-b border-ink/10 dark:border-white/10 pb-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="font-mono text-xs font-bold bg-pop text-white px-3 py-1 rounded-full uppercase tracking-wider">CASE STUDY</span>
                            {project.id === 'nova' && (
                                <span className="font-mono text-xs font-bold bg-gold text-ink px-3 py-1 rounded-full inline-flex items-center gap-2 uppercase tracking-wider">
                                <IconTrophy className="w-3 h-3 pixel-icon" /> AWARD WINNER
                                </span>
                            )}
                        </div>
                        <h1 className="font-display font-bold text-5xl md:text-8xl leading-[0.9] mb-6 tracking-tight">
                            {project.title}
                        </h1>
                        <p className="font-mono text-lg md:text-xl text-pop uppercase tracking-widest font-bold">
                            {project.subtitle}
                        </p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                        <span className="font-mono text-xs opacity-40">PROJECT_ID: {project.id.toUpperCase()}</span>
                        <span className="font-mono text-xs opacity-40">YEAR: {project.year}</span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Sidebar Stats */}
                <div className="space-y-12">
                    <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] [animation-delay:200ms]">
                        <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-pop rounded-full"></span>
                            CONTEXT
                        </h3>
                        <p className="font-sans opacity-80 leading-relaxed text-lg">{project.context}</p>
                    </div>
                    
                    <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] [animation-delay:300ms]">
                        <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-ink dark:bg-white rounded-full"></span>
                            TECH STACK
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.stack.map(tech => (
                                <span key={tech} className="border border-current opacity-60 px-3 py-1 text-xs font-mono rounded-md font-bold hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink transition-colors cursor-default">{tech}</span>
                            ))}
                        </div>
                    </div>

                    <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] [animation-delay:400ms]">
                        <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 bg-ink dark:bg-white rounded-full"></span>
                            STATS
                        </h3>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between border-b border-current/10 pb-1"><span>Strategy</span><span>{project.stats.strategy}%</span></div>
                            <div className="flex justify-between border-b border-current/10 pb-1"><span>Tech</span><span>{project.stats.tech}%</span></div>
                            <div className="flex justify-between border-b border-current/10 pb-1"><span>Product</span><span>{project.stats.product}%</span></div>
                            <div className="flex justify-between border-b border-current/10 pb-1"><span>Leadership</span><span>{project.stats.leadership}%</span></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-16 lg:pl-8 lg:border-l border-ink/10 dark:border-white/10">
                    <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] [animation-delay:500ms]">
                        <h3 className="font-mono text-xs text-pop font-bold mb-3 uppercase tracking-widest">01. What I Built</h3>
                        <p className="font-display text-3xl md:text-4xl font-bold leading-tight">{project.what}</p>
                    </div>
                    
                    <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] [animation-delay:600ms]">
                        <h3 className="font-mono text-xs text-pop font-bold mb-3 uppercase tracking-widest">02. How It Works</h3>
                        <div className="prose prose-xl dark:prose-invert font-sans opacity-90 leading-relaxed max-w-none">
                            <p>{project.how}</p>
                        </div>
                    </div>

                    <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] [animation-delay:700ms] bg-ink text-cream dark:bg-white dark:text-ink p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-pop opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <h3 className="font-mono text-xs text-pop font-bold mb-4 uppercase flex items-center gap-2">
                                <IconCheck className="w-4 h-4" /> The Outcome
                            </h3>
                            <p className="font-display text-2xl md:text-4xl font-bold">{project.impact}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetailView;