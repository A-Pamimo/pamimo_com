## 2024-05-23 - Invisible Forms
**Learning:** Newsletter subscriptions in footers are often implemented as "invisible" forms - just an input and an icon. While visually minimal, they are completely inaccessible to screen readers without explicit labeling.
**Action:** Always verify that "icon-only" submit buttons have `aria-label` and inputs have `aria-label` or `<label>` (visually hidden if needed). Mouse users also benefit from `title` attributes on icon-only buttons.
