import { useState, useEffect } from 'react';

export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        // Threshold to prevent jitter
        const threshold = 10;

        const updateScrollDirection = () => {
            const scrollY = window.scrollY;
            const direction = scrollY > lastScrollY ? 'down' : 'up';

            // Only update if the difference is greater than the threshold
            // or if we're at the very top/bottom (optional, but good for UX)
            if (Math.abs(scrollY - lastScrollY) < threshold) {
                return;
            }

            setScrollDirection(direction);
            setIsScrolled(scrollY > 50); // Set scrolled state if passed 50px
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };

        // Use passive listener for better performance
        window.addEventListener('scroll', updateScrollDirection, { passive: true });

        // Initial check
        setIsScrolled(window.scrollY > 50);

        return () => {
            window.removeEventListener('scroll', updateScrollDirection);
        };
    }, []);

    return { scrollDirection, isScrolled };
}
