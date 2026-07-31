import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/Landing/Navbar';
import HeroSection from '../components/Landing/HeroSection';
import WorkflowStory from '../components/Landing/WorkflowStory';
import BentoGrid from '../components/Landing/BentoGrid';
import InteractiveDashboardPreview from '../components/Landing/InteractiveDashboardPreview';
import LandingMapPreview from '../components/Landing/LandingMapPreview';
import RoleSelectionModal from '../components/Landing/RoleSelectionModal';
import CursorSpotlight from '../components/Effects/CursorSpotlight';
import Footer from '../components/Landing/Footer';

export default function LandingPage() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Initialize Lenis smooth momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fefae0] text-[#283618] relative selection:bg-[#dda15e]/30">
      <CursorSpotlight />

      {/* Navigation */}
      <Navbar onGetStarted={() => setRoleModalOpen(true)} />

      {/* Hero Section */}
      <HeroSection onGetStarted={() => setRoleModalOpen(true)} />

      {/* Workflow 8-Stage Storytelling */}
      <WorkflowStory />

      {/* Bento Grid Feature Matrix */}
      <BentoGrid />

      {/* Interactive Command Center Preview */}
      <InteractiveDashboardPreview />

      {/* GIS Leaflet Map Preview */}
      <LandingMapPreview />

      {/* Role Selection Overlay */}
      <RoleSelectionModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />

      {/* Footer */}
      <Footer onGetStarted={() => setRoleModalOpen(true)} />
    </div>
  );
}
