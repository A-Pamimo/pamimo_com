## 2024-05-22 - Hover-only Interactions and Keyboard Accessibility
**Learning:** Interactive elements that rely on `onMouseEnter` (like the "XP.MODE" preview) must have corresponding `onFocus` handlers. Without them, keyboard users miss out on context/preview cues.
**Action:** Always pair `onMouseEnter` with `onFocus` and `onMouseLeave` with `onBlur` for interactive elements.
