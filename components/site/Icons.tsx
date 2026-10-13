import React from 'react';

/* Hand-authored line icons, drawn at one stroke weight to match the ribbon */

export const ArrowRight: React.FC = () => (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2.5 8h10.5M9 4l4 4-4 4" />
    </svg>
);

export const ArrowUpRight: React.FC = () => (
    <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
);

export const Play: React.FC = () => (
    <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4.5 2.8v10.4L13 8z" />
    </svg>
);
