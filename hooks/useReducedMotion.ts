'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** False during SSR, so the first paint matches the server. */
const getServerSnapshot = () => false;

export const useReducedMotion = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
