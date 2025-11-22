
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const taglineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/content/site-content');
        const data = await res.json();
        const logoItem = data.find((item: any) => item.key === 'logo_url');
        if (logoItem) {
          setLogoUrl(logoItem.value);
        }
      } catch (err) {
        console.error('Failed to fetch logo', err);
      }
    };
    fetchLogo();
  }, []);

  // Tagline Animation Loop
  useEffect(() => {
    const words = [".Design", ".Develop", ".Deploy"];
    let currentIndex = 0;

    // Set initial text
    if (taglineRef.current) {
      taglineRef.current.textContent = words[0];
    }

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
      const nextWord = words[currentIndex];

      if (taglineRef.current) {
        const tl = gsap.timeline();

        tl.to(taglineRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => {
            if (taglineRef.current) {
              taglineRef.current.textContent = nextWord;
            }
          }
        })
          .set(taglineRef.current, { y: -20 })
          .to(taglineRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out"
          });
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Disable background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gradevo-navy/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo & Tagline Wrapper */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group select-none">

            {/* Animated Container: Collapses on scroll */}
            <div className={`flex flex-col leading-[0.85] overflow-hidden transition-all duration-500 ease-in-out ${scrolled ? 'max-w-0 opacity-0 -translate-x-4' : 'max-w-[200px] opacity-100 translate-x-0'}`}>
              {logoUrl ? (
                <img
                  src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`}
                  alt="Gradevo Logo"
                  className="h-12 object-contain"
                />
              ) : (
                <>
                  <span className="text-2xl font-display font-bold tracking-tight text-[#EAF0FF] group-hover:text-white transition-colors whitespace-nowrap">Gra</span>
                  <span className="text-2xl font-display font-bold tracking-tight text-[#EAF0FF] group-hover:text-white transition-colors whitespace-nowrap">Devo</span>
                </>
              )}
            </div>

            {/* The Hashtag: 
                - Text Mode: Always visible.
                - Image Mode: Hidden initially, Visible when scrolled.
            */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${logoUrl && !scrolled ? 'max-w-0 opacity-0' : 'max-w-[50px] opacity-100'}`}>
              <span className={`block font-display font-bold text-gradevo-red group-hover:rotate-12 transition-all duration-300 ${scrolled ? 'text-4xl' : 'text-5xl -translate-y-1'}`}>#</span>
            </div>
          </Link>

          {/* Animated Tagline (Desktop Only) - Always Visible alongside # */}
          <div className="hidden md:flex items-center h-6 overflow-hidden max-w-[200px] opacity-100 transition-all duration-500">
            <div className="w-[1px] h-8 bg-white/20 mx-3 transform rotate-12"></div>
            <span
              ref={taglineRef}
              className="font-display font-medium text-sm text-gradevo-white/60 tracking-[0.15em] uppercase w-24"
            >
              .Design
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-gradevo-red relative group ${location.pathname === link.path ? 'text-gradevo-red' : 'text-gradevo-white/80'}`}
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradevo-red transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gradevo-white z-50 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#071739] z-50 flex flex-col pt-24 px-6 md:hidden"
          >
            <button
              className="absolute top-6 right-6 text-3xl text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>

            <motion.ul
              className="space-y-6 text-white text-3xl font-semibold"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.name}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <Link
                    to={link.path}
                    className="block hover:text-gradevo-red transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.span whileTap={{ scale: 0.95 }} className="inline-block">
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
