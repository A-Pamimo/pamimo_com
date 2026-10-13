'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getSessionSeed, mulberry32 } from '../../lib/visit';
import Traveller, { SIZE as TRAVELLER_BOX, type TravellerShape } from './origami/Traveller';

/**
 * The thin line that leaves the PA mark and flies down the page with the reader.
 * It swoops back and forth across the whole page, passing behind the text, and
 * ties open felt-tip loops along the way. Behind a block of text it dims (an SVG
 * mask built from the text boxes) and the text carries a page-coloured halo, so
 * the words stay crisp. Its drawn length tracks native scrolling; nothing
 * hijacks the scroll.
 *
 * The line's tip carries a piece of folded paper (Traveller) that takes the shape
 * of the chapter it is passing and refolds at each new chapter. It opens up in
 * clear space and travels folded into a slip while it passes behind text.
 * The paper sits outside the mask so it never fades.
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
    /** Text and photos the line passes behind, padded a little */
    blocks: { x: number; y: number; w: number; h: number }[];
}

const TEXT_BLOCKS = 'p, li, h1, h2, h3, figcaption, dt, dd, a, img, form';

/** The traveller opens up to this size, and folds into a slip below the smaller one */
const TRAVELLER_MAX = 56;
const TRAVELLER_MAX_NARROW = 40;
const TRAVELLER_MIN = 22;
const SLIP = 18;

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
    const [compact, setCompact] = useState(false);
    const compactRef = useRef(false);
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
        setCarry(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const leftGutter = col.left;
        const rightGutter = width - col.right;
        // The far reach on each side: out in the gutters, past the text
        const leftX = small ? Math.max(6, leftGutter / 2) : leftGutter * (0.42 + r() * 0.16);
        const rightX = small ? width - rightGutter / 2 : col.right + Math.min(rightGutter * (0.28 + r() * 0.22), 220);
        const colMid = (col.left + col.right) / 2;
        // How far a swoop reaches toward its side: mostly all the way, sometimes only partway
        const reach = (side: 'left' | 'right') => {
            const k = r() < (small ? 0.2 : 0.3) ? 0.35 + r() * 0.35 : 1;
            const far = side === 'left' ? leftX : rightX;
            return colMid + (far - colMid) * k;
        };
        const f = (n: number) => n.toFixed(1);

        let side: 'left' | 'right' = 'right';
        let x = start.left;
        let y = start.top;
        let d = `M${f(x)},${f(y)}`;

        // Ease from the end of the PA tail out to the right
        const firstBottom = rel(chapters[0].getBoundingClientRect()).bottom;
        const settleY = Math.min(y + 140, firstBottom);
        const lead = small ? Math.min(20, rightX - x) : 60;
        d += ` C${f(x + lead)},${f(y + 10)} ${f(rightX)},${f(y + 40)} ${f(rightX)},${f(settleY)}`;
        x = rightX;
        y = settleY;

        /**
         * One swoop across the page from the current point to (nx, ny): it leaves
         * and arrives travelling downward and crosses in between, like a plane
         * banking side to side. With loopR it ties an open felt-tip loop halfway.
         */
        const swoop = (nx: number, ny: number, loopR = 0) => {
            const dy = ny - y;
            if (!loopR) {
                d += ` C${f(x)},${f(y + dy * 0.55)} ${f(nx)},${f(ny - dy * 0.55)} ${f(nx)},${f(ny)}`;
            } else {
                const dir = nx >= x ? 1 : -1;
                const mx = (x + nx) / 2 - (dir * loopR) / 2;
                const my = y + dy / 2;
                const pull = Math.min(Math.abs(nx - x) / 3, small ? 50 : 90);
                d += ` C${f(x)},${f(y + dy * 0.3)} ${f(mx - dir * pull)},${f(my)} ${f(mx)},${f(my)}`;
                d += ` C${f(mx + dir * 2.4 * loopR)},${f(my - 2.2 * loopR)} ${f(mx - dir * 1.4 * loopR)},${f(my - 2.2 * loopR)} ${f(mx + dir * loopR)},${f(my)}`;
                d += ` C${f(mx + dir * (loopR + pull))},${f(my)} ${f(nx)},${f(ny - dy * 0.3)} ${f(nx)},${f(ny)}`;
            }
            x = nx;
            y = ny;
        };
        const loopSize = (room: number) =>
            small ? Math.max(5, Math.min(room, 8 + r() * 10)) : Math.max(8, Math.min(room, 14 + r() * 26));

        chapters.forEach((chapter, i) => {
            const box = rel(chapter.getBoundingClientRect());
            // Swoop back and forth across the chapter, behind the text
            const h = box.bottom - y;
            if (h > 40) {
                const n = Math.max(small ? 1 : 2, Math.round(h / (small ? 420 : 320)));
                let looped = h < 500;
                for (let k = 1; k <= n; k++) {
                    side = side === 'left' ? 'right' : 'left';
                    const ny = k === n ? box.bottom : y + (box.bottom - y) / (n - k + 1) * (0.85 + r() * 0.3);
                    const loop = !looped && r() < 0.5 ? loopSize((ny - y) / 5) : 0;
                    if (loop) looped = true;
                    swoop(reach(side), ny, loop);
                }
            }

            const next = chapters[i + 1];
            if (!next) return;
            const nextTop = rel(next.getBoundingClientRect()).top;
            const gap = nextTop - y;
            if (gap < 30) return;
            // Cross through the gap between chapters, usually with a loop
            side = side === 'left' ? 'right' : 'left';
            swoop(reach(side), nextTop, r() < 0.75 ? loopSize((gap / 2 - 10) / 1.7) : 0);
        });

        // Trail off into the footer with a small sway, ending where the carried
        // paper settles as a crane
        const end = Math.min(height - 40, y + 120);
        const inward = x > colMid ? -1 : 1;
        const sway = small ? 4 : 18;
        d += ` C${f(x)},${f(y + 50)} ${f(x + inward * sway)},${f(end - 40)} ${f(x)},${f(end)}`;
        const chapterInfo = chapters.map(c => {
            const b = rel(c.getBoundingClientRect());
            const fig = c.querySelector<HTMLElement>('[data-shape]');
            return { top: b.top, bottom: b.bottom, shape: (fig?.dataset.shape as TravellerShape) ?? 'plane' };
        });

        // The text the line passes behind: it dims there, and the paper folds small
        const blocks = Array.from(column.querySelectorAll<HTMLElement>(TEXT_BLOCKS))
            .map(el => rel(el.getBoundingClientRect()))
            .filter(b => b.right > b.left && b.bottom > b.top)
            .map(b => ({ x: b.left - 4, y: b.top - 3, w: b.right - b.left + 8, h: b.bottom - b.top + 6 }))
            .sort((a, b) => a.y - b.y)
            // Merge blocks a paragraph gap apart, so the line fades once instead of flickering
            .reduce<Geometry['blocks']>((merged, b) => {
                const last = merged[merged.length - 1];
                if (last && b.y - (last.y + last.h) < 40 && b.x < last.x + last.w && b.x + b.w > last.x) {
                    const x = Math.min(last.x, b.x);
                    const right = Math.max(last.x + last.w, b.x + b.w);
                    last.h = Math.max(last.y + last.h, b.y + b.h) - last.y;
                    last.x = x;
                    last.w = right - x;
                } else merged.push({ ...b });
                return merged;
            }, []);

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

        setGeo({ d, width, height, samples, total, col: { left: col.left, right: col.right }, chapters: chapterInfo, blocks });
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
        // Room around the tip: the distance to the nearest text block or page edge
        let room = 2 * Math.min(pt.x, g.width - pt.x);
        for (const b of g.blocks) {
            const dx = Math.max(b.x - pt.x, 0, pt.x - (b.x + b.w));
            const dy = Math.max(b.y - pt.y, 0, pt.y - (b.y + b.h));
            room = Math.min(room, 2 * Math.hypot(dx, dy));
            if (room <= 0) break;
        }
        const wide = window.matchMedia('(min-width: 64rem)').matches;
        const fold = room - 10 < TRAVELLER_MIN;
        if (fold !== compactRef.current) {
            compactRef.current = fold;
            setCompact(fold);
        }
        const size = fold ? SLIP : Math.min(wide ? TRAVELLER_MAX : TRAVELLER_MAX_NARROW, room - 10);
        trav.dataset.compact = fold ? '1' : '';
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
                    <defs>
                        <mask id="ribbon-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={geo.width} height={geo.height}>
                            <rect width={geo.width} height={geo.height} fill="#fff" />
                            {geo.blocks.map((b, i) => (
                                <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill="#737373" />
                            ))}
                        </mask>
                    </defs>
                    <g mask="url(#ribbon-mask)">
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
                    </g>
                    {carry && (
                        <g ref={travellerRef} className="ribbon-traveller">
                            <Traveller shape={shape} compact={compact} />
                        </g>
                    )}
                </>
            )}
        </svg>
    );
};

export default Ribbon;
