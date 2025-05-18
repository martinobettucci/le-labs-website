import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

type TransitionType = 'fade' | 'slide' | 'scale' | 'zoom' | 'obturator' | 'slidingDoors';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const { preferences } = useUserPreferences();
  const reducedMotion = preferences.reducedMotion;
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Determine a random transition type when location changes
  useEffect(() => {
    if (reducedMotion) {
      setTransitionType('fade');
      return;
    }
    
    const transitions: TransitionType[] = [
      'fade', 'slide', 'scale', 'zoom', 'obturator', 'slidingDoors'
      // Removed more extreme transitions like kaleidoscope, rainbow and flip
      // for page transitions to keep things more usable
    ];
    const randomIndex = Math.floor(Math.random() * transitions.length);
    setTransitionType(transitions[randomIndex]);
  }, [location.pathname, reducedMotion]);
  
  // Get transition-specific animation variants
  const getVariants = () => {
    switch (transitionType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { duration: 0.6, ease: 'easeInOut' }
          },
          exit: { 
            opacity: 0,
            transition: { duration: 0.4, ease: 'easeInOut' }
          }
        };
      case 'slide':
        return {
          initial: { x: '-5%', opacity: 0 },
          animate: { 
            x: 0, 
            opacity: 1,
            transition: { 
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1.0]
            }
          },
          exit: { 
            x: '5%', 
            opacity: 0,
            transition: { duration: 0.4, ease: 'easeInOut' }
          }
        };
      case 'scale':
        return {
          initial: { 
            scale: 0.98, 
            opacity: 0,
            transformOrigin: 'center'
          },
          animate: { 
            scale: 1, 
            opacity: 1,
            transformOrigin: 'center',
            transition: { 
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1.0]
            }
          },
          exit: { 
            scale: 0.98, 
            opacity: 0,
            transformOrigin: 'center',
            transition: { duration: 0.4, ease: 'easeInOut' }
          }
        };
      case 'obturator':
        return {
          initial: { 
            opacity: 0,
            clipPath: 'circle(0% at center)'
          },
          animate: { 
            opacity: 1,
            clipPath: 'circle(150% at center)',
            transition: { 
              clipPath: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              },
              opacity: { duration: 0.5 }
            }
          },
          exit: { 
            opacity: 0,
            clipPath: 'circle(0% at center)',
            transition: { 
              clipPath: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              },
              opacity: { duration: 0.3 }
            }
          }
        };
      case 'slidingDoors':
        return {
          initial: { 
            opacity: 0,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
          },
          animate: { 
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transition: { 
              clipPath: {
                duration: 0.8,
                ease: 'easeInOut'
              },
              opacity: { duration: 0.5 }
            }
          },
          exit: { 
            opacity: 0,
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            transition: { 
              clipPath: {
                duration: 0.4,
                ease: 'easeInOut'
              },
              opacity: { duration: 0.3 }
            }
          }
        };
      case 'zoom':
        return {
          initial: { 
            scale: 1.02,
            opacity: 0,
            transformOrigin: 'center',
            filter: 'blur(2px)'
          },
          animate: { 
            scale: 1,
            opacity: 1,
            transformOrigin: 'center',
            filter: 'blur(0px)',
            transition: { 
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1]
            }
          },
          exit: { 
            scale: 0.98,
            opacity: 0,
            transformOrigin: 'center',
            filter: 'blur(2px)',
            transition: { 
              duration: 0.4,
              ease: 'easeInOut'
            }
          }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.6 } },
          exit: { opacity: 0, transition: { duration: 0.4 } }
        };
    }
  };

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getVariants()}
      className="page-transition"
      data-motion-state={isAnimating ? "animating" : "static"}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
