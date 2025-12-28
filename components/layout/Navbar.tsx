'use client';

import React, { useEffect, useState } from 'react';
import { IconMenu, IconClose, IconMoon, IconSun } from '../ui/Icons';
import { useTheme } from '../../hooks/useTheme';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { CONTACT_EMAIL } from '../../constants';

interface NavbarProps {
  simulationMode?: boolean;
  toggleSimulation?: () => void;
  setSimulationPreview?: (active: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ simulationMode, toggleSimulation, setSimulationPreview }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = scrolled
    ? 'py-4 bg-cream/90 dark:bg-charcoal/90 backdrop-blur-md shadow-sm border-b border-ink/10 dark:border-white/10'
    : 'py-6 pointer-events-none';

  const linkClasses = scrolled ? 'pointer-events-auto' : 'pointer-events-auto';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 px-6 flex justify-between items-center transition-all duration-300 ${navClasses}`}>
        <a href="#" className={`flex items-center hover:opacity-80 transition-opacity text-ink dark:text-cream ${linkClasses}`}>
          <Logo className="h-10 w-auto" variant="full" />
        </a>

        <div className={`flex items-center gap-6 ${linkClasses}`}>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium hover:underline decoration-pop underline-offset-4 text-ink dark:text-cream">ABOUT ME</a>
            <a href="#work" className="text-sm font-medium hover:underline decoration-pop underline-offset-4 text-ink dark:text-cream">INDEX</a>
            <a href="/blog" className="text-sm font-medium hover:underline decoration-pop underline-offset-4 text-ink dark:text-cream">WRITING</a>
          </div>

          {/* Gamification Toggle (Renamed to XP.MODE) */}
          {toggleSimulation && (
            <div className="hidden md:flex">
              <button
                onClick={toggleSimulation}
                onMouseEnter={() => setSimulationPreview && setSimulationPreview(true)}
                onMouseLeave={() => setSimulationPreview && setSimulationPreview(false)}
                className="group relative font-mono font-bold text-xs border border-ink dark:border-white px-4 py-2 transition-all hover:bg-black hover:text-green-400 hover:border-green-400 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-2">
                  <span className="group-hover:hidden">{simulationMode ? 'EXIT XP.MODE' : 'ENTER XP.MODE'}</span>
                  <span className="hidden group-hover:block font-mono tracking-widest">
                    {simulationMode ? 'EXIT SYSTEM' : 'PRESS START >'}
                  </span>
                  {simulationMode && <span className="w-2 h-2 bg-white rounded-none animate-ping" />}
                </div>
              </button>
            </div>
          )}

          {/* Theme Toggle - Updated for clarity */}
          <button
            onClick={toggleTheme}
            className="group flex items-center gap-2 border border-ink bg-white dark:bg-zinc text-ink dark:text-white px-3 py-1.5 hover:bg-pop hover:border-pop hover:text-white transition-all shadow-hard active:translate-y-1 active:shadow-none cursor-hoverable"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <IconSun className="w-4 h-4 pixel-icon" /> : <IconMoon className="w-4 h-4 pixel-icon" />}
            <span className="font-mono text-xs font-bold">
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </span>
          </button>

          {/* Hire Me (Desktop) */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hidden md:flex text-sm font-bold bg-ink text-cream dark:bg-cream dark:text-ink px-4 py-2 hover:bg-pop hover:text-white dark:hover:bg-pop dark:hover:text-white transition-colors items-center gap-2 shadow-hard hover:shadow-hard-hover cursor-hoverable"
          >
            <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
            HIRE ME
          </a>

          {/* Mobile Menu Btn */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 p-2 text-ink dark:text-white transform transition-transform active:scale-95"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>

          {/* Mobile Sticky CTA (Persistent Bottom Right) */}

        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 bg-ink dark:bg-black z-[60] flex flex-col justify-center px-8"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-cream text-2xl cursor-hoverable"
            >
              <IconClose className="w-8 h-8 pixel-icon" />
            </button>

            <nav className="flex flex-col">
              {[
                { label: 'About Me', href: '#about' },
                { label: 'Index', href: '#work' },
                { label: 'Writing', href: '/blog' }
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-cream font-display text-5xl font-bold mb-6 hover:text-pop transition-colors cursor-hoverable"
                >
                  {item.label}
                </motion.a>
              ))}
              {/* Mobile Game Mode Toggle */}
              {toggleSimulation && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toggleSimulation();
                  }}
                  className="text-left font-mono text-xl font-bold mb-8 flex items-center gap-3 text-pop hover:text-white transition-colors cursor-hoverable"
                >
                  <span className={`w-3 h-3 rounded-full ${simulationMode ? 'bg-white' : 'bg-pop'}`}></span>
                  {simulationMode ? 'EXIT XP.MODE' : 'ENTER XP.MODE'}
                </button>
              )}

              <div className="h-px bg-white/20 w-full mb-8" />
              <motion.a
                href={`mailto:${CONTACT_EMAIL}`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-pop text-xl font-mono cursor-hoverable"
              >
                {CONTACT_EMAIL}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;