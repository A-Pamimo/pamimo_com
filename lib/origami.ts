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
            const s = 0.62 + 0.5 * lit;
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

/** Crane flapping slowly in place */
export const flappingCrane: Model = {
    pose: t => craneShape(0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2))),
    yaw: -0.55,
    pitch: 0.38,
    scale: 0.82,
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

/** Fortune teller: four paper pyramids around a centre, pairs opening in turn */
export const fortuneTeller: Model = {
    pose: t => {
        const phase = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
        const o: V3 = [0, 0, 0];
        const facets: Facet[] = [];
        for (let i = 0; i < 4; i++) {
            const a0 = (i * Math.PI) / 2;
            const am = a0 + Math.PI / 4;
            const a1 = a0 + Math.PI / 2;
            // Opposite pyramids spread and lower while the other pair closes and rises
            const open = i % 2 ? phase : 1 - phase;
            const reach = 0.85 + 0.25 * open;
            const c0: V3 = [Math.cos(a0) * reach, 0, Math.sin(a0) * reach];
            const c1: V3 = [Math.cos(a1) * reach, 0, Math.sin(a1) * reach];
            const tip: V3 = [Math.cos(am) * (0.3 + 0.35 * open), 0.95 - 0.35 * open, Math.sin(am) * (0.3 + 0.35 * open)];
            facets.push([o, c0, tip], [o, tip, c1], [c0, c1, tip]);
        }
        return facets;
    },
    yaw: 0.3,
    pitch: 0.5,
    scale: 0.75,
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

/** Dog-ear: the corner (top right) folds down over the diagonal as t goes 0 to 1 */
export const dogEar: Model = {
    pose: t => {
        const a: V3 = [-1, 1, 0];
        const b: V3 = [1, -1, 0];
        const corner = hinge([1, 1, 0], a, b, Math.PI * ease(t));
        return [[a, corner, b]];
    },
    yaw: 0,
    pitch: 0,
    scale: 1,
};
