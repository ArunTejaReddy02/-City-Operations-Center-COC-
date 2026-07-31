import { useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * PrimaryButton — Standard action button with gradient and ripple effect.
 */
export function PrimaryButton({ children, onClick, disabled, className = '', ...props }) {
  const rippleRef = useRef(null);

  const handleClick = useCallback((e) => {
    if (disabled) return;
    // Ripple effect
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.5;

    const circle = document.createElement('span');
    circle.className = 'btn-ripple-circle';
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    rippleRef.current?.appendChild(circle);

    gsap.to(circle, {
      width: size,
      height: size,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => circle.remove(),
    });

    onClick?.(e);
  }, [onClick, disabled]);

  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      <span className="btn-ripple" ref={rippleRef} />
      <span className="btn-content">{children}</span>
    </button>
  );
}

/**
 * DispatchButton — Used for team assignment/dispatch actions with confirmation state.
 */
export function DispatchButton({ children, onClick, confirming = false, disabled, className = '', ...props }) {
  const rippleRef = useRef(null);

  const handleClick = useCallback((e) => {
    if (disabled) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.5;

    const circle = document.createElement('span');
    circle.className = 'btn-ripple-circle';
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    rippleRef.current?.appendChild(circle);

    gsap.to(circle, {
      width: size,
      height: size,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => circle.remove(),
    });

    onClick?.(e);
  }, [onClick, disabled]);

  return (
    <button
      className={`btn btn-dispatch ${confirming ? 'confirming' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      <span className="btn-ripple" ref={rippleRef} />
      <span className="btn-content">{children}</span>
    </button>
  );
}

/**
 * StatusButton — Toggles field team status (Available, En Route, On-Site, Done).
 */
export function StatusButton({ children, status, active = false, onClick, className = '', ...props }) {
  const statusClass = status ? `status-${status.toLowerCase().replace(/\s+/g, '-')}` : '';
  return (
    <button
      className={`btn btn-status ${statusClass} ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="btn-content">{children}</span>
    </button>
  );
}

/**
 * IconButton — Compact button for map controls and secondary actions.
 */
export function IconButton({ icon: Icon, onClick, active = false, label, className = '', ...props }) {
  return (
    <button
      className={`btn btn-icon ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      {...props}
    >
      {Icon && <Icon size={18} />}
    </button>
  );
}

/**
 * FloatingActionButton — Fixed position FAB for quick actions.
 */
export function FloatingActionButton({ icon: Icon, onClick, label, className = '', ...props }) {
  return (
    <button
      className={`btn btn-fab ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      {...props}
    >
      {Icon && <Icon size={24} />}
    </button>
  );
}

/**
 * SecondaryButton — Outlined button for non-primary actions.
 */
export function SecondaryButton({ children, onClick, disabled, className = '', ...props }) {
  return (
    <button
      className={`btn btn-secondary ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="btn-content">{children}</span>
    </button>
  );
}

/**
 * GhostButton — Minimal button for inline actions.
 */
export function GhostButton({ children, onClick, className = '', ...props }) {
  return (
    <button
      className={`btn btn-ghost ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="btn-content">{children}</span>
    </button>
  );
}
