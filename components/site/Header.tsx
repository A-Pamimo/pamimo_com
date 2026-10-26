'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PAMark from './PAMark';
import { NAV } from '../../content/site';

const Header: React.FC = () => {
    const [current, setCurrent] = useState<string | null>(null);
    // The section menu on phones; on wider screens the links sit in the header
    const [open, setOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const navRef = useRef<HTMLElement>(null);

    const close = useCallback((refocus: boolean) => {
        setOpen(false);
        if (refocus) buttonRef.current?.focus();
    }, []);

    // While the menu is open: focus its first link, hold the page still, and
    // close on Escape or a tap outside the header
    useEffect(() => {
        if (!open) return;
        navRef.current?.querySelector('a')?.focus();
        const root = document.documentElement;
        const overflow = root.style.overflow;
        root.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close(true);
        };
        const onPointer = (e: PointerEvent) => {
            if (!headerRef.current?.contains(e.target as Node)) close(false);
        };
        // Back on a wide screen the links are in the header again
        const wide = window.matchMedia('(min-width: 48rem)');
        const onWide = () => wide.matches && close(false);
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onPointer);
        wide.addEventListener('change', onWide);
        return () => {
            root.style.overflow = overflow;
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onPointer);
            wide.removeEventListener('change', onWide);
        };
    }, [open, close]);

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
        <header className="site-header" ref={headerRef}>
            <div className="site-shell">
                <a href="#top" className="site-header__mark" aria-label="Back to the top of the page">
                    <PAMark variant="small" />
                </a>
                <button
                    ref={buttonRef}
                    type="button"
                    className="menu-toggle"
                    aria-expanded={open}
                    aria-controls="site-nav"
                    onClick={() => setOpen(o => !o)}
                >
                    <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
                    <svg className="menu-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path className="menu-toggle__line menu-toggle__line--top" d="M3.5 6.5 C9 5.8 15 6.4 20.5 6" />
                        <path className="menu-toggle__line menu-toggle__line--mid" d="M3 12.2 C9 11.6 15 12.5 21 11.9" />
                        <path className="menu-toggle__line menu-toggle__line--bot" d="M3.5 17.8 C9 17.3 15 18.1 20.5 17.6" />
                    </svg>
                </button>
                <nav id="site-nav" ref={navRef} className="site-nav" aria-label="Sections" data-open={open ? '' : undefined}>
                    <ul>
                        {NAV.map(item => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={current === item.id ? 'location' : undefined}
                                    onClick={() => setOpen(false)}
                                >
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
