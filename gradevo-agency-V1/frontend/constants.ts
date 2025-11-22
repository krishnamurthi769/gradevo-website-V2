import { ServiceItem, CaseStudyItem, TestimonialItem } from './types';

export const BRAND_COLORS = {
  navy: '#0B0E31',
  blue: '#1B2BEE',
  white: '#EAF0FF',
  red: '#FF3B2E',
};

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Contact', path: '/contact' },
];

export const SERVICES_DATA: ServiceItem[] = [
  { id: '1', title: 'Web Development', description: 'Scalable, high-performance web applications built with modern stacks.', icon: 'code' },
  { id: '2', title: 'Frontend Engineering', description: 'Interactive, smooth, and responsive interfaces using React & GSAP.', icon: 'layout' },
  { id: '3', title: 'UI/UX Design', description: 'User-centric design systems that convert visitors into customers.', icon: 'pen-tool' },
  { id: '4', title: 'Branding', description: 'Complete identity systems from logos to brand guidelines.', icon: 'star' },
];

export const PORTFOLIO_DATA: CaseStudyItem[] = [
  { id: '1', title: 'FinTech Dashboard', category: 'Web App', image: 'https://picsum.photos/800/600?random=1', description: 'Real-time financial data visualization.' },
  { id: '2', title: 'Neon Commerce', category: 'E-Commerce', image: 'https://picsum.photos/800/600?random=2', description: 'High-conversion streetwear store.' },
  { id: '3', title: 'Future Health', category: 'Mobile App', image: 'https://picsum.photos/800/600?random=3', description: 'Telemedicine platform for the future.' },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'CEO, TechFlow', content: 'Gradevo transformed our digital presence. The 3D integration is seamless.' },
  { id: '2', name: 'Marcus Chen', role: 'Founder, StartUp X', content: 'Pixel-perfect design and incredibly fast delivery. Highly recommended.' },
];

export const CONTENT = {
  heroTitle: 'Gra#Devo — Design. Develop. Deploy.',
  heroSubtitle: 'A full-stack creative agency blending design, engineering, and storytelling to help brands grow digitally.',
  servicesIntro: 'We build digital experiences that are fast, beautiful, and ready to scale.',
  contactCTA: 'Let’s build something extraordinary.',
};