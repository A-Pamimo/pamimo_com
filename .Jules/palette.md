# Palette's Journal

## 2025-02-14 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (like close buttons in modals) are easy to miss during accessibility checks. The mobile menu close button was purely visual (SVG) with no accessible name, making it invisible to screen readers.
**Action:** Always verify that buttons without text content have an `aria-label`, and consider hiding the decorative icon with `aria-hidden="true"` to prevent redundancy or confusion.
