'use client';

import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import WorkIndex from '../../components/sections/WorkIndex';
import Footer from '../../components/layout/Footer';
import CustomCursor from '../../components/ui/CustomCursor';
import ProjectModal from '../../components/sections/ProjectModal';
import BackgroundCanvas from '../../components/ui/BackgroundCanvas';
import { Project } from '../../types';

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <CustomCursor />
      <BackgroundCanvas simulationMode={false} />
      <Navbar />

      <main className="pt-24 min-h-screen flex flex-col justify-between">
        <WorkIndex onSelectProject={setSelectedProject} />
        <Footer />
      </main>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}