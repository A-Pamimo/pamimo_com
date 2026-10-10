'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getSessionSeed, mulberry32 } from '../../lib/visit';
import Traveller, { SIZE as TRAVELLER_BOX, type TravellerShape } from './origami/Traveller';

/**
 * The thin line that leaves the PA mark and follows the reader down the page.
 * It runs through the gutters beside each chapter and only crosses the page in
 * the empty gap between chapters, so it never passes over text. Its drawn length
 * tracks native scrolling; nothing hijacks the scroll.
 *
 * Shown in full mode at every width. On phones the gutters are only about 20px,
 * so the line runs down their middle with small loops (see NARROW below).
 *
 * On wide screens the line's tip carries a piece of folded paper (Traveller) that
 * takes the shape of the chapter it is passing and refolds at each new chapter.
 * It is sized from the free space around the tip so it never covers text.
 */

interface Geometry {
    d: string;
    width: number;
    height: number;
    /** Path length at sampled points, with the y each one reaches, for scroll mapping */
    samples: { len: number; y: number }[];
    total: number;
    /** Reading column edges and each chapter's extent and origami shape */
    col: { left: number; right: number };
    chapters: { top: number; bottom: number; shape: TravellerShape }[];
}

/** The traveller never grows past this, and hides below the smaller size */
const TRAVELLER_MAX = 56;
const TRAVELLER_MIN = 22;

const SAMPLE_COUNT = 400;

const isActive = () => typeof window !== 'undefined' && document.documentElement.dataset.mode === 'full';

/** Below 64rem the gutters are too narrow for wide loops or a 3px line */
const isNarrow = () => !window.matchMedia('(min-width: 64rem)').matches;

const Ribbon: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const travellerRef = useRef<SVGGElement>(null);
    const [shape, setShape] = useState<TravellerShape>('plane');
    const shapeRef = useRef<TravellerShape>('plane');
    const [carry, setCarry] = useState(false);
    const [geo, setGeo] = useState<Geometry | null>(null);
    const [narrow, setNarrow] = useState(false);
    const geoRef = useRef<Geometry | null>(null);

    const build = useCallback(() => {
        const svg = svgRef.current;
        const site = svg?.closest('.site') as HTMLElement | null;
        if (!svg || !site || !isActive()) {
            setGeo(null);
            return;
        }

        const siteBox = site.getBoundingClientRect();
        const rel = (r: DOMRect) => ({
            top: r.top - siteBox.top,
            bottom: r.bottom - siteBox.top,
            left: r.left - siteBox.left,
            right: r.right - siteBox.left,
        });

        const column = site.querySelector('.site-column');
        const tailEnd = site.querySelector('[data-pa-tail-end]');
        const chapters = Array.from(site.querySelectorAll<HTMLElement>('.chapter'));
        if (!column || !tailEnd || chapters.length === 0) return;

        const col = rel(column.getBoundingClientRect());
        const start = rel(tailEnd.getBoundingClientRect());
        const width = siteBox.width;
        const height = site.scrollHeight;

        const r = mulberry32(getSessionSeed());
        const small = isNarrow();
        setNarrow(small);
        setCarry(!small && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const leftGutter = col.left;
        const rightGutter = width - col.right;
        const leftX = small ? leftGutter / 2 : leftGutter * (0.42 + r() * 0.16);
        const rightX = small ? width - rightGutter / 2 : col.right + Math.min(rightGutter * (0.28 + r() * 0.22), 220);
        const xFor = (side: 'left' | 'right') => (side === 'left' ? leftX : rightX);

        let side: 'left' | 'right' = 'right';
        let x = start.left;
        let y = start.top;
        let d = `M${x.toFixed(1)},${y.toFixed(1)}`;

        // Ease from the end of the PA tail into the right gutter
        const firstBottom = rel(chapters[0].getBoundingClientRect()).bottom;
        const settleY = Math.min(y + 140, firstBottom);
        const lead = small ? Math.min(20, xFor(side) - x) : 60;
        d += ` C${(x + lead).toFixed(1)},${(y + 10).toFixed(1)} ${xFor(side).toFixed(1)},${(y + 40).toFixed(1)} ${xFor(side).toFixed(1)},${settleY.toFixed(1)}`;
        x = xFor(side);
        y = settleY;

        chapters.forEach((chapter, i) => {
            const box = rel(chapter.getBoundingClientRect());
            const maxWander = small ? 3 : side === 'left' ? Math.min(14, leftX - 12) : 26;
            const wander = (r() * 2 - 1) * maxWander;

            // Run down the gutter alongside the chapter with a gentle wander
            if (box.bottom > y) {
                d += ` C${(x + wander).toFixed(1)},${(y + (box.bottom - y) * 0.35).toFixed(1)} ${(x - wander).toFixed(1)},${(y + (box.bottom - y) * 0.7).toFixed(1)} ${x.toFixed(1)},${box.bottom.toFixed(1)}`;
                y = box.bottom;
            }

            const next = chapters[i + 1];
            if (!next) return;
            const nextTop = rel(next.getBoundingClientRect()).top;
            const gap = nextTop - y;
            if (gap < 40) return;

            const mid = y + gap / 2;
            // An open, self-crossing loop like a felt-tip "l"; it rises about 1.7R
            const loopR = small
                ? Math.max(3, Math.min((gap / 2 - 10) / 1.7, 4 + r() * 2))
                : Math.max(6, Math.min((gap / 2 - 14) / 1.7, 12 + r() * 14));
            const cross = r() < 0.6;

            if (cross) {
                // Cross the page through the empty gap, looping once on the way
                const nextSide = side === 'left' ? 'right' : 'left';
                const nx = xFor(nextSide);
                const loopX = col.left + (col.right - col.left) * (0.25 + r() * 0.5);
                const dir = nx > x ? 1 : -1;
                const pull = small ? 40 : 80;
                d += ` C${x.toFixed(1)},${(mid - gap * 0.2).toFixed(1)} ${(loopX - dir * pull).toFixed(1)},${mid.toFixed(1)} ${loopX.toFixed(1)},${mid.toFixed(1)}`;
                d += ` C${(loopX + dir * 2.4 * loopR).toFixed(1)},${(mid - 2.2 * loopR).toFixed(1)} ${(loopX - dir * 1.4 * loopR).toFixed(1)},${(mid - 2.2 * loopR).toFixed(1)} ${(loopX + dir * loopR).toFixed(1)},${mid.toFixed(1)}`;
                d += ` C${(loopX + dir * (loopR + pull)).toFixed(1)},${mid.toFixed(1)} ${nx.toFixed(1)},${(mid + gap * 0.2).toFixed(1)} ${nx.toFixed(1)},${nextTop.toFixed(1)}`;
                side = nextSide;
                x = nx;
            } else {
                // Stay in this gutter and tie a small open loop in the gap, bulging
                // away from the column so it never reaches the text
                const away = side === 'left' ? -1 : 1;
                d += ` C${x.toFixed(1)},${(mid - gap * 0.25).toFixed(1)} ${x.toFixed(1)},${(mid - gap * 0.1).toFixed(1)} ${x.toFixed(1)},${mid.toFixed(1)}`;
                d += ` C${(x + away * 2.2 * loopR).toFixed(1)},${(mid + 2.4 * loopR).toFixed(1)} ${(x + away * 2.2 * loopR).toFixed(1)},${(mid - 1.4 * loopR).toFixed(1)} ${x.toFixed(1)},${(mid + loopR).toFixed(1)}`;
                d += ` C${x.toFixed(1)},${(mid + gap * 0.15).toFixed(1)} ${x.toFixed(1)},${(mid + gap * 0.3).toFixed(1)} ${x.toFixed(1)},${nextTop.toFixed(1)}`;
            }
            y = nextTop;
        });

        // Trail off into the footer with a small sway, ending mid-gutter where the
        // carried paper settles as a crane
        const end = Math.min(height - 40, y + 120);
        const inward = (side as 'left' | 'right') === 'left' ? 1 : -1;
        const sway = small ? 4 : 18;
        d += ` C${x.toFixed(1)},${(y + 50).toFixed(1)} ${(x + inward * sway).toFixed(1)},${(end - 40).toFixed(1)} ${x.toFixed(1)},${end.toFixed(1)}`;
        const chapterInfo = chapters.map(c => {
            const b = rel(c.getBoundingClientRect());
            const fig = c.querySelector<HTMLElement>('[data-shape]');
            return { top: b.top, bottom: b.bottom, shape: (fig?.dataset.shape as TravellerShape) ?? 'plane' };
        });

        // Sample the path once so scroll position maps to drawn length cheaply
        const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        probe.setAttribute('d', d);
        svg.appendChild(probe);
        const total = probe.getTotalLength();
        const samples: Geometry['samples'] = [];
        let maxY = -Infinity;
        for (let i = 0; i <= SAMPLE_COUNT; i++) {
            const len = (total * i) / SAMPLE_COUNT;
            // Keep y monotonic so loops never make the line jump backwards
            maxY = Math.max(maxY, probe.getPointAtLength(len).y);
            samples.push({ len, y: maxY });
        }
        probe.remove();

        setGeo({ d, width, height, samples, total, col: { left: col.left, right: col.right }, chapters: chapterInfo });
    }, []);

    const update = useCallback(() => {
        const g = geoRef.current;
        const path = pathRef.current;
        const svg = svgRef.current;
        if (!g || !path || !svg) return;

        // The line reaches a little past the middle of the viewport, then
        // catches up with the bottom of the page as the reader gets there
        const svgTop = svg.getBoundingClientRect().top;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 1;
        const targetY = window.innerHeight * (0.62 + 0.38 * progress ** 3) - svgTop + progress ** 3 * 40;

        let lo = 0;
        let hi = g.samples.length - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (g.samples[mid].y < targetY) lo = mid + 1;
            else hi = mid;
        }
        const drawn = g.samples[lo].len;
        path.style.strokeDashoffset = String(g.total - drawn);

        // Carry the paper at the tip
        const trav = travellerRef.current;
        if (!trav) return;
        const pt = path.getPointAtLength(drawn);
        const back = path.getPointAtLength(Math.max(0, drawn - 3));
        const inChapter = [...g.chapters].reverse().find(c => pt.y >= c.top - 4);
        const arrived = drawn / g.total > 0.985;
        const next: TravellerShape = arrived ? 'crane' : inChapter ? inChapter.shape : 'plane';
        if (next !== shapeRef.current) {
            shapeRef.current = next;
            setShape(next);
        }
        // Room around the tip: across the gutter beside text, or up and down in a gap
        let room: number;
        if (pt.x < g.col.left) room = 2 * Math.min(pt.x, g.col.left - pt.x);
        else if (pt.x > g.col.right) room = 2 * Math.min(g.width - pt.x, pt.x - g.col.right);
        else {
            const above = g.chapters.filter(c => c.bottom <= pt.y).pop();
            const below = g.chapters.find(c => c.top >= pt.y);
            room = 2 * Math.min(above ? pt.y - above.bottom : 999, below ? below.top - pt.y : 999);
        }
        const size = Math.min(TRAVELLER_MAX, room - 10);
        if (size < TRAVELLER_MIN) {
            trav.style.visibility = 'hidden';
            return;
        }
        trav.style.visibility = 'visible';
        // The plane points along the line; the other shapes stay upright
        const angle = next === 'plane' ? (Math.atan2(pt.y - back.y, pt.x - back.x) * 180) / Math.PI : 0;
        const k = size / TRAVELLER_BOX;
        trav.setAttribute(
            'transform',
            `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${k.toFixed(3)}) translate(${-TRAVELLER_BOX / 2} ${-TRAVELLER_BOX / 2})`,
        );
    }, []);

    useEffect(() => {
        geoRef.current = geo;
        update();
    }, [geo, update]);

    useEffect(() => {
        let raf = 0;
        let resizeTimer: ReturnType<typeof setTimeout>;

        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                update();
            });
        };
        const rebuild = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(build, 200);
        };

        build();
        // Fonts change line breaks, so measure again once they are ready
        document.fonts?.ready.then(build);

        const site = svgRef.current?.closest('.site');
        const ro = new ResizeObserver(rebuild);
        if (site) ro.observe(site);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('pa-mode', build);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(resizeTimer);
            ro.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('pa-mode', build);
        };
    }, [build, update]);

    return (
        <svg
            ref={svgRef}
            className="ribbon"
            aria-hidden="true"
            width={geo?.width ?? 0}
            height={geo?.height ?? 0}
            viewBox={geo ? `0 0 ${geo.width} ${geo.height}` : undefined}
        >
            {geo && (
                <>
                    <path
                        ref={pathRef}
                        d={geo.d}
                        fill="none"
                        stroke="var(--ribbon)"
                        strokeWidth={narrow ? 2 : 3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ strokeDasharray: geo.total, strokeDashoffset: geo.total }}
                    />
                    {carry && (
                        <g ref={travellerRef} className="ribbon-traveller">
                            <Traveller shape={shape} />
                        </g>
                    )}
                </>
            )}
        </svg>
    );
};

export default Ribbon;
