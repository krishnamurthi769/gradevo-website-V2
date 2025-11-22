
import React, { useEffect, useRef } from 'react';

const DotGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Grid Configuration
    const gap = 40; // Distance between dots
    const dotRadius = 1.5;
    const mouseInfluenceRadius = 150;
    const mouseForce = 0.5; // How much they move

    let dots: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[] = [];
    
    const mouse = { x: -1000, y: -1000 };

    const initDots = () => {
      dots = [];
      const cols = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap + (gap / 2);
          const y = j * gap + (gap / 2);
          dots.push({
            x, y,      // Current position
            ox: x, oy: y, // Original position
            vx: 0, vy: 0 // Velocity
          });
        }
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initDots();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Styling
      ctx.fillStyle = 'rgba(234, 240, 255, 0.15)'; // Brand white, low opacity

      dots.forEach(dot => {
        // Calculate distance to mouse
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Mouse interaction force
        if (distance < mouseInfluenceRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
          const push = force * mouseForce * 2; // Push strength

          dot.vx -= Math.cos(angle) * push;
          dot.vy -= Math.sin(angle) * push;
        }

        // Spring back to original position
        const spring = 0.05;
        const friction = 0.9;

        dot.vx += (dot.ox - dot.x) * spring;
        dot.vy += (dot.oy - dot.y) * spring;

        dot.vx *= friction;
        dot.vy *= friction;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen"
    />
  );
};

export default DotGridBackground;
