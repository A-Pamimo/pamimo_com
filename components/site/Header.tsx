'use client';

import React, { useEffect, useState } from 'react';
import PAMark from './PAMark';
import { NAV } from '../../content/site';
import { getMode, setMode, type Mode } from '../../lib/visit';

const VIEWS: { mode: Mode; label: string; title: string }[] = [
    { mode: 'full', label: 'Full', title: 'The full design, with the moving line and the folded paper' },
    { mode: 'simple', label: 'Simple', title: 'A calm, single-column view' },
];

const Header: React.FC = () => {
    // The pre-paint script has already chosen the mode; read it after mount
    const [mode, setModeState] = useState<Mode | null>(null);
    const [current, setCurrent] = useState<string | null>(null);

    useEffect(() => {
        setModeState(getMode());
    }, []);

    // Underline the section being read
    useEffect(() => {
        const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
        const io = new IntersectionObserver(
            entries => {
                const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (hit) setCurrent(hit.target.id);
            },
            { rootMargin: '-30% 0px -60% 0px' },
        );
        sections.forEach(s => io.observe(s));
        return () => io.disconnect();
    }, []);

    const choose = (next: Mode) => {
        if (next === mode) return;
        setMode(next);
        setModeState(next);
    };

    return (
        <header className="site-header">
            <div className="site-shell">
                <a href="#top" className="site-header__mark" aria-label="Back to the top of the page">
                    <PAMark variant="small" />
                </a>
                <nav className="site-nav" aria-label="Sections">
                    <ul>
                        {NAV.map(item => (
                            <li key={item.id}>
                                <a href={`#${item.id}`} aria-current={current === item.id ? 'location' : undefined}>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="view-toggle" role="group" aria-label="View" hidden={mode === null}>
                    {VIEWS.map(v => (
                        <button key={v.mode} type="button" aria-pressed={mode === v.mode} title={v.title} onClick={() => choose(v.mode)}>
                            {v.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
