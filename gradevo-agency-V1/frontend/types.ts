export enum PageRoutes {
  HOME = '/',
  ABOUT = '/about',
  SERVICES = '/services',
  PORTFOLIO = '/portfolio',
  CONTACT = '/contact',
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
}