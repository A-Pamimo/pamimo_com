'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  // Base text repeated to ensure it covers wide screens before looping
  const baseText = "PRODUCT LEAD // FOUNDER // COMPUTER SCIENTIST // AGENTIC AI // 0-TO-1 // PRODUCT STRATEGY // FULL STACK // ECONOMIC SYSTEMS // ";
  const marqueeContent = baseText.repeat(2);

  // Grouped for better visual flow
  const lineOne = ["BUILDING", "INSTITUTIONS."];
  const lineTwo = ["SCALING", "IMPACT."];

  return (
    <section className="min-h-screen flex flex-col justify-center px-4 md:px-12 relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="w-2 h-2 bg-pop animate-pulse"></span>
          <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-60">
            Ready to Build // Product Strategy & Engineering
          </span>
        </motion.div>

        {/* Refactored Typography: Grouped lines for tighter, less awkward spacing */}
        <div className="font-display font-extrabold text-[10vw] md:text-[9vw] leading-[0.9] mb-12 tracking-tighter space-y-2">
          <div className="flex flex-wrap gap-x-4 md:gap-x-8">
            {lineOne.map((text, i) => (
              <motion.div
                key={text}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <span className={`inline-block ${i === 1 ? 'text-transparent' : ''}`}
                  style={i === 1 ? { WebkitTextStroke: '1px currentColor', opacity: 0.5 } : {}}>
                  {text}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 md:gap-x-8">
            {lineTwo.map((text, i) => (
              <motion.div
                key={text}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.3 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <span className={`inline-block ${i === 0 ? 'text-pop' : ''}`}>
                  {text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          <div className="md:col-span-7 md:col-start-6 lg:col-start-7">
            {/* Identity Specs / Traits */}
            <div className="flex flex-wrap gap-y-2 gap-x-4 mb-6 font-mono text-xs md:text-sm text-pop uppercase tracking-wider font-bold">
              <span>[HIGH_AGENCY]</span>
              <span>[COMMUNITY_BUILDER]</span>
              <span>[0_TO_1_BUILDER]</span>
            </div>

            <p className="text-lg md:text-xl font-sans leading-relaxed opacity-80 border-l-2 border-pop pl-6">
              I operate at the intersection of Strategy, Data, and Community. A builder translating complex theory into systems that actually work for people.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-ink dark:bg-white text-cream dark:text-ink py-3 overflow-hidden flex border-t-4 border-pop z-20">
        <div className="animate-marquee whitespace-nowrap font-mono text-sm tracking-wider font-bold shrink-0">
          {marqueeContent}
        </div>
        <div className="animate-marquee whitespace-nowrap font-mono text-sm tracking-wider font-bold shrink-0">
          {marqueeContent}
        </div>
      </div>
    </section>
  );
};

export default Hero;