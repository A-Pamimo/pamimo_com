'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import WorkIndex from '../components/sections/WorkIndex';
import Footer from '../components/layout/Footer';
import BackgroundCanvas from '../components/ui/BackgroundCanvas';
import ProjectModal from '../components/sections/ProjectModal';
import Preloader from '../components/ui/Preloader';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { Project } from '../types';

// Lazy load heavy game components - only loaded when user enters game mode
const StoryMode = dynamic(() => import('../components/game/StoryMode'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black flex items-center justify-center text-green-500 font-mono">LOADING SIMULATION...</div>
});

const MobileTerminal = dynamic(() => import('../components/game/MobileTerminal'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black flex items-center justify-center text-green-500 font-mono">LOADING TERMINAL...</div>
});

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

        <BackgroundCanvas simulationMode={simulationMode} simulationPreview={simulationPreview} />

        <Navbar
          simulationMode={simulationMode}
          toggleSimulation={() => setSimulationMode(!simulationMode)}
          setSimulationPreview={setSimulationPreview}
        />

        {/* Performance: blur only on desktop (md:), opacity-only on mobile */}
        <main className={`transition-all duration-500 ${simulationMode ? 'md:blur-md opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <Hero />
          <WorkIndex onSelectProject={setSelectedProject} />
          <About />
          <Footer />
        </main>

        <AnimatePresence>
          {simulationMode && (
            isMobile ? (
              <ErrorBoundary name="Mobile Terminal">
                <MobileTerminal
                  key="mobile-terminal"
                  onExit={() => setSimulationMode(false)}
                  onSelectProject={handleProjectSelect}
                />
              </ErrorBoundary>
            ) : (
              <ErrorBoundary name="Story Mode Engine">
                <StoryMode
                  key="desktop-story-mode"
                  active={simulationMode}
                  onExit={() => setSimulationMode(false)}
                  onSelectProject={handleProjectSelect}
                />
              </ErrorBoundary>
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