
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, centered = false, className = '' }) => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <div ref={headerRef} className={`mb-16 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      <h2 className="text-5xl md:text-8xl font-display font-bold text-gradevo-white mb-6 leading-[0.9] tracking-tight">
        {title.split('#').map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && <span className="text-gradevo-red">#</span>}
          </React.Fragment>
        ))}
      </h2>
      {subtitle && (
        <p className={`text-xl md:text-2xl text-gradevo-white/70 font-light max-w-3xl mt-8 leading-relaxed ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
