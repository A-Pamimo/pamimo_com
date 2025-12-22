'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  if (variant === 'icon') {
    // Icon-only version for favicon and small spaces
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Geometric P shape with strategic angles */}
        <path
          d="M20 20 L20 80 L35 80 L35 55 L60 55 C72 55 80 47 80 35 C80 23 72 20 60 20 Z"
          fill="currentColor"
        />
        <path
          d="M35 32 L60 32 C65 32 68 35 68 40 C68 45 65 48 60 48 L35 48 Z"
          fill="#FF4400"
        />
        {/* Data point accent */}
        <circle cx="75" cy="75" r="8" fill="#FF4400" />
        <circle cx="75" cy="75" r="4" fill="currentColor" />
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* P Icon */}
      <path
        d="M5 10 L5 50 L12 50 L12 35 L24 35 C30 35 35 30 35 24 C35 18 30 10 24 10 Z"
        fill="currentColor"
      />
      <path
        d="M12 16 L24 16 C26 16 28 18 28 21 C28 24 26 26 24 26 L12 26 Z"
        fill="#FF4400"
      />

      {/* PAMIMO Text */}
      <text
        x="45"
        y="38"
        fontFamily="var(--font-syne), sans-serif"
        fontSize="28"
        fontWeight="800"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        PAMIMO
      </text>

      {/* Subtitle/Tagline */}
      <text
        x="45"
        y="52"
        fontFamily="var(--font-mono), monospace"
        fontSize="8"
        fontWeight="600"
        fill="#FF4400"
        letterSpacing="2"
      >
        STRATEGY × DATA × SYSTEMS
      </text>

      {/* Accent dot */}
      <circle cx="192" cy="35" r="3.5" fill="#FF4400" />
    </svg>
  );
};

export default Logo;
