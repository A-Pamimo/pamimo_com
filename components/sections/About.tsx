import React from 'react';
import Image from 'next/image';
import { IconCheck } from '../ui/Icons';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 px-4 md:px-12 bg-cream dark:bg-charcoal border-t border-ink dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative group cursor-hoverable w-full">
          <div className="absolute inset-0 bg-pop translate-x-2 translate-y-2 border border-ink dark:border-white transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"></div>
          <div className="relative bg-white dark:bg-zinc border border-ink dark:border-white p-2 aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/slide-assets/header-smile.png"
              alt="About Portrait"
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
        <div>
          <h2 className="font-display font-bold text-4xl md:text-6xl mb-8 leading-none">THE<br /><span className="text-pop">THROUGH-LINE.</span></h2>
          <div className="prose prose-lg dark:prose-invert opacity-80 font-sans space-y-6">
            <p>I see the world in systems. Whether I&apos;m designing a product roadmap or building a community from scratch, I&apos;m driven by the same question: <em>How can we make this last?</em></p>

            <div className="space-y-6 mt-8">
              {[
                { title: 'Building Scalable Systems', desc: 'I build structures that last. From founding student associations to scaling advisory ventures.' },
                { title: 'Translating Complexity', desc: 'Whether it\'s econometric models for the WFP or AI strategy for RBC, I bridge the gap between technical rigor and executive decision-making.' },
                { title: 'Operational Resilience', desc: 'Resilience means operating calmly under pressure and delivering clarity when conditions are not ideal.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <IconCheck className="w-6 h-6 text-pop mt-1 shrink-0 pixel-icon" />
                  <div>
                    <strong className="block text-lg mb-1">{item.title}</strong>
                    <p className="text-sm opacity-70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs font-mono opacity-50 pt-8 border-t border-ink/10 dark:border-white/10 mt-8">
              *Ask me about why I hate American milk or my Chinese language progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

