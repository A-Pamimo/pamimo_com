'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  if (variant === 'icon') {
    return (
      <Image 
        src="/favicon.svg" 
        alt="Logo Icon" 
        width={40} 
        height={40} 
        className={className} 
      />
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* 1. The Icon File */}
      <Image 
        src="/favicon.svg" 
        alt="Logo Icon" 
        width={40} 
        height={40}
        className="h-10 w-auto" 
      />

      {/* 2. Your Name */}
      <span className="font-display font-bold text-2xl tracking-tighter">
        PAMIMO
      </span>
    </div>
  );
};

export default Logo;
