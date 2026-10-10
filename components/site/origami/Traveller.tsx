'use client';

import React, { useEffect, useRef } from 'react';
import {
    draw,
    envelope,
    foldingCrane,
    helm,
    lantern,
    mortarboard,
    paperPlane,
    pinwheel,
    rockingBoat,
    wristwatch,
    type Facet,
    type Model,
} from '../../../lib/origami';
import { FPS, readPaint } from './Figure';

/**
 * The piece of paper the ribbon carries at its tip. It holds the shape of the
 * chapter the line is passing through, looping that shape's own motion, and when
 * the line crosses into a new chapter it folds flat and refolds into the next
 * shape, stepped frame by frame. Position and size are set by Ribbon.
 */

export type TravellerShape =
    | 'plane'
    | 'helm'
    | 'lantern'
    | 'boat'
    | 'pinwheel'
    | 'mortarboard'
    | 'watch'
    | 'envelope'
    | 'crane';

const SHAPES: Record<TravellerShape, { model: Model; frames: number; still?: number }> = {
    plane: { model: paperPlane, frames: 0, still: 0 },
    helm: { model: helm, frames: 14 },
    lantern: { model: lantern, frames: 36 },
    boat: { model: rockingBoat, frames: 36 },
    pinwheel: { model: pinwheel, frames: 12 },
    mortarboard: { model: mortarboard, frames: 40 },
    watch: { model: wristwatch, frames: 60 },
    envelope: { model: envelope, frames: 48 },
    crane: { model: foldingCrane, frames: 0, still: 1 },
};

export const SIZE = 64;
const SLOTS = Math.max(...Object.values(SHAPES).map(s => s.model.pose(0).length));
/** Frames to fold flat, and the same again to refold into the next shape */
const HALF = 6;

/** The same model, pressed toward a flat sheet by k (1 = as folded, 0 = flat) */
const pressed = (model: Model, k: number): Model => ({
    ...model,
    pose: t => model.pose(t).map(f => f.map(p => [p[0], p[1] * k, p[2] * (0.25 + 0.75 * k)]) as Facet),
});

const Traveller: React.FC<{ shape: TravellerShape }> = ({ shape }) => {
    const ref = useRef<SVGGElement>(null);
    const state = useRef({ shown: shape, wanted: shape, frame: 0, fold: 0 });

    useEffect(() => {
        state.current.wanted = shape;
    }, [shape]);

    useEffect(() => {
        const g = ref.current;
        if (!g) return;
        const s = state.current;
        const polys = Array.from(g.children) as SVGPolygonElement[];
        let paint = readPaint();
        const repaint = () => (paint = readPaint());
        window.addEventListener('pa-palette', repaint);

        const render = () => {
            const { model, frames, still } = SHAPES[s.shown];
            const t = still ?? (frames ? (s.frame % frames) / frames : 0);
            // fold counts 0..HALF going flat, then HALF..0 coming back up
            const k = 1 - s.fold / HALF;
            const facets = draw(k < 1 ? pressed(model, Math.max(0.04, k)) : model, t, paint, SIZE);
            polys.forEach((p, i) => {
                const f = facets[i];
                if (!f) {
                    p.setAttribute('points', '');
                    return;
                }
                p.setAttribute('points', f.points);
                p.setAttribute('fill', f.fill);
                p.setAttribute('stroke', paint.edge);
            });
        };

        let raf = 0;
        let last = 0;
        let flattening = false;
        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            if (now - last < 1000 / FPS || document.hidden) return;
            last = now;
            s.frame += 1;
            if (s.wanted !== s.shown || flattening) {
                // Fold flat, swap to the next shape, then open it back up
                flattening = true;
                s.fold = Math.min(HALF, s.fold + 1);
                if (s.fold === HALF) {
                    s.shown = s.wanted;
                    s.frame = 0;
                    flattening = false;
                }
            } else if (s.fold > 0) {
                s.fold -= 1;
            }
            render();
        };
        render();
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('pa-palette', repaint);
        };
    }, []);

    return (
        <g ref={ref} aria-hidden="true">
            {Array.from({ length: SLOTS }, (_, i) => (
                <polygon key={i} strokeWidth={1.1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            ))}
        </g>
    );
};

export default Traveller;
