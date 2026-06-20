import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring } from 'framer-motion';
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
  image?: string; // Optional image to show
  links?: React.ReactNode; // Links content to show
  size?: 'small' | 'medium' | 'large' | 'wide';
  onFlip?: () => void; // New callback for manual flip
}

// Three face types
type FaceType = 'details' | 'image' | 'links';

// Transition types (entrance)
type TransitionType = 'fade' | 'slide' | 'scale' | 'kaleidoscope' | 'rainbow' | 'slidingDoors' | 'zoom' | 'flip';

// Stable hash so per-tile choices (ambient effect, entrance) are deterministic.
const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const MetroTile: React.FC<MetroTileProps> = ({
  title,
  description,
  tileStyles,
  to,
  onClick,
  notification = false,
  children,
  image,
  links,
  size,
  onFlip,
}) => {
  const { preferences } = useUserPreferences();
  const reducedMotion = preferences.reducedMotion;
  const tileRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const flipButtonRef = useRef<HTMLButtonElement>(null);

  // Determine which faces are available
  const availableFaces = useMemo<FaceType[]>(() => {
    const faces: FaceType[] = ['details'];
    if (image) faces.push('image');
    if (links) faces.push('links');
    return faces;
  }, [image, links]);

  // Deterministic initial face (stable across renders, varied across tiles).
  const [currentFace, setCurrentFace] = useState<FaceType>(
    () => availableFaces[hashString(title) % availableFaces.length],
  );
  const [ambientColor, setAmbientColor] = useState<string>(tileStyles.background);

  // Entrance transition + always-on ambient effect, chosen deterministically per
  // tile (no re-randomization on every render). This "finishes" the previously
  // suspended effect classes by wiring a curated subset in for good.
  const transitionType = useMemo<TransitionType>(() => {
    if (reducedMotion) return 'fade';
    const all: TransitionType[] = ['fade', 'slide', 'scale', 'zoom', 'flip', 'kaleidoscope', 'rainbow', 'slidingDoors'];
    const forced = typeof localStorage !== 'undefined' ? localStorage.getItem('forceTransition') : null;
    if (forced && all.includes(forced as TransitionType)) return forced as TransitionType;
    return all[hashString(title + ':t') % all.length];
  }, [reducedMotion, title]);

  const ambientClass = useMemo(() => {
    if (reducedMotion) return '';
    // Curated, tasteful subset that layers well over the accent colours.
    const palette = ['', 'subtle-waves', 'flat-animated-overlay', 'tile-glow'];
    return palette[hashString(title + ':fx') % palette.length];
  }, [reducedMotion, title]);

  // --- Win8 "Metro" tilt: the tile leans in 3D toward the pointer -----------
  const tiltX = useSpring(0, { stiffness: 300, damping: 28, mass: 0.4 });
  const tiltY = useSpring(0, { stiffness: 300, damping: 28, mass: 0.4 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = tileRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 16);
    tiltX.set(-py * 16);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Update ambient color based on current face content
  useEffect(() => {
    let newColor = tileStyles.background;
    if (currentFace === 'image' && image) {
      newColor = adjustColorBrightness(tileStyles.background, 20);
    } else if (currentFace === 'links') {
      newColor = adjustColorBrightness(tileStyles.background, 15);
    }
    const subtleColor = adjustColorOpacity(newColor, 0.35);
    if (tileRef.current) {
      tileRef.current.style.setProperty('--ambient-color', subtleColor);
    }
    setAmbientColor(subtleColor);
  }, [currentFace, tileStyles.background, image]);

  // Helper to adjust color brightness
  const adjustColorBrightness = (color: string, amount: number): string => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
      const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
      const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } else if (color.startsWith('rgb')) {
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
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      if (!values || values.length < 3) return color;
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
    }
    return color;
  };

  // Periodically rotate tile if it has multiple faces (livelier than before).
  useEffect(() => {
    if (availableFaces.length <= 1 || reducedMotion) return;
    const flipInterval = Math.floor(Math.random() * 8000) + 8000; // 8–16s
    const intervalId = setInterval(() => {
      setCurrentFace((prev) => {
        if (prev === 'details') return image ? 'image' : 'links';
        if (prev === 'image') return links ? 'links' : 'details';
        return 'details';
      });
    }, flipInterval);
    return () => clearInterval(intervalId);
  }, [image, links, reducedMotion, availableFaces]);

  // Handle tile click (excluding the flip button click)
  const handleTileClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    if ((currentFace === 'details' || currentFace === 'image') && to) {
      return; // let the Link work
    }
    e.preventDefault();
  };

  // Get the next face in the rotation
  const getNextFace = (current: FaceType): FaceType => {
    if (image && links) {
      if (current === 'details') return 'image';
      if (current === 'image') return 'links';
      return 'details';
    }
    if (image && !links) return current === 'details' ? 'image' : 'details';
    if (links && !image) return current === 'details' ? 'links' : 'details';
    return 'details';
  };

  // Handle flip button click
  const handleFlipButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFlip) {
      onFlip();
    } else {
      setCurrentFace(getNextFace(currentFace));
    }
  };

  // Tile heights per size (driven by the grid in the parent for width).
  const sizeClasses = {
    small: 'h-68 md:h-68',
    medium: 'h-68 md:h-68',
    large: 'h-100 md:h-100',
    wide: 'h-56 md:h-56',
  };

  // Entrance animation variants
  const getVariants = () => {
    const hoverTapAnimations = {
      hover: { scale: 1.015, transition: { duration: 0.3 } },
      tap: { scale: 0.97, transition: { duration: 0.1 } },
    };
    switch (transitionType) {
      case 'slide':
        return { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 20 } }, ...hoverTapAnimations };
      case 'scale':
        return { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } }, ...hoverTapAnimations };
      case 'kaleidoscope':
        return { initial: { rotate: -10, scale: 0.9, opacity: 0 }, animate: { rotate: 0, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } }, ...hoverTapAnimations };
      case 'rainbow':
        return { initial: { opacity: 0, filter: 'hue-rotate(0deg) brightness(1.2)' }, animate: { opacity: 1, filter: ['hue-rotate(0deg) brightness(1.2)', 'hue-rotate(180deg) brightness(1)', 'hue-rotate(360deg) brightness(1.2)'], transition: { filter: { duration: 1.2, times: [0, 0.5, 1] }, opacity: { duration: 0.5 } } }, ...hoverTapAnimations };
      case 'slidingDoors':
        return { initial: { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }, animate: { opacity: 1, clipPath: ['polygon(0 0, 0 0, 0 100%, 0% 100%)', 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'], transition: { clipPath: { duration: 1.2, times: [0, 0.5, 1], ease: 'easeInOut' }, opacity: { duration: 0.5 } } }, ...hoverTapAnimations };
      case 'zoom':
        return { initial: { scale: 1.5, opacity: 0, filter: 'blur(10px)' }, animate: { scale: 1, opacity: 1, filter: 'blur(0px)', transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }, ...hoverTapAnimations };
      case 'flip':
        return { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0, transition: { duration: 0.8, ease: 'easeOut' } }, ...hoverTapAnimations };
      case 'fade':
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.8 } }, ...hoverTapAnimations };
    }
  };

  // Notification animation
  const notificationVariants = {
    initial: { opacity: 0 },
    animate: { opacity: [0, 1, 0.8, 1], transition: { repeat: Infinity, repeatType: 'reverse' as const, duration: 3 } },
  };

  // Vertical "live tile" flip between faces.
  const getFaceAnimation = (face: FaceType): React.CSSProperties => {
    const isActive = currentFace === face;
    return {
      opacity: isActive ? 1 : 0,
      transform: `rotateX(${isActive ? '0deg' : '-90deg'})`,
      transformOrigin: 'center top',
      zIndex: isActive ? 10 : 0,
      transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      pointerEvents: isActive ? 'auto' : 'none',
    };
  };

  const renderDetailsFace = () => (
    <div className="p-5 h-full flex flex-col justify-between relative backface-hidden preserve-3d" style={getFaceAnimation('details')}>
      {notification && (
        <motion.div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-error" variants={notificationVariants} initial="initial" animate="animate" />
      )}
      <div>
        <h3 className="metro-tile-headline mb-2">{title}</h3>
        {description && <p className="text-sm md:text-base opacity-90">{description}</p>}
      </div>
      {children}
    </div>
  );

  const renderImageFace = () => (
    <div className="absolute inset-0 w-full h-full backface-hidden preserve-3d" style={getFaceAnimation('image')}>
      {image && (
        <>
          <img ref={imageRef} src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4">
            <div className="flex justify-start">
              <h3 className="text-white font-bold metro-tile-headline">{title}</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderLinksFace = () => (
    <div className="p-5 h-full flex flex-col justify-center items-center backface-hidden preserve-3d" style={getFaceAnimation('links')}>
      <div className="text-center mb-4">
        <h3 className="metro-tile-headline mb-2">{title}</h3>
      </div>
      {links}
    </div>
  );

  const getAmbientShadowStyle = () =>
    ({ '--ambient-color': ambientColor, transition: 'box-shadow 1.2s ease, background-color 0.8s ease' } as React.CSSProperties);

  const renderTileContent = () => (
    <motion.div
      ref={tileRef}
      className={`metro-tile metro-shine ambient-light-tile w-full ${sizeClasses[size || 'large']} cursor-pointer ${ambientClass} perspective-1000 relative`}
      style={{ backgroundColor: tileStyles.background, color: tileStyles.color, ...getAmbientShadowStyle() }}
      variants={getVariants()}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={handleTileClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      {/* Inner layer carries the pointer tilt so it composes with the entrance/hover. */}
      <motion.div className="absolute inset-0 preserve-3d" style={{ rotateX: tiltX, rotateY: tiltY }}>
        {renderDetailsFace()}
        {image && renderImageFace()}
        {links && renderLinksFace()}

        {(image || links) && (
          <button
            ref={flipButtonRef}
            onClick={handleFlipButtonClick}
            className="absolute top-3 right-3 z-50 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1.5 transition-colors"
            aria-label="Rotate tile view"
            style={{ pointerEvents: 'auto' }}
          >
            <RotateCw size={16} className="text-current" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );

  if (to && (currentFace === 'details' || currentFace === 'image')) {
    return <Link to={to}>{renderTileContent()}</Link>;
  }
  return renderTileContent();
};

export default MetroTile;
