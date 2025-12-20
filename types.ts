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
}

export type Theme = 'light' | 'dark';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}