// Shared motion system — one ease, a small set of durations, one signature per zone.
// Import EASE/DUR into `motion` components so timing stays consistent site-wide.

export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
    micro: 0.2,      // hovers, small state changes
    standard: 0.5,   // fades / reveals
    entrance: 0.9,   // Hero line-mask reveal (Hero only)
} as const;

// The modal / sheet spring (ProjectModal, game consoles).
export const SPRING = { type: 'spring', damping: 30, stiffness: 300, mass: 0.8 } as const;
