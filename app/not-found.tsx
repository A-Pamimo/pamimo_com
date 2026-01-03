import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The requested resource could not be found.',
    robots: {
        index: false,
        follow: true,
    },
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-cream dark:bg-charcoal flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="font-mono text-pop text-6xl font-black glitch-text" data-text="404">
                    404
                </div>

                <div className="space-y-2">
                    <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
                        Signal Lost
                    </h1>
                    <p className="font-mono text-sm opacity-75">
                        The requested coordinates do not resolve to a known location in this sector.
                    </p>
                </div>

                <div className="bg-ink/5 dark:bg-white/5 p-4 rounded font-mono text-xs text-left border border-ink/10 dark:border-white/10">
                    <p className="text-red-500 mb-2">&gt; ERROR: RESOURCE_NOT_FOUND</p>
                    <p className="opacity-50">&gt; TRACE: /unknown/path</p>
                    <p className="opacity-50">&gt; STATUS: TERMINATED</p>
                </div>

                <Link
                    href="/"
                    className="inline-block bg-ink text-white dark:bg-white dark:text-ink px-6 py-3 font-mono font-bold uppercase tracking-widest hover:bg-pop hover:text-white transition-colors"
                >
                    Return to Base
                </Link>
            </div>
        </div>
    );
}
