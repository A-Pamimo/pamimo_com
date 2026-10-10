/**
 * A tiny paper-folding renderer for the site's origami.
 *
 * Each model is a set of flat triangular facets in 3D whose corners move with a
 * single parameter t (a fold, a flap, a flight). Every frame the facets are posed,
 * turned to the model's camera angle, projected flat, sorted back to front, and
 * shaded by how squarely they face the light. Facets seen from behind show the
 * paper's other side. Frames are stepped (stop-motion), not tweened.
 */

export type V3 = [number, number, number];
export type Facet = V3[];

export interface Model {
    /** Facet corners for a pose; t runs 0 to 1. The facet count never changes. */
    pose: (t: number) => Facet[];
    yaw: number;
    pitch: number;
    /** Projected units per model unit, before the viewBox scale */
    scale: number;
}

export interface Paint {
    front: string;
    back: string;
    edge: string;
}

export interface DrawnFacet {
    points: string;
    fill: string;
}

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
};
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp3 = (a: V3, b: V3, k: number): V3 => [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];

/** Rotates p about the line through a and b by angle (Rodrigues) */
export const hinge = (p: V3, a: V3, b: V3, angle: number): V3 => {
    const k = norm(sub(b, a));
    const v = sub(p, a);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const kv = cross(k, v);
    const kd = dot(k, v) * (1 - c);
    return [a[0] + v[0] * c + kv[0] * s + k[0] * kd, a[1] + v[1] * c + kv[1] * s + k[1] * kd, a[2] + v[2] * c + kv[2] * s + k[2] * kd];
};

const turn = (p: V3, yaw: number, pitch: number): V3 => {
    const x = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw);
    const z = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
    const y = p[1] * Math.cos(pitch) - z * Math.sin(pitch);
    return [x, y, p[1] * Math.sin(pitch) + z * Math.cos(pitch)];
};

const LIGHT = norm([-0.45, 0.75, 0.55]);

const rgb = (hex: string) => {
    const h = hex.trim().replace('#', '');
    const full = h.length === 3 ? h.replace(/./g, c => c + c) : h;
    return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) || 0);
};
/** Below 1 darkens toward the paper's shadow, above 1 lifts toward a highlight */
const shade = (hex: string, s: number) =>
    `rgb(${rgb(hex)
        .map(c => Math.round(s <= 1 ? c * s : c + (255 - c) * (s - 1)))
        .join(',')})`;

/** Poses, projects, sorts and shades a model; returns SVG-ready facets */
export const draw = (model: Model, t: number, paint: Paint, size: number, extraYaw = 0): DrawnFacet[] => {
    const facets = model.pose(t);
    return facets
        .map(f => {
            const v = f.map(p => turn(p, model.yaw + extraYaw, model.pitch));
            let n = norm(cross(sub(v[1], v[0]), sub(v[2], v[0])));
            const facing = n[2] >= 0;
            if (!facing) n = [-n[0], -n[1], -n[2]];
            const lit = Math.max(0, dot(n, LIGHT));
            // Gentle: folds in pale paper, not painted blocks
            const s = 0.84 + 0.22 * lit;
            const depth = v.reduce((a, p) => a + p[2], 0) / v.length;
            const k = (size / 2) * model.scale;
            return {
                depth,
                points: v.map(p => `${(size / 2 + p[0] * k).toFixed(2)},${(size / 2 - p[1] * k).toFixed(2)}`).join(' '),
                fill: shade(facing ? paint.front : paint.back, s),
            };
        })
        .sort((a, b) => a.depth - b.depth)
        .map(({ points, fill }) => ({ points, fill }));
};

/* --- Models ------------------------------------------------------------------ */

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

/** The crane's resting shape, with wings raised by `flap` (radians) */
const craneShape = (flap: number, neckLift = 1, bodyDepth = 1): Facet[] => {
    const F: V3 = [0.32, 0, 0];
    const B: V3 = [-0.32, 0, 0];
    const dl: V3 = [0, -0.26 * bodyDepth, -0.12 * bodyDepth];
    const dr: V3 = [0, -0.26 * bodyDepth, 0.12 * bodyDepth];
    const fd: V3 = [0.04, -0.22 * bodyDepth, 0.03];
    const bd: V3 = [-0.04, -0.22 * bodyDepth, -0.03];
    const neck = hinge([0.95, -0.05, 0], F, [0.32, 0, 1], 1.0 * neckLift);
    const head: V3 = [neck[0] + 0.2, neck[1] - 0.14, 0];
    const tail = hinge([-1.0, -0.05, 0], B, [-0.32, 0, -1], 0.85 * neckLift);
    const wl = hinge([0.02, 0, -1.05], F, B, -flap);
    const wr = hinge([0.02, 0, 1.05], B, F, -flap);
    return [
        [F, B, dl],
        [B, F, dr],
        [F, fd, neck],
        [neck, [neck[0] - 0.02, neck[1] - 0.09, 0.03], head],
        [B, tail, bd],
        [F, wl, B],
        [B, wr, F],
        [F, [0.02, 0, -0.42], wl],
        [B, wr, [0.02, 0, 0.42]],
    ];
};

/** Crane folding itself up from a flat sheet as t goes 0 to 1 */
export const foldingCrane: Model = {
    pose: t => {
        const flat = craneShape(-0.02, 0, 0.02);
        const done = craneShape(1.05, 1, 1);
        return flat.map((f, i) => {
            // Body first, then neck and tail, then the wings lift last
            const start = i < 2 ? 0 : i < 5 ? 0.25 : 0.45;
            const k = ease((t - start) / (1 - start));
            return f.map((p, j) => lerp3(p, done[i][j], k));
        });
    },
    yaw: -0.55,
    pitch: 0.42,
    scale: 0.82,
};

/** Boat rocking on its keel while the sail folds open and shut */
export const rockingBoat: Model = {
    pose: t => {
        const roll = 0.16 * Math.sin(t * Math.PI * 2);
        const open = 0.18 + 0.3 * (0.5 + 0.5 * Math.sin(t * Math.PI * 4));
        const axisA: V3 = [-1, -0.3, 0];
        const axisB: V3 = [1, -0.3, 0];
        const r = (p: V3) => hinge(p, axisA, axisB, roll);
        const pl: V3 = [0.95, 0.12, -0.32], ql: V3 = [-0.95, 0.12, -0.32];
        const pr: V3 = [0.95, 0.12, 0.32], qr: V3 = [-0.95, 0.12, 0.32];
        const kf: V3 = [0.5, -0.32, 0], kb: V3 = [-0.5, -0.32, 0];
        const top: V3 = [0, 1.0, 0], mast: V3 = [0, 0.12, 0];
        const sf = hinge([0.5, 0.12, 0], mast, top, open);
        const sb = hinge([-0.5, 0.12, 0], mast, top, -open);
        return [
            [pl, ql, kb], [pl, kb, kf],
            [qr, pr, kf], [qr, kf, kb],
            [pl, kf, pr], [ql, qr, kb],
            [top, mast, sf], [top, sb, mast],
        ].map(f => f.map(r) as Facet);
    },
    yaw: -0.5,
    pitch: 0.3,
    scale: 0.78,
};

/** Paper dart; open goes 0 (folded, flying) to 1 (unfolded flat) */
export const paperPlane: Model = {
    pose: open => {
        const nose: V3 = [1, 0, 0];
        const spine: V3 = [-1, 0, 0];
        const fold = (1 - open) * 1.15;
        const wl = hinge([-1, 0, -0.7], nose, spine, -fold * 0.35);
        const wr = hinge([-1, 0, 0.7], spine, nose, -fold * 0.35);
        const kl = hinge([-0.9, 0, -0.32], nose, spine, -fold * 1.3);
        const kr = hinge([-0.9, 0, 0.32], spine, nose, -fold * 1.3);
        return [
            [nose, wl, spine],
            [nose, spine, wr],
            [nose, spine, kl],
            [nose, kr, spine],
        ];
    },
    yaw: -0.2,
    pitch: 1.0,
    scale: 0.9,
};

/* --- Story models: one folded shape per chapter ------------------------------- */

const TAU = Math.PI * 2;
const ring = (n: number, r: number, y: number, phase = 0): V3[] =>
    Array.from({ length: n }, (_, i) => [Math.cos(phase + (i * TAU) / n) * r, y, Math.sin(phase + (i * TAU) / n) * r] as V3);
const flat = (n: number, r: number, z: number, phase = 0): V3[] =>
    Array.from({ length: n }, (_, i) => [Math.cos(phase + (i * TAU) / n) * r, Math.sin(phase + (i * TAU) / n) * r, z] as V3);

/** Experience: a ship's helm with seven spokes, the Kubernetes wheel, turning a notch at a time */
export const helm: Model = {
    pose: t => {
        const a = -t * (TAU / 7);
        const hub = flat(7, 0.3, 0, a);
        const c: V3 = [0, 0, 0.2];
        const facets: Facet[] = [];
        for (let k = 0; k < 7; k++) {
            const h0 = hub[k];
            const h1 = hub[(k + 1) % 7];
            const th = a + ((k + 0.5) * TAU) / 7;
            const tip: V3 = [Math.cos(th) * 0.98, Math.sin(th) * 0.98, 0];
            const ridge: V3 = [Math.cos(th) * 0.58, Math.sin(th) * 0.58, 0.13];
            facets.push([c, h0, h1], [h0, ridge, tip], [ridge, h1, tip], [h0, h1, ridge]);
        }
        return facets;
    },
    yaw: 0.28,
    pitch: 0.32,
    scale: 0.86,
};

/** Research: a pleated paper lantern, breathing open and shut along its folds */
export const lantern: Model = {
    pose: t => {
        const breath = Math.sin(t * TAU);
        const h = 0.66 + 0.12 * breath;
        const rm = 0.74 - 0.1 * breath;
        const n = 8;
        const top = ring(n, 0.27, h);
        const bot = ring(n, 0.27, -h);
        // The middle ring zigzags in and out: those are the pleats
        const mid = Array.from({ length: n }, (_, i) => {
            const r = i % 2 ? rm : rm * 0.84;
            return [Math.cos((i * TAU) / n) * r, 0, Math.sin((i * TAU) / n) * r] as V3;
        });
        const facets: Facet[] = [];
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            facets.push([top[i], top[j], mid[j]], [top[i], mid[j], mid[i]], [mid[i], mid[j], bot[j]], [mid[i], bot[j], bot[i]]);
        }
        return facets;
    },
    yaw: 0.2,
    pitch: 0.28,
    scale: 0.86,
};

/** Leadership: a pinwheel, four folded blades turning together */
export const pinwheel: Model = {
    pose: t => {
        const a = -t * (TAU / 4);
        const c: V3 = [0, 0, 0.06];
        const facets: Facet[] = [];
        for (let k = 0; k < 4; k++) {
            const phi = a + (k * TAU) / 4;
            const corner: V3 = [Math.cos(phi) * 1, Math.sin(phi) * 1, 0];
            const mid: V3 = [Math.cos(phi + Math.PI / 4) * 0.52, Math.sin(phi + Math.PI / 4) * 0.52, 0];
            const flap: V3 = [Math.cos(phi + 0.55) * 0.42, Math.sin(phi + 0.55) * 0.42, 0.34];
            facets.push([c, corner, mid], [c, mid, flap]);
        }
        return facets;
    },
    yaw: 0.18,
    pitch: 0.3,
    scale: 0.82,
};

/** Education: a mortarboard, the board rocking and the tassel swinging */
export const mortarboard: Model = {
    pose: t => {
        const rock = 0.07 * Math.sin(t * TAU);
        const swing = 0.45 * Math.sin(t * TAU + 1.2);
        const tilt = (p: V3) => hinge(p, [0, 0, -1], [0, 0, 1], rock);
        const board = ring(4, 0.95, 0.28, Math.PI / 4);
        const under = ring(4, 0.95, 0.2, Math.PI / 4);
        const capTop = ring(4, 0.42, 0.2, Math.PI / 4);
        const capBot = ring(4, 0.48, -0.32, Math.PI / 4);
        const facets: Facet[] = [
            [board[0], board[1], board[2]],
            [board[0], board[2], board[3]],
        ];
        for (let i = 0; i < 4; i++) {
            const j = (i + 1) % 4;
            facets.push([board[i], under[i], under[j]], [board[i], under[j], board[j]]);
            facets.push([capTop[i], capBot[i], capBot[j]], [capTop[i], capBot[j], capTop[j]]);
        }
        // Tassel hangs from the board's front corner and swings
        const knot: V3 = board[0];
        const end = hinge([knot[0], knot[1] - 0.62, knot[2]], knot, [knot[0], knot[1], knot[2] + 1], swing);
        facets.push([knot, [end[0] - 0.07, end[1], end[2]], [end[0] + 0.07, end[1], end[2]]]);
        return facets.map(f => f.map(tilt) as Facet);
    },
    yaw: 0.55,
    pitch: 0.42,
    scale: 0.8,
};

/** Beyond work: a folded wristwatch whose hand ticks round a frame at a time */
export const wristwatch: Model = {
    pose: t => {
        const dial = flat(8, 0.56, 0, Math.PI / 8);
        const c: V3 = [0, 0, 0.12];
        const facets: Facet[] = dial.map((p, i) => [c, p, dial[(i + 1) % 8]] as Facet);
        // Strap folds away behind the dial top and bottom
        facets.push(
            [[-0.3, 0.5, 0], [0.3, 0.5, 0], [0.26, 1.02, -0.18]],
            [[-0.3, 0.5, 0], [0.26, 1.02, -0.18], [-0.26, 1.02, -0.18]],
            [[0.3, -0.5, 0], [-0.3, -0.5, 0], [-0.26, -1.02, -0.18]],
            [[0.3, -0.5, 0], [-0.26, -1.02, -0.18], [0.26, -1.02, -0.18]],
        );
        const th = Math.PI / 2 - t * TAU;
        const tip: V3 = [Math.cos(th) * 0.44, Math.sin(th) * 0.44, 0.2];
        const side: V3 = [Math.cos(th + Math.PI / 2) * 0.05, Math.sin(th + Math.PI / 2) * 0.05, 0.2];
        facets.push([[side[0], side[1], 0.2], tip, [-side[0], -side[1], 0.2]]);
        return facets;
    },
    yaw: 0.3,
    pitch: 0.2,
    scale: 0.82,
};

/** Contact: an envelope whose flap opens, lets the letter peek out, and closes */
export const envelope: Model = {
    pose: t => {
        const open = ease(Math.min(1, Math.max(0, 1.6 * Math.sin(t * Math.PI) - 0.3)));
        const bl: V3 = [-0.85, -0.52, 0], br: V3 = [0.85, -0.52, 0];
        const tr: V3 = [0.85, 0.52, 0], tl: V3 = [-0.85, 0.52, 0];
        const m: V3 = [0, -0.02, 0.04];
        const flapTip = hinge([0, -0.14, 0.06], tl, tr, -open * Math.PI * 0.92);
        const top = 0.3 + 0.42 * open;
        return [
            [bl, br, tr], [bl, tr, tl],
            [[-0.68, -0.4, 0.01], [0.68, -0.4, 0.01], [0.68, top, 0.01]],
            [[-0.68, -0.4, 0.01], [0.68, top, 0.01], [-0.68, top, 0.01]],
            [tl, bl, m], [br, tr, m], [bl, br, [0, 0.06, 0.05]],
            [tl, flapTip, tr],
        ];
    },
    yaw: -0.3,
    pitch: 0.28,
    scale: 0.74,
};
