import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu } from 'lucide-react';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  
  // Transform properties based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(13, 13, 13, 0)', 'rgba(13, 13, 13, 0.9)']
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(10px)']
  );
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/methodology', label: 'Methodology' },
    { path: '/your-news', label: 'Your News' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      className="fixed w-full top-0 z-50 px-4 md:px-6"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
      }}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <span className="font-heading font-bold text-xl">LE LABS</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    isActive 
                      ? 'text-highlight font-medium' 
                      : 'text-white hover:text-highlight transition-colors'
                  }
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
