'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { envelope, helm, lantern, mortarboard, pinwheel, rockingBoat, wristwatch, type Model } from '../../../lib/origami';
import Figure from './Figure';

/**
 * The folded shape that belongs to a chapter of the story, pinned level with the
 * chapter's heading. On wide screens it rests in the outer right margin, beyond
 * the ribbon's widest reach; where that margin is too narrow it sits at the end
 * of the heading row instead. It casts a small contact shadow so it rests on the
 * page rather than floating. Full mode only (see .chapter-figure in site.css).
 */

const SHAPES: Record<string, { model: Model; frames: number }> = {
    helm: { model: helm, frames: 14 },
    lantern: { model: lantern, frames: 36 },
    boat: { model: rockingBoat, frames: 36 },
    pinwheel: { model: pinwheel, frames: 12 },
    mortarboard: { model: mortarboard, frames: 40 },
    watch: { model: wristwatch, frames: 60 },
    envelope: { model: envelope, frames: 48 },
};

export type Shape = keyof typeof SHAPES;

const BOX = 64;

const ChapterFigure: React.FC<{ shape: Shape }> = ({ shape }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [spot, setSpot] = useState<{ left: number; top: number; size: number } | null>(null);
    const { model, frames } = SHAPES[shape];

    const place = useCallback(() => {
        const el = ref.current;
        const chapter = el?.parentElement;
        const site = el?.closest('.site') as HTMLElement | null;
        const heading = chapter?.querySelector('h2');
        if (!el || !chapter || !site || !heading) return;
        const c = chapter.getBoundingClientRect();
        const s = site.getBoundingClientRect();
        const h = heading.getBoundingClientRect();
        const headMid = h.top - c.top + h.height / 2;
        const gutter = s.right - c.right;
        // The ribbon keeps within min(gutter / 2, 220) of the column, plus its loops
        const offset = Math.min(gutter * 0.5, 220) + 90;
        const wide = window.matchMedia('(min-width: 64rem)').matches;
        if (wide && c.right + offset + BOX < s.right - 16) {
            setSpot({ left: c.width + offset, top: headMid - BOX / 2, size: BOX });
        } else {
            const size = 44;
            setSpot({ left: c.width - size, top: headMid - size / 2, size });
        }
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const rebuild = () => {
            clearTimeout(timer);
            timer = setTimeout(place, 150);
        };
        place();
        document.fonts?.ready.then(place);
        const ro = new ResizeObserver(rebuild);
        const site = ref.current?.closest('.site');
        if (site) ro.observe(site);
        return () => {
            clearTimeout(timer);
            ro.disconnect();
        };
    }, [place]);

    return (
        <div
            ref={ref}
            className="chapter-figure"
            aria-hidden="true"
            style={spot ? { left: spot.left, top: spot.top, width: spot.size, height: spot.size } : { visibility: 'hidden' }}
        >
            <svg viewBox={`0 0 ${BOX} ${BOX}`}>
                <ellipse className="chapter-figure__shadow" cx={BOX / 2} cy={BOX - 5} rx={BOX * 0.3} ry={2.6} />
                <Figure model={model} size={BOX} loop frames={frames} />
            </svg>
        </div>
    );
};

export default ChapterFigure;
