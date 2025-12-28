'use client';

import React, { useState } from 'react';
import { PROJECT_DATA } from '../../constants';
import ProjectCard from './ProjectCard';
import { Project } from '../../types';
import { AnimatePresence, motion } from 'framer-motion';

interface WorkIndexProps {
  onSelectProject: (project: Project) => void;
}

const WorkIndex: React.FC<WorkIndexProps> = ({ onSelectProject }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const projects = Object.values(PROJECT_DATA);
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category.includes(filter as any));

  const activeProjects = filteredProjects.filter(p => !p.archived);
  const archivedProjects = filteredProjects.filter(p => p.archived);

  return (
    <section id="work" className="py-24 px-4 md:px-12 bg-white dark:bg-zinc border-t border-ink dark:border-zinc-700 relative transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter">THE INDEX<span className="text-pop">.</span></h2>
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {[
              { id: 'all', label: 'All Work' },
              { id: 'strategy', label: 'Strategy' },
              { id: 'product', label: 'Product' },
              { id: 'tech', label: 'Data & Engineering' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`font-mono text-xs uppercase px-4 py-2 border border-ink dark:border-white transition-all cursor-hoverable ${filter === btn.id
                  ? 'bg-ink dark:bg-white text-cream dark:text-ink shadow-hard'
                  : 'bg-transparent hover:bg-pop hover:text-white hover:border-pop'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <AnimatePresence>
            {activeProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className={`
                  ${project.id === 'nova' ? 'lg:col-span-8' :
                    project.id === 'weg' ? 'lg:col-span-8' : 'lg:col-span-4'}
                `}
              >
                <ProjectCard project={project} onClick={onSelectProject} className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Archived Section */}
        {archivedProjects.length > 0 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/50 dark:text-white/50 hover:text-pop transition-colors py-4"
            >
              <span>{showArchived ? '[HIDE_ARCHIVE]' : '[VIEW_PAST_WORK]'}</span>
              <span className={`transition-transform duration-300 ${showArchived ? 'rotate-180' : ''}`}>↓</span>
            </button>

            <AnimatePresence>
              {showArchived && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mt-8"
                >
                  {archivedProjects.map((project) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={project.id}
                      className="lg:col-span-4 opacity-75 grayscale hover:grayscale-0 transition-all duration-500"
                    >
                      <ProjectCard project={project} onClick={onSelectProject} className="h-full" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkIndex;