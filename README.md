# Pamimo Akinjide | Portfolio

A modern, interactive portfolio website showcasing strategy, data, and systems work at the intersection of Product, Economics, and Technology.

## 🎨 Design Philosophy

This portfolio embodies a **strategy-meets-tech** aesthetic with:
- **Bold Typography**: Syne display font for impact, JetBrains Mono for technical precision
- **Strategic Color Palette**: Ink (#121212), Cream (#F2F0E9), Pop Orange (#FF4400), Gold (#eab308)
- **Interactive Elements**: Custom cursor, animated canvas backgrounds, gamified exploration mode
- **Dark/Light Modes**: Seamless theme switching with persistent preferences

## ✨ Key Features

### 🎮 XP.MODE (Gamified Experience)
- **2D Exploration World**: Navigate a data lab environment with WASD/Arrow keys or mobile D-pad
- **Interactive Nodes**: Touch project servers, identity core, and comms relay to explore
- **Progress Tracking**: Visual indicators for visited nodes and completion percentage
- **Retro Aesthetic**: CRT scanlines, neon accents, and terminal-inspired UI

### 📊 Project Showcase
- **7 Featured Projects**: From RBC Amplify AI innovation to WFP humanitarian research
- **Interactive Modals**: Spring physics animations with detailed case studies
- **Full Story Blogs**: Conversational, engaging narratives for each project
- **Tech Stack Display**: Both technical skills and soft skills highlighted

### 🎯 Professional Branding
- **Custom Logo**: Geometric "P" monogram with data point accent
- **Strategic Tagline**: "STRATEGY × DATA × SYSTEMS"
- **SVG Favicon**: Scalable, modern browser support
- **Consistent Identity**: Logo integration across all touchpoints

### 📱 Responsive & Accessible
- **Mobile-First Design**: Touch-optimized controls for game mode
- **Adaptive Layouts**: Seamless experience from phone to desktop
- **Performance Optimized**: Smooth 60fps animations
- **Custom Cursor**: Desktop enhancement that respects user preferences

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Physics-based animations

### Key Libraries
- **Canvas API**: Custom particle background animations
- **Local Storage**: Theme and preference persistence
- **Google Fonts**: Inter, Syne, JetBrains Mono

### Deployment
- **Static Export**: Optimized for Cloudflare Pages
- **No API Routes**: Pure client-side interactivity
- **Fast Load Times**: Minimal bundle size

## 📂 Project Structure

```
pamimo_com/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts & metadata
│   ├── page.tsx           # Home page
│   └── work/              # Project detail pages
├── components/            # React components
│   ├── Logo.tsx           # Brand logo with variants
│   ├── Navbar.tsx         # Navigation with theme toggle
│   ├── Hero.tsx           # Landing section with marquee
│   ├── About.tsx          # Personal narrative
│   ├── WorkIndex.tsx      # Project grid with filters
│   ├── ProjectCard.tsx    # Individual project cards
│   ├── ProjectModal.tsx   # Interactive project popup
│   ├── ProjectDetailView.tsx  # Full project pages
│   ├── StoryMode.tsx      # Gamified exploration mode
│   ├── CustomCursor.tsx   # Desktop cursor enhancement
│   ├── BackgroundCanvas.tsx   # Particle animations
│   └── game/              # Game mode components
│       ├── GameIdentityCore.tsx
│       ├── GameCommsRelay.tsx
│       └── GameProjectConsole.tsx
├── constants.ts           # Project data & content
├── types.ts              # TypeScript interfaces
├── hooks/                # Custom React hooks
│   └── useTheme.ts       # Theme management
└── public/               # Static assets
    ├── icon.svg          # Favicon
    └── images/           # Project images
```

## 🎯 Featured Projects

1. **NOVA (RBC Amplify)**: Agentic AI for banking operations - $20K Best Business Value winner
2. **WFP Research**: 150K+ record analysis for humanitarian food security
3. **World's Edge Group**: Independent economic advisory platform
4. **City of Saskatoon**: $1B+ municipal budget performance system
5. **Saskatoon Summer Players**: $11M arts fundraising strategy
6. **PASA**: 40% YoY growth in Pan-African student community
7. **Economics Students Society**: Ground-zero organization building

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit `http://localhost:3000`

### Build
```bash
npm run build
npm run export  # For static export
```

### Deploy
Optimized for static hosting on:
- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

## 🎨 Customization

### Colors
Update `tailwind.config.js`:
```js
colors: {
  cream: '#F2F0E9',
  ink: '#121212',
  charcoal: '#1A1A1A',
  zinc: '#27272a',
  pop: '#FF4400',
  gold: '#eab308',
}
```

### Fonts
Modify `app/layout.tsx` to use different Google Fonts

### Projects
Edit `constants.ts` to add/modify projects:
```ts
export const PROJECT_DATA: Record<string, Project> = {
  yourProject: {
    id: "yourProject",
    title: "Your Project Title",
    subtitle: "Your Role // Organization",
    // ... more fields
  }
}
```

## 📧 Contact

**Email**: oluwapamimoakinjide@gmail.com
**LinkedIn**: [linkedin.com/in/pamimo](https://www.linkedin.com/in/pamimo)

## 🏆 Highlights

- **Award-Winning Work**: RBC Amplify Best Business Value ($20K prize)
- **Global Impact**: WFP research affecting humanitarian operations
- **Community Leadership**: PASA president, ESS co-founder
- **Strategic Consulting**: World's Edge Group founder
- **Municipal Impact**: City of Saskatoon performance systems

## 📄 License

This portfolio is a personal project. Feel free to draw inspiration, but please don't copy directly. Build something that represents YOU.

---

**Built with strategy, designed with intention, coded with precision.**

*Pamimo Akinjide - Where Strategy Meets Systems*
