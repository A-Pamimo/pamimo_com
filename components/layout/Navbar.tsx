'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconMenu, IconClose, IconMoon, IconSun } from '../ui/Icons';
import { useTheme } from '../../hooks/useTheme';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Logo from '../ui/Logo';
import { CONTACT_EMAIL } from '../../constants';

import { useScrollDirection } from '../../hooks/useScrollDirection';
import RegionToggle from '../apps/grocery-gap/ui/RegionToggle';

interface NavbarProps {
  simulationMode?: boolean;
  toggleSimulation?: () => void;
  setSimulationPreview?: (active: boolean) => void;
  variant?: 'default' | 'blog';
}

const Navbar: React.FC<NavbarProps> = ({ simulationMode, toggleSimulation, setSimulationPreview, variant = 'default' }) => {
  const { theme, toggleTheme } = useTheme();
  const { scrollDirection, isScrolled } = useScrollDirection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const linkClasses = 'pointer-events-auto';
  const reduce = useReducedMotion();

  // Motion Variants for fluid header (Apple Standard)
  const navVariants = {
    visible: {
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    hidden: {
      y: '-100%',
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        animate={(!reduce && scrollDirection === 'down' && isScrolled && !mobileMenuOpen) ? 'hidden' : 'visible'}
        className={`fixed top-0 w-full z-50 px-6 flex justify-between items-center transition-colors duration-500
          ${isScrolled
            ? 'py-4 backdrop-blur-md border-b border-ink/5 dark:border-white/5 shadow-sm bg-bg/80'
            : 'py-6 backdrop-blur-md bg-transparent border-transparent'
          }
        `}
      >
        <Link href="/" className={`flex items-center hover:opacity-80 transition-opacity text-ink dark:text-cream ${linkClasses}`}>
          <Logo className="h-10 w-auto" variant="full" />
        </Link>

        {variant === 'blog' ? (
          /* Blog Mode Navigation */
          <div className={`flex items-center gap-6 ${linkClasses}`}>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-bold font-mono uppercase tracking-widest hover:text-pop transition-colors text-ink dark:text-cream">
              <span>←</span> Index
            </Link>
            <div className="hidden md:block scale-90 origin-right">
              <RegionToggle className="!static !shadow-none !border-ink/20 dark:!border-white/20 !bg-transparent hover:!bg-black/5" />
            </div>
          </div>
        ) : (
          /* Standard Desktop Links */
          <div className={`hidden md:flex items-center gap-8 ${linkClasses}`}>
            <Link href="/#about" className="text-sm font-medium hover:underline decoration-pop underline-offset-4 text-ink dark:text-cream">ABOUT ME</Link>
            <Link href="/#work" className="text-sm font-medium hover:underline decoration-pop underline-offset-4 text-ink dark:text-cream">INDEX</Link>
            <Link href="/blog" className="text-sm font-medium hover:underline decoration-pop underline-offset-4 text-ink dark:text-cream">WRITING</Link>
            <Link href="/resume" className="text-sm font-bold hover:underline decoration-pop underline-offset-4 text-pop-ink dark:text-pop">RÉSUMÉ</Link>
          </div>
        )}

        <div className={`flex items-center gap-6 ${linkClasses}`}>
          {/* Gamification Toggle (Renamed to XP.MODE) */}
          {toggleSimulation && (
            <div className="hidden md:flex">
              <button
                onClick={toggleSimulation}
                onMouseEnter={() => setSimulationPreview && setSimulationPreview(true)}
                onMouseLeave={() => setSimulationPreview && setSimulationPreview(false)}
                onFocus={() => setSimulationPreview && setSimulationPreview(true)}
                onBlur={() => setSimulationPreview && setSimulationPreview(false)}
                aria-pressed={simulationMode}
                className="group font-mono font-bold text-xs uppercase tracking-widest border border-ink/30 dark:border-cream/30 text-ink/70 dark:text-cream/70 px-3 py-2 transition-colors hover:border-pop hover:text-pop-ink dark:hover:text-pop focus-visible:ring-2 focus-visible:ring-pop-ink focus-visible:outline-none cursor-hoverable"
                title="Interactive game mode (experimental)"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-pop motion-safe:animate-pulse" aria-hidden="true" />
                  {simulationMode ? 'EXIT XP.MODE' : 'XP.MODE'}
                </span>
              </button>
            </div>
          )}

          {/* Theme Toggle - Hidden on blog variant */}
          {variant !== 'blog' && (
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
          )}

          {/* Hire Me (Desktop) */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hidden md:flex text-sm font-bold bg-ink text-cream dark:bg-cream dark:text-ink px-4 py-2 hover:bg-pop hover:text-white dark:hover:bg-pop dark:hover:text-white transition-colors items-center gap-2 shadow-hard hover:shadow-hard-hover cursor-hoverable"
          >
            <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
            WORK WITH ME
          </a>

          {/* Mobile Menu Btn */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 p-2 text-ink dark:text-white transform transition-transform active:scale-95"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {
          mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="fixed inset-0 bg-ink dark:bg-black z-[60] flex flex-col justify-center px-8"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 text-cream text-2xl cursor-hoverable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop rounded-sm"
                aria-label="Close Menu"
              >
                <IconClose className="w-8 h-8 pixel-icon" />
              </button>

              <nav className="flex flex-col">
                {[
                  { label: 'About Me', href: '/#about' },
                  { label: 'Index', href: '/#work' },
                  { label: 'Writing', href: '/blog' },
                  { label: 'Résumé', href: '/resume' }
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
                    className="text-left font-mono text-sm uppercase tracking-widest mb-8 flex items-center gap-3 text-cream/60 hover:text-pop transition-colors cursor-hoverable"
                  >
                    <span className="w-2 h-2 rounded-none bg-pop motion-safe:animate-pulse"></span>
                    {simulationMode ? 'EXIT XP.MODE' : 'XP.MODE (Experimental)'}
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

                {/* Mobile Region Toggle (Blog Mode Only) */}
                {variant === 'blog' && (
                  <div className="mb-8">
                    <RegionToggle className="!static !w-full justify-center !border-ink/20 dark:!border-white/20 !bg-transparent" />
                  </div>
                )}
              </nav>
            </motion.div >
          )
        }
      </AnimatePresence >
    </>
  );
};

export default Navbar;