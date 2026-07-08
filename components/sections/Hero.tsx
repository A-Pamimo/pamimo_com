'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <section className="min-h-[100dvh] flex items-center px-4 md:px-12 relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full z-10">
        {/* Eyebrow — honest level, recruiter keywords */}
        <motion.p
          {...fade}
          className="font-mono text-xs md:text-sm uppercase tracking-widest text-pop-ink dark:text-pop font-bold mb-6 flex items-center gap-3"
        >
          <span className="w-2 h-2 bg-pop shrink-0" aria-hidden="true" />
          Product Manager — Product &amp; Strategy · Toronto · Open to early-career roles
        </motion.p>

        {/* H1 — the one claim */}
        <motion.h1
          {...fade}
          className="font-display font-extrabold text-5xl sm:text-6xl md:text-8xl leading-[0.95] tracking-tight mb-6"
        >
          I ship products that turn messy data into{' '}
          <span className="text-pop">decisions people make.</span>
        </motion.h1>

        {/* Spine — one sentence */}
        <motion.p
          {...fade}
          className="text-lg md:text-xl font-sans leading-relaxed max-w-2xl mb-10 border-l-2 border-pop pl-6"
        >
          Economics + engineering background. I find a real user problem, make the hard
          prioritization call, ship it, and measure what moved — most recently{' '}
          <span className="font-bold">xuexi</span> (a Mandarin-learning app) and{' '}
          <span className="font-bold">Sangyin</span> (an open-source audio reader).
        </motion.p>

        {/* Two CTAs — high-ability triggers */}
        <motion.div {...fade} className="flex flex-wrap gap-4">
          <a
            href="#work"
            className="inline-flex items-center gap-2 bg-ink text-cream dark:bg-cream dark:text-ink font-bold px-8 py-4 text-lg shadow-hard hover:bg-pop hover:text-white hover:shadow-none hover:translate-y-1 transition-all focus-visible:ring-2 focus-visible:ring-pop-ink focus-visible:outline-none cursor-hoverable"
          >
            Read my flagship case study →
          </a>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 border-2 border-ink dark:border-cream px-8 py-4 text-lg font-bold hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-pop-ink focus-visible:outline-none cursor-hoverable"
          >
            View résumé
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
