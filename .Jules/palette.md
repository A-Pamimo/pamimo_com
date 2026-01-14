# Palette's Journal

## 2024-05-22 - Missing ARIA labels on icon-only buttons
**Learning:** Several icon-only buttons (close buttons in modals and mobile menu, submit button in footer) were missing `aria-label` attributes. This makes them inaccessible to screen reader users who won't know what the button does.
**Action:** Always check `onClick` handlers or `type="submit"` buttons that only contain icons for `aria-label` or `title` attributes.

## 2024-05-22 - Footer form accessibility
**Learning:** The footer subscription form has an input with `placeholder` but no `<label>`. While the design might rely on the placeholder, it's best practice to have a visually hidden label or `aria-label` on the input.
**Action:** Add `aria-label` to inputs that lack a visible `<label>`.
