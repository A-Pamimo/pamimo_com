'use client';

import React, { useEffect, useState } from 'react';
import PAMark from './PAMark';
import { NAV } from '../../content/site';
import { getMode, setMode, type Mode } from '../../lib/visit';

const Header: React.FC = () => {
    // The pre-paint script has already chosen the mode; read it after mount
    const [mode, setModeState] = useState<Mode | null>(null);

    useEffect(() => {
        setModeState(getMode());
    }, []);

    const toggle = () => {
        const next: Mode = mode === 'simple' ? 'full' : 'simple';
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
                                <a href={`#${item.id}`}>{item.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <button
                    type="button"
                    className="mode-toggle"
                    onClick={toggle}
                    title={mode === 'simple' ? 'Switch to the full design with the moving line' : 'Switch to a calm, single-column view'}
                    hidden={mode === null}
                >
                    {mode === 'simple' ? 'Full view' : 'Simple view'}
                </button>
            </div>
        </header>
    );
};

export default Header;
