import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/methodology', label: 'Methodology' },
    { path: '/your-news', label: 'Your News' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-background"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="font-heading font-bold text-xl">LE LABS</span>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 text-white"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-grow flex flex-col justify-center px-8">
              <ul className="space-y-6">
                {navItems.map((item, index) => (
                  <motion.li 
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive 
                          ? 'text-highlight font-heading text-3xl font-bold' 
                          : 'text-white font-heading text-3xl hover:text-highlight transition-colors'
                      }
                      onClick={onClose}
                      end={item.path === '/'}
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;