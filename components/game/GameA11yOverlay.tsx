import React, { useEffect, useRef } from 'react';
import { GameObject } from '../../hooks/useGamePhysics';

interface GameA11yOverlayProps {
    objects: GameObject[];
    onInteract: (target: GameObject) => void;
    active: boolean;
}

const GameA11yOverlay: React.FC<GameA11yOverlayProps> = ({ objects, onInteract, active }) => {
    // Only render interactive objects (projects, portals)
    // Filter out walls, decorations, and labels unless they are critical
    const interactiveObjects = objects.filter(obj =>
        obj.type === 'project' || obj.type === 'portal' || obj.id === 'contact' || obj.id === 'about'
    );

    if (!active) return null;


    return (
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
            <div className="sr-only focus-within:not-sr-only focus-within:block bg-black/90 p-4 border border-white/50 text-white rounded-lg shadow-xl pointer-events-auto">
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-yellow-400">Keyboard Navigation Active</h3>
                <p className="text-xs mb-3 text-gray-300">Use <kbd className="bg-gray-700 px-1 rounded">Tab</kbd> to select terminals. <kbd className="bg-gray-700 px-1 rounded">Enter</kbd> to access.</p>
                <ul className="space-y-2">
                    {interactiveObjects.map(obj => (
                        <li key={obj.id}>
                            <button
                                onClick={() => onInteract(obj)}
                                aria-label={`Access ${obj.label} Terminal`}
                                className="block w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded text-xs font-mono transition-all"
                            >
                                {obj.label} <span className="opacity-50">[{obj.type === 'project' ? 'PROJECT' : 'SYSTEM'}]</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GameA11yOverlay;
