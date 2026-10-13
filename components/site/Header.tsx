'use client';

import React, { useEffect, useState } from 'react';
import PAMark from './PAMark';
import { NAV } from '../../content/site';

const Header: React.FC = () => {
    const [current, setCurrent] = useState<string | null>(null);

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
            </div>
        </header>
    );
};

export default Header;
