'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getSessionSeed, mulberry32 } from '../../lib/visit';
import Traveller, { SIZE as TRAVELLER_BOX, type TravellerShape } from './origami/Traveller';
import { motion, pathTracker, shortAngle } from '../../lib/motion';

/**
 * The thin line that leaves the PA mark and travels down the page with the
 * reader. It never touches a letter: it runs down the gutters beside the text
 * and crosses the page only between the lines, through the leading inside a
 * paragraph or the gaps between paragraphs and sections, with rounded turns and
 * the odd open felt-tip loop where there is room. The lanes come from measuring
 * the ink itself (each line of text's glyph box, photos, code and controls).
 * Its drawn length follows native scrolling and eases with GSAP quickTo, so it
 * glides; nothing hijacks the scroll.
 *
 * The line's tip carries a piece of folded paper (Traveller) that takes the shape
 * of the chapter it is passing and refolds at each new chapter. It opens up in
 * the gutters and gaps, and folds away out of sight while the line threads
 * between lines of text.
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
    /** Everything inked on the page: lines of text, photos, code and controls */
    ink: Box[];
}

type Box = { x: number; y: number; w: number; h: number };
type Side = 'left' | 'right';

/** Inked elements besides text: their boxes, padded for backgrounds */
const INK = 'img, svg, code, input, textarea, select, button, video, iframe';

/** The traveller opens up to this size, and folds away out of sight below the smaller one */
const TRAVELLER_MAX = 56;
const TRAVELLER_MAX_NARROW = 40;
const TRAVELLER_MIN = 22;
const SLIP = 18;

const SAMPLE_COUNT = 1600;
/** A folded slip opens again only with this much room, and after this long folded (s) */
const TRAVELLER_OPEN = 34;
const HOLD = 0.6;

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
        const f = (n: number) => n.toFixed(1);
        const box = (b: DOMRect, grow: number): Box => ({
            x: b.left - siteBox.left - grow,
            y: b.top - siteBox.top - grow,
            w: b.width + grow * 2,
            h: b.height + grow * 2,
        });

        // The ink on the page: each line of text as its glyph box (not its full
        // line-height, so the leading between lines stays open), plus photos,
        // code chips, icons and form controls. The PA mark is where the line starts.
        const mark = column.querySelector('.hero__mark');
        const ink: Box[] = [];
        const range = document.createRange();
        const walker = document.createTreeWalker(column, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (!n.textContent?.trim() || mark?.contains(n)) continue;
            range.selectNodeContents(n);
            for (const b of Array.from(range.getClientRects())) if (b.width > 0 && b.height > 0) ink.push(box(b, 0));
        }
        column.querySelectorAll(INK).forEach(el => {
            if (mark?.contains(el)) return;
            for (const b of Array.from(el.getClientRects())) if (b.width > 0 && b.height > 0) ink.push(box(b, 2));
        });

        // Half the stroke plus a hair: how close the line may come to any ink
        const pad = (small ? 2 : 3) / 2 + 0.75;

        // Lanes: heights where a horizontal run crosses the page without touching
        // ink. They are the leading between lines, and the gaps between
        // paragraphs and sections.
        const spans = ink.map(b => [b.y - pad, b.y + b.h + pad]).sort((p, q) => p[0] - q[0]);
        const merged: number[][] = [];
        for (const sp of spans) {
            const last = merged[merged.length - 1];
            if (last && sp[0] <= last[1]) last[1] = Math.max(last[1], sp[1]);
            else merged.push([...sp]);
        }
        const lanes: { top: number; bottom: number; y: number }[] = [];
        for (let i = 1; i < merged.length; i++) {
            const top = merged[i - 1][1];
            const bottom = merged[i][0];
            if (bottom > top) lanes.push({ top, bottom, y: (top + bottom) / 2 });
        }

        // The gutters the line runs down, and the heights where ink (a photo
        // strip running to the edge, say) reaches into each one
        const leftGutter = col.left;
        const rightGutter = width - col.right;
        const gx = {
            left: small ? Math.max(6, leftGutter / 2) : leftGutter * (0.42 + r() * 0.16),
            right: small ? width - rightGutter / 2 : col.right + Math.min(rightGutter * (0.28 + r() * 0.22), 220),
        };
        // How far a gutter run may swing either way and still keep clear of the
        // text and the page edge
        const swing = {
            left: small ? 0 : Math.max(0, Math.min(36, gx.left - 10, col.left - gx.left - 10)),
            right: small ? 0 : Math.max(0, Math.min(36, width - gx.right - 10, gx.right - col.right - 10)),
        };
        const blockedOn = (side: Side) =>
            ink
                .filter(b => b.x - pad - swing[side] < gx[side] && b.x + b.w + pad + swing[side] > gx[side])
                .map(b => [b.y - pad, b.y + b.h + pad])
                .sort((p, q) => p[0] - q[0]);
        const blocked = { left: blockedOn('left'), right: blockedOn('right') };
        const clearRun = (side: Side, y1: number, y2: number) => !blocked[side].some(([t, b]) => t < y2 && b > y1);
        // Corner radius where the line turns between a gutter and a lane
        const radius = {
            left: Math.max(3, Math.min(small ? 8 : 44, col.left - gx.left - 3)),
            right: Math.max(3, Math.min(small ? 8 : 44, gx.right - col.right - 3)),
        };
        const K = 0.5523;

        let side = 'right' as Side;
        let x = start.left;
        let y = start.top;
        let d = `M${f(x)},${f(y)}`;

        // Leave the PA tail along its own height, then turn down the right gutter
        {
            const R = radius.right;
            d += ` L${f(gx.right - R)},${f(y)}`;
            d += ` C${f(gx.right - R + K * R)},${f(y)} ${f(gx.right)},${f(y + R - K * R)} ${f(gx.right)},${f(y + R)}`;
            x = gx.right;
            y += R;
        }

        /** Straight down the gutter to y2, with a slight wander and sometimes a loop */
        const runDown = (y2: number) => {
            const len = y2 - y;
            if (len <= 0) return;
            const away = side === 'left' ? -1 : 1;
            const R = Math.min(18, (side === 'left' ? gx.left : width - gx.right) / 2.6);
            if (!small && len > 200 && R > 6 && r() < 0.45) {
                // An open loop bulging out, away from the text
                const mid = y + len * (0.35 + r() * 0.3);
                const w = (r() * 2 - 1) * swing[side];
                d += ` C${f(x + w)},${f(y + (mid - y) * 0.4)} ${f(x)},${f(mid - (mid - y) * 0.3)} ${f(x)},${f(mid)}`;
                d += ` C${f(x + away * 2.2 * R)},${f(mid + 2.4 * R)} ${f(x + away * 2.2 * R)},${f(mid - 1.4 * R)} ${f(x)},${f(mid + R)}`;
                d += ` C${f(x)},${f(mid + R + (y2 - mid) * 0.3)} ${f(x - w)},${f(y2 - (y2 - mid) * 0.3)} ${f(x)},${f(y2)}`;
            } else {
                const w = (r() * 2 - 1) * swing[side] * Math.min(1, len / 200);
                d += ` C${f(x + w)},${f(y + len * 0.35)} ${f(x - w)},${f(y + len * 0.7)} ${f(x)},${f(y2)}`;
            }
            y = y2;
        };

        /** Turn into a lane, run between the lines to the far gutter, and turn down */
        const cross = (lane: { top: number; bottom: number; y: number }) => {
            const to: Side = side === 'left' ? 'right' : 'left';
            const s = to === 'right' ? 1 : -1;
            const R1 = radius[side];
            const R2 = radius[to];
            const Y = lane.y;
            runDown(Y - R1);
            d += ` C${f(x)},${f(Y - R1 + K * R1)} ${f(x + s * (R1 - K * R1))},${f(Y)} ${f(x + s * R1)},${f(Y)}`;
            // A loop where a lane is roomy (the gaps between sections)
            const half = (lane.bottom - lane.top) / 2;
            const L = Math.min(small ? 12 : 24, (half - 2) / 2.1);
            if (L >= 5) {
                const lx = col.left + (col.right - col.left) * (0.25 + r() * 0.5);
                d += ` L${f(lx)},${f(Y)}`;
                d += ` C${f(lx + s * 2.4 * L)},${f(Y - 2.2 * L)} ${f(lx - s * 1.4 * L)},${f(Y - 2.2 * L)} ${f(lx + s * L)},${f(Y)}`;
            }
            d += ` L${f(gx[to] - s * R2)},${f(Y)}`;
            d += ` C${f(gx[to] - s * R2 + s * K * R2)},${f(Y)} ${f(gx[to])},${f(Y + R2 - K * R2)} ${f(gx[to])},${f(Y + R2)}`;
            side = to;
            x = gx[to];
            y = Y + R2;
        };

        const last = rel(chapters[chapters.length - 1].getBoundingClientRect());
        const end = Math.min(height - 40, last.bottom + 120);
        const lanesInside = lanes.filter(l => l.y > y && l.y < end);
        // Cross every so often, and always before ink reaches into this gutter
        for (;;) {
            const R1 = radius[side];
            const to: Side = side === 'left' ? 'right' : 'left';
            const wall = blocked[side].find(([t, b]) => b > y)?.[0] ?? Infinity;
            const target = y + (small ? 300 + r() * 160 : 240 + r() * 150);
            if (target > end && wall > end) break;
            const options = lanesInside.filter(
                l => l.y - R1 >= y + 4 && l.y + pad <= wall && clearRun(to, l.y, l.y + radius[to] + 6),
            );
            if (!options.length) break;
            const lane = options.reduce((best, l) => (Math.abs(l.y - target) < Math.abs(best.y - target) ? l : best));
            // Ink ahead in this gutter forces the earliest lane that clears it
            cross(wall < target + 40 ? options.filter(l => l.y < wall).pop() ?? lane : lane);
        }

        // Trail off down the gutter, ending where the carried paper settles as a crane
        const wall = blocked[side].find(([t, b]) => b > y)?.[0] ?? Infinity;
        runDown(Math.max(y, Math.min(end, wall - 4)));
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

        setGeo({ d, width, height, samples, total, col: { left: col.left, right: col.right }, chapters: chapterInfo, ink });
    }, []);

    /** Where the scroll says the line should reach, as a drawn length */
    const targetLength = useCallback((): number | null => {
        const g = geoRef.current;
        const svg = svgRef.current;
        if (!g || !svg) return null;
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
        // Interpolate between neighbouring samples so the length moves continuously
        const a = g.samples[Math.max(0, lo - 1)];
        const b = g.samples[lo];
        const t = b.y > a.y ? Math.min(1, Math.max(0, (targetY - a.y) / (b.y - a.y))) : 1;
        return a.len + (b.len - a.len) * t;
    }, []);

    // The line and its paper, eased by GSAP: one rig per layout
    useEffect(() => {
        geoRef.current = geo;
        const g = geo;
        const path = pathRef.current;
        if (!g || !path) return;
        const { gsap } = motion();
        const at = pathTracker(path);
        const start = targetLength() ?? 0;
        const now = { len: start, angle: 0, size: SLIP, alpha: 0 };
        const ease = {
            len: gsap.quickTo(now, 'len', { duration: 0.6, ease: 'power3' }),
            angle: gsap.quickTo(now, 'angle', { duration: 0.35, ease: 'power2' }),
            size: gsap.quickTo(now, 'size', { duration: 0.3, ease: 'power2' }),
            alpha: gsap.quickTo(now, 'alpha', { duration: 0.25, ease: 'power1' }),
        };
        const aim = { angle: 0, size: SLIP, alpha: 0 };
        let folded = compactRef.current;
        let flipped = 0;
        /** A slip that has room to open but is still holding */
        let waiting = false;
        let first = true;

        const render = (time: number) => {
            path.style.strokeDashoffset = String(g.total - now.len);
            const trav = travellerRef.current;
            if (!trav) return;
            const pt = at(now.len / g.total);
            const inChapter = [...g.chapters].reverse().find(c => pt.y >= c.top - 4);
            const arrived = now.len / g.total > 0.985;
            const next: TravellerShape = arrived ? 'crane' : inChapter ? inChapter.shape : 'plane';
            if (next !== shapeRef.current) {
                shapeRef.current = next;
                setShape(next);
            }

            // Room around the tip: the distance to the nearest text block or page edge
            let room = 2 * Math.min(pt.x, g.width - pt.x);
            for (const b of g.ink) {
                const dx = Math.max(b.x - pt.x, 0, pt.x - (b.x + b.w));
                const dy = Math.max(b.y - pt.y, 0, pt.y - (b.y + b.h));
                room = Math.min(room, 2 * Math.hypot(dx, dy));
                if (room <= 0) break;
            }
            // Fold as soon as text is near; open again only with room to spare and
            // after a moment folded, so it never flickers open and shut
            const fold = folded ? room - 10 < TRAVELLER_OPEN : room - 10 < TRAVELLER_MIN;
            waiting = folded && !fold && !first && time - flipped <= HOLD;
            if (fold !== folded && !waiting) {
                folded = fold;
                flipped = time;
                compactRef.current = fold;
                setCompact(fold);
            }
            const wide = window.matchMedia('(min-width: 64rem)').matches;
            const size = folded ? SLIP : Math.max(SLIP, Math.min(wide ? TRAVELLER_MAX : TRAVELLER_MAX_NARROW, room - 10));
            trav.dataset.compact = folded ? '1' : '';
            // The plane points along the line and banks through the turns; the
            // other shapes stay upright
            const angle = shortAngle(now.angle, next === 'plane' ? pt.angle : 0);
            const alpha = folded ? 0 : 1;
            if (first) {
                ease.alpha(alpha, alpha);
                aim.alpha = alpha;
                ease.size(size, size);
                ease.angle(angle, angle);
                aim.size = size;
                aim.angle = angle;
                first = false;
            } else {
                if (Math.abs(size - aim.size) > 0.5) ease.size((aim.size = size));
                if (Math.abs(angle - aim.angle) > 0.5) ease.angle((aim.angle = angle));
                if (alpha !== aim.alpha) ease.alpha((aim.alpha = alpha));
            }
            const k = now.size / TRAVELLER_BOX;
            trav.style.opacity = now.alpha.toFixed(3);
            trav.setAttribute(
                'transform',
                `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${now.angle.toFixed(1)}) scale(${k.toFixed(3)}) translate(${-TRAVELLER_BOX / 2} ${-TRAVELLER_BOX / 2})`,
            );
        };

        // Redraw on the GSAP ticker only while something is still easing
        let last = { len: NaN, angle: NaN, size: NaN, alpha: NaN };
        const tick = (time: number) => {
            const still = now.len === last.len && now.angle === last.angle && now.size === last.size && now.alpha === last.alpha;
            if (still && !waiting) return;
            last = { ...now };
            render(time);
        };
        render(gsap.ticker.time);
        gsap.ticker.add(tick);

        // Native scroll sets the target; quickTo eases the line toward it
        const onScroll = () => {
            const target = targetLength();
            if (target !== null) ease.len(target);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            gsap.ticker.remove(tick);
            gsap.killTweensOf(now);
        };
    }, [geo, targetLength]);

    useEffect(() => {
        let resizeTimer: ReturnType<typeof setTimeout>;
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

        return () => {
            clearTimeout(resizeTimer);
            ro.disconnect();
        };
    }, [build]);

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
                            <Traveller shape={shape} compact={compact} />
                        </g>
                    )}
                </>
            )}
        </svg>
    );
};

export default Ribbon;
