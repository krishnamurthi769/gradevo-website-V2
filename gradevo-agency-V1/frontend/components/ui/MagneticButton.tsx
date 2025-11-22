import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { BRAND_COLORS } from '../../constants';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, onClick, variant = 'primary', className = '' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;

    if (!button || !text) return;

    const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    
    const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * 0.5);
      yTo(y * 0.5);
      
      textXTo(x * 0.1);
      textYTo(y * 0.1);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const baseStyles = "relative px-8 py-4 rounded-full font-display font-bold tracking-wide overflow-hidden group transition-colors duration-300";
  const variantStyles = variant === 'primary' 
    ? `bg-gradevo-red text-white hover:bg-white hover:text-gradevo-navy` 
    : `border border-gradevo-white/20 text-gradevo-white hover:border-gradevo-red hover:bg-gradevo-navy`;

  return (
    <button 
      ref={buttonRef}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <span ref={textRef} className="relative z-10 inline-block">
        {children}
      </span>
      {/* Hover Fill Effect */}
      <div className="absolute inset-0 bg-white scale-0 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out origin-center -z-0" />
    </button>
  );
};

export default MagneticButton;