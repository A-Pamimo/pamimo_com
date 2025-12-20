import React from 'react';
import { notFound } from 'next/navigation';
import { PROJECT_DATA } from '../../../constants';
import ProjectDetailView from '../../../components/ProjectDetailView';

export async function generateStaticParams() {
    return Object.keys(PROJECT_DATA).map((slug) => ({
      slug,
    }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECT_DATA[params.slug];

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}