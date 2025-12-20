import React, { useEffect } from 'react';
import { Project } from '../types';
import { IconClose, IconTrophy, IconCheck, IconArrow } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9000] bg-cream dark:bg-zinc overflow-y-auto no-scrollbar"
      >
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 bg-ink text-cream dark:bg-white dark:text-ink w-12 h-12 flex items-center justify-center hover:bg-pop hover:text-white dark:hover:bg-pop dark:hover:text-white transition-colors shadow-hard cursor-hoverable"
        >
          <IconClose className="w-6 h-6 pixel-icon" />
        </button>

        <div className="max-w-7xl mx-auto w-full min-h-screen p-6 md:p-12 flex flex-col">
          <div className="mb-12 pt-12 border-b border-ink/20 dark:border-white/20 pb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-xs bg-pop text-white px-2 py-1 inline-block uppercase tracking-wider">CASE STUDY</span>
                  {project.id === 'nova' && (
                    <span className="font-mono text-xs bg-gold text-ink px-2 py-1 inline-flex items-center gap-2 uppercase tracking-wider font-bold">
                      <IconTrophy className="w-4 h-4 pixel-icon" /> AWARD WINNER
                    </span>
                  )}
                </div>
                <h2 className="font-display font-bold text-4xl md:text-6xl leading-[0.9] mb-4">{project.title}</h2>
                <p className="font-mono text-lg opacity-60 uppercase tracking-widest">{project.subtitle}</p>
              </div>
              
              <a 
                href={`/work/${project.id}`}
                className="shrink-0 inline-flex items-center gap-3 bg-ink text-cream dark:bg-white dark:text-ink px-6 py-4 font-mono text-sm font-bold uppercase tracking-wider hover:bg-pop hover:text-white dark:hover:bg-pop dark:hover:text-white transition-all shadow-hard hover:shadow-hard-hover cursor-hoverable group mt-4 md:mt-0"
              >
                VIEW CASE STUDY
                <IconArrow className="w-5 h-5 group-hover:translate-x-1 transition-transform pixel-icon" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">
            <div className="space-y-12">
              <div>
                <h3 className="font-display font-bold text-xl mb-4 border-l-4 border-pop pl-3">THE CONTEXT</h3>
                <p className="font-sans opacity-80 leading-relaxed text-sm md:text-base">{project.context}</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl mb-4 border-l-4 border-ink dark:border-white pl-3">TECH STACK</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="border border-current opacity-60 px-3 py-1 text-sm font-mono">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-10 lg:border-l border-ink/10 dark:border-white/10 lg:pl-12">
              <div>
                <h3 className="font-mono text-sm text-pop font-bold mb-2 uppercase">01. What I Built</h3>
                <p className="font-display text-2xl font-bold leading-tight">{project.what}</p>
              </div>
              <div>
                <h3 className="font-mono text-sm text-pop font-bold mb-2 uppercase">02. How It Works</h3>
                <div className="prose prose-lg dark:prose-invert font-sans opacity-90">
                  <p>{project.how}</p>
                </div>
              </div>
              <div className="bg-ink text-cream dark:bg-white dark:text-ink p-8 shadow-hard relative overflow-hidden group">
                <div className="absolute inset-0 bg-pop opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <h3 className="font-mono text-xs text-pop font-bold mb-2 uppercase flex items-center gap-2">
                   03. The Outcome <IconCheck className="w-4 h-4 pixel-icon" />
                </h3>
                <p className="font-display text-xl md:text-2xl font-bold">{project.impact}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;