import React from 'react';

/**
 * Line-art origami, drawn on a 48x48 grid. Faces are paper (field colour) with a
 * pen-coloured edge; each shape has one part (.fold) that slowly folds and unfolds.
 */

export const Boat: React.FC = () => (
    <svg viewBox="0 0 48 48" className="origami origami--boat" aria-hidden="true">
        <polygon points="4,30 44,30 36,40 12,40" className="origami-face origami-face--back" />
        <g className="fold fold--sail">
            <polygon points="24,6 24,30 9,30" className="origami-face" />
            <polygon points="24,6 39,30 24,30" className="origami-face origami-face--back" />
        </g>
        <polyline points="24,6 24,30" className="origami-crease" />
    </svg>
);

export const Crane: React.FC = () => (
    <svg viewBox="0 0 48 48" className="origami origami--crane" aria-hidden="true">
        <polygon points="17,30 24,22 31,30 24,36" className="origami-face origami-face--back" />
        <g className="fold fold--wing">
            <polygon points="24,22 13,6 20,27" className="origami-face" />
            <polygon points="24,22 37,8 28,27" className="origami-face" />
        </g>
        <polyline points="17,30 7,22 10,20" className="origami-crease origami-crease--neck" />
        <polyline points="31,30 42,25" className="origami-crease origami-crease--neck" />
    </svg>
);

export const FortuneTeller: React.FC = () => (
    <svg viewBox="0 0 48 48" className="origami origami--teller" aria-hidden="true">
        <g className="fold fold--teller">
            <polygon points="24,8 24,24 8,24" className="origami-face" />
            <polygon points="24,8 40,24 24,24" className="origami-face origami-face--back" />
            <polygon points="8,24 24,24 24,40" className="origami-face origami-face--back" />
            <polygon points="40,24 24,40 24,24" className="origami-face" />
        </g>
        <polyline points="8,24 40,24" className="origami-crease" />
        <polyline points="24,8 24,40" className="origami-crease" />
    </svg>
);
