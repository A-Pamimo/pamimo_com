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
    resizeNoise();
    window.addEventListener('resize', resizeNoise);
    return () => window.removeEventListener('resize', resizeNoise);
  }, []);

  // --- GEO SHAPES (Normal Mode Only) ---
  useEffect(() => {
    if (simulationMode) return;

    const canvas = geoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

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
          // We check for dark mode via document class manually since canvas is outside React render cycle largely
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
      for (let i = 0; i < 15; i++) {
        shapes.push(createShape());
      }
    };

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initShapes();
    };

    const animateBg = () => {
      ctx.clearRect(0, 0, width, height);
      shapes.forEach(s => {
        s.update();
        s.draw();
      });
      animationFrameId = requestAnimationFrame(animateBg);
    };

    resize();
    initShapes();
    animateBg();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [simulationMode, simulationPreview]);

  return (
    <>
      <canvas ref={noiseCanvasRef} className="fixed inset-0 z-[-1] opacity-[0.05] pointer-events-none" />

      {/* Simulation Preview Grid Overlay */}
      <div
        className={`fixed inset-0 z-[-1.5] pointer-events-none transition-opacity duration-300 bg-zinc-900 ${simulationPreview ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Standard Mode Canvas: Background */}
      <canvas
        ref={geoCanvasRef}
        className={`fixed inset-0 z-[-2] pointer-events-none transition-opacity duration-500 ${simulationMode ? 'opacity-0' : 'opacity-100'}`}
      />
    </>
  );
};

export default BackgroundCanvas;