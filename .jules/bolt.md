## 2024-05-23 - Canvas Resize Bottleneck
**Learning:** Generating full-screen noise on every resize event blocks the main thread (measured ~80ms per frame at 1080p).
**Action:** Always debounce or throttle heavy canvas operations attached to window resize events.
