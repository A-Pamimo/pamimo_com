import React from 'react';
import { IconCheck } from './Icons';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 md:px-12 bg-cream dark:bg-charcoal border-t border-ink dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative group cursor-hoverable">
          <div className="absolute inset-0 bg-pop translate-x-2 translate-y-2 border border-ink dark:border-white transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"></div>
          <div className="relative bg-white dark:bg-zinc border border-ink dark:border-white p-2 aspect-[4/5] overflow-hidden">
            <video
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              src="/IMG_3961.mov"
              autoPlay      // Required to start automatically
              loop          // Required to repeat
              muted         // CRITICAL: Browsers block autoplay if this is missing
              playsInline   // CRITICAL: Prevents iOS from forcing full-screen
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
            <p>My narrative isn't just about where I'm from; it's about what I've built. Across every role, three things recur:</p>

            {/* Career Metrics - Added per Product Review */}
            <div className="grid grid-cols-3 gap-2 py-4 my-2 border-y border-ink/10 dark:border-white/10">
              <div className="text-center">
                <div className="font-display font-bold text-2xl md:text-3xl text-pop">3+</div>
                <div className="font-mono text-[10px] md:text-xs uppercase opacity-60">Years Exp</div>
              </div>
              <div className="text-center border-l border-ink/10 dark:border-white/10">
                <div className="font-display font-bold text-2xl md:text-3xl text-pop">5+</div>
                <div className="font-mono text-[10px] md:text-xs uppercase opacity-60">Products</div>
              </div>
              <div className="text-center border-l border-ink/10 dark:border-white/10">
                <div className="font-display font-bold text-2xl md:text-3xl text-pop">100k+</div>
                <div className="font-mono text-[10px] md:text-xs uppercase opacity-60">Impact</div>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              {[
                { title: 'Building Institutions', desc: 'I don\'t just participate; I build structures that last. From founding student associations to scaling advisory ventures.' },
                { title: 'Translating Complexity', desc: 'Whether it\'s econometric models for the WFP or AI strategy for RBC, I bridge the gap between technical rigor and executive decision-making.' },
                { title: 'Leaving Systems Stronger', desc: 'Resilience is not cosmetic. It is the ability to operate calmly under pressure and deliver clarity when conditions are not ideal.' }
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
