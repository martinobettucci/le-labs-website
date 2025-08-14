import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MethodologyPage from './pages/MethodologyPage';
import YourNewsPage from './pages/YourNewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import BillingSuccessPage from './pages/BillingSuccessPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import NotificationsPanel from './components/notifications/NotificationsPanel';

// Page transition component
import PageTransition from './components/transitions/PageTransition';

function App() {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize smooth scrolling
  useEffect(() => {
    if (!lenisRef.current) {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        // smoothTouch: false,
      });
      
      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }
      
      requestAnimationFrame(raf);
    }
    
    // Reset scroll position on page change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <NotificationsPanel />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
            <Route path="projects/:slug" element={<PageTransition><ProjectDetailPage /></PageTransition>} />
            <Route path="methodology" element={<PageTransition><MethodologyPage /></PageTransition>} />
            <Route path="your-news" element={<PageTransition><YourNewsPage /></PageTransition>} />
            <Route path="about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="account" element={<PageTransition><AccountPage /></PageTransition>} />
            <Route path="billing/success" element={<PageTransition><BillingSuccessPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
