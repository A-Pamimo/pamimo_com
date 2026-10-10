'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { envelope, helm, lantern, mortarboard, pinwheel, rockingBoat, wristwatch, type Model } from '../../../lib/origami';
import Figure from './Figure';

/**
 * The folded shape that belongs to a chapter of the story, at the end of the
 * chapter's heading row on a small contact shadow. On wide screens the ribbon's
 * travelling paper takes these shapes instead, so this shows on phones (and on
 * wide screens under reduced motion). It also tells Ribbon each chapter's shape
 * through data-shape. Full mode only (see .chapter-figure in site.css).
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
        const h = heading.getBoundingClientRect();
        const size = 44;
        setSpot({ left: c.width - size, top: h.top - c.top + h.height / 2 - size / 2, size });
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
            data-shape={shape}
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
