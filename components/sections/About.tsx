'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { IconCheck } from '../ui/Icons';
import { EASE } from '../../lib/motion';

const PILLARS = [
  {
    title: 'Discovery — economics → product',
    desc: "I was trained to find the real constraint in a messy system before proposing a fix. Now I point that at users, not just data.",
  },
  {
    title: 'Prioritization — the call and the tradeoff',
    desc: 'I ship the core loop and cut the rest. xuexi shipped with handwriting, social, accounts and an AI tutor deliberately left out — to protect the one job that mattered.',
  },
  {
    title: 'Measure what moved',
    desc: 'Honest metrics over vanity — a sub-10s cold start, an 85% known-word floor, ≥3 tone voices — with a metric-type label so a prize never poses as product impact.',
  },
];

const About: React.FC = () => {
  const reduce = useReducedMotion();
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.6, ease: EASE },
      };

  return (
    <section id="about" className="py-24 md:py-32 px-4 md:px-12 bg-bg border-t-2 border-edge transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Portrait */}
        <div className="relative group cursor-hoverable w-full">
          <div className="absolute inset-0 bg-pop translate-x-2 translate-y-2 border-2 border-edge transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"></div>
          <div className="relative bg-surface border-2 border-edge p-2 aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/slide-assets/header-smile.png"
              alt="Portrait of Pamimo Akinjide"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-ink/90 text-cream backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="font-mono text-xs">LOC: TORONTO, CA</p>
              <p className="font-mono text-xs">ORIGIN: NIGERIA</p>
            </div>
          </div>
        </div>

        {/* Text */}
        <motion.div {...fade}>
          <h2 className="font-display font-extrabold text-display-1 mb-8">HOW I<br />WORK<span className="text-pop">.</span></h2>
          <p className="font-sans text-body-lg opacity-80 mb-10 max-w-lg">
            I&apos;m an economist who became a product manager. The through-line: find the real
            constraint, make the hard call, ship it, and measure what actually moved.
          </p>

          <div className="space-y-6">
            {PILLARS.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <IconCheck className="w-6 h-6 text-pop mt-1 shrink-0 pixel-icon" />
                <div>
                  <strong className="block text-lg mb-1">{item.title}</strong>
                  <p className="text-sm opacity-75 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono text-label opacity-70 pt-8 border-t-2 border-ink/10 dark:border-white/10 mt-10">
            Off the clock I&apos;m learning Mandarin — which is how xuexi started.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
