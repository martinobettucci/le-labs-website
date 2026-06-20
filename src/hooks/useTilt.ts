import { useSpring } from 'framer-motion';
import type { PointerEvent } from 'react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

/**
 * Windows-8 "Metro" tilt: returns spring-damped rotateX/rotateY motion values
 * plus pointer handlers that lean an element in 3D toward the cursor. Respects
 * the user's reduced-motion preference (stays flat).
 *
 * Usage: spread the handlers on the perspective parent and bind the motion
 * values to a child's `style={{ rotateX, rotateY }}` (with a perspective set).
 */
export function useTilt(max = 16) {
  const { preferences } = useUserPreferences();
  const reduced = preferences.reducedMotion;

  const rotateX = useSpring(0, { stiffness: 300, damping: 28, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 28, mass: 0.4 });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * max);
    rotateX.set(-py * max);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { rotateX, rotateY, onPointerMove, onPointerLeave, reduced };
}
