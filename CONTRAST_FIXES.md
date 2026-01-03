Contrast fixes applied

Date: 2025-12-31

Summary
- Fixed runtime text/background contrast issues across the Grocery Gap app.
- Added a combined contrast checker script `tools/check_contrast_all.mjs`.

Files changed (high-level)
- components/apps/grocery-gap/theme.css
  - Removed broad color fallbacks that caused unintended overrides.

- components/apps/grocery-gap/sections/GroceryTest.module.css
  - Ensured `.eyebrow`, `.resultsTitle`, `.comparisonLabel` force contrast using `--gg-on-dark`/`--gg-on-light`.

- components/apps/grocery-gap/sections/FrequencyBias.module.css
  - Ensured `.eyebrow` and `.basketTitle` use `--gg-on-dark` and dark-mode inversion.

- components/apps/grocery-gap/sections/Shrinkflation.module.css
  - Ensured `.title`, `.subtitle`, `.productCategory`, `.hiddenCostsTitle`, `.keyFindingLabel` force readable colors.

- components/apps/grocery-gap/sections/RegionalMap.module.css
  - Ensured `.title`, `.subtitle`, `.insightText`, `.insightSource` force readable colors.

- components/apps/grocery-gap/sections/Calculator.module.css
  - Ensured `.eyebrow` forces readable color on dark backgrounds.

Tools added
- tools/check_contrast_all.mjs — runs the static CSS scanner and a Puppeteer runtime contrast check.

Notes & rationale
- The static scanner was updated to only report same-variable `color` and `background` within the same CSS rule block, and to skip `theme.css` (intentional variable definitions).
- I avoided broad high-specificity theme fallbacks because they caused unintended overrides; instead I applied targeted per-module fixes for the specific selectors flagged by the runtime scan.
- I used `!important` sparingly on the exact selectors that were being overridden at runtime to guarantee visible contrast without changing layout.

How to reproduce locally
1. Start dev server:

```bash
npm run dev
```

2. Run the combined checker (wait until dev server is reachable):

```bash
node tools/check_contrast_all.mjs
```

Questions / next steps
- I can commit these changes and run a full `npm run build` if you'd like.
- If you prefer removing the `!important` uses, I can do a pass to increase selector specificity instead.
