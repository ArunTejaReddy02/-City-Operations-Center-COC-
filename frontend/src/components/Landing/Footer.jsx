import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  ExternalLink,
  Shield,
  Activity,
  MapPin,
  ArrowUp,
} from 'lucide-react';

export default function Footer({ onGetStarted }) {
  const navigate = useNavigate();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#18181b] text-[#a1a1aa] py-16 px-6 sm:px-12 selection:bg-[#dda15e]/30 overflow-hidden">
      {/* Decorative background gradient glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#dda15e]/3 blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#606c38]/3 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Identity Column (Col Span 4) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bc6c25] to-[#dda15e] flex items-center justify-center shadow-md">
                <MapPin className="text-white w-4.5 h-4.5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#f4f4f5]">
                VizagOps Unify
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Unified Civic Command & Operations Control platform for the Visakhapatnam Metropolitan Area. Enabling real-time sensor ingestion, field triage, and automated incident mapping.
            </p>
            {/* Social Icons with micro-animations */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com/ArunTejaReddy02/-City-Operations-Center-COC-"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:contact@gvmc.gov.in"
                className="w-9 h-9 rounded-full bg-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (Col Span 2) */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dda15e] mb-1">
              Platform
            </h4>
            <button
              onClick={handleScrollToTop}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform"
            >
              Overview
            </button>
            <button
              onClick={() => handleScrollToSection('gis-map')}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform"
            >
              GIS Pilot Map
            </button>
            <button
              onClick={onGetStarted}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform"
            >
              Role Selection
            </button>
            <span className="text-sm text-zinc-600 cursor-not-allowed text-left">
              Operational Statistics
            </span>
          </div>

          {/* Redirect Options (Col Span 3) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dda15e] mb-1">
              Internal Portals
            </h4>
            <button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white font-semibold transition-colors duration-200 text-left hover:translate-x-1 transform"
            >
              Operator Log In
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white font-semibold transition-colors duration-200 text-left hover:translate-x-1 transform"
            >
              Command Center
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
            <a
              href="https://gvmc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
            >
              GVMC Official Website
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="https://visakhapatnamsmartcity.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
            >
              GVSCCL Smart Portal
              <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* System Status / Newsletter (Col Span 3) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dda15e] mb-1">
              Municipal Ingest Node
            </h4>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-inner flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                  Systems Operational
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-normal">
                GVMC Municipal API integration node is active. Telemetry stream syncing normally at 120ms latency.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1">
              <Shield size={12} />
              <span>TLS 1.3 Secure Operational Link</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright area */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-semibold text-zinc-300">VizagOps Unify</span>
            <span>• Visakhapatnam Municipal Corporation (GVMC) Pilot Program.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleScrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-inner group"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
