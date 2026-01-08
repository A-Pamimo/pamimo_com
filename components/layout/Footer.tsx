
import React from 'react';
import { IconMail, IconArrow } from '../ui/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink dark:bg-black text-cream py-24 px-4 md:px-12 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        <div>
          <h2 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-none">READY TO<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px #fff', cursor: 'pointer' }}>BUILD.</span></h2>
          <p className="font-mono text-sm opacity-50 mb-8 max-w-sm">Currently available for Product & Strategy roles. Let&apos;s discuss how we can scale your impact.</p>
          <a href="mailto:oluwapamimoakinjide@gmail.com" className="inline-flex items-center bg-cream text-ink font-bold px-8 py-4 text-lg hover:bg-pop hover:text-white transition-colors shadow-hard hover:shadow-hard-hover cursor-hoverable">
            <IconMail className="w-5 h-5 mr-2 pixel-icon" /> INITIATE CONTACT
          </a>

          <div className="mt-12 max-w-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2 opacity-40">Or keep in touch</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="ENTER EMAIL FOR UPDATES"
                className="w-full bg-transparent border-b border-white/20 py-3 text-xs font-mono placeholder:text-white/20 focus:outline-none focus:border-pop transition-colors pr-10 text-cream"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="absolute right-0 top-2 opacity-50 group-hover:opacity-100 hover:text-pop transition-all"
                aria-label="Subscribe"
              >
                <IconArrow className="w-4 h-4 -rotate-45" />
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col justify-end items-start md:items-end">
          <div className="flex gap-6 text-2xl mb-8">
            <a href="https://www.linkedin.com/in/pamimo" target="_blank" rel="noopener noreferrer" className="hover:text-pop transition-colors font-mono cursor-hoverable">LINKEDIN</a>
            <a href="https://github.com/A-Pamimo/" target="_blank" rel="noopener noreferrer" className="hover:text-pop transition-colors font-mono cursor-hoverable">GITHUB</a>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs opacity-30">TORONTO, ON</p>
            <p className="font-mono text-xs opacity-30">&copy; 2026 PAMIMO AKINJIDE</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none opacity-5">
        <span className="font-display font-bold text-[20vw] whitespace-nowrap">PAMIMO</span>
      </div>
    </footer >
  );
};

export default Footer;

