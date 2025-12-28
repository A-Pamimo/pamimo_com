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
        <div className="sr-only">
            <h3>Game World Interactive Elements</h3>
            <p>Use Tab to navigate through the interactive terminals in this world. Press Enter to access them.</p>
            <ul>
                {interactiveObjects.map(obj => (
                    <li key={obj.id}>
                        <button
                            onClick={() => onInteract(obj)}
                            aria-label={`Access ${obj.label} Terminal`}
                            className="focus:outline-none"
                        >
                            {obj.label} - {obj.type === 'project' ? 'Project Console' : 'System Portal'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameA11yOverlay;
