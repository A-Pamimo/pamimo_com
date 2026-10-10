'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getSessionSeed, mulberry32 } from '../../../lib/visit';
import { flappingCrane, fortuneTeller, rockingBoat } from '../../../lib/origami';
import Figure from './Figure';

/**
 * Three small paper pieces resting in the outer right margin, each in an empty
 * gap between chapters and beyond the ribbon's path, so they never touch text.
 * Desktop full mode only; they fold frame by frame and drift a little with scroll.
 */

const MODELS = [rockingBoat, flappingCrane, fortuneTeller];
const SIZE = 64;

interface Spot {
    top: number;
    left: number;
}

const MarginOrigami: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [spots, setSpots] = useState<Spot[]>([]);

    const place = useCallback(() => {
        const host = ref.current;
        const site = host?.closest('.site') as HTMLElement | null;
        const active =
            document.documentElement.dataset.mode === 'full' && window.matchMedia('(min-width: 64rem)').matches;
        if (!host || !site || !active) {
            setSpots([]);
            return;
        }
        const siteBox = site.getBoundingClientRect();
        const col = site.querySelector('.site-column')!.getBoundingClientRect();
        const colRight = col.right - siteBox.left;
        const gutter = siteBox.width - colRight;
        // The ribbon stays within colRight + min(gutter * 0.5, 220); keep clear of it
        const ribbonMax = colRight + Math.min(gutter * 0.5, 220) + 44;
        const left = Math.max(ribbonMax + 15, colRight + gutter * 0.72 - SIZE / 2);
        if (left + SIZE + 15 > siteBox.width - 12) {
            setSpots([]);
            return;
        }
        const chapters = Array.from(site.querySelectorAll<HTMLElement>('.chapter')).map(c => {
            const r = c.getBoundingClientRect();
            return { top: r.top - siteBox.top, bottom: r.bottom - siteBox.top };
        });
        const gaps = chapters.slice(0, -1).map((c, i) => ({ from: c.bottom, to: chapters[i + 1].top }));
        const usable = gaps.filter(g => g.to - g.from > SIZE + 24);
        const r = mulberry32(getSessionSeed() ^ 0x5bd1);
        // Spread the three pieces down the page: one from each third of the gaps
        const picks = MODELS.map((_, i) => {
            const slice = usable.slice(Math.floor((usable.length * i) / 3), Math.floor((usable.length * (i + 1)) / 3));
            const g = slice[Math.floor(r() * slice.length)];
            return g && { top: g.from + (g.to - g.from - SIZE) * (0.3 + r() * 0.4), left: left + (r() - 0.5) * 30 };
        });
        setSpots(picks.filter(Boolean) as Spot[]);
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const rebuild = () => {
            clearTimeout(timer);
            timer = setTimeout(place, 200);
        };
        place();
        document.fonts?.ready.then(place);
        const site = ref.current?.closest('.site');
        const ro = new ResizeObserver(rebuild);
        if (site) ro.observe(site);
        window.addEventListener('pa-mode', place);

        // Gentle parallax: each piece lags the scroll by a few pixels
        let raf = 0;
        const drift = () => {
            raf = 0;
            ref.current?.querySelectorAll<HTMLElement>('.margin-origami__piece').forEach(el => {
                const r = el.getBoundingClientRect();
                const offset = Math.max(-24, Math.min(24, (r.top + r.height / 2 - innerHeight / 2) * -0.04));
                el.style.translate = `0 ${offset.toFixed(1)}px`;
            });
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(drift);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            clearTimeout(timer);
            ro.disconnect();
            cancelAnimationFrame(raf);
            window.removeEventListener('pa-mode', place);
            window.removeEventListener('scroll', onScroll);
        };
    }, [place]);

    return (
        <div ref={ref} className="margin-origami" aria-hidden="true">
            {spots.map((s, i) => (
                <div key={i} className="margin-origami__piece" style={{ top: s.top, left: s.left }}>
                    <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
                        <Figure model={MODELS[i]} size={SIZE} loop frames={36} phase={i / 3} />
                    </svg>
                </div>
            ))}
        </div>
    );
};

export default MarginOrigami;
