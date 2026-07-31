import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const LOADER_STEPS = [
  'Connecting to server...',
  'Authenticating...',
  'Loading GIS layers...',
  'Synchronizing live feeds...',
  'Preparing dashboard...',
  'Ready.',
];

/**
 * CinematicLoader — Premium loading sequence with GSAP timeline.
 * Animates each step sequentially with a progress bar, then calls onComplete.
 */
export default function CinematicLoader({ onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const stepsRef = useRef([]);
  const progressRef = useRef(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShow(false);
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out overlay
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            setShow(false);
            onComplete?.();
          },
        });
      },
    });

    // Logo entrance
    tl.fromTo(logoRef.current,
      { scale: 0.5, opacity: 0, rotation: -10 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
    );

    // Animate each step
    LOADER_STEPS.forEach((_, i) => {
      const stepEl = stepsRef.current[i];
      if (!stepEl) return;

      const progress = ((i + 1) / LOADER_STEPS.length) * 100;
      const isLast = i === LOADER_STEPS.length - 1;

      tl.to(stepEl, {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out',
        onStart: () => {
          stepEl.classList.add('active');
          // Mark previous as completed
          if (i > 0) {
            stepsRef.current[i - 1]?.classList.remove('active');
            stepsRef.current[i - 1]?.classList.add('completed');
          }
        },
      });

      // Progress bar
      tl.to(progressRef.current, {
        width: `${progress}%`,
        duration: isLast ? 0.3 : 0.25,
        ease: 'power1.inOut',
      }, '<');

      // Delay between steps (shorter for last)
      if (!isLast) {
        tl.to({}, { duration: 0.3 });
      }
    });

    // Mark last step as completed
    tl.to({}, {
      duration: 0.3,
      onStart: () => {
        const lastStep = stepsRef.current[LOADER_STEPS.length - 1];
        lastStep?.classList.remove('active');
        lastStep?.classList.add('completed');
      },
    });

    return () => tl.kill();
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="loader-overlay" ref={overlayRef}>
      <div className="loader-logo" ref={logoRef} style={{ opacity: 0 }}>
        V
      </div>
      <div className="loader-steps">
        {LOADER_STEPS.map((step, i) => (
          <div
            key={i}
            className="loader-step"
            ref={(el) => (stepsRef.current[i] = el)}
          >
            <span className="loader-step-dot" />
            {step}
          </div>
        ))}
      </div>
      <div className="loader-progress">
        <div className="loader-progress-fill" ref={progressRef} />
      </div>
    </div>
  );
}
