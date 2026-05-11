'use client';

import React, { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  simulationMode: boolean;
  simulationPreview?: boolean;
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ simulationMode, simulationPreview }) => {
  const geoCanvasRef = useRef<HTMLCanvasElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- NOISE ---
  useEffect(() => {
    const noiseCanvas = noiseCanvasRef.current;
    if (!noiseCanvas) return;
    const noiseCtx = noiseCanvas.getContext('2d');
    if (!noiseCtx) return;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const resizeNoise = () => {
      noiseCanvas.width = window.innerWidth;
      noiseCanvas.height = window.innerHeight;
      const idata = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      const buffer32 = new Uint32Array(idata.data.buffer);
      for (let i = 0; i < buffer32.length; i++) {
        if (Math.random() < 0.5) buffer32[i] = 0xff000000;
      }
      noiseCtx.putImageData(idata, 0, 0);
    };

    // Debounced resize handler to prevent blocking main thread on resize
    // (Noise generation takes ~80ms at 1080p)
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeNoise, 200);
    };

    resizeNoise();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  // --- GEO SHAPES (Normal Mode Only) ---
  // Performance optimizations:
  // 1. IntersectionObserver pauses animation when not visible
  // 2. Reduced shape count on mobile (5 vs 15)
  // 3. Throttled resize handler
  useEffect(() => {
    if (simulationMode) return;

    const canvas = geoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let isVisible = true;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    // Detect mobile for reduced complexity
    const isMobile = window.innerWidth < 768;
    const SHAPE_COUNT = isMobile ? 5 : 15;

    interface Shape {
      x: number;
      y: number;
      size: number;
      type: 'circle' | 'square';
      dx: number;
      dy: number;
      update: () => void;
      draw: () => void;
    }

    const shapes: Shape[] = [];

    const createShape = (): Shape => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 100 + 50,
        type: Math.random() > 0.5 ? 'circle' : 'square',
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        update() {
          this.x += this.dx;
          this.y += this.dy;
          if (this.x < -100 || this.x > width + 100) this.dx *= -1;
          if (this.y < -100 || this.y > height + 100) this.dy *= -1;
        },
        draw() {
          const isDark = document.documentElement.classList.contains('dark') || simulationPreview;
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(18, 18, 18, 0.05)';
          if (this.type === 'circle') {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          } else {
            ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
          }
          ctx.stroke();
        }
      };
    };

    const initShapes = () => {
      shapes.length = 0;
      for (let i = 0; i < SHAPE_COUNT; i++) {
        shapes.push(createShape());
      }
    };

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initShapes();
    };

    // Throttled resize handler
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };

    const animateBg = () => {
      // Only animate when visible
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animateBg);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      shapes.forEach(s => {
        s.update();
        s.draw();
      });
      animationFrameId = requestAnimationFrame(animateBg);
    };

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    resize();
    initShapes();
    animateBg();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [simulationMode, simulationPreview]);

  return (
    <>
      <canvas ref={noiseCanvasRef} className="fixed inset-0 z-[-1] opacity-[0.05] pointer-events-none" />

      {/* Simulation Preview Grid Overlay - High Contrast Neon */}
      {simulationPreview && (
        <div
          className="fixed inset-0 z-[0] pointer-events-none transition-opacity duration-300 bg-black/80 flex items-center justify-center"
          style={{
            backgroundImage: `
                linear-gradient(rgba(0, 255, 65, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            boxShadow: 'inset 0 0 100px rgba(0, 255, 65, 0.1)'
          }}
        >
          {/* Animated Scanline */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,255,65,0.1)_50%)] bg-[length:100%_4px] animate-scanlines opacity-50" />

          {/* Hint Text */}
          <div className="text-center">
            <h2 className="text-6xl font-black text-transparent stroke-text-green tracking-tighter opacity-20">
              SYSTEM DETECTED
            </h2>
            <div className="text-green-500 font-mono text-sm mt-4 animate-pulse">
              &gt; HOVER TO PREVIEW XP.MODE
            </div>
          </div>
        </div>
      )}

      {/* Standard Mode Canvas: Background */}
      <canvas
        ref={geoCanvasRef}
        className={`fixed inset-0 z-[-2] pointer-events-none transition-opacity duration-500 ${simulationMode ? 'opacity-0' : 'opacity-100'}`}
      />
    </>
  );
};

export default BackgroundCanvas;