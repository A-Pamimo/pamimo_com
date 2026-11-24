import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/site/Header';
import ClockPalette from '../../components/site/ClockPalette';
import VisitTracker from '../../components/site/VisitTracker';
import { ArrowLeft, ArrowUpRight } from '../../components/site/Icons';
import { rich } from '../../components/site/rich';
import { site } from '../../content/site';
import '../site.css';

export const metadata: Metadata = {
    title: 'Selected analysis | Pamimo Akinjide',
    description: 'Project finance models and investment memos built from public disclosures.',
    openGraph: {
        title: 'Selected analysis | Pamimo Akinjide',
        description: 'Project finance models and investment memos built from public disclosures.',
    },
};

/** A separate page, reached from the menu, so the home page keeps telling one story */
export default function Analysis() {
    const { analysis } = site;

    return (
        <div className="site" id="top">
            <VisitTracker />
            <ClockPalette />
            <Header />

            <main className="site-shell">
                <div className="site-column">
                    <section className="chapter" aria-labelledby="analysis-title">
                        <h1 id="analysis-title" style={{ marginBottom: '1.5rem' }}>Selected analysis</h1>
                        <p className="lede">{rich(analysis.intro)}</p>
                        <div className="chapter__list">
                            {analysis.entries.map(entry => (
                                <article key={entry.id}>
                                    <h3>{entry.title}</h3>
                                    {entry.meta && <p className="meta">{entry.meta}</p>}
                                    {entry.body.map((para, i) => (
                                        <p key={i}>{rich(para)}</p>
                                    ))}
                                    <div className="contact__links">
                                        {entry.links.map(link => (
                                            <a key={link.href} href={link.href} className="link-accent" target="_blank" rel="noopener noreferrer">
                                                {link.label} <ArrowUpRight />
                                            </a>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                        <a href="/" className="link-accent">
                            <ArrowLeft /> Back to the home page
                        </a>
                    </section>
                </div>
            </main>

            <footer className="site-footer">
                <div className="site-shell">
                    <p>{site.footer}</p>
                </div>
            </footer>
        </div>
    );
}
