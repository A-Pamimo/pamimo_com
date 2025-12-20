'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
        initial={{ y: 0 }}
        exit={{ y: '-100%', transition: { duration: 0.8, ease: "easeInOut" } }}
        className="fixed inset-0 bg-ink dark:bg-black z-[10000] flex items-center justify-center text-cream"
    >
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl mb-2 overflow-hidden">
          <motion.span 
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            PAMIMO
          </motion.span>
        </h1>
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-1 bg-pop mx-auto" 
            style={{ width: '100px' }} // Fixed max width for bar
        />
      </div>
    </motion.div>
  );
};

export default Preloader;