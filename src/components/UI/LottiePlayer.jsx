import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

/**
 * LottiePlayer — Renders Lottie animation files from /lottie directory.
 */
export default function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      path: src,
    });

    return () => {
      animRef.current?.destroy();
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
}
