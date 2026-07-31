import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileText, Cpu, Layers, MapPin, AlertOctagon, Users, Radio, CheckCircle,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Citizen Complaint Ingestion',
    desc: 'Multilingual grievance submitted via mobile app or portal with exact geo-coordinates.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'NLP & AI Contextual Parser',
    desc: 'Incident description processed, categorized, and assigned severity index instantly.',
    icon: Cpu,
  },
  {
    step: '03',
    title: 'Deduplication Engine',
    desc: 'Duplicate citizen reports within 150m radius are merged to avoid triage clutter.',
    icon: Layers,
  },
  {
    step: '04',
    title: 'COC Sensor Cross-Matching',
    desc: 'Correlates complaint with live CCTV alert events and IoT road sensors in 30min window.',
    icon: MapPin,
  },
  {
    step: '05',
    title: 'Dynamic Priority Scoring',
    desc: 'Haversine distance, asset density, and traffic impact calculate response SLA priority.',
    icon: AlertOctagon,
  },
  {
    step: '06',
    title: 'Nearest Crew Auto-Select',
    desc: 'Scans active field units (FT-01..12), ranks by ETA, and suggests optimal dispatch.',
    icon: Users,
  },
  {
    step: '07',
    title: 'WebSocket Live Push',
    desc: 'Operators & field team mobile clients receive assignment pings simultaneously.',
    icon: Radio,
  },
  {
    step: '08',
    title: 'Resolution & Audit Log',
    desc: 'Status transitions from En Route to On-Site to Done with immutable audit trail.',
    icon: CheckCircle,
  },
];

export default function WorkflowStory() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.workflow-card');

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="workflow" ref={sectionRef} className="py-28 px-6 bg-[#faf5d0] border-y border-[#d4cc9a]/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#bc6c25]">
            Operational Lifecycle
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#283618] tracking-tight mt-2">
            From Incident Filing to Dispatch in Seconds
          </h2>
          <p className="text-base text-[#606c38] mt-4">
            How VizagOps Unify automates triage and links citizen feeds with municipal response units.
          </p>
        </div>

        {/* 8-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="workflow-card p-6 rounded-3xl bg-[#fefae0] border border-[#d4cc9a] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-[#dda15e] bg-[#f5efc0] px-3 py-1 rounded-full">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#f5efc0] text-[#283618] flex items-center justify-center group-hover:bg-[#dda15e] group-hover:text-[#fefae0] transition-colors">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#283618] mb-2">{item.title}</h3>
                <p className="text-xs text-[#606c38] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
