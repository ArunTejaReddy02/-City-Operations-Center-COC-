import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowRight, ChevronDown, Shield, Sparkles, Activity } from 'lucide-react';
import Magnetic from '../Effects/Magnetic';
import { PrimaryButton, SecondaryButton } from '../UI/Buttons';

export default function HeroSection({ onGetStarted }) {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Badge entrance
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      );

      // 2. Headline word reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { opacity: 0, y: 40, rotationX: -20 },
          { opacity: 1, y: 0, rotationX: 0, stagger: 0.08, duration: 0.7, ease: 'back.out(1.4)' },
          '-=0.3'
        );
      }

      // 3. Subtitle fade up
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );

      // 4. CTA buttons spring entrance
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
        '-=0.2'
      );

      // 5. Scroll indicator
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-[#fefae0] via-[#faf5d0] to-[#f5efc0]"
    >
      {/* Background Aurora Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#dda15e]/25 via-[#606c38]/15 to-[#bc6c25]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#d4cc9a 1px, transparent 1px),
            linear-gradient(90deg, #d4cc9a 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Badge Pill */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#fefae0] border border-[#d4cc9a] shadow-sm mb-8"
        >
          <Sparkles size={14} className="text-[#dda15e]" />
          <span className="text-xs font-semibold text-[#283618]">
            Next-Gen GVMC Command Center Pilot
          </span>
          <span className="w-2 h-2 rounded-full bg-[#606c38] animate-pulse" />
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#283618] tracking-tight leading-[1.1] mb-8 font-sans"
        >
          <span className="inline-block word">Real-Time</span>{' '}
          <span className="inline-block word">Civic</span>{' '}
          <span className="inline-block word">Operations,</span>{' '}
          <br className="hidden sm:inline" />
          <span className="inline-block word bg-gradient-to-r from-[#dda15e] via-[#bc6c25] to-[#606c38] bg-clip-text text-transparent">
            Unified & Intelligent.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-xl text-[#606c38] max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Connecting citizen grievances, COC sensor pings, and field crew telemetry into a single 60 FPS real-time dispatch dashboard.
        </p>

        {/* Hero CTA & Quick Action */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <Magnetic strength={0.25} radius={140}>
            <PrimaryButton
              onClick={onGetStarted}
              className="!py-4 !px-8 !text-base !rounded-full shadow-xl shadow-[#bc6c25]/25"
            >
              Get Started <ArrowRight size={18} />
            </PrimaryButton>
          </Magnetic>
          <SecondaryButton
            onClick={() => {
              document.getElementById('live-preview')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="!py-4 !px-7 !text-base !rounded-full"
          >
            Explore Command Matrix
          </SecondaryButton>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8a9460] cursor-pointer"
        onClick={() => {
          document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[11px] font-semibold tracking-widest uppercase">Scroll to explore</span>
        <ChevronDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}
