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
    <h3 className="font-mono text-xs text-pop-ink dark:text-pop font-bold mb-4 uppercase tracking-widest flex items-center gap-3">
        <span className="w-2 h-2 bg-pop shrink-0" aria-hidden="true" />
        {String(n).padStart(2, '0')}. {label}
    </h3>
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
                <div className="bg-ink text-cream dark:bg-white dark:text-ink p-8 md:p-10 shadow-hard">
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
