import React from 'react';
import { IconMail } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink dark:bg-black text-cream py-24 px-4 md:px-12 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        <div>
          <h2 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-none">READY TO<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px #fff', cursor: 'pointer' }}>BUILD.</span></h2>
          <p className="font-mono text-sm opacity-50 mb-8 max-w-sm">Currently available for Product & Strategy roles. Let's discuss how we can scale your impact.</p>
          <a href="mailto:pamimo@example.com" className="inline-flex items-center bg-cream text-ink font-bold px-8 py-4 text-lg hover:bg-pop hover:text-white transition-colors shadow-hard hover:shadow-hard-hover cursor-hoverable">
            <IconMail className="w-5 h-5 mr-2 pixel-icon" /> INITIATE CONTACT
          </a>
        </div>
        <div className="flex flex-col justify-end items-start md:items-end">
          <div className="flex gap-6 text-2xl mb-8">
            <a href="#" className="hover:text-pop transition-colors font-mono cursor-hoverable">LINKEDIN</a>
            <a href="#" className="hover:text-pop transition-colors font-mono cursor-hoverable">GITHUB</a>
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
    </footer>
  );
};

export default Footer;
