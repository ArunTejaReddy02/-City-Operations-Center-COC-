import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Magnetic — Interactive wrapper component translating child position based on mouse proximity.
 */
export default function Magnetic({ children, strength = 0.35, radius = 200, className = '', ...props }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < radius) {
        gsap.to(el, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, radius]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
}
