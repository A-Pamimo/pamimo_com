import React from 'react';
import { notFound } from 'next/navigation';
import { PROJECT_DATA } from '../../../constants';
import ProjectDetailView from '../../../components/sections/ProjectDetailView';
import { getPostData } from '../../../lib/blog';

export async function generateStaticParams() {
  return Object.keys(PROJECT_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = PROJECT_DATA[params.slug];

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Pamimo Akinjide`,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECT_DATA[params.slug];

  if (!project) {
    notFound();
  }

  let blogContent = project.blog;

  try {
    const postData = await getPostData(params.slug);
    if (postData && postData.content) {
      blogContent = postData.content;
    }
  } catch (e) {
    // No blog post file found, fall back to project.blog (if any) or undefined
  }

  const projectWithContent = { ...project, blog: blogContent };

  return <ProjectDetailView project={projectWithContent} />;
}