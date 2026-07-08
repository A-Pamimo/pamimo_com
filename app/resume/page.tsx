'use client';

import React from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '../../constants';

const PRODUCTS = [
    {
        name: 'xuexi (学习)',
        note: 'Self-initiated · shipped MVP (2026)',
        points: [
            'Offline-first Mandarin-learning app (React Native + Expo, one codebase for iOS + web) that points doomscrolling-style reward loops at comprehensible input, FSRS spaced repetition, and multi-speaker tone training.',
            'Made offline-first a hard constraint for a user learning in mainland China; cut handwriting, social, accounts and an AI tutor from the MVP to protect the core loop.',
            'Verified sub-10s cold-start to a completable action (~0.3s) with zero JS errors; feed never drops below an 85% known-word floor.',
        ],
    },
    {
        name: 'Sangyin (聲音)',
        note: 'Open source · shipped + hosted (2026)',
        points: [
            'Free, open-source audio reader that streams open-source neural TTS to web, desktop, iOS and Android from a single client, backed by a self-hostable FastAPI server.',
            'Split the product client/server to get natural neural voices on any device without a paid API; streams synthesis sentence-by-sentence for fast time-to-first-audio.',
            'Live hosted app + always-on backend, with a one-command self-host and deploy path (DigitalOcean, Modal, R2).',
        ],
    },
    {
        name: 'MacroMonitor',
        note: 'Self-initiated · prototype (2025)',
        points: [
            'Real-time Canadian macro dashboard (Next.js/TS) that closes the 3–6 month lag in official data; prioritized a fast, readable answer over exhaustive coverage.',
        ],
    },
];

const EXPERIENCE = [
    {
        role: 'Product Manager',
        org: 'RBC Amplify — NOVA (Agentic AI concept)',
        year: '2025',
        points: [
            'Led product strategy for a cross-functional squad; defined the roadmap and business case for an agentic-AI banking concept.',
            "Won the $20,000 'Best Business Value' prize (concept/prototype; core technology patent pending).",
        ],
    },
    {
        role: 'Strategy Intern',
        org: 'City of Saskatoon',
        year: '2025',
        points: [
            'Built 6 Power BI/SQL dashboards over $1B+ in municipal budget data for a city of 300,000+.',
            'Variance analysis surfaced $1M+ in budget optimizations; automation cut monthly reporting cycle time by 30%.',
        ],
    },
    {
        role: 'Founder',
        org: "World's Edge Group (economic advisory)",
        year: '2025',
        points: [
            'Built the operating model, pricing and evaluation frameworks; authored board-ready economic impact reports.',
            "Created the 'IMPACT 100' methodology for the Western Canada Economic Forum ($708.9B revenue represented).",
        ],
    },
    {
        role: 'Technical Product Lead',
        org: 'Interactive Tracking Systems',
        year: '2024',
        points: [
            'Built Python web-scraping + WhatsApp API pipelines and internal Flask/SQL tooling.',
            'Cut manual data collection time 30% and reporting hours 50%; marketing automation engaged 200+ customers.',
        ],
    },
    {
        role: 'Research Assistant',
        org: 'University of Saskatchewan (Climate Resilience)',
        year: '2024',
        points: [
            'Built reproducible R/Python pipelines over 150K+ geo-coded weather data points across 3 sub-Saharan countries.',
        ],
    },
];

const LEADERSHIP = [
    'President, Pan-African Students Association — grew annual events 2 → 10, secured $10K funding, 40% YoY membership growth (2023).',
    'Co-Founder & President, Economics Students Society — founded and scaled to 40+ members (2023).',
];

const SKILLS = [
    'Product discovery & prioritization', 'Roadmapping', 'User research framing', 'Metrics & experimentation',
    'React / React Native / Expo', 'TypeScript', 'Python / FastAPI', 'SQL', 'Econometrics (R/Stata)', 'Data viz (Power BI)',
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pop-ink dark:text-pop font-bold mb-5 border-b border-current/20 pb-2">
            {title}
        </h2>
        {children}
    </section>
);

export default function ResumePage() {
    return (
        <main className="min-h-screen bg-cream dark:bg-charcoal text-ink dark:text-cream transition-colors px-4 md:px-12 py-16 print:py-0">
            <div className="max-w-3xl mx-auto">
                {/* Controls — hidden when printing */}
                <div className="flex justify-between items-center mb-12 print:hidden">
                    <Link href="/" className="font-mono text-sm font-bold hover:text-pop-ink dark:hover:text-pop transition-colors">
                        ← Back to site
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="font-mono text-sm font-bold border-2 border-ink dark:border-cream px-5 py-2.5 shadow-hard hover:bg-pop hover:text-white hover:border-pop hover:shadow-none hover:translate-y-1 transition-all"
                    >
                        Print / Save as PDF
                    </button>
                </div>

                {/* Header */}
                <header className="mb-10">
                    <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Pamimo Akinjide</h1>
                    <p className="font-mono text-sm uppercase tracking-widest text-pop-ink dark:text-pop font-bold mt-2">
                        Product Manager — Product &amp; Strategy · Toronto
                    </p>
                    <p className="font-mono text-xs mt-3 opacity-80 flex flex-wrap gap-x-4 gap-y-1">
                        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-pop-ink dark:hover:text-pop">{CONTACT_EMAIL}</a>
                        <a href="https://github.com/A-Pamimo" className="hover:text-pop-ink dark:hover:text-pop">github.com/A-Pamimo</a>
                        <a href="https://www.linkedin.com/in/pamimo" className="hover:text-pop-ink dark:hover:text-pop">linkedin.com/in/pamimo</a>
                    </p>
                </header>

                <p className="font-sans text-lg leading-relaxed mb-12 border-l-2 border-pop pl-5">
                    Early-career product manager with an economics + engineering background. I find a real user problem,
                    make the hard prioritization call, ship it end-to-end, and measure what moved — most recently two shipped
                    cross-platform products, xuexi and Sangyin.
                </p>

                <Section title="Selected Products">
                    {PRODUCTS.map((p) => (
                        <div key={p.name} className="mb-6">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="font-display font-bold text-xl">{p.name}</h3>
                                <span className="font-mono text-xs opacity-70">{p.note}</span>
                            </div>
                            <ul className="mt-2 space-y-1.5">
                                {p.points.map((pt, i) => (
                                    <li key={i} className="font-sans leading-relaxed flex gap-2">
                                        <span className="text-pop-ink dark:text-pop shrink-0">–</span>
                                        <span>{pt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Section>

                <Section title="Experience">
                    {EXPERIENCE.map((e) => (
                        <div key={e.org} className="mb-6">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="font-display font-bold text-lg">
                                    {e.role} <span className="opacity-60 font-sans font-normal text-base">· {e.org}</span>
                                </h3>
                                <span className="font-mono text-xs opacity-70">{e.year}</span>
                            </div>
                            <ul className="mt-2 space-y-1.5">
                                {e.points.map((pt, i) => (
                                    <li key={i} className="font-sans leading-relaxed flex gap-2">
                                        <span className="text-pop-ink dark:text-pop shrink-0">–</span>
                                        <span>{pt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Section>

                <Section title="Leadership">
                    <ul className="space-y-1.5">
                        {LEADERSHIP.map((l, i) => (
                            <li key={i} className="font-sans leading-relaxed flex gap-2">
                                <span className="text-pop-ink dark:text-pop shrink-0">–</span>
                                <span>{l}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="Education">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display font-bold text-lg">University of Saskatchewan</h3>
                    </div>
                    <p className="font-sans leading-relaxed mt-1">
                        Economics (Honours). Honours thesis on food-security measurement with the UN World Food Programme —
                        accepted for submission to PacDEV and AAEA.
                    </p>
                </Section>

                <Section title="Skills">
                    <div className="flex flex-wrap gap-2">
                        {SKILLS.map((s) => (
                            <span key={s} className="font-mono text-xs border border-current/40 px-3 py-1">{s}</span>
                        ))}
                    </div>
                </Section>
            </div>
        </main>
    );
}
