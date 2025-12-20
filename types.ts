// Added missing React import to resolve namespace error
import React from 'react';

export interface ProjectStats {
  strategy: number;
  tech: number;
  product: number;
  leadership: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  context: string;
  stack: string[];
  what: string;
  how: string;
  impact: string;
  category: ('strategy' | 'product' | 'tech')[];
  featured?: boolean;
  year: number;
  stats: ProjectStats;
}

export type Theme = 'light' | 'dark';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}