'use client';

import React, { useState } from 'react';
import { site } from '../../content/site';

type State = 'idle' | 'loading' | 'success' | 'error';

const copy = site.contact.newsletter;

/** Posts to the existing Cloudflare function at /api/subscribe */
const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [state, setState] = useState<State>('idle');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setState('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error(`Subscribe failed with ${res.status}`);
            setState('success');
            setEmail('');
        } catch {
            setState('error');
        }
    };

    const status = state === 'loading' ? copy.loading : state === 'success' ? copy.success : state === 'error' ? copy.error : '';

    return (
        <form className="newsletter" onSubmit={submit} noValidate={false}>
            <p>{copy.text}</p>
            <label htmlFor="newsletter-email">{copy.label}</label>
            <div className="newsletter__row">
                <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        if (state === 'error') setState('idle');
                    }}
                    aria-invalid={state === 'error'}
                    aria-describedby="newsletter-status"
                    disabled={state === 'loading'}
                />
                <button type="submit" disabled={state === 'loading'}>
                    {copy.button}
                </button>
            </div>
            <p id="newsletter-status" className="newsletter__status" data-state={state} role="status" aria-live="polite">
                {status}
            </p>
        </form>
    );
};

export default Newsletter;
