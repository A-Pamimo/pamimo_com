import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { PROJECT_DATA } from '../constants';
import { IconArrow, IconClose, IconBrain, IconGlobe, IconGov, IconUsers, IconChart, IconTrophy, IconCheck } from './Icons';

interface StoryModeProps {
  active: boolean;
  onExit: () => void;
  onSelectProject: (project: Project) => void;
}

const StoryMode: React.FC<StoryModeProps> = ({ active, onExit, onSelectProject }) => {
  const projects = Object.values(PROJECT_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onExit();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getIcon = (id: string) => {
    const props = { className: "w-full h-full text-white/10" };
    switch (id) {
      case 'nova': return <IconBrain {...props} />;
      case 'wfp': return <IconGlobe {...props} />;
      case 'city': return <IconGov {...props} />;
      case 'pasa': return <IconUsers {...props} />;
      case 'ess': return <IconUsers {...props} />;
      case 'weg': return <IconGlobe {...props} />;
      case 'sctc': return <IconChart {...props} />;
      default: return null;
    }
  };

  if (!active) return null;

  const currentProject = projects[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-ink/95 dark:bg-black/95 backdrop-blur-xl flex flex-col"
    >
      {/* HUD Header */}
      <div className="p-6 md:p-12 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
            <span className="w-3 h-3 bg-pop animate-pulse rounded-full"></span>
            <span className="font-mono text-pop text-sm tracking-widest font-bold">XP.MODE // ACTIVE</span>
        </div>
        <button 
            onClick={onExit}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-hoverable"
        >
            <span className="font-mono text-xs font-bold hidden md:block">[ESC] TO EXIT</span>
            <IconClose className="w-6 h-6" />
        </button>
      </div>

      {/* Main Stage */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Background Icon Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 scale-150 pointer-events-none">
            <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px]">
                {getIcon(currentProject.id)}
            </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl px-6 md:px-12 flex items-center justify-between">
            
            {/* Prev Button */}
            <button onClick={prevSlide} className="hidden md:flex w-16 h-16 rounded-full border border-white/20 items-center justify-center text-white hover:bg-pop hover:border-pop transition-all cursor-hoverable">
                <IconArrow className="w-6 h-6 rotate-180 pixel-icon" />
            </button>

            {/* Card Carousel */}
            <div className="flex-1 max-w-4xl mx-auto min-h-[400px]">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -100 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="w-full"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                            {/* Left: Info */}
                            <div className="text-cream">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="font-mono text-xs bg-white/10 px-2 py-1">{currentProject.tag.toUpperCase()}</span>
                                    <span className="font-mono text-xs text-white/50">{(currentIndex + 1).toString().padStart(2, '0')} / {projects.length.toString().padStart(2, '0')}</span>
                                </div>
                                
                                <h2 className="font-display font-bold text-4xl md:text-6xl mb-4 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                    {currentProject.title}
                                </h2>
                                <p className="font-mono text-pop text-sm mb-6 uppercase tracking-wider">{currentProject.subtitle}</p>
                                
                                <p className="text-lg opacity-80 mb-8 border-l-2 border-pop pl-4 leading-relaxed">
                                    {currentProject.context}
                                </p>

                                <button 
                                    onClick={() => onSelectProject(currentProject)}
                                    className="inline-flex items-center gap-3 bg-white text-ink px-6 py-3 font-bold uppercase tracking-wider shadow-hard hover:bg-pop hover:text-white transition-colors cursor-hoverable"
                                >
                                    Access File
                                    <IconArrow className="w-5 h-5 pixel-icon" />
                                </button>
                            </div>

                            {/* Right: Stats/Stack */}
                            <div className="bg-white/5 p-8 border border-white/10 backdrop-blur-sm">
                                <h3 className="font-mono text-xs text-pop mb-6 uppercase tracking-widest font-bold">SYSTEM_SPECS</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs text-white/40 font-mono mb-2">OBJECTIVE</label>
                                        <p className="text-sm text-white/90 font-medium">{currentProject.what}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-white/40 font-mono mb-2">STACK</label>
                                        <div className="flex flex-wrap gap-2">
                                            {currentProject.stack.map(s => (
                                                <span key={s} className="text-xs border border-white/20 px-2 py-1 text-white/70 font-mono">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-white/40 font-mono mb-2">IMPACT METRIC</label>
                                        <div className="flex items-start gap-2">
                                            <IconCheck className="w-5 h-5 text-pop shrink-0" />
                                            <p className="text-sm text-white font-bold">{currentProject.impact}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Next Button */}
            <button onClick={nextSlide} className="hidden md:flex w-16 h-16 rounded-full border border-white/20 items-center justify-center text-white hover:bg-pop hover:border-pop transition-all cursor-hoverable">
                <IconArrow className="w-6 h-6 pixel-icon" />
            </button>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="p-6 border-t border-white/10 md:hidden flex justify-between">
         <button onClick={prevSlide} className="font-mono text-xs text-white p-4">PREV</button>
         <button onClick={nextSlide} className="font-mono text-xs text-white p-4">NEXT</button>
      </div>
    </motion.div>
  );
};

export default StoryMode;