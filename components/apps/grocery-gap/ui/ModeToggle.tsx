import React from 'react';

interface ModeToggleProps {
    isBusinessMode: boolean;
    onToggle: () => void;
}

export default function ModeToggle({ isBusinessMode, onToggle }: ModeToggleProps) {
    return (
        <button
            onClick={onToggle}
            title="Toggle View Mode: Full vs Executive Brief"
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-theme-text/20 hover:bg-theme-text hover:text-theme-bg transition-colors backdrop-blur-sm bg-theme-bg/80 shadow-sm"
        >
            <div className={`w-2 h-2 rounded-full border border-current ${isBusinessMode ? 'bg-current' : 'bg-transparent'}`} />
            {isBusinessMode ? 'Return to Article' : 'Fast Mode: Exec Brief'}
        </button>
    );
}
