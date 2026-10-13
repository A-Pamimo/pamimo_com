import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

/**
 * GSAP, registered once on the client. The line and the paper that rides it use
 * MotionPathPlugin for points and angles along an SVG path, and quickTo for
 * smooth, interruptible easing.
 */

let registered = false;

export const motion = () => {
    if (!registered && typeof window !== 'undefined') {
        gsap.registerPlugin(MotionPathPlugin);
        registered = true;
    }
    return { gsap, MotionPathPlugin };
};

export interface PathPoint {
    x: number;
    y: number;
    /** Direction of travel in degrees */
    angle: number;
}

/** Point and heading on a path at a progress from 0 to 1 measured by length */
export const pathTracker = (path: SVGPathElement) => {
    const { MotionPathPlugin: mp } = motion();
    const raw = mp.getRawPath(path);
    mp.cacheRawPathMeasurements(raw);
    return (progress: number) => mp.getPositionOnPath(raw, Math.min(1, Math.max(0, progress)), true) as PathPoint;
};

/** Turns `from` toward `to` the short way round, in degrees */
export const shortAngle = (from: number, to: number) => from + ((((to - from) % 360) + 540) % 360) - 180;
