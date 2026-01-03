'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Setup mouse tracking and interactive element listeners
  useEffect(() => {
    if (!mounted) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;

    if (!dot || !outline) return;

    const onMouseMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;

      outline.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 500, fill: "forwards" }
      );
    };

    const onMouseEnter = () => {
      outline.style.width = '60px';
      outline.style.height = '60px';
    };

    const onMouseLeave = () => {
      outline.style.width = '40px';
      outline.style.height = '40px';
    };

    window.addEventListener('mousemove', onMouseMove);

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cursor-hoverable');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    // Setup observer for new elements (like modal)
    const observer = new MutationObserver((mutations) => {
      const interactiveElements = document.querySelectorAll('a, button, .cursor-hoverable');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      const allInteractiveElements = document.querySelectorAll('a, button, .cursor-hoverable');
      allInteractiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
      observer.disconnect();
    };
  }, [mounted]);

  if (!mounted) return null;

  // Use Portal to escape parent transforms (framer-motion in template.tsx)
  return createPortal(
    <div className="hidden md:block pointer-events-none">
      <div ref={dotRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-ink dark:bg-pop z-[9999] pointer-events-none" />
      <div ref={outlineRef} className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-ink dark:border-white z-[9999] pointer-events-none transition-[width,height,background-color] duration-200" />
    </div>,
    document.body
  );
};

export default CustomCursor;