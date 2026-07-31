import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CursorSpotlight — Ambient radial background spotlight following the cursor on desktop devices.
 */
export default function CursorSpotlight() {
  const lightRef = useRef(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
    if (isMobile || !lightRef.current) return;

    const el = lightRef.current;

    const handleMouseMove = (e) => {
      gsap.to(el, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={lightRef}
      className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full z-0 opacity-40 blur-[100px]"
      style={{
        background: 'radial-gradient(circle, rgba(221,161,94,0.15) 0%, rgba(96,108,56,0.08) 50%, transparent 80%)',
        willChange: 'transform',
      }}
    />
  );
}
