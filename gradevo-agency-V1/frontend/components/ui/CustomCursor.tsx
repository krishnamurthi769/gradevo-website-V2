
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isViewMore, setIsViewMore] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isClicking, setIsClicking] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Center element logic
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });
    
    const cursorX = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });
    
    const followerX = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3.out" });
    const followerY = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorX(clientX);
      cursorY(clientY);
      followerX(clientX);
      followerY(clientY);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // View More Detection (Data Attribute)
        const viewMoreEl = target.closest('[data-cursor]');
        if (viewMoreEl) {
            const text = viewMoreEl.getAttribute('data-cursor');
            setCursorText(text || 'View');
            setIsViewMore(true);
            setIsHovering(false);
        } else {
            setIsViewMore(false);
            // Generic Hover Detection
            const isInteractive = 
                target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.closest('a') || 
                target.closest('button') ||
                target.classList.contains('cursor-hover');
            setIsHovering(!!isInteractive);
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver); 

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [location]);

  useEffect(() => {
    const follower = followerRef.current;
    const cursor = cursorRef.current;
    const text = textRef.current;
    
    if (!follower || !cursor) return;

    if (isViewMore) {
        // VIEW MORE STATE: Large White Circle with Text
        gsap.to(follower, {
            width: 100,
            height: 100,
            backgroundColor: '#EAF0FF', // Brand White
            border: 'none',
            opacity: 1,
            mixBlendMode: 'normal',
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
        });
        gsap.to(cursor, { opacity: 0, duration: 0.2 }); // Hide small dot
        if (text) gsap.to(text, { opacity: 1, scale: 1, duration: 0.2, delay: 0.1 });
    
    } else if (isHovering) {
        // GENERIC HOVER STATE: Red Ring
        gsap.to(follower, {
            width: 50,
            height: 50,
            backgroundColor: 'transparent',
            border: '1px solid #FF3B2E', // Brand Red
            opacity: 1,
            mixBlendMode: 'normal', 
            scale: 1,
            duration: 0.3
        });
        gsap.to(cursor, { opacity: 1, scale: 1, backgroundColor: '#FF3B2E' }); 
        if (text) gsap.to(text, { opacity: 0, scale: 0, duration: 0.1 });

    } else {
        // DEFAULT STATE: Small Ring
        gsap.to(follower, {
            width: 20,
            height: 20,
            backgroundColor: 'transparent',
            border: '1px solid rgba(234, 240, 255, 0.3)',
            opacity: 1,
            mixBlendMode: 'normal',
            scale: 1,
            duration: 0.3
        });
        gsap.to(cursor, { opacity: 1, scale: 1, backgroundColor: '#EAF0FF' });
        if (text) gsap.to(text, { opacity: 0, scale: 0, duration: 0.1 });
    }

  }, [isHovering, isViewMore]);
  
  // Click animation
  useEffect(() => {
    const follower = followerRef.current;
    if(!follower) return;
    if(isClicking) {
        gsap.to(follower, { scale: 0.9, duration: 0.1 });
    } else {
        gsap.to(follower, { scale: 1, duration: 0.1 });
    }
  }, [isClicking]);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-gradevo-white rounded-full pointer-events-none z-[10000] hidden md:block"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center transition-colors duration-300"
      >
         <span ref={textRef} className="text-gradevo-navy font-bold text-[12px] uppercase tracking-widest opacity-0 pointer-events-none whitespace-nowrap">
            {cursorText}
         </span>
      </div>
    </>
  );
};

export default CustomCursor;
