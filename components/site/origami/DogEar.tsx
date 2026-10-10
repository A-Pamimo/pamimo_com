'use client';

import React, { useEffect, useRef, useState } from 'react';
import { dogEar } from '../../../lib/origami';
import Figure from './Figure';

/**
 * The section's top-right corner, folded down over its diagonal frame by frame
 * the first time the section scrolls into view. Full mode only (see CSS).
 */
const DogEar: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);
    const [folded, setFolded] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (!e.isIntersecting) return;
                setFolded(true);
                io.disconnect();
            },
            { rootMargin: '0px 0px -20% 0px' },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <svg ref={ref} className="dog-ear" viewBox="0 0 32 32" aria-hidden="true">
            <Figure model={dogEar} size={32} frames={10} target={folded ? 1 : 0} pageFront hideAtZero />
        </svg>
    );
};

export default DogEar;
