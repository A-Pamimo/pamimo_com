'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Project } from '../../types';
import { IconArrow, IconBrain, IconGlobe, IconGov, IconUsers, IconChart } from '../ui/Icons';
import { SPRING } from '../../lib/motion';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  className?: string;
}

type Variant = 'flagship' | 'wide' | 'standard';

// Variant + span are data-driven (replacing the old hardcoded id branches).
export const resolveVariant = (p: Project): Variant =>
  p.cardVariant ?? (p.featured ? 'flagship' : p.image ? 'wide' : 'standard');

// Static class map so Tailwind's JIT can see every span used.
const SPAN_CLASS: Record<number, string> = {
  4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6',
  7: 'lg:col-span-7', 8: 'lg:col-span-8', 12: 'lg:col-span-12',
};
export const spanClass = (p: Project): string => {
  const span = p.span ?? ({ flagship: 6, wide: 8, standard: 4 } as const)[resolveVariant(p)];
  return SPAN_CLASS[span] ?? 'lg:col-span-4';
};

const statusLabel = (p: Project): string =>
  p.id === 'sangyin' ? 'OPEN SOURCE' :
  p.status === 'shipped' ? 'LIVE' :
  (p.status ?? 'PROJECT').toUpperCase();

const iconFor = (p: Project) => {
  switch (p.id) {
    case 'nova': return <IconBrain className="w-24 h-24 text-pop opacity-80 pixel-icon" />;
    case 'weg': return <IconGlobe className="w-24 h-24 text-pop opacity-30 pixel-icon" />;
    case 'city': return <IconGov className="w-24 h-24 opacity-20 pixel-icon" />;
    case 'pasa':
    case 'ess': return <IconUsers className="w-24 h-24 text-pop opacity-30 pixel-icon" />;
    default:
      if (p.category.includes('strategy')) return <IconChart className="w-24 h-24 opacity-20 pixel-icon" />;
      if (p.category.includes('product')) return <IconBrain className="w-24 h-24 text-pop opacity-30 pixel-icon" />;
      return <IconGlobe className="w-24 h-24 opacity-20 pixel-icon" />;
  }
};

const Tag: React.FC<{ children: React.ReactNode; variant?: 'solid' | 'outline' }> = ({ children, variant = 'solid' }) => (
  <span className={`font-mono text-label px-2 py-1 uppercase inline-block ${
    variant === 'solid' ? 'bg-ink text-cream dark:bg-cream dark:text-ink' : 'border border-edge opacity-70'
  }`}>{children}</span>
);

const StackChips: React.FC<{ stack: string[]; n: number }> = ({ stack, n }) => (
  <div className="flex flex-wrap gap-2">
    {stack.slice(0, n).map(s => (
      <span key={s} className="border border-current/30 px-2 py-1 text-xs font-mono">{s}</span>
    ))}
  </div>
);

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, className }) => {
  const reduce = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const variant = resolveVariant(project);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setTilt({ rotateX: -y, rotateY: x });
  };
  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <motion.button
      type="button"
      onClick={() => onClick(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`Open case study: ${project.title}`}
      style={reduce ? undefined : { rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
      transition={SPRING}
      className={`project-card ${className ?? ''} group relative w-full text-left overflow-hidden border-2 border-edge bg-surface p-6 md:p-8 cursor-hoverable transition-all hover:shadow-hard-lg hover:-translate-x-1 hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink`}
    >
      <div className="pointer-events-none h-full">
        {variant === 'flagship' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <Tag>{project.tag}</Tag>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-label text-pop-ink dark:text-pop font-bold">● {statusLabel(project)}</span>
                  <IconArrow className="w-6 h-6 text-pop group-hover:translate-x-1 transition-transform pixel-icon" />
                </div>
              </div>
              <h3 className="font-display font-extrabold text-display-2 mb-3">{project.title}</h3>
              <p className="font-mono text-sm text-pop-ink dark:text-pop font-bold mb-5">{project.subtitle}</p>
              <p className="opacity-80 leading-relaxed max-w-xl">{project.context}</p>
            </div>
            <div className="mt-8"><StackChips stack={project.stack} n={5} /></div>
          </div>
        )}

        {variant === 'wide' && (
          <div className="flex flex-col md:flex-row gap-8 h-full">
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <Tag>{project.tag}</Tag>
                <h3 className="font-display font-bold text-display-3 mt-4 mb-2 break-words">{project.title}</h3>
                <p className="text-sm font-mono opacity-60 mb-4">{project.subtitle}</p>
                <p className="opacity-80 max-w-lg">{project.context}</p>
              </div>
              <div className="mt-6"><StackChips stack={project.stack} n={4} /></div>
            </div>
            <div className="md:w-1/3 shrink-0 flex items-center justify-center bg-ink/5 dark:bg-white/5 border border-edge overflow-hidden aspect-video md:aspect-auto">
              {project.image ? (
                <Image src={project.image} alt={project.title} width={400} height={300} className="w-full h-full object-cover" />
              ) : iconFor(project)}
            </div>
          </div>
        )}

        {variant === 'standard' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <Tag variant="outline">{project.tag}</Tag>
                <IconArrow className="w-5 h-5 text-pop opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all pixel-icon" />
              </div>
              <h3 className="font-display font-bold text-display-3 mb-1">{project.title}</h3>
              <p className="text-sm font-mono opacity-60 mb-4">{project.subtitle}</p>
              <p className="text-sm opacity-80">{project.context}</p>
            </div>
            <div className="mt-6"><StackChips stack={project.stack} n={3} /></div>
          </div>
        )}
      </div>

      {/* shared hover accent bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-pop origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.button>
  );
};

export default ProjectCard;
