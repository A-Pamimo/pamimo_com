'use client';

import { useEffect } from 'react';

/**
 * Folds each section's top-right corner down like a dog-eared page the first time
 * the section scrolls into view. The corner itself is pure CSS (.chapter::after
 * in app/site.css); this only adds the class that triggers the fold.
 */
const FoldCorners: React.FC = () => {
    useEffect(() => {
        const chapters = document.querySelectorAll<HTMLElement>('.site .chapter:not(.hero)');
        if (!('IntersectionObserver' in window)) {
            chapters.forEach(c => c.classList.add('is-folded'));
            return;
        }
        const io = new IntersectionObserver(
            entries =>
                entries.forEach(e => {
                    if (!e.isIntersecting) return;
                    e.target.classList.add('is-folded');
                    io.unobserve(e.target);
                }),
            { rootMargin: '0px 0px -20% 0px' },
        );
        chapters.forEach(c => io.observe(c));
        return () => io.disconnect();
    }, []);
    return null;
};

export default FoldCorners;
