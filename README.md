# PAMIMO

**Building. Scaling. Impact.**

This is the source code for [pamimoakinjide.com](https://pamimoakinjide.com) — my personal portfolio and digital playground.

---

## What You're Looking At

This isn't a template. I built this from scratch because I believe **the medium is the message**. If I'm going to tell you I can ship product, I should probably... ship product.

### The Fun Stuff
- **Game Mode**: Click "Enter XP Mode" on the site. There's a custom physics engine under the hood (`components/game/`) that lets you explore my work in a retro terminal interface.
- **Interactive Blog**: "The Grocery Gap" is a full data-driven web app, not a static article. It visualizes food inflation data with a calculator that adapts to your province.
- **Sound Design**: Every button has synthesized audio feedback using the Web Audio API. No sound files — just code.

### The Boring (But Important) Stuff
- **Zero-error build** on Next.js 14 with strict TypeScript
- **Lazy-loaded game engine** so the marketing site loads fast
- **Error boundaries** so if the game crashes, the rest of the site survives
- **SEO-ready** with dynamic OpenGraph tags for every page

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (Strict) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Hosting | Cloudflare Pages |
| Sound | Web Audio API (no files) |

---

## Project Structure

```
pamimo_com/
├── app/                  # Pages & layouts
├── components/
│   ├── game/             # Physics engine & retro UI
│   ├── apps/             # Interactive blog apps (Grocery Gap)
│   ├── sections/         # Marketing sections (Hero, Work)
│   └── ui/               # Design system (Button, ErrorBoundary)
├── hooks/                # Reusable logic (useSound, useLocalStorage)
├── constants.ts          # All content lives here (CMS-lite)
└── public/               # Static assets
```

---

## Run It Locally

```bash
git clone https://github.com/pamimo/pamimo_com.git
cd pamimo_com
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Let's Talk

I'm open to opportunities in **Product Strategy**, **Technical PM**, and **0-to-1 building**.

- **Email**: [oluwapamimoakinjide@gmail.com](mailto:oluwapamimoakinjide@gmail.com)
- **LinkedIn**: [linkedin.com/in/pamimo](https://www.linkedin.com/in/pamimo)
- **Site**: [pamimoakinjide.com](https://pamimoakinjide.com)
