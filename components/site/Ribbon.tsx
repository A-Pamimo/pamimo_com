'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getSessionSeed, mulberry32 } from '../../lib/visit';
import Traveller, { FOLD_BELOW, HOLD, OPEN_ABOVE, SIZE as TRAVELLER_BOX, type TravellerShape } from './origami/Traveller';
import { motion, pathTracker, shortAngle } from '../../lib/motion';

/**
 * The thin line that leaves the PA mark and travels down the page with the
 * reader. It never touches a letter: it runs down the gutters beside the text
 * and crosses the page only between the lines, through the leading inside a
 * paragraph or the gaps between paragraphs and sections, with rounded turns and
 * the odd open felt-tip loop where there is room. The lanes come from measuring
 * the ink itself (each line of text's glyph box, photos, code and controls).
 * Its drawn length follows native scrolling through a damped spring, so it
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
    /**
     * Path length at sampled points. `y` is how far down the page the line has
     * reached (never backwards). `key` gives each loop its own scroll span, so
     * the stroke draws through the loop instead of skipping it.
     */
    samples: { len: number; y: number; key: number }[];
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
const SLIP = 18;

const SAMPLE_COUNT = 1600;
/** Wildness before the visitor has scrolled at all */
const CALM = 0.3;
/** How fast scroll energy follows the hand, in seconds */
const ENERGY_TAU = 0.45;
/** A reversal of at least this many px inside this window adds a little wildness */
const REVERSAL_PX = 48;
const REVERSAL_MS = 200;
const REVERSAL_ADD = 0.15;
/** New loops and wobble start this far below the tip, and blend in over the ramp */
const REPLAN_GAP = 400;
const WILD_RAMP = 240;
/** First appearance eases out over this long, instead of popping to the scroll target */
const INTRO_DRAW = 0.9;
/** Tip speed caps, px per second. The higher one is only while catching a flick. */
const SPEED_CAP = 1400;
const SPEED_CAP_CATCH = 2800;
const CATCH_GAP = 900;
const SPRING_K = 70;
const SPRING_D = 18;

/** Scroll span for one loop: its vertical size, kept short so the tip doesn't lag far */
const loopSpanFor = (backtrack: number) => Math.min(140, Math.max(48, backtrack));

/**
 * Gives every loop a monotonic scroll key of its own. Straight runs keep key equal
 * to page position plus the spans already passed, so a loop is drawn across a
 * short extra scroll instead of collapsing into one sample.
 */
const withLoopKeys = (raw: { len: number; y: number }[]) => {
    const samples: { len: number; y: number; key: number }[] = [];
    let maxY = -Infinity;
    let extra = 0;
    let loopAt = -1;
    let loopMinY = Infinity;

    const closeLoop = () => {
        if (loopAt < 0) return;
        const entrance = samples[Math.max(0, loopAt - 1)];
        const span = loopSpanFor(Math.max(0, maxY - loopMinY));
        const n = samples.length - loopAt;
        for (let i = 0; i < n; i++) {
            const t = n <= 1 ? 1 : i / (n - 1);
            samples[loopAt + i].key = entrance.key + span * t;
        }
        extra += span;
        loopAt = -1;
        loopMinY = Infinity;
    };

    for (const s of raw) {
        if (s.y >= maxY - 0.5) {
            closeLoop();
            maxY = Math.max(maxY, s.y);
            samples.push({ len: s.len, y: maxY, key: s.y + extra });
        } else {
            if (loopAt < 0) {
                loopAt = samples.length;
                loopMinY = s.y;
            } else loopMinY = Math.min(loopMinY, s.y);
            const entrance = samples.length ? samples[samples.length - 1].key : s.y + extra;
            samples.push({ len: s.len, y: maxY < 0 ? s.y : maxY, key: entrance });
        }
    }
    closeLoop();
    for (let i = 1; i < samples.length; i++) {
        if (samples[i].key <= samples[i - 1].key) samples[i].key = samples[i - 1].key + 0.01;
    }
    return samples;
};

/** Drawn length whose scroll key is `key`, interpolated so it moves continuously */
const lengthAtKey = (samples: { len: number; key: number }[], key: number) => {
    if (!samples.length) return 0;
    if (key <= samples[0].key) return samples[0].len;
    let lo = 0;
    let hi = samples.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].key < key) lo = mid + 1;
        else hi = mid;
    }
    const b = samples[lo];
    const a = samples[Math.max(0, lo - 1)];
    const t = b.key > a.key ? Math.min(1, Math.max(0, (key - a.key) / (b.key - a.key))) : 1;
    return a.len + (b.len - a.len) * t;
};

/** Length at which the line has reached `pageY`, ignoring loop spans (for keeping the tip put) */
const lengthAtPageY = (samples: { len: number; y: number }[], pageY: number) => {
    if (!samples.length) return 0;
    let lo = 0;
    let hi = samples.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < pageY) lo = mid + 1;
        else hi = mid;
    }
    const b = samples[lo];
    const a = samples[Math.max(0, lo - 1)];
    const t = b.y > a.y ? Math.min(1, Math.max(0, (pageY - a.y) / (b.y - a.y))) : 0;
    return a.len + (b.len - a.len) * t;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);

const isActive = () => typeof window !== 'undefined' && document.documentElement.dataset.mode === 'full';

/** Below 64rem the gutters are too narrow for wide loops or a 3px line */
const isNarrow = () => !window.matchMedia('(min-width: 64rem)').matches;

/**
 * Redraws a planned route the way a hand would: a slow, uneven wobble along its
 * whole length, sized at every point to the free space around it. It swings
 * wide out in the margins and barely moves while threading between two lines
 * of text, so it never reaches the ink.
 */
const handDrawn = (
    route: string,
    ink: Box[],
    pad: number,
    width: number,
    r: () => number,
    small: boolean,
    wild: (y: number) => number,
): { d: string; pts: { x: number; y: number }[] } => {
    // GSAP measures the route once and then finds points along it cheaply
    const { MotionPathPlugin: mp } = motion();
    const raw = mp.getRawPath(route);
    mp.cacheRawPathMeasurements(raw);
    const total = (raw as unknown as { totalLength: number }).totalLength;
    const at = (l: number) => mp.getPositionOnPath(raw, Math.min(1, l / total)) as { x: number; y: number };
    const step = small ? 6 : 8;
    const pts: { x: number; y: number }[] = [];
    for (let l = 0; l <= total; l += step) {
        const p = at(l);
        pts.push({ x: p.x, y: p.y });
    }
    const last = at(total);
    pts.push({ x: last.x, y: last.y });
    const n = pts.length;

    // Free space at each point: distance to the nearest ink, less the stroke.
    // The wobble never needs more than a few pixels, so only nearby ink counts
    // (bucketed by height to keep this quick on long pages).
    const CAP = 24;
    const BIN = 64;
    const bins = new Map<number, Box[]>();
    for (const b of ink) {
        for (let k = Math.floor((b.y - CAP) / BIN); k <= Math.floor((b.y + b.h + CAP) / BIN); k++) {
            const list = bins.get(k);
            if (list) list.push(b);
            else bins.set(k, [b]);
        }
    }
    const clear = pts.map(p => {
        let best = Math.min(CAP, p.x - 2, width - p.x - 2);
        for (const b of bins.get(Math.floor(p.y / BIN)) ?? []) {
            const dy = Math.max(b.y - p.y, 0, p.y - (b.y + b.h));
            if (dy >= best) continue;
            const dx = Math.max(b.x - p.x, 0, p.x - (b.x + b.w));
            if (dx >= best) continue;
            best = Math.min(best, Math.hypot(dx, dy));
        }
        return Math.max(0, best - pad);
    });
    // Let the wobble grow and shrink gradually, never past the space nearby
    const W = 6;
    const windowMin = (a: number[], w: number) =>
        a.map((_, i) => {
            let m = Infinity;
            for (let j = Math.max(0, i - w); j <= Math.min(a.length - 1, i + w); j++) m = Math.min(m, a[j]);
            return m;
        });
    const near = windowMin(clear, W);
    const maxAmp = small ? 5 : 14;
    const amp = near.map((c, i) => {
        let sum = 0;
        let k = 0;
        for (let j = Math.max(0, i - 4); j <= Math.min(n - 1, i + 4); j++, k++) sum += near[j];
        // Ease in from the PA tail and out at the end
        const ends = Math.min(1, i / 6, (n - 1 - i) / 6);
        // Calm reading keeps it to about a third; restless scrolling lets it loose
        const loose = 0.3 + 0.7 * wild(pts[i].y);
        return Math.min(maxAmp, (sum / k) * 0.7, clear[i] * 0.85) * ends * loose;
    });
    // Hold still through tight curves (loops and corners) so they keep their shape
    const heading = pts.map((p, i) => {
        const q = pts[Math.min(n - 1, i + 1)];
        const o = pts[Math.max(0, i - 1)];
        return Math.atan2(q.y - o.y, q.x - o.x);
    });
    const turn = heading.map((h, i) => {
        let t = 0;
        for (let j = Math.max(1, i - 3); j <= Math.min(n - 1, i + 3); j++) {
            const dh = Math.abs(((heading[j] - heading[j - 1] + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            t = Math.max(t, dh);
        }
        return t;
    });
    // Fade the wobble in and out over a stretch rather than at a point, so it
    // leaves no notch where it settles
    const still = turn.map(t => 1 / (1 + (t / 0.06) ** 2));
    const lowest = windowMin(still, 8);
    const calm = lowest.map((_, i) => {
        let sum = 0;
        let k = 0;
        for (let j = Math.max(0, i - 8); j <= Math.min(n - 1, i + 8); j++, k++) sum += lowest[j];
        return sum / k;
    });
    const p1 = r() * Math.PI * 2;
    const p2 = r() * Math.PI * 2;
    const p3 = r() * Math.PI * 2;
    const out = pts.map((p, i) => {
        const a = pts[Math.max(0, i - 1)];
        const b = pts[Math.min(n - 1, i + 1)];
        const tx = b.x - a.x;
        const ty = b.y - a.y;
        const len = Math.hypot(tx, ty) || 1;
        const s = i * step;
        // A quicker tremor joins in as the reader scrolls more restlessly
        const w = wild(p.y);
        const wobble = (0.62 * Math.sin(s / 83 + p1) + 0.38 * Math.sin(s / 37 + p2) + 0.5 * w * Math.sin(s / 17 + p3)) / (1 + 0.5 * w);
        const a2 = amp[i] * calm[i];
        return { x: p.x - (ty / len) * a2 * wobble, y: p.y + (tx / len) * a2 * wobble };
    });

    // A smooth curve through the points (Catmull-Rom as cubic Béziers)
    const f = (v: number) => v.toFixed(1);
    let d = `M${f(out[0].x)},${f(out[0].y)}`;
    for (let i = 0; i < n - 1; i++) {
        const p0 = out[Math.max(0, i - 1)];
        const q1 = out[i];
        const q2 = out[i + 1];
        const p3 = out[Math.min(n - 1, i + 2)];
        d += ` C${f(q1.x + (q2.x - p0.x) / 6)},${f(q1.y + (q2.y - p0.y) / 6)} ${f(q2.x - (p3.x - q1.x) / 6)},${f(q2.y - (p3.y - q1.y) / 6)} ${f(q2.x)},${f(q2.y)}`;
    }
    return { d, pts: out };
};

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
    /**
     * How wild the line is, set by how the visitor scrolls: a list of heights
     * from which a wildness (0 calm to 1 wild) applies. Only the stretch below
     * the line's tip is ever replanned, so what is already drawn never changes.
     */
    const profileRef = useRef<{ y: number; w: number }[]>([]);
    /**
     * Drawn length, the furthest page position the stroke has reached (`y`), and
     * the tip's actual page position (`at`). Kept so a rebuild can put the tip back.
     */
    const tipRef = useRef<{ len: number; y: number; at: number } | null>(null);
    /** 'arc' keeps the drawn length (route ahead changed only). 'page' remaps a font or resize. */
    const keepTipRef = useRef<false | 'arc' | 'page'>(false);
    /** Length, velocity and paper pose, kept across path rebuilds so nothing snaps */
    const poseRef = useRef({ len: 0, v: 0, angle: 0, size: SLIP, alpha: 0, seen: false, intro: true, introStart: 0 });
    /** Set when the visitor actually scrolls, so anchor jumps don't count as wild */
    const gestureUntilRef = useRef(0);

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

        const seed = getSessionSeed();
        const r = mulberry32(seed);
        const profile = profileRef.current;
        // Blend each wildness change over WILD_RAMP px instead of stepping at a point
        const wild = (at: number) => {
            let prevW = CALM;
            let w = CALM;
            let from = -1e9;
            for (const p of profile) {
                if (p.y <= at) {
                    prevW = w;
                    w = p.w;
                    from = p.y;
                }
            }
            if (from < -1e8) return w;
            const t = Math.min(1, Math.max(0, (at - from) / WILD_RAMP));
            const s = t * t * (3 - 2 * t);
            return prevW + (w - prevW) * s;
        };
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
        // On a phone the mark fills the column and the line can curve back through
        // the letters. Treat the letterforms as ink, but leave the tail's exit clear.
        if (small && mark) {
            const b = mark.getBoundingClientRect();
            if (b.width > 8 && b.height > 0) {
                ink.push({
                    x: b.left - siteBox.left,
                    y: b.top - siteBox.top,
                    w: b.width - 8,
                    h: b.height,
                });
            }
        }

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
        /** A bow down the gutter from y to y2, leaving and arriving straight down */
        const bow = (y2: number, w: number) => {
            const mid = (y + y2) / 2;
            const q = (y2 - y) / 4;
            d += ` C${f(x)},${f(y + q)} ${f(x + w)},${f(mid - q)} ${f(x + w)},${f(mid)}`;
            d += ` C${f(x + w)},${f(mid + q)} ${f(x)},${f(y2 - q)} ${f(x)},${f(y2)}`;
            y = y2;
        };

        /** Down the gutter to y2, bowing out a little and sometimes tying a loop */
        const runDown = (y2: number) => {
            const len = y2 - y;
            if (len <= 0) return;
            const away = side === 'left' ? -1 : 1;
            const R = Math.min(18, (side === 'left' ? gx.left : width - gx.right) / 2.6);
            const loose = 0.35 + 0.65 * wild(y);
            const w = () => (r() * 2 - 1) * swing[side] * Math.min(1, len / 200) * loose;
            if (!small && len > 200 && R > 6 && r() < 0.1 + 0.6 * wild(y)) {
                // An open loop bulging out, away from the text
                const mid = y + len * (0.35 + r() * 0.3);
                bow(mid, w());
                d += ` C${f(x + away * 2.2 * R)},${f(mid + 2.4 * R)} ${f(x + away * 2.2 * R)},${f(mid - 1.4 * R)} ${f(x)},${f(mid + R)}`;
                y = mid + R;
                bow(y2, w());
            } else {
                bow(y2, w());
            }
            y = y2;
        };

        /** Turn into a lane, run between the lines to the far gutter, and turn down */
        const cross = (lane: { top: number; bottom: number; y: number }) => {
            const to: Side = side === 'left' ? 'right' : 'left';
            const s = to === 'right' ? 1 : -1;
            const R1 = radius[side];
            const R2 = radius[to];
            // A loop where a lane is roomy (the gaps between sections)
            const half = (lane.bottom - lane.top) / 2;
            const L = Math.min(small ? 12 : 24, (half - 2) / 2.1);
            const roll = r();
            const loop = L >= 5 && roll < 0.3 + 0.7 * wild(lane.y);
            // Otherwise drift down across a roomy lane instead of running dead level
            const tilt = loop ? 0 : Math.max(0, Math.min(small ? 18 : 36, half - pad - 2) * (0.35 + r() * 0.55));
            const Y1 = lane.y - tilt;
            const Y2 = lane.y + tilt;
            runDown(Y1 - R1);
            d += ` C${f(x)},${f(Y1 - R1 + K * R1)} ${f(x + s * (R1 - K * R1))},${f(Y1)} ${f(x + s * R1)},${f(Y1)}`;
            x += s * R1;
            const endX = gx[to] - s * R2;
            if (loop) {
                const lx = col.left + (col.right - col.left) * (0.25 + r() * 0.5);
                d += ` L${f(lx)},${f(Y1)}`;
                d += ` C${f(lx + s * 2.4 * L)},${f(Y1 - 2.2 * L)} ${f(lx - s * 1.4 * L)},${f(Y1 - 2.2 * L)} ${f(lx + s * L)},${f(Y1)}`;
                d += ` L${f(endX)},${f(Y2)}`;
            } else {
                const span = Math.abs(endX - x);
                d += ` C${f(x + s * span * (0.3 + r() * 0.25))},${f(Y1)} ${f(endX - s * span * (0.3 + r() * 0.25))},${f(Y2)} ${f(endX)},${f(Y2)}`;
            }
            // Turn down into the far gutter
            d += ` C${f(endX + s * K * R2)},${f(Y2)} ${f(gx[to])},${f(Y2 + R2 - K * R2)} ${f(gx[to])},${f(Y2 + R2)}`;
            side = to;
            x = gx[to];
            y = Y2 + R2;
        };

        const last = rel(chapters[chapters.length - 1].getBoundingClientRect());
        const end = Math.min(height - 40, last.bottom + 120);
        const lanesInside = lanes.filter(l => l.y > y && l.y < end);
        // Cross every so often, and always before ink reaches into this gutter
        for (;;) {
            const R1 = radius[side];
            const to: Side = side === 'left' ? 'right' : 'left';
            const wall = blocked[side].find(([t, b]) => b > y)?.[0] ?? Infinity;
            // Restless scrolling crosses the page more often
            const often = wild(y);
            const target = y + (small ? 460 - 200 * often : 400 - 200 * often) + r() * 140;
            if (target > end && wall > end) break;
            const options = lanesInside.filter(
                l => l.y - R1 >= y + 4 && l.y + pad <= wall && clearRun(to, l.y, l.y + radius[to] + 6),
            );
            if (!options.length) break;
            // Prefer threading between two lines of a paragraph when one is near
            const score = (l: { top: number; bottom: number; y: number }) =>
                Math.abs(l.y - target) - (l.bottom - l.top < 16 ? 70 : 0);
            const lane = options.reduce((best, l) => (score(l) < score(best) ? l : best));
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

        // Measure the drawn line from its own points (a long hand-drawn path is
        // slow for the browser to measure), then sample it so scroll position
        // maps to drawn length cheaply
        // The wobble has its own random sequence, so replanning the route ahead
        // never shifts the part already drawn
        const drawn = handDrawn(d, ink, pad, width, mulberry32(seed ^ 0x5bd1e995), small, wild);
        const cum = [0];
        for (let i = 1; i < drawn.pts.length; i++) {
            const a = drawn.pts[i - 1];
            const b = drawn.pts[i];
            cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
        }
        const total = cum[cum.length - 1];
        const raw: { len: number; y: number }[] = [];
        let j = 0;
        for (let i = 0; i <= SAMPLE_COUNT; i++) {
            const len = (total * i) / SAMPLE_COUNT;
            while (j < cum.length - 2 && cum[j + 1] < len) j++;
            const t = cum[j + 1] > cum[j] ? (len - cum[j]) / (cum[j + 1] - cum[j]) : 0;
            const yAt = drawn.pts[j].y + (drawn.pts[j + 1].y - drawn.pts[j].y) * Math.min(1, Math.max(0, t));
            raw.push({ len, y: yAt });
        }
        const samples = withLoopKeys(raw);

        setGeo({ d: drawn.d, width, height, samples, total, col: { left: col.left, right: col.right }, chapters: chapterInfo, ink });
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
        // Loop spans push keys past page position. Fold that lag back in toward
        // the end of the page so the line still arrives, without collapsing a loop.
        const end = g.samples[g.samples.length - 1];
        const extra = end ? Math.max(0, end.key - end.y) : 0;
        return lengthAtKey(g.samples, targetY + extra * progress * progress);
    }, []);

    // The line and its paper. Length is a damped spring; the dash offset is written
    // here, before paint, so a path rebuild never flashes the stroke back to empty.
    useLayoutEffect(() => {
        geoRef.current = geo;
        const g = geo;
        const path = pathRef.current;
        if (!g || !path) return;
        const { gsap } = motion();
        const at = pathTracker(path);
        const pose = poseRef.current;
        // A replan keeps the drawn length (the path above the tip did not change).
        // A font or resize rebuild keeps the tip at the same place on the page.
        // The very first draw eases up from nothing and is not replayed by either.
        const keep = keepTipRef.current;
        keepTipRef.current = false;
        if (!pose.seen) {
            pose.seen = true;
            pose.intro = true;
            pose.introStart = gsap.ticker.time;
        }
        let startLen = pose.intro ? 0 : Math.min(pose.len, g.total);
        if (keep === 'page' && tipRef.current) {
            pose.intro = false;
            startLen = Math.min(lengthAtPageY(g.samples, tipRef.current.at), g.total);
        } else if (keep === 'arc') {
            pose.intro = false;
            startLen = Math.min(pose.len, g.total);
        }
        const now = {
            len: startLen,
            angle: pose.angle,
            size: pose.size,
            alpha: pose.alpha,
        };
        const spring = { v: keep ? 0 : pose.v, target: targetLength() ?? now.len };
        const ease = {
            angle: gsap.quickTo(now, 'angle', { duration: 0.35, ease: 'power2' }),
            size: gsap.quickTo(now, 'size', { duration: 0.35, ease: 'power2' }),
            alpha: gsap.quickTo(now, 'alpha', { duration: 0.4, ease: 'power2' }),
        };
        const aim = { angle: now.angle, size: now.size, alpha: now.alpha };
        let folded = compactRef.current;
        let flipped = 0;
        let hasFlipped = false;
        // The paper has never been posed, so its first placement shouldn't ease in from 0.
        let first = !keep && pose.intro && now.angle === 0 && now.alpha === 0;

        const render = (time: number) => {
            const len = Math.min(g.total, Math.max(0, now.len));
            now.len = len;
            path.style.strokeDashoffset = String(g.total - len);
            const sample = g.samples[Math.min(g.samples.length - 1, Math.round((len / Math.max(g.total, 1)) * SAMPLE_COUNT))] ?? g.samples[0];
            pose.len = len;
            pose.v = spring.v;
            pose.angle = now.angle;
            pose.size = now.size;
            pose.alpha = now.alpha;
            if (g.total <= 0) return;
            const pt = at(len / g.total);
            if (sample) tipRef.current = { len, y: sample.y, at: pt.y };
            const trav = travellerRef.current;
            if (!trav || !sample) return;
            const inChapter = [...g.chapters].reverse().find(c => pt.y >= c.top - 4);
            const arrived = len / g.total > 0.985;
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
            // Fold below FOLD_BELOW, open only above OPEN_ABOVE, and hold either
            // way so a fast pass through a line of text can't flicker the paper.
            const wantFold = folded ? room < OPEN_ABOVE : room < FOLD_BELOW;
            const held = hasFlipped && time - flipped < HOLD;
            if (wantFold !== folded && !held) {
                folded = wantFold;
                hasFlipped = true;
                flipped = time;
                compactRef.current = folded;
                setCompact(folded);
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

        const stepLength = (dt: number) => {
            if (pose.intro) {
                const t = Math.min(1, (gsap.ticker.time - pose.introStart) / INTRO_DRAW);
                const prev = now.len;
                spring.target = targetLength() ?? spring.target;
                now.len = spring.target * easeInOut(t);
                spring.v = dt > 0 ? (now.len - prev) / dt : 0;
                if (t >= 1) pose.intro = false;
                return;
            }
            const acc = SPRING_K * (spring.target - now.len) - SPRING_D * spring.v;
            spring.v += acc * dt;
            const cap = Math.abs(spring.target - now.len) > CATCH_GAP ? SPEED_CAP_CATCH : SPEED_CAP;
            if (spring.v > cap) spring.v = cap;
            if (spring.v < -cap) spring.v = -cap;
            now.len += spring.v * dt;
        };

        const tick = (time: number, delta = 16) => {
            const dt = Math.min(0.05, Math.max(0.001, delta / 1000));
            stepLength(dt);
            render(time);
        };
        // Pose the stroke before the browser paints this rebuild
        stepLength(1 / 60);
        render(gsap.ticker.time);
        gsap.ticker.add(tick);

        // Native scroll sets the target. The spring eases toward it, including
        // during a programmatic smooth scroll. The wildness sampler ignores those.
        const onScroll = () => {
            const target = targetLength();
            if (target === null) return;
            if (pose.intro && performance.now() < gestureUntilRef.current) pose.intro = false;
            spring.target = target;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            gsap.ticker.remove(tick);
            gsap.killTweensOf(now);
        };
    }, [geo, targetLength]);

    // The randomness calculator: how the visitor scrolls decides how wild the
    // line ahead of them is. Steady reading keeps it calm; fast or jumpy
    // scrolling (quick flicks, sudden reversals) loosens it. Every so often the
    // stretch below the tip is replanned at the new wildness.
    useEffect(() => {
        let lastY = window.scrollY;
        let lastT = performance.now();
        let dir = 0;
        let energy = CALM;
        let planned = 0;
        let revArmed = false;
        let revDir = 0;
        let revDist = 0;
        let revT = 0;
        const arm = (ms = 500) => {
            gestureUntilRef.current = performance.now() + ms;
        };
        const onWheel = () => arm(500);
        const onTouch = () => arm(700);
        const onKey = (e: KeyboardEvent) => {
            if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) arm(700);
        };
        const onScroll = () => {
            const t = performance.now();
            const y = window.scrollY;
            const dy = y - lastY;
            const dt = Math.max(0.001, (t - lastT) / 1000);
            lastT = t;
            lastY = y;
            // Anchor jumps and scrollTo({ behavior: 'smooth' }) are not the hand.
            if (t > gestureUntilRef.current || dy === 0) return;
            const sample = Math.min(1, Math.abs(dy) / dt / 2400);
            const d = Math.sign(dy);
            // A touch or wheel keeps the window open through the inertial tail.
            // A programmatic smooth scroll never opens it, so it is not sampled.
            gestureUntilRef.current = Math.max(gestureUntilRef.current, t + 220);
            const noteReversal = () => {
                if (revDist >= REVERSAL_PX && t - revT <= REVERSAL_MS) {
                    energy = Math.min(1, energy + REVERSAL_ADD);
                    revArmed = false;
                } else if (t - revT > REVERSAL_MS) revArmed = false;
            };
            if (d && dir && d !== dir) {
                revArmed = true;
                revDir = d;
                revDist = Math.abs(dy);
                revT = t;
                noteReversal();
            } else if (revArmed && d === revDir) {
                revDist += Math.abs(dy);
                noteReversal();
            }
            if (d) dir = d;
            const goal = Math.max(CALM, sample);
            energy += (goal - energy) * (1 - Math.exp(-dt / ENERGY_TAU));
        };
        const check = window.setInterval(() => {
            const t = performance.now();
            // Drift back toward calm while the visitor is still
            if (t - lastT > 1500) energy += (CALM - energy) * (1 - Math.exp(-0.4 / ENERGY_TAU));
            const level = Math.min(1, Math.max(0, energy));
            const svg = svgRef.current;
            if (svg) svg.dataset.wild = level.toFixed(2);
            const profile = profileRef.current;
            const current = profile.length ? profile[profile.length - 1].w : CALM;
            const tip = tipRef.current;
            if (!tip || !geoRef.current || Math.abs(level - current) < 0.2 || t - planned < 1500) return;
            planned = t;
            // New loops start well below the tip. wild() ramps the change over WILD_RAMP.
            const from = tip.y + REPLAN_GAP;
            profileRef.current = [...profile.filter(p => p.y < from), { y: from, w: level }];
            keepTipRef.current = 'arc';
            build();
        }, 400);
        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('touchmove', onTouch, { passive: true });
        window.addEventListener('keydown', onKey);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.clearInterval(check);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchmove', onTouch);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', onScroll);
        };
    }, [build]);

    useEffect(() => {
        let resizeTimer: ReturnType<typeof setTimeout>;
        const rebuild = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (tipRef.current) keepTipRef.current = 'page';
                build();
            }, 200);
        };

        build();
        // Fonts change line breaks. Keep the tip where it is instead of redrawing from scratch.
        document.fonts?.ready.then(() => {
            if (tipRef.current) keepTipRef.current = 'page';
            build();
        });

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
                        pathLength={geo.total}
                        fill="none"
                        stroke="var(--ribbon)"
                        strokeWidth={narrow ? 2 : 3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ strokeDasharray: geo.total }}
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
