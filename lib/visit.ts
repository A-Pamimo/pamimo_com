/**
 * Small, bounded per-visit variation for the home page.
 * Everything here is read after mount; the pre-paint script in app/layout.tsx
 * handles the attributes that must exist before first paint.
 */

export type Daypart = 'morning' | 'dusk' | 'night';
export type Mode = 'full' | 'simple';

const SEED_KEY = 'pa_seed';
const VISIT_KEY = 'pa_visits';
const VISIT_SESSION_KEY = 'pa_visit_counted';
const MODE_KEY = 'pa_mode';
const INTRO_KEY = 'pa_intro_seen';

const safe = <T,>(fn: () => T, fallback: T): T => {
    try {
        return fn();
    } catch {
        return fallback;
    }
};

/** Seeded PRNG (mulberry32): the same seed always gives the same sequence */
export const mulberry32 = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** One seed per browser session, so a refresh keeps the same ribbon route */
export const getSessionSeed = (): number =>
    safe(() => {
        const stored = sessionStorage.getItem(SEED_KEY);
        if (stored) return Number(stored);
        const seed = Math.floor(Math.random() * 1e9);
        sessionStorage.setItem(SEED_KEY, String(seed));
        return seed;
    }, 1234567);

/** Counts a visit once per session and returns the running total */
export const countVisit = (): number =>
    safe(() => {
        let visits = Number(localStorage.getItem(VISIT_KEY) || '0');
        if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
            visits += 1;
            localStorage.setItem(VISIT_KEY, String(visits));
            sessionStorage.setItem(VISIT_SESSION_KEY, '1');
        }
        return Math.max(visits, 1);
    }, 1);

/** True once the PA intro has already played in this session */
export const introSeen = (): boolean => safe(() => sessionStorage.getItem(INTRO_KEY) === '1', false);
export const markIntroSeen = () => safe(() => sessionStorage.setItem(INTRO_KEY, '1'), undefined);

export const getMode = (): Mode =>
    typeof document !== 'undefined' && document.documentElement.dataset.mode === 'simple' ? 'simple' : 'full';

export const setMode = (mode: Mode) => {
    document.documentElement.dataset.mode = mode;
    safe(() => localStorage.setItem(MODE_KEY, mode), undefined);
    window.dispatchEvent(new CustomEvent('pa-mode', { detail: mode }));
};

/**
 * Runs inline in <head> before first paint. Kept dependency-free and tiny.
 * Sets data-daypart from the visitor's clock and data-mode from their saved
 * choice, falling back to simple for reduced motion and slow networks.
 * Sets data-intro to play (first visit) or quick (visits two to four) when the
 * PA should write itself; from the fifth visit it simply appears drawn.
 */
export const PREPAINT_SCRIPT = `(function(){try{
var d=document.documentElement,h=new Date().getHours();
d.dataset.daypart=h>=5&&h<12?'morning':h>=12&&h<19?'dusk':'night';
var m=null;try{m=localStorage.getItem('${MODE_KEY}')}catch(e){}
if(m!=='full'&&m!=='simple'){
var c=navigator.connection||{};
var slow=c.saveData||/(^|-)2g|3g/.test(c.effectiveType||'');
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
m=(rm||slow)?'simple':'full';}
d.dataset.mode=m;
var seen=null,v=0;try{seen=sessionStorage.getItem('${INTRO_KEY}');v=+(localStorage.getItem('${VISIT_KEY}')||0)}catch(e){}
var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(m==='full'&&!seen&&!still&&v<4)d.dataset.intro=v===0?'play':'quick';
}catch(e){}})();`;
