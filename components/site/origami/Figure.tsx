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

const darken = (hex: string, k: number) => {
    const h = hex.replace('#', '');
    return `rgb(${[0, 2, 4].map(i => Math.round(parseInt(h.slice(i, i + 2), 16) * k)).join(',')})`;
};

export const readPaint = (): Paint => {
    const cs = getComputedStyle(document.documentElement);
    const get = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
    const front = get('--pa-ribbon', '#9e511f');
    return { front, back: get('--pa-field', '#f9fcec'), edge: darken(front, 0.55) };
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
    /** Paper whose front is the page itself (a dog-ear): front takes the page colour */
    pageFront?: boolean;
    /** Hide the figure while it sits at pose 0 */
    hideAtZero?: boolean;
}

const Figure: React.FC<Props> = ({ model, size, loop = false, frames, target = 1, phase = 0, rest = 0.25, pageFront = false, hideAtZero = false }) => {
    const ref = useRef<SVGGElement>(null);
    const state = useRef({ frame: Math.round(phase * frames), paint: null as Paint | null, target });
    const count = model.pose(0).length;

    // Paints the current frame into the existing polygons
    const render = (t: number) => {
        const g = ref.current;
        if (!g) return;
        let paint = (state.current.paint ??= readPaint());
        if (pageFront) {
            const page = getComputedStyle(document.documentElement).getPropertyValue('--pa-bg').trim() || '#eff3dc';
            paint = { front: page, back: paint.front, edge: paint.edge };
        }
        g.style.visibility = hideAtZero && t <= 0 ? 'hidden' : 'visible';
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
                <polygon key={i} strokeWidth={0.8} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            ))}
        </g>
    );
};

export default Figure;
