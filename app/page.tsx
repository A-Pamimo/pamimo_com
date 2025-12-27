'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import WorkIndex from '../components/WorkIndex';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import BackgroundCanvas from '../components/BackgroundCanvas';
import Preloader from '../components/Preloader';
import StoryMode from '../components/StoryMode';
import MobileTerminal from '../components/MobileTerminal';
import ProjectModal from '../components/ProjectModal';
import { Project } from '../types';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationPreview, setSimulationPreview] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
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
      )}
    </>
  );
}