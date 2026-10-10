'use client';

import { useEffect } from 'react';
import { paletteEngine } from '../../lib/palette';

/**
 * Keeps the colour wheel turning while the page is open. The pre-paint script
 * paints the first minute; this re-applies the palette at each minute boundary.
 */
const ClockPalette: React.FC = () => {
    useEffect(() => {
        const { paPalette, paApply } = paletteEngine();
        let timer: ReturnType<typeof setTimeout>;
        const tick = () => {
            paApply(paPalette(Date.now()));
            window.dispatchEvent(new Event('pa-palette'));
            timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
        };
        tick();
        return () => clearTimeout(timer);
    }, []);
    return null;
};

export default ClockPalette;
