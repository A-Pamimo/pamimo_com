'use client';

import React from 'react';
import { Project } from '../../types';

const METRIC_LABEL: Record<string, string> = {
    product: 'Product outcome',
    usability: 'Usability metric',
    analyst: 'Analyst output',
    award: 'Award / recognition',
    concept: 'Concept — not yet shipped',
};

const StepHead: React.FC<{ n: number; label: string }> = ({ n, label }) => (
    <div className="flex items-baseline gap-4 mb-5">
        <span aria-hidden="true" className="font-display font-extrabold text-[3.5rem] md:text-[5rem] leading-none text-pop/15 dark:text-pop/25 select-none shrink-0">
            {String(n).padStart(2, '0')}
        </span>
        <h3 className="font-mono text-label text-pop-ink dark:text-pop font-bold uppercase">{label}</h3>
    </div>
);

const Fact: React.FC<{ k: string; v: string }> = ({ k, v }) => (
    <div>
        <dt className="font-mono text-xs uppercase tracking-widest opacity-60 mb-1">{k}</dt>
        <dd className="font-sans leading-relaxed">{v}</dd>
    </div>
);

const CaseStudy: React.FC<{ project: Project }> = ({ project }) => {
    const c = project.case;
    if (!c) return null;

    return (
        <ol className="space-y-14 list-none">
            {/* 1. Problem */}
            <li>
                <StepHead n={1} label="The problem (validated)" />
                <p className="font-display text-2xl md:text-3xl font-bold leading-tight mb-6">{c.problem.statement}</p>
                <dl className="grid sm:grid-cols-2 gap-6">
                    <Fact k="Who it's for" v={c.problem.users} />
                    <Fact k="How I know it's real" v={c.problem.validation} />
                    <Fact k="Success metric (set up front)" v={c.problem.successMetric} />
                </dl>
            </li>

            {/* 2. Decision + tradeoff — the PM signal */}
            <li>
                <StepHead n={2} label="The call I made — and the tradeoff" />
                <p className="font-sans text-lg leading-relaxed opacity-90 mb-6">{c.decision.rationale}</p>
                {c.decision.options && c.decision.options.length > 0 && (
                    <div className="mb-6">
                        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Options on the table</p>
                        <ul className="space-y-1">
                            {c.decision.options.map((o) => (
                                <li key={o} className="font-mono text-sm flex gap-2">
                                    <span className="text-pop-ink dark:text-pop">–</span>
                                    <span>{o}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p className="border-l-4 border-pop pl-5 font-sans text-lg leading-relaxed">
                    <span className="font-bold">Tradeoff I accepted: </span>
                    {c.decision.tradeoff}
                </p>
            </li>

            {/* 3. Shipped */}
            <li>
                <StepHead n={3} label="What shipped" />
                <p className="font-sans text-lg leading-relaxed opacity-90 mb-6">{c.shipped.summary}</p>
                {c.shipped.scope && c.shipped.scope.length > 0 && (
                    <ul className="grid sm:grid-cols-2 gap-2">
                        {c.shipped.scope.map((s) => (
                            <li key={s} className="font-mono text-sm border border-current/20 px-3 py-2">{s}</li>
                        ))}
                    </ul>
                )}
            </li>

            {/* 4. Result — honest metric type */}
            <li>
                <StepHead n={4} label="What moved" />
                <div className="bg-ink text-cream dark:bg-cream dark:text-ink p-8 md:p-10 shadow-hard-lg">
                    <p className="font-display text-2xl md:text-4xl font-bold leading-tight">{c.result.metric}</p>
                    <p className="font-mono text-xs uppercase tracking-widest mt-4 opacity-70">
                        {METRIC_LABEL[c.result.metricType] ?? c.result.metricType}
                    </p>
                    {c.result.evidence && (
                        <p className="font-sans text-base leading-relaxed mt-4 opacity-80">{c.result.evidence}</p>
                    )}
                </div>
            </li>

            {/* 5. Reflection */}
            <li>
                <StepHead n={5} label="What I'd do next" />
                <p className="font-sans text-lg leading-relaxed opacity-90 mb-3">
                    <span className="font-bold">Got wrong: </span>{c.reflection.gotWrong}
                </p>
                <p className="font-sans text-lg leading-relaxed opacity-90">
                    <span className="font-bold">Next: </span>{c.reflection.next}
                </p>
            </li>
        </ol>
    );
};

export default CaseStudy;
