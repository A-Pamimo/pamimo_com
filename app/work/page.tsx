'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import WorkIndex from '../../components/WorkIndex';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ProjectModal from '../../components/ProjectModal';
import BackgroundCanvas from '../../components/BackgroundCanvas';
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