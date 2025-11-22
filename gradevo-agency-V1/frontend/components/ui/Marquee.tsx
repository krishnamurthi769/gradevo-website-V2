
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MarqueeProps {
  text: string;
  repeat?: number;
  className?: string;
  reverse?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ text, repeat = 4, className = '', reverse = false }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    // Clone content to ensure seamless loop
    const width = content.offsetWidth;
    
    gsap.to(el, {
      x: reverse ? width / 2 : -width / 2,
      duration: 20,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % (width / 2))
      }
    });
  }, [text, reverse]);

  return (
    <div className={`overflow-hidden whitespace-nowrap flex select-none ${className}`}>
      <div ref={marqueeRef} className="flex w-max">
        <div ref={contentRef} className="flex">
           {Array.from({ length: repeat }).map((_, i) => (
            <span key={i} className="mx-4">
              {text} <span className="text-gradevo-red mx-4">#</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
