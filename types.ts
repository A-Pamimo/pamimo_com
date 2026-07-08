// Added missing React import to resolve namespace error
import React from 'react';

export interface ProjectStats {
  strategy: number;
  tech: number;
  product: number;
  leadership: number;
}

// How honest is the headline metric? Guards against passing a prize off as product impact.
export type MetricType = 'product' | 'usability' | 'analyst' | 'award' | 'concept';

export type ProjectStatus = 'shipped' | 'prototype' | 'concept' | 'research' | 'archived';

// The PM case-study arc: problem -> the call (with the tradeoff) -> shipped -> what moved -> reflection.
export interface CaseStudy {
  problem: {
    statement: string;
    users: string;
    validation: string;   // how you know the problem is real
    successMetric: string; // defined up front
  };
  decision: {
    options?: string[];
    chosen?: string;
    rationale: string;
    tradeoff: string;      // what you cut, and why — the PM signal
  };
  shipped: {
    summary: string;
    scope?: string[];
  };
  result: {
    metric: string;
    metricType: MetricType;
    evidence?: string;
  };
  reflection: {
    gotWrong: string;
    next: string;
  };
}

export interface ProjectLink {
  label: string;
  url: string;
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
  status?: ProjectStatus;
  year: number;
  // Structured PM case study — when present, drives the new modal layout.
  case?: CaseStudy;
  links?: ProjectLink[];
  // Deprecated: self-scored vanity metrics. Optional so entries can drop them.
  stats?: ProjectStats;
  blog?: string;
  image?: string;
  imageCaption?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  link?: string;
  archived?: boolean;
  video?: string;
}

export type Theme = 'light' | 'dark';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}