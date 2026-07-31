import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * StatCard — Animated metric card with GSAP count-up.
 * 
 * @param {string} label - Metric name.
 * @param {number} value - Target numeric value.
 * @param {string} trend - e.g., "+12%" or "-3%"
 * @param {'up'|'down'} trendDirection
 * @param {React.ReactNode} icon
 * @param {string} iconColor - CSS class for icon bg color: orange, green, blue, red
 * @param {string} suffix - Optional suffix like "%", "ms", etc.
 */
export default function StatCard({ label, value, trend, trendDirection = 'up', icon, iconColor = 'orange', suffix = '' }) {
  const valueRef = useRef(null);
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !valueRef.current) return;
    hasAnimated.current = true;

    const target = { val: 0 };
    gsap.to(target, {
      val: value,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (valueRef.current) {
          valueRef.current.textContent = Math.round(target.val).toLocaleString() + suffix;
        }
      },
    });
  }, [value, suffix]);

  return (
    <div className="stat-card" ref={cardRef}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className={`stat-card-icon ${iconColor}`}>
          {icon}
        </div>
      </div>
      <span className="stat-card-value" ref={valueRef}>0{suffix}</span>
      {trend && (
        <span className={`stat-card-trend ${trendDirection}`}>
          {trendDirection === 'up' ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
  );
}
