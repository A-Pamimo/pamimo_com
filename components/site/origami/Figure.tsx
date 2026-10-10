'use client';

import React, { useEffect, useRef } from 'react';
import { draw, type Model, type Paint } from '../../../lib/origami';

/**
 * Renders a faceted paper model into an SVG group, stepped frame by frame at a
 * stop-motion rate. `loop` cycles the model forever (only while on screen);
 * otherwise the figure steps toward `target` one frame at a time, so a change
 * from 0 to 1 plays the fold and 1 to 0 plays it back. Under reduced motion the
 * figure is drawn once in its resting pose.
 */

export const FPS = 12;

/** Pale paper with pen-coloured folds: the page's own paper and pen */
export const readPaint = (): Paint => {
    const cs = getComputedStyle(document.documentElement);
    const get = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
    return { front: get('--pa-field', '#f9fcec'), back: get('--pa-rule', '#d3d6c5'), edge: get('--pa-ribbon', '#9e511f') };
};

export const stillMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Props {
    model: Model;
    /** Drawing box in user units; the figure is centred in it */
    size: number;
    loop?: boolean;
    /** Frames per loop cycle, or per full 0 to 1 transition */
    frames: number;
    /** Where a non-looping figure should end up, 0 to 1 */
    target?: number;
    /** Starting point in the cycle, so neighbours don't move in step */
    phase?: number;
    /** Pose shown under reduced motion */
    rest?: number;
}

const Figure: React.FC<Props> = ({ model, size, loop = false, frames, target = 1, phase = 0, rest = 0.25 }) => {
    const ref = useRef<SVGGElement>(null);
    const state = useRef({ frame: Math.round(phase * frames), paint: null as Paint | null, target });
    const count = model.pose(0).length;

    // Paints the current frame into the existing polygons
    const render = (t: number) => {
        const g = ref.current;
        if (!g) return;
        const paint = (state.current.paint ??= readPaint());
        const facets = draw(model, t, paint, size);
        const polys = g.children;
        facets.forEach((f, i) => {
            const p = polys[i] as SVGPolygonElement;
            p.setAttribute('points', f.points);
            p.setAttribute('fill', f.fill);
            p.setAttribute('stroke', paint.edge);
        });
    };

    useEffect(() => {
        state.current.target = target;
    }, [target]);

    useEffect(() => {
        const s = state.current;
        const still = stillMotion();
        const pose = () => (loop ? (s.frame % frames) / frames : s.frame / frames);
        // A one-shot figure starts unfolded and steps toward its target
        if (!loop && still) s.frame = Math.round(target * frames);
        render(still ? (loop ? rest : target) : pose());

        const repaint = () => {
            s.paint = readPaint();
            render(still ? (loop ? rest : s.target) : pose());
        };
        window.addEventListener('pa-palette', repaint);
        if (still) return () => window.removeEventListener('pa-palette', repaint);

        let visible = true;
        const svg = ref.current?.ownerSVGElement;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '120px' });
        if (svg) io.observe(svg);

        let raf = 0;
        let last = 0;
        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (now - last < 1000 / FPS || !visible || document.hidden) return;
            last = now;
            if (loop) {
                s.frame += 1;
            } else {
                const goal = Math.round(s.target * frames);
                if (s.frame === goal) return;
                s.frame += s.frame < goal ? 1 : -1;
            }
            render(pose());
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            window.removeEventListener('pa-palette', repaint);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model, size, loop, frames]);

    return (
        <g ref={ref} className="origami-figure" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <polygon key={i} strokeWidth={1.1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            ))}
        </g>
    );
};

export default Figure;
