'use client';

import React, { useEffect, useRef } from 'react';
import { draw, paperPlane } from '../../../lib/origami';
import { motion, pathTracker } from '../../../lib/motion';
import { readPaint, stillMotion } from './Figure';

/**
 * A faceted paper plane that flies the PA tail, then unfolds flat and fades so
 * the ribbon carries on from where it landed. GSAP times the flight and the
 * unfold; MotionPathPlugin gives the point and heading along the tail, so it
 * moves smoothly at display rate. Runs on every load in full mode (in step with
 * the tail when the intro plays) and stays hidden under reduced motion. Lives
 * inside the PA hero SVG, in viewBox units.
 */

interface Props {
    /** Seconds before the tail starts drawing, and how long it takes */
    delay: number;
    dur: number;
}

const SIZE = 150;
const FACETS = paperPlane.pose(0).length;

const PaperPlane: React.FC<Props> = ({ delay, dur }) => {
    const ref = useRef<SVGGElement>(null);

    useEffect(() => {
        const plane = ref.current;
        const tail = plane?.ownerSVGElement?.querySelector<SVGPathElement>('.pa-tail');
        const root = document.documentElement;
        if (!plane || !tail || root.dataset.mode !== 'full' || stillMotion()) return;

        const { gsap } = motion();
        // In step with the tail when the intro plays; otherwise a short solo flight
        const speed = root.dataset.intro === 'quick' ? 0.4 : 1;
        const wait = root.dataset.intro ? delay * speed : 0.5;
        const fly = root.dataset.intro ? Math.max(dur * speed, 0.9) : 1.8;
        const at = pathTracker(tail);
        const paint = readPaint();
        const polys = Array.from(plane.querySelectorAll('polygon'));
        const state = { p: 0, u: 0 };

        const render = () => {
            const pt = at(state.p);
            // A little bank on the way, then the paper opens out flat
            const facets = draw(paperPlane, state.u, paint, SIZE, Math.sin(state.p * Math.PI) * 0.35);
            facets.forEach((f, i) => {
                polys[i].setAttribute('points', f.points);
                polys[i].setAttribute('fill', f.fill);
                polys[i].setAttribute('stroke', paint.edge);
            });
            // The model's nose sits at the right of its box; put the nose on the line
            plane.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${pt.angle}) translate(${-SIZE * 0.9} ${-SIZE / 2})`);
            plane.style.opacity = String(1 - state.u);
        };

        plane.style.opacity = '0';
        const tl = gsap
            .timeline({ delay: wait, onUpdate: render })
            .to(state, { p: 1, duration: fly, ease: 'power2.out' })
            .to(state, { u: 1, duration: 0.75, ease: 'power1.inOut' });
        return () => {
            tl.kill();
        };
    }, [delay, dur]);

    return (
        <g ref={ref} className="paper-plane" style={{ opacity: 0 }} aria-hidden="true">
            {Array.from({ length: FACETS }, (_, i) => (
                <polygon key={i} strokeWidth={1.1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            ))}
        </g>
    );
};

export default PaperPlane;
