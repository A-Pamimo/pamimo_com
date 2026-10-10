'use client';

import React, { useEffect, useRef } from 'react';
import { draw, paperPlane } from '../../../lib/origami';
import { FPS, readPaint, stillMotion } from './Figure';

/**
 * A faceted paper plane that flies the PA tail in stop-motion steps, then
 * unfolds flat and fades so the ribbon carries on from where it landed. Runs on
 * every load in full mode (in step with the tail when the intro plays) and stays
 * hidden under reduced motion. Lives inside the PA hero SVG, in viewBox units.
 */

interface Props {
    /** Seconds before the tail starts drawing, and how long it takes */
    delay: number;
    dur: number;
}

const SIZE = 150;
const FACETS = paperPlane.pose(0).length;
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

const PaperPlane: React.FC<Props> = ({ delay, dur }) => {
    const ref = useRef<SVGGElement>(null);

    useEffect(() => {
        const plane = ref.current;
        const tail = plane?.ownerSVGElement?.querySelector<SVGPathElement>('.pa-tail');
        const root = document.documentElement;
        if (!plane || !tail || root.dataset.mode !== 'full' || stillMotion()) return;

        // In step with the tail when the intro plays; otherwise a short solo flight
        const speed = root.dataset.intro === 'quick' ? 0.4 : 1;
        const wait = root.dataset.intro ? delay * speed : 0.5;
        const fly = root.dataset.intro ? Math.max(dur * speed, 0.9) : 1.8;
        const unfold = 0.75;
        const total = tail.getTotalLength();
        const paint = readPaint();
        const polys = Array.from(plane.querySelectorAll('polygon'));
        let raf = 0;
        let start = 0;
        let lastFrame = -1;

        const frame = (now: number) => {
            if (!start) start = now;
            const elapsed = (now - start) / 1000;
            raf = requestAnimationFrame(frame);
            // Stop-motion: only redraw on whole frames
            const step = Math.floor(elapsed * FPS);
            if (step === lastFrame) return;
            lastFrame = step;
            const t = step / FPS - wait;
            if (t < 0) return;

            const p = Math.min(1, t / fly);
            const len = total * ease(p);
            const pt = tail.getPointAtLength(len);
            const ahead = tail.getPointAtLength(Math.min(total, len + 2));
            const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
            const u = Math.max(0, Math.min(1, (t - fly) / unfold));
            // A little bank on the way, then the paper opens out flat
            const facets = draw(paperPlane, u, paint, SIZE, Math.sin(p * Math.PI) * 0.35);
            facets.forEach((f, i) => {
                polys[i].setAttribute('points', f.points);
                polys[i].setAttribute('fill', f.fill);
                polys[i].setAttribute('stroke', paint.edge);
            });
            // The model's nose sits at the right of its box; put the nose on the line
            plane.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${angle}) translate(${-SIZE * 0.9} ${-SIZE / 2})`);
            plane.style.opacity = String(1 - u);
            if (u >= 1) cancelAnimationFrame(raf);
        };
        plane.style.opacity = '0';
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [delay, dur]);

    return (
        <g ref={ref} className="paper-plane" style={{ opacity: 0 }} aria-hidden="true">
            {Array.from({ length: FACETS }, (_, i) => (
                <polygon key={i} strokeWidth={0.8} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            ))}
        </g>
    );
};

export default PaperPlane;
