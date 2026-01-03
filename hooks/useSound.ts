import { useCallback, useRef } from 'react';

type SoundType = 'hover' | 'click' | 'on' | 'off' | 'error';

export const useSound = (enabled: boolean = true) => {
    const audioContext = useRef<AudioContext | null>(null);

    const play = useCallback((type: SoundType) => {
        if (!enabled || typeof window === 'undefined') return;

        try {
            if (!audioContext.current) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                audioContext.current = new AudioContext();
            }

            const ctx = audioContext.current;
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => { });
            }

            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;

            switch (type) {
                case 'hover':
                    // Subtle high blip
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
                    gainNode.gain.setValueAtTime(0.02, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
                    osc.start(now);
                    osc.stop(now + 0.03);
                    break;

                case 'click':
                    // Satisfying mechanical keypress
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;

                case 'on':
                    // Power up / Activate
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.linearRampToValueAtTime(880, now + 0.2);
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;

                case 'off':
                    // Power down
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.linearRampToValueAtTime(110, now + 0.2);
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
            }
        } catch (e) {
            // Ignore audio errors (e.g. if blocked by browser policy)
        }
    }, [enabled]);

    return { play };
};
