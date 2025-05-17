import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TileStyles } from '../../types/data';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { RotateCw } from 'lucide-react';

interface MetroTileProps {
  title: string;
  description?: string;
  tileStyles: TileStyles;
  to?: string;
  onClick?: () => void;
  notification?: boolean;
  children?: React.ReactNode;
  backContent?: React.ReactNode; // Content for the back of the tile
  image?: string; // Optional image to show
  links?: React.ReactNode; // Links content to show
  onFlip?: () => void; // New callback for manual flip
}

// Three face types
type FaceType = 'details' | 'image' | 'links';

// Transition types
type TransitionType = 'fade' | 'slide' | 'scale' | 'kaleidoscope' | 'rainbow' | 'obturator' | 'slidingDoors' | 'zoom' | 'flip';

const MetroTile: React.FC<MetroTileProps> = ({
  title,
  description,
  tileStyles,
  to,
  onClick,
  notification = false,
  children,
  backContent,
  image,
  links,
  onFlip
}) => {
  const { preferences } = useUserPreferences();
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');
  const reducedMotion = preferences.reducedMotion;
  const tileRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const flipButtonRef = useRef<HTMLButtonElement>(null);
  
  // Determine which faces are available
  const availableFaces: FaceType[] = ['details'];
  if (image) availableFaces.push('image');
  if (links) availableFaces.push('links');
  
  // Select a random initial face from available options
  const getRandomInitialFace = (): FaceType => {
    // If there's only one face available, use that
    if (availableFaces.length === 1) return 'details';
    
    // Otherwise, randomly select one of the available faces
    const randomIndex = Math.floor(Math.random() * availableFaces.length);
    return availableFaces[randomIndex];
  };
  
  // Initialize with a random face
  const [currentFace, setCurrentFace] = useState<FaceType>(getRandomInitialFace());
  const [ambientColor, setAmbientColor] = useState<string>(tileStyles.background);
  
  // Update ambient color based on current face content
  useEffect(() => {
    // Default to the tile's background color
    let newColor = tileStyles.background;
    
    // Different color for different faces
    if (currentFace === 'image' && image) {
      // Use a more vibrant version of the tile's background when showing an image
      newColor = adjustColorBrightness(tileStyles.background, 20);
    } else if (currentFace === 'links') {
      // For links, use a slight variation of the background
      newColor = adjustColorBrightness(tileStyles.background, 15);
    }
    
    // Adjust opacity to make it more visible but still subtle
    const subtleColor = adjustColorOpacity(newColor, 0.35);
    
    // Update CSS variable for the ambient color
    if (tileRef.current) {
      tileRef.current.style.setProperty('--ambient-color', subtleColor);
    }
    
    setAmbientColor(subtleColor);
  }, [currentFace, tileStyles.background, image]);
  
  // Helper to adjust color brightness
  const adjustColorBrightness = (color: string, amount: number): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
      const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
      const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    // Handle rgb/rgba colors
    else if (color.startsWith('rgb')) {
      // Extract just the numbers
      const values = color.match(/\d+/g);
      if (!values || values.length < 3) return color;
      const r = Math.min(255, parseInt(values[0]) + amount);
      const g = Math.min(255, parseInt(values[1]) + amount);
      const b = Math.min(255, parseInt(values[2]) + amount);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  };
  
  // Helper to adjust color opacity
  const adjustColorOpacity = (color: string, opacity: number): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // Handle rgb/rgba colors
    else if (color.startsWith('rgb')) {
      // Extract just the numbers
      const values = color.match(/\d+/g);
      if (!values || values.length < 3) return color;
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
    }
    return color;
  };
  
  // Periodically rotate tile if it has multiple faces
  useEffect(() => {
    if (availableFaces.length <= 1 || reducedMotion) return;
    
    // Random interval between 15-30 seconds
    const flipInterval = Math.floor(Math.random() * 15000) + 15000;
    
    const intervalId = setInterval(() => {
      // Cycle through the three faces
      setCurrentFace(prev => {
        if (prev === 'details') return image ? 'image' : 'links';
        if (prev === 'image') return links ? 'links' : 'details';
        return 'details';
      });
    }, flipInterval);
    
    return () => clearInterval(intervalId);
  }, [image, links, reducedMotion, availableFaces]);
  
  // Determine a random transition type when component mounts
  useEffect(() => {
    if (reducedMotion) {
      setTransitionType('fade');
      return;
    }
    
    // Fixed: Exclude potentially problematic transition types for first tile
    // This prevents the obturator effect from causing excessive zoom
    const safeTransitions: TransitionType[] = [
      'fade', 'slide', 'scale', 'zoom', 'flip'
    ];
    
    // For other tiles, use the full range of transitions
    const allTransitions: TransitionType[] = [
      ...safeTransitions,
      'kaleidoscope', 'rainbow', 'obturator', 'slidingDoors'
    ];
    
    // Use a unique property (like title or tileStyles) to determine if this is the first tile
    // First tile typically has a specific background color or is featured
    const isFirstTile = tileStyles.size === 'large' && tileStyles.background === '#23468C';
    
    // Choose from safe transitions for the first tile, all transitions for others
    const availableTransitions = isFirstTile ? safeTransitions : allTransitions;
    
    const randomIndex = Math.floor(Math.random() * availableTransitions.length);
    setTransitionType(availableTransitions[randomIndex]);
  }, [reducedMotion, tileStyles]);
  
  // Handle tile click (excluding the flip button click)
  const handleTileClick = (e: React.MouseEvent) => {
    // If we have a custom click handler, call it
    if (onClick) {
      onClick();
      return;
    }
    
    // If the tile is showing details or image and has a link, let the link work
    if ((currentFace === 'details' || currentFace === 'image') && to) {
      // Let default link behavior work
      return;
    }
    
    // For other states (links face), prevent default and handle rotation
    e.preventDefault();
  };
  
  // Get the next face in the rotation
  const getNextFace = (current: FaceType): FaceType => {
    // If we have image and links, cycle through all three
    if (image && links) {
      if (current === 'details') return 'image';
      if (current === 'image') return 'links';
      return 'details';
    }
    
    // If we have just image, toggle between details and image
    if (image && !links) {
      return current === 'details' ? 'image' : 'details';
    }
    
    // If we have just links, toggle between details and links
    if (links && !image) {
      return current === 'details' ? 'links' : 'details';
    }
    
    // If we have neither, stay on details
    return 'details';
  };
  
  // Handle flip button click
  const handleFlipButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Prevent the tile click from firing
    
    // Cycle to the next face
    if (onFlip) {
      // If there's a custom flip handler, use it
      onFlip();
    } else {
      // Otherwise cycle through faces using the helper method
      const nextFace = getNextFace(currentFace);
      setCurrentFace(nextFace);
    }
  };
  
  // Determine tile size class
  const sizeClasses = {
    small: 'h-40 md:h-48',
    medium: 'h-60 md:h-68',
    large: 'h-80 md:h-100',
    wide: 'h-48 md:h-56 md:col-span-2 lg:col-span-3',
  };
  
  // Get transition-specific animation variants
  const getVariants = () => {
    // Base animation for hover and tap - FIXED: reduced hover scale to prevent excessive growth
    const hoverTapAnimations = {
      hover: { 
        scale: transitionType === 'obturator' ? 1.01 : 1.02, // Even smaller scale for obturator transition
        transition: { duration: 0.3 }
      },
      tap: { 
        scale: 0.98,
        transition: { duration: 0.1 }
      }
    };
    
    switch (transitionType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { duration: 0.8 }
          },
          ...hoverTapAnimations
        };
      case 'slide':
        return {
          initial: { x: -100, opacity: 0 },
          animate: { 
            x: 0, 
            opacity: 1,
            transition: { 
              type: 'spring',
              stiffness: 80,
              damping: 20
            }
          },
          ...hoverTapAnimations
        };
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: { 
              type: 'spring',
              stiffness: 200,
              damping: 25
            }
          },
          ...hoverTapAnimations
        };
      case 'kaleidoscope':
        return {
          initial: { rotate: -10, scale: 0.9, opacity: 0 },
          animate: { 
            rotate: 0, 
            scale: 1, 
            opacity: 1,
            transition: { 
              type: 'spring',
              stiffness: 150,
              damping: 20
            }
          },
          ...hoverTapAnimations
        };
      case 'rainbow':
        return {
          initial: { 
            opacity: 0,
            filter: 'hue-rotate(0deg) brightness(1.2)'
          },
          animate: { 
            opacity: 1,
            filter: [
              'hue-rotate(0deg) brightness(1.2)',
              'hue-rotate(90deg) brightness(1.1)',
              'hue-rotate(180deg) brightness(1)',
              'hue-rotate(270deg) brightness(1.1)',
              'hue-rotate(360deg) brightness(1.2)',
            ],
            transition: { 
              filter: {
                duration: 1.2,
                times: [0, 0.25, 0.5, 0.75, 1]
              },
              opacity: { duration: 0.5 }
            }
          },
          ...hoverTapAnimations
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
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1]
              },
              opacity: { duration: 0.5 }
            }
          },
          // Fixed: Custom hover animation for obturator to limit scale
          hover: {
            scale: 1.01, // Much smaller scale for obturator effect
            transition: { duration: 0.3 }
          },
          tap: { 
            scale: 0.98,
            transition: { duration: 0.1 }
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
            clipPath: [
              'polygon(0 0, 0 0, 0 100%, 0% 100%)',
              'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            ],
            transition: { 
              clipPath: {
                duration: 1.2,
                times: [0, 0.5, 1],
                ease: 'easeInOut'
              },
              opacity: { duration: 0.5 }
            }
          },
          ...hoverTapAnimations
        };
      case 'zoom':
        return {
          initial: { 
            scale: 1.5,
            opacity: 0,
            filter: 'blur(10px)'
          },
          animate: { 
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            transition: { 
              duration: 1.0,
              ease: [0.16, 1, 0.3, 1]
            }
          },
          ...hoverTapAnimations
        };
      case 'flip':
        return {
          initial: { 
            opacity: 0,
            rotateY: 90
          },
          animate: { 
            opacity: 1,
            rotateY: 0,
            transition: { 
              duration: 0.8,
              ease: 'easeOut'
            }
          },
          ...hoverTapAnimations
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.8 } },
          ...hoverTapAnimations
        };
    }
  };
  
  // Notification animation
  const notificationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0.8, 1],
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 3
      }
    }
  };
  
  // Get animation class based on transition type
  const getAnimationClass = () => {
    switch (transitionType) {
      case 'rainbow':
        return 'rainbow-doors';
      case 'kaleidoscope':
        return 'kaleidoscope-bg';
      case 'obturator':
        return 'obturator-open';
      default:
        return '';
    }
  };
  
  // Animation for face transitions
  const getFaceAnimation = (face: FaceType) => {
    const isActive = currentFace === face;
    
    return {
      opacity: isActive ? 1 : 0,
      transform: `rotateY(${isActive ? '0deg' : '180deg'})`,
      zIndex: isActive ? 10 : 0,
      transition: 'opacity 0.8s ease, transform 0.8s ease',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      pointerEvents: isActive ? 'auto' : 'none', // Only allow interaction with active face
    } as React.CSSProperties;
  };
  
  // Render the details face (default content)
  const renderDetailsFace = () => (
    <div 
      className="p-5 h-full flex flex-col justify-between relative backface-hidden preserve-3d"
      style={getFaceAnimation('details')}
    >
      {notification && (
        <motion.div
          className="absolute top-3 right-3 w-3 h-3 rounded-full bg-error"
          variants={notificationVariants}
          initial="initial"
          animate="animate"
        />
      )}
      
      <div>
        <h3 className="metro-tile-headline mb-2">{title}</h3>
        {description && (
          <p className="text-sm md:text-base opacity-90">{description}</p>
        )}
      </div>
      
      {children}
    </div>
  );
  
  // Render the image face
  const renderImageFace = () => (
    <div 
      className="absolute inset-0 w-full h-full backface-hidden preserve-3d"
      style={getFaceAnimation('image')}
    >
      {image && (
        <>
          <img 
            ref={imageRef}
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            onLoad={() => {
              // When image loads, we could potentially extract its dominant color
              // But for now we'll use the tile's background with adjusted opacity
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4">
            <div className="flex justify-start">
              <h3 className="text-white font-bold metro-tile-headline">{title}</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  // Render the links face
  const renderLinksFace = () => (
    <div 
      className="p-5 h-full flex flex-col justify-center items-center backface-hidden preserve-3d"
      style={getFaceAnimation('links')}
    >
      <div className="text-center mb-4">
        <h3 className="metro-tile-headline mb-2">{title}</h3>
        <p className="text-sm font-medium">Project Links</p>
      </div>
      
      {links}
    </div>
  );
  
  // Generate the ambient lighting shadow style
  const getAmbientShadowStyle = () => {
    return {
      // Using CSS variables allows for smoother transitions
      '--ambient-color': ambientColor,
      transition: 'box-shadow 1.2s ease, background-color 0.8s ease'
    } as React.CSSProperties;
  };
  
  // Create element based on current face and props
  const renderTileContent = () => {
    return (
      <motion.div
        ref={tileRef}
        className={`metro-tile ambient-light-tile ${sizeClasses[tileStyles.size]} w-full cursor-pointer ${getAnimationClass()} perspective-1000 relative`}
        style={{ 
          backgroundColor: tileStyles.background, 
          color: tileStyles.color,
          ...getAmbientShadowStyle()
        }}
        variants={getVariants()}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={handleTileClick}
      >
        {/* Three faces of the tile */}
        {renderDetailsFace()}
        {image && renderImageFace()}
        {links && renderLinksFace()}
        
        {/* Manual rotation button - rendered last to ensure it's on top of all faces */}
        {(image || links) && (
          <button 
            ref={flipButtonRef}
            onClick={handleFlipButtonClick}
            className="absolute top-3 right-3 z-50 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1.5 transition-colors"
            aria-label="Rotate tile view"
            style={{ pointerEvents: 'auto' }} // Ensure clicks are registered
          >
            <RotateCw size={16} className="text-current" />
          </button>
        )}
      </motion.div>
    );
  };
  
  // If in details face or image face and has a link, wrap in Link component
  if (to && (currentFace === 'details' || currentFace === 'image')) {
    return <Link to={to}>{renderTileContent()}</Link>;
  }
  
  // Otherwise render without Link wrapper
  return renderTileContent();
};

export default MetroTile;