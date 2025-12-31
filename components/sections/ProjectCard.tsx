import React from 'react';
import { Project } from '../../types';
import { IconArrow, IconBrain, IconGlobe, IconGov, IconUsers, IconChart, IconTrophy } from '../ui/Icons';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, className }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'nova': return <IconBrain className="w-32 h-32 text-pop relative z-10 opacity-80 pixel-icon" />;
      case 'wfp': return <IconGlobe className="w-6 h-6 opacity-50 pixel-icon" />;
      case 'city': return <IconGov className="w-24 h-24 opacity-20 self-end mt-4 pixel-icon" />;
      case 'pasa': return <IconUsers className="w-6 h-6 text-pop pixel-icon" />;
      case 'ess': return <IconUsers className="w-6 h-6 opacity-50 pixel-icon" />;
      case 'weg': return <IconGlobe className="w-24 h-24 text-pop opacity-20 pixel-icon" />;
      case 'sctc': return <IconChart className="w-24 h-24 text-ink/10 dark:text-white/10 pixel-icon" />;
      default: return null;
    }
  };

  // Special layouts based on card type to match visual parity
  if (project.id === 'nova') {
    return (
      <div onClick={() => onClick(project)} className={`project-card ${className} border border-ink dark:border-white/20 p-0 group hover:shadow-hard transform transition-all active:scale-[0.98] bg-cream dark:bg-black cursor-hoverable cursor-pointer`}>
        <div className="h-full flex flex-col md:flex-row pointer-events-none">
          <div className="p-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs bg-ink text-cream dark:bg-white dark:text-ink px-2 py-1">{project.tag.toUpperCase()}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-pop font-bold animate-pulse">● LIVE</span>
                  <IconArrow className="w-6 h-6 text-pop group-hover:translate-x-1 transition-transform pixel-icon" />
                </div>
              </div>
              <h3 className="font-display font-bold text-3xl mb-2">{project.title}</h3>
              <p className="text-sm font-mono text-pop mb-4">{project.subtitle}</p>
              <p className="opacity-70 max-w-md">{project.context}</p>
            </div>
            <div className="mt-8">
              <span className="bg-gold text-ink text-xs font-bold px-3 py-1 inline-flex items-center gap-2 mb-2 shadow-sm w-fit uppercase tracking-wider">
                <IconTrophy className="w-4 h-4 pixel-icon" /> <span className="text-pop font-black">$20K</span> BEST BUSINESS VALUE PRIZE
              </span>
              <div className="flex gap-2">
                {project.stack.slice(0, 3).map(s => (
                  <span key={s} className="border border-current opacity-30 px-2 py-1 text-xs font-mono">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 bg-ink dark:bg-zinc-800 flex items-center justify-center relative overflow-hidden p-8 md:p-0">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#FF4400 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            {getIcon('nova')}
          </div>
        </div>
      </div>
    );
  }

  // WEG Prominent layout
  if (project.id === 'weg') {
    return (
      <div onClick={() => onClick(project)} className={`project-card ${className} border border-ink dark:border-white/20 p-6 group hover:shadow-hard transform transition-all active:scale-[0.98] cursor-hoverable cursor-pointer bg-white dark:bg-charcoal flex flex-col justify-between overflow-hidden`}>
        <div className="flex flex-col md:flex-row gap-8 h-full pointer-events-none">
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs bg-ink text-cream dark:bg-white dark:text-ink px-2 py-1">ENTREPRENEURSHIP</span>
              </div>
              <h3 className="font-display font-bold text-3xl mb-2 break-words">{project.title}</h3>
              <p className="text-sm font-mono opacity-50 mb-4">{project.subtitle}</p>
              <p className="opacity-70 max-w-lg">{project.context}</p>
            </div>
            <div className="mt-6 flex gap-2 flex-wrap">
              {project.stack.map(s => (
                <span key={s} className="border border-current opacity-30 px-2 py-1 text-xs font-mono">{s}</span>
              ))}
            </div>
          </div>
          <div className="md:w-1/3 flex-shrink-0 flex items-center justify-center bg-cream dark:bg-zinc-800/50 p-4 border border-ink/5 dark:border-white/5">
            {getIcon('weg')}
          </div>
        </div>
      </div>
    );
  }

  // Fallback generic card structure customized per item to match HTML structure
  return (
    <div onClick={() => onClick(project)} className={`project-card ${className} border border-ink dark:border-white/20 p-6 group hover:shadow-hard transform transition-all active:scale-[0.98] cursor-hoverable cursor-pointer flex flex-col justify-between ${project.id === 'city' ? 'bg-pop text-white' : 'bg-white dark:bg-charcoal'}`}>
      <div className={`h-full flex flex-col ${project.id === 'sctc' ? 'md:flex-row gap-6' : 'justify-between'} pointer-events-none`}>
        <div className={project.id === 'sctc' ? 'flex-1' : ''}>
          {project.id === 'wfp' && <div className="flex justify-between items-center mb-4"><span className="font-mono text-xs border border-current px-2 py-1 opacity-60">RESEARCH</span></div>}
          {project.id === 'city' && <span className="font-mono text-xs bg-white text-pop px-2 py-1 inline-block mb-4">STRATEGY</span>}
          {project.id === 'pasa' && <div className="flex justify-between items-start mb-4"><h3 className="font-display font-bold text-2xl">{project.title}</h3>{getIcon('pasa')}</div>}
          {project.id === 'ess' && <div className="flex justify-between items-start mb-4"><h3 className="font-display font-bold text-2xl leading-tight">{project.title}</h3>{getIcon('ess')}</div>}

          {project.id === 'sctc' && <span className="font-mono text-xs bg-ink text-cream dark:bg-white dark:text-ink px-2 py-1 mb-4 inline-block">DATA ANALYSIS</span>}

          {(project.id !== 'pasa' && project.id !== 'ess') && <h3 className="font-display font-bold text-2xl mb-1">{project.title}</h3>}

          {project.id === 'pasa' && <p className="text-sm font-mono text-pop mt-1">LEADERSHIP</p>}
          {project.id === 'ess' && <p className="text-sm font-mono opacity-50 mt-1">CO-FOUNDER</p>}

          {(project.id !== 'pasa' && project.id !== 'ess') && <p className="text-sm font-mono opacity-50 mb-4">{project.subtitle}</p>}

          <p className="text-sm opacity-70">
            {project.context}
          </p>
        </div>

        {project.id === 'wfp' && (
          <div className="mt-6 pt-4 border-t border-dashed border-current opacity-30 flex justify-between">
            <code className="text-xs text-pop block mb-1">import stata</code>
            {getIcon('wfp')}
          </div>
        )}
        {project.id === 'sctc' && <div className="flex items-end">{getIcon('sctc')}</div>}
      </div>
    </div>
  );
};

export default ProjectCard;