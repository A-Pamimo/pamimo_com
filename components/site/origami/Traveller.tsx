'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from '../../../lib/motion';
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
 * shape. Where there is little room it stays folded into a slip and opens again
 * where there is space. Drawn on the GSAP ticker at display rate, with the folds
 * tweened, so it moves smoothly. Position and size are set by Ribbon.
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
/** Seconds to fold flat, and to open back up */
const FOLD = 0.28;

/** The same model, pressed toward a flat sheet by k (1 = as folded, 0 = flat) */
const pressed = (model: Model, k: number): Model => ({
    ...model,
    pose: t => model.pose(t).map(f => f.map(p => [p[0], p[1] * k, p[2] * (0.25 + 0.75 * k)]) as Facet),
});

const Traveller: React.FC<{ shape: TravellerShape; compact?: boolean }> = ({ shape, compact = false }) => {
    const ref = useRef<SVGGElement>(null);
    /** fold: 0 as folded into the shape, 1 pressed flat */
    const state = useRef({ shown: shape, wanted: shape, fold: 0, compact, busy: false, start: 0 });
    const settleRef = useRef<() => void>(() => {});

    useEffect(() => {
        state.current.wanted = shape;
        settleRef.current();
    }, [shape]);

    useEffect(() => {
        state.current.compact = compact;
        settleRef.current();
    }, [compact]);

    useEffect(() => {
        const g = ref.current;
        if (!g) return;
        const { gsap } = motion();
        const s = state.current;
        const polys = Array.from(g.children) as SVGPolygonElement[];
        let paint = readPaint();
        const repaint = () => (paint = readPaint());
        window.addEventListener('pa-palette', repaint);
        s.start = gsap.ticker.time;

        let tween: gsap.core.Tween | null = null;
        // Fold flat and swap to the wanted shape, then open up (or stay a slip)
        const settle = () => {
            if (s.busy) return;
            if (s.wanted !== s.shown) {
                s.busy = true;
                tween?.kill();
                tween = gsap.to(s, {
                    fold: 1,
                    duration: FOLD * (1 - s.fold) + 0.04,
                    ease: 'power2.in',
                    onComplete: () => {
                        s.shown = s.wanted;
                        s.start = gsap.ticker.time;
                        s.busy = false;
                        settle();
                    },
                });
                return;
            }
            const goal = s.compact ? 1 : 0;
            if (s.fold !== goal) {
                tween?.kill();
                tween = gsap.to(s, { fold: goal, duration: FOLD + 0.06, ease: 'power2.inOut' });
            }
        };
        settleRef.current = settle;

        const render = (time: number) => {
            if (document.hidden) return;
            const { model, frames, still } = SHAPES[s.shown];
            // Each shape loops at its own pace: the same cycle as its stop-motion figure
            const t = still ?? (frames ? (((time - s.start) * FPS) / frames) % 1 : 0);
            const k = 1 - s.fold;
            const facets = draw(k < 1 ? pressed(model, Math.max(0.1, k)) : model, t, paint, SIZE);
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
        render(gsap.ticker.time);
        settle();
        gsap.ticker.add(render);
        return () => {
            gsap.ticker.remove(render);
            tween?.kill();
            settleRef.current = () => {};
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
