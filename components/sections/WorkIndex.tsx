'use client';

import React, { useState } from 'react';
import { PROJECT_DATA } from '../../constants';
import ProjectCard, { spanClass } from './ProjectCard';
import { Project } from '../../types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface WorkIndexProps {
  onSelectProject: (project: Project) => void;
}

type FilterType = 'all' | 'strategy' | 'product' | 'tech';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Work' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'product', label: 'Product' },
  { id: 'tech', label: 'Data & Engineering' },
];

const WorkIndex: React.FC<WorkIndexProps> = ({ onSelectProject }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const reduce = useReducedMotion();

  const projects = Object.values(PROJECT_DATA);
  const shippedCount = projects.filter(p => p.status === 'shipped').length;
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category.includes(filter));

  const activeProjects = filteredProjects.filter(p => !p.archived);
  const archivedProjects = filteredProjects.filter(p => p.archived);

  return (
    <section id="work" className="py-24 md:py-32 px-4 md:px-12 bg-surface border-t-2 border-edge relative transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Masthead */}
        <div className="mb-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display font-extrabold text-display-1">THE INDEX<span className="text-pop">.</span></h2>
            <span className="font-mono text-label opacity-60">[ {shippedCount} SHIPPED / {projects.length} PROJECTS ]</span>
          </div>
          <div className="mt-6 border-t-2 border-edge pt-4 flex flex-wrap gap-2">
            {FILTERS.map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                aria-pressed={filter === btn.id}
                className={`font-mono text-label px-5 py-2.5 border-2 transition-all cursor-hoverable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink ${
                  filter === btn.id
                    ? 'bg-ink dark:bg-cream text-cream dark:text-ink border-ink dark:border-cream shadow-hard'
                    : 'bg-transparent border-transparent hover:border-pop hover:text-pop-ink dark:hover:text-pop'
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
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className={spanClass(project)}
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
              aria-expanded={showArchived}
              className="inline-flex items-center gap-2 font-mono text-label text-ink/70 dark:text-cream/70 hover:text-pop-ink dark:hover:text-pop transition-colors py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink"
            >
              <span>{showArchived ? '[HIDE_ARCHIVE]' : '[View More Projects]'}</span>
              <span className={`transition-transform duration-300 ${showArchived ? 'rotate-180' : ''}`}>↓</span>
            </button>

            <AnimatePresence>
              {showArchived && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mt-8 text-left"
                >
                  {archivedProjects.map((project) => (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={project.id}
                      className={`${spanClass(project)} opacity-75 hover:opacity-100 transition-opacity duration-500`}
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
