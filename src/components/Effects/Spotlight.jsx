import { useRef, useCallback } from 'react';

/**
 * Spotlight — Mouse-follow lighting card container.
 */
export default function Spotlight({ children, className = '', spotlightColor = 'rgba(221, 161, 94, 0.15)', ...props }) {
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden group ${className}`}
      style={{
        '--spotlight-color': spotlightColor,
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--spotlight-color), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
