
import React from 'react';
import { Link } from 'react-router-dom';
import Marquee from './ui/Marquee';

const CTABanner: React.FC = () => {
  return (
    <section className="bg-gradevo-red py-20 overflow-hidden relative group">
      <Link to="/contact" className="block">
        <Marquee
          text="LET'S START A PROJECT"
          className="text-4xl md:text-9xl font-display font-bold text-gradevo-navy group-hover:text-white transition-colors duration-300"
          repeat={10}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
          <span className="bg-white text-gradevo-navy px-8 py-4 rounded-full font-bold text-xl transform rotate-12">Click to Contact</span>
        </div>
      </Link>
    </section>
  );
};

export default CTABanner;
