# 2024-05-22 - Project Modal Accessibility Gap

**Learning:** Modal dialogs in this codebase were missing critical ARIA roles and labels, making them inaccessible to screen readers. Specifically, the close buttons were icon-only without `aria-label`, and the modal container lacked `role="dialog"` and `aria-modal="true"`. Also, keyboard trapping and `Escape` key handling were missing.

**Action:** When implementing or reviewing modals, always ensure:
1. `role="dialog"` and `aria-modal="true"` are present on the overlay/container.
2. `aria-labelledby` points to the modal title.
3. All interactive elements (especially icon-only buttons) have `aria-label` or visible text.
4. `Escape` key closes the modal.
5. Focus is trapped within the modal (though for this micro-improvement, we focused on attributes and Escape key).
