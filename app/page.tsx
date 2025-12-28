'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import WorkIndex from '../components/sections/WorkIndex';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/ui/CustomCursor';
import BackgroundCanvas from '../components/ui/BackgroundCanvas';
import StoryMode from '../components/game/StoryMode';
import MobileTerminal from '../components/game/MobileTerminal';
import ProjectModal from '../components/sections/ProjectModal';
import Preloader from '../components/ui/Preloader';
import { Project } from '../types';

export default function Home() {
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationPreview, setSimulationPreview] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProjectSelect = (project: Project) => {
    // If selecting from Story Mode, close Story Mode first
    if (simulationMode) {
      setSimulationMode(false);
      // Small timeout to allow transition
      setTimeout(() => setSelectedProject(project), 300);
    } else {
      setSelectedProject(project);
    }
  };

  return (
    <>
      <Preloader onComplete={() => setIsLoading(false)} />
      <div className={`${simulationMode ? 'font-mono tracking-tight' : ''} ${simulationPreview ? 'dark' : ''}`}>
        {/* Base Background Layer - Moved here to respect local dark mode & z-indexing */}
        <div className="fixed inset-0 z-[-50] bg-cream dark:bg-charcoal transition-colors duration-500 pointer-events-none" />

        <CustomCursor />
        <BackgroundCanvas simulationMode={simulationMode} simulationPreview={simulationPreview} />

        <Navbar
          simulationMode={simulationMode}
          toggleSimulation={() => setSimulationMode(!simulationMode)}
          setSimulationPreview={setSimulationPreview}
        />

        <main className={`transition-all duration-500 ${simulationMode ? 'blur-md opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <Hero />
          <About />
          <WorkIndex onSelectProject={setSelectedProject} />
          <Footer />
        </main>

        <AnimatePresence>
          {simulationMode && (
            isMobile ? (
              <MobileTerminal
                key="mobile-terminal"
                onExit={() => setSimulationMode(false)}
                onSelectProject={handleProjectSelect}
              />
            ) : (
              <StoryMode
                key="desktop-story-mode"
                active={simulationMode}
                onExit={() => setSimulationMode(false)}
                onSelectProject={handleProjectSelect}
              />
            )
          )}
        </AnimatePresence>

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </>
  );
}