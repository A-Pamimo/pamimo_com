import { useEffect, useRef } from 'react';

interface GameInputProps {
    active: boolean;
    onEscape: () => void;
    onInteract: () => void;
}

export const useGameInput = ({ active, onEscape, onInteract }: GameInputProps) => {
    const keys = useRef<Record<string, boolean>>({});

    useEffect(() => {
        if (!active) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            keys.current[e.key] = true;

            // Prevent scrolling for navigation keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            // Command Signals
            if (e.key === 'Escape') {
                onEscape();
            }
            if (e.key === 'Enter' || e.key === ' ') {
                onInteract();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [active, onEscape, onInteract]);

    return keys;
};
