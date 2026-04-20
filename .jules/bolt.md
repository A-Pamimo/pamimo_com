# Bolt's Journal

## 2024-05-23 - Static Noise Generation
**Learning:** Generating full-screen noise on a canvas every resize is extremely expensive and memory-intensive.
**Action:** Use a small (e.g., 128x128) off-screen canvas to generate the noise once, convert it to a data URL, and apply it as a tiled `backgroundImage` on a div. This leverages the browser's efficient background tiling and eliminates main-thread work on resize.
