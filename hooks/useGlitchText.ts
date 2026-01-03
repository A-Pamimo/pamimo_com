import { useState, useEffect, useRef } from 'react';

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Hook that creates a glitch text animation effect.
 * When active, characters scramble and then resolve to the original text.
 * 
 * @param text - The original text to display/animate
 * @param active - Whether the glitch animation is active
 * @param speed - Optional speed multiplier (default: 1/3, higher = faster resolution)
 * @returns The current display text (either glitched or resolved)
 * 
 * @example
 * ```tsx
 * const [isHovered, setIsHovered] = useState(false);
 * const glitchedTitle = useGlitchText(title, isHovered);
 * 
 * return <h1 onMouseEnter={() => setIsHovered(true)}>{glitchedTitle}</h1>;
 * ```
 */
export function useGlitchText(text: string, active: boolean, speed: number = 1 / 3): string {
    const [displayText, setDisplayText] = useState(text);
    const iterations = useRef(0);

    useEffect(() => {
        if (!active) {
            setDisplayText(text);
            iterations.current = 0;
            return;
        }

        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((char, index) => {
                        if (index < iterations.current) {
                            return text[index];
                        }
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    })
                    .join('')
            );

            if (iterations.current >= text.length) {
                clearInterval(interval);
            }

            iterations.current += speed;
        }, 30);

        return () => clearInterval(interval);
    }, [active, text, speed]);

    return displayText;
}

export default useGlitchText;
