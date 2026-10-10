'use client';

import React, { useEffect, useRef } from 'react';

/**
 * A small paper plane that rides the PA tail, then unfolds flat and fades so the
 * ribbon carries on from where it landed. Runs on every load in full mode (in
 * step with the tail when the intro plays) and stays hidden under reduced motion.
 * Lives inside the PA hero SVG, so coordinates are viewBox units.
 */

interface Props {
    /** Seconds before the tail starts drawing, and how long it takes */
    delay: number;
    dur: number;
}

const ease = (x: number) => 1 - Math.pow(1 - x, 3);

const PaperPlane: React.FC<Props> = ({ delay, dur }) => {
    const ref = useRef<SVGGElement>(null);

    useEffect(() => {
        const plane = ref.current;
        const tail = plane?.ownerSVGElement?.querySelector<SVGPathElement>('.pa-tail');
        const root = document.documentElement;
        if (!plane || !tail) return;
        if (root.dataset.mode !== 'full' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // In step with the tail when the intro plays; otherwise a short solo flight
        const speed = root.dataset.intro === 'quick' ? 0.4 : 1;
        const wait = root.dataset.intro ? delay * speed : 0.5;
        const fly = root.dataset.intro ? Math.max(dur * speed, 0.9) : 1.8;
        const unfold = 0.6;
        const total = tail.getTotalLength();
        let raf = 0;
        let start = 0;

        const frame = (now: number) => {
            if (!start) start = now;
            const t = (now - start) / 1000 - wait;
            if (t < 0) {
                raf = requestAnimationFrame(frame);
                return;
            }
            const p = Math.min(1, t / fly);
            const len = total * ease(p);
            const pt = tail.getPointAtLength(len);
            const ahead = tail.getPointAtLength(Math.min(total, len + 2));
            const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
            // After landing the wings open flat (scaleY to zero) and the paper fades
            const u = Math.max(0, Math.min(1, (t - fly) / unfold));
            plane.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${angle}) scale(1 ${1 - u * 0.92})`);
            plane.style.opacity = String(1 - u);
            if (u < 1) raf = requestAnimationFrame(frame);
        };
        plane.style.opacity = '0';
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [delay, dur]);

    return (
        <g ref={ref} className="paper-plane" style={{ opacity: 0 }} aria-hidden="true">
            {/* Nose at the origin, pointing along +x */}
            <polygon points="0,0 -74,-28 -50,0" className="origami-face" />
            <polygon points="0,0 -74,22 -50,0" className="origami-face origami-face--back" />
            <polyline points="-50,0 0,0" className="origami-crease" />
        </g>
    );
};

export default PaperPlane;
