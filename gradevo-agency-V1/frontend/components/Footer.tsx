
import React, { useEffect, useRef } from 'react';
import { Instagram, Linkedin, Phone } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const fillTextRef = useRef<HTMLDivElement>(null);

  const [contactInfo, setContactInfo] = React.useState({
    email: 'hello@gradevo.com',
    phone: '+1 (555) 123-4567',
    address: 'Los Angeles, CA',
    social_instagram: '',
    social_linkedin: '',
    social_whatsapp: '',
    logo_url: ''
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/content/site-content');
        const data = await res.json();
        const info: any = {};
        data.forEach((item: any) => {
          info[item.key] = item.value;
        });
        setContactInfo(prev => ({ ...prev, ...info }));
      } catch (err) {
        console.error('Failed to fetch contact info', err);
      }
    };

    fetchContactInfo();

    gsap.registerPlugin(ScrollTrigger);

    const footer = footerRef.current;
    const content = contentRef.current;
    const textWrapper = textWrapperRef.current;
    const fillText = fillTextRef.current;

    if (!footer || !content || !textWrapper || !fillText) return;

    // Make the fill text visible by default (remove animation constraint)
    gsap.set(fillText, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top bottom", // Triggers as soon as footer enters viewport
        toggleActions: "play none none reverse",
      }
    });

    // 1. Content Entrance
    tl.fromTo(content,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    // 2. Text Slide Up
    tl.fromTo(textWrapper,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.6"
    );

    // 3. LIQUID FILL EFFECT 
    tl.fromTo(fillText,
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.2,
        ease: "power4.inOut"
      },
      "-=0.8"
    );

  }, []);

  return (
    <footer ref={footerRef} className="bg-gradevo-navy pt-24 pb-0 relative overflow-hidden z-10 border-t border-white/5 flex flex-col justify-between min-h-screen">

      {/* TOP SECTION: LINKS & CONTENT */}
      <div className="container mx-auto px-6 relative z-20 flex-grow" ref={contentRef}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit select-none">
              {contactInfo.logo_url ? (
                <img
                  src={contactInfo.logo_url.startsWith('http') ? contactInfo.logo_url : `http://localhost:5000${contactInfo.logo_url}`}
                  alt="Gradevo Logo"
                  className="h-12 object-contain"
                />
              ) : (
                <>
                  <div className="flex flex-col leading-[0.85]">
                    <span className="text-5xl font-display font-bold tracking-tight text-[#EAF0FF] group-hover:text-white transition-colors">Gra</span>
                    <span className="text-5xl font-display font-bold tracking-tight text-[#EAF0FF] group-hover:text-white transition-colors">Devo</span>
                  </div>
                  <span className="text-[5rem] text-gradevo-red font-display font-bold -translate-y-2 group-hover:rotate-12 transition-transform duration-300">#</span>
                </>
              )}
            </Link>
            <p className="text-xs font-bold text-gradevo-white/30 tracking-[0.2em] uppercase mb-8">Design. Develop. Deploy.</p>

            <p className="text-gradevo-white/60 max-w-md mb-8 font-light leading-relaxed">
              A full-stack creative agency blending design, engineering, and storytelling to help brands grow digitally.
            </p>
            <div className="flex gap-4">
              {contactInfo.social_instagram && (
                <a href={contactInfo.social_instagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gradevo-white hover:bg-gradevo-red hover:border-gradevo-red hover:-translate-y-1 transition-all duration-300">
                  <Instagram size={20} />
                </a>
              )}
              {contactInfo.social_whatsapp && (
                <a href={contactInfo.social_whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gradevo-white hover:bg-gradevo-red hover:border-gradevo-red hover:-translate-y-1 transition-all duration-300">
                  <Phone size={20} />
                </a>
              )}
              {contactInfo.social_linkedin && (
                <a href={contactInfo.social_linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gradevo-white hover:bg-gradevo-red hover:border-gradevo-red hover:-translate-y-1 transition-all duration-300">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-gradevo-white font-bold mb-8 text-lg">Sitemap</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gradevo-white/60 hover:text-gradevo-red hover:translate-x-2 inline-block transition-all duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gradevo-white font-bold mb-8 text-lg">Contact</h4>
            <ul className="space-y-4 text-gradevo-white/60">
              <li className="hover:text-white transition-colors cursor-pointer">{contactInfo.email}</li>
              <li className="hover:text-white transition-colors cursor-pointer">{contactInfo.phone}</li>
              <li className="hover:text-white transition-colors cursor-pointer whitespace-pre-line">{contactInfo.address}</li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gradevo-white/40 pb-12">
          <p>&copy; {new Date().getFullYear()} Gradevo Agency.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-gradevo-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gradevo-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: MASSIVE ANIMATED TEXT LAYER */}
      <div className="relative w-full overflow-hidden mt-auto select-none pointer-events-none pb-[2vw]">
        <div ref={textWrapperRef} className="relative flex justify-center items-center w-full">

          {/* LAYER 1: THE OUTLINE (Background) - INCREASED OPACITY HERE */}
          <div
            className="text-[18.5vw] leading-[0.75] font-display font-black tracking-tighter w-full flex justify-center"
          >
            <span className="text-transparent" style={{ WebkitTextStroke: '2px #FF3B2E' }}>#</span>
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(234, 240, 255, 0.8)' }}>GRADEVO</span>
          </div>

          {/* LAYER 2: THE FILL (Foreground - Animated ClipPath) */}
          <div
            ref={fillTextRef}
            className="absolute inset-0 text-[18.5vw] leading-[0.75] font-display font-black tracking-tighter w-full flex justify-center"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Changed to be visible by default
              zIndex: 2
            }}
          >
            <span className="text-gradevo-red">#</span>
            <span className="text-gradevo-white">GRADEVO</span>
          </div>

        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-t from-gradevo-blue/10 to-transparent pointer-events-none z-0" />
    </footer>
  );
};

export default Footer;
