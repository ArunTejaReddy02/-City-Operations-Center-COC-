import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Menu, X } from 'lucide-react';
import Magnetic from '../Effects/Magnetic';
import { PrimaryButton, SecondaryButton } from '../UI/Buttons';

export default function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false); // Hide on scroll down
      } else {
        setVisible(true); // Reveal on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-[#fefae0]/85 backdrop-blur-md border border-[#d4cc9a]/60 shadow-lg shadow-[#283618]/5'
              : 'bg-transparent'
          }`}
        >
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dda15e] to-[#bc6c25] flex items-center justify-center text-[#fefae0] font-bold text-lg shadow-md shadow-[#bc6c25]/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#283618] leading-none tracking-tight">
                Vizag<span className="text-[#dda15e]">Ops</span>
              </span>
              <span className="text-[10px] text-[#606c38] font-semibold tracking-widest uppercase mt-0.5">
                GVMC Unified Ops
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#606c38]">
            <a href="#workflow" className="hover:text-[#283618] transition-colors relative group py-1">
              Workflow
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#dda15e] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#features" className="hover:text-[#283618] transition-colors relative group py-1">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#dda15e] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#live-preview" className="hover:text-[#283618] transition-colors relative group py-1">
              Live Command
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#dda15e] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#gis-map" className="hover:text-[#283618] transition-colors relative group py-1">
              GIS Matrix
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#dda15e] group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          {/* CTA Actions */}
          <div className="hidden md:flex items-center gap-3">
            <SecondaryButton
              onClick={() => navigate('/login')}
              className="!py-2 !px-4 !text-xs"
            >
              Sign In
            </SecondaryButton>
            <Magnetic strength={0.2} radius={120}>
              <PrimaryButton
                onClick={onGetStarted}
                className="!py-2 !px-5 !text-xs !rounded-full shadow-md"
              >
                Get Started <ArrowRight size={14} />
              </PrimaryButton>
            </Magnetic>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#283618]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-6 rounded-3xl bg-[#fefae0]/95 backdrop-blur-xl border border-[#d4cc9a] shadow-xl flex flex-col gap-4">
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#283618]"
            >
              Workflow
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#283618]"
            >
              Features
            </a>
            <a
              href="#live-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#283618]"
            >
              Live Command
            </a>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#d4cc9a]/40">
              <SecondaryButton onClick={() => navigate('/login')} className="w-full justify-center">
                Sign In
              </SecondaryButton>
              <PrimaryButton onClick={onGetStarted} className="w-full justify-center">
                Get Started
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
