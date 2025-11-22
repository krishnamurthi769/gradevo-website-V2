import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/ui/CustomCursor';
import DotGridBackground from './components/ui/DotGridBackground';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import ServiceManager from './pages/admin/ServiceManager';
import PortfolioManager from './pages/admin/PortfolioManager';
import TestimonialManager from './pages/admin/TestimonialManager';
import ContactManager from './pages/admin/ContactManager';
import DnaManager from './pages/admin/DnaManager';
import StoryManager from './pages/admin/StoryManager';
import LegalManager from './pages/admin/LegalManager';
import LogoManager from './pages/admin/LogoManager';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

const ConditionalNavbar = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <Navbar />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ConditionalFooter = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <Footer />;
};

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      <DotGridBackground />
      <SmoothScroll>
        <div className="bg-gradevo-navy min-h-screen text-gradevo-white font-sans selection:bg-gradevo-red selection:text-white relative">
          <ConditionalNavbar />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/services" element={<ServiceManager />} />
                  <Route path="/admin/portfolio" element={<PortfolioManager />} />
                  <Route path="/admin/testimonials" element={<TestimonialManager />} />
                  <Route path="/admin/contact" element={<ContactManager />} />
                  <Route path="/admin/dna" element={<DnaManager />} />
                  <Route path="/admin/story" element={<StoryManager />} /> {/* Added StoryManager route */}
                  <Route path="/admin/legal" element={<LegalManager />} />
                  <Route path="/admin/logo" element={<LogoManager />} />
                  {/* Add other admin routes here later */}
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ConditionalFooter />
        </div>
      </SmoothScroll>
    </>
  );
};


export default App;
