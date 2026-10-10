import React from 'react';
import PaperPlane from './origami/PaperPlane';

/**
 * The PA mark: Reenie Beanie lettering with the A pulled left until it just
 * touches the P. Each pen stroke is revealed through a mask that follows a path
 * traced over the glyph, so the letters appear in writing order. The tail leaves
 * the A's crossbar and becomes the ribbon that runs down the page.
 *
 * Timing is pure CSS (see .pa-stroke in app/site.css), driven by data-intro on
 * <html>. With no intro attribute the mark renders fully drawn.
 */

const STROKES = [
    { d: 'M82.7,116.7 C82.1,120.8 79.2,132.8 79.3,141.3 C79.4,149.9 80.6,158.2 83.3,168.0 C86.1,177.8 91.0,189.6 96.0,200.0 C101.0,210.4 107.8,220.7 113.3,230.7 C118.9,240.7 126.7,255.1 129.3,260.0', dur: 0.304, delay: 0.12 },
    { d: 'M59.3,116.7 C62.3,113.3 65.7,102.8 77.3,96.7 C89.0,90.6 118.3,80.6 129.3,80.0 C140.3,79.4 140.2,86.4 143.3,93.3 C146.4,100.2 148.8,111.1 148.0,121.3 C147.2,131.6 142.9,144.7 138.7,154.7 C134.4,164.7 127.8,173.1 122.7,181.3 C117.6,189.6 110.4,200.2 108.0,204.0', dur: 0.392, delay: 0.504 },
    { d: 'M161.3,253.3 C161.9,247.8 163.0,234.4 164.7,220.0 C166.3,205.6 168.4,183.1 171.3,166.7 C174.2,150.2 179.2,134.7 182.0,121.3 C184.8,108.0 186.1,97.4 188.0,86.7 C189.9,75.9 192.4,61.7 193.3,56.7', dur: 0.359, delay: 0.976 },
    { d: 'M193.3,56.7 C194.4,63.9 197.6,83.9 200.0,100.0 C202.4,116.1 204.7,136.7 208.0,153.3 C211.3,170.0 216.1,185.6 220.0,200.0 C223.9,214.4 228.0,228.7 231.3,240.0 C234.7,251.3 238.6,263.3 240.0,268.0', dur: 0.381, delay: 1.415 },
    { d: 'M174.7,203.3 C178.0,202.6 188.4,200.8 194.7,198.7 C200.9,196.6 206.2,192.9 212.0,190.7 C217.8,188.4 226.4,186.2 229.3,185.3', dur: 0.182, delay: 1.876 },
];

const TAIL = { d: 'M229.3,185.3 C279.3,191.3 299.3,229.3 359.3,225.3 S479.3,189.3 640,211.3', dur: 0.75, delay: 2.098 };

/** Where the tail leaves the mark's box, in viewBox units; the ribbon picks up here */
export const TAIL_END = { x: 640, y: 211.3 };

const SHIFT = 28;
const MASK_WIDTH = 19;
const INK_WIDTH = 5;

interface PAMarkProps {
    variant: 'hero' | 'small';
    className?: string;
}

const PAMark: React.FC<PAMarkProps> = ({ variant, className = '' }) => {
    const hero = variant === 'hero';
    const id = `pa-${variant}`;
    // Hero shows the tail running off to the right; the header mark is letters only
    const viewBox = hero ? '40 40 610 240' : '50 45 205 235';

    return (
        <svg
            viewBox={viewBox}
            className={`pa-mark ${hero ? 'pa-mark--animated' : ''} ${className}`}
            role="img"
            aria-label="PA, Pamimo Akinjide's initials, hand-written in felt-tip"
            data-pa-mark={variant}
        >
            <defs>
                <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="700" height="340">
                    {STROKES.map((s, i) => (
                        <path
                            key={i}
                            className="pa-stroke"
                            d={s.d}
                            pathLength={1}
                            fill="none"
                            stroke="#fff"
                            strokeWidth={MASK_WIDTH}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as React.CSSProperties}
                        />
                    ))}
                </mask>
                {/* Slightly uneven felt-tip edge, rendered once (not animated) */}
                <filter id={`${id}-ink`} x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale={hero ? 3.2 : 2} xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>

            <text
                x={60}
                y={250}
                fontSize={300}
                fill="currentColor"
                mask={`url(#${id}-mask)`}
                filter={`url(#${id}-ink)`}
                style={{ fontFamily: 'var(--hand)' }}
                aria-hidden="true"
            >
                P<tspan dx={-SHIFT}>A</tspan>
            </text>
            {/* The tail stays smooth: it is the start of the ribbon, not lettering */}
            {hero && (
                <path
                    className="pa-tail"
                    d={TAIL.d}
                    pathLength={1}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={INK_WIDTH}
                    strokeLinecap="round"
                    style={{ '--dur': `${TAIL.dur}s`, '--delay': `${TAIL.delay}s` } as React.CSSProperties}
                />
            )}
            {hero && <PaperPlane delay={TAIL.delay} dur={TAIL.dur} />}
            {hero && <circle data-pa-tail-end cx={TAIL_END.x} cy={TAIL_END.y} r={0.5} fill="none" />}
        </svg>
    );
};

export default PAMark;
