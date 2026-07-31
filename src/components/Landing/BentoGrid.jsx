import { Shield, Zap, Eye, BarChart2, Radio, Smartphone } from 'lucide-react';
import Spotlight from '../Effects/Spotlight';
import LottiePlayer from '../UI/LottiePlayer';

export default function BentoGrid() {
  return (
    <section id="features" className="py-28 px-6 bg-[#fefae0]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#bc6c25]">
            Engineered Excellence
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#283618] tracking-tight mt-2">
            Built for Mission-Critical Municipal Command
          </h2>
        </div>

        {/* Asymmetric Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Featured */}
          <Spotlight className="md:col-span-2 p-8 rounded-3xl bg-[#faf5d0] border border-[#d4cc9a] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#dda15e]/20 text-[#bc6c25] flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#283618] mb-3">
                Spatial & Temporal Correlation Engine
              </h3>
              <p className="text-sm text-[#606c38] max-w-md leading-relaxed">
                Automatically matches incoming citizen pothole or waterlogging complaints with nearby GVSCCL CCTV alert metadata within a 150-meter radius and 30-minute time window.
              </p>
            </div>
            <div className="mt-8 h-44 w-full flex items-center justify-center">
              <LottiePlayer
                src="/lottie/lottieflow-search-04-000000-easey.json"
                className="h-full object-contain"
              />
            </div>
          </Spotlight>

          {/* Card 2: Field Unit Telemetry */}
          <Spotlight className="p-8 rounded-3xl bg-[#faf5d0] border border-[#d4cc9a] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#606c38]/20 text-[#606c38] flex items-center justify-center mb-6">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#283618] mb-2">Thin Field Client</h3>
              <p className="text-xs text-[#606c38] leading-relaxed">
                Mobile-optimized interface allowing field units (Ravi persona) to toggle availability and acknowledge assignments in 1-tap.
              </p>
            </div>
            <div className="mt-6 h-36 flex items-center justify-center">
              <LottiePlayer
                src="/lottie/lottieflow-chat-17-6-000000-easey.json"
                className="h-full object-contain"
              />
            </div>
          </Spotlight>

          {/* Card 3: Real-Time WebSockets */}
          <Spotlight className="p-8 rounded-3xl bg-[#faf5d0] border border-[#d4cc9a] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#dda15e]/20 text-[#bc6c25] flex items-center justify-center mb-6">
                <Radio size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#283618] mb-2">Zero-Polling Pub/Sub</h3>
              <p className="text-xs text-[#606c38] leading-relaxed">
                Sub-second WebSocket state pushes ensure triage officers see new incidents the moment they arrive without refreshing.
              </p>
            </div>
          </Spotlight>

          {/* Card 4: Audit & Observability */}
          <Spotlight className="md:col-span-2 p-8 rounded-3xl bg-[#faf5d0] border border-[#d4cc9a] shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#606c38]/20 text-[#283618] flex items-center justify-center mb-4">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#283618] mb-2">Audit-Grade Traceability</h3>
                <p className="text-xs text-[#606c38] max-w-sm leading-relaxed">
                  Every state transition from receipt to resolution is recorded with timestamp, actor, and payload metadata for GVMC IT handovers.
                </p>
              </div>
              <div className="h-32 w-32 flex-shrink-0">
                <LottiePlayer
                  src="/lottie/lottieflow-checkbox-06-000000-easey.json"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
