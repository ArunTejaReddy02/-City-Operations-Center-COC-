import { useState, useEffect } from 'react';
import { MapPin, Activity, Radio, AlertTriangle, Users, Clock } from 'lucide-react';

export default function InteractiveDashboardPreview() {
  const [liveIncidents, setLiveIncidents] = useState([
    { id: 'CMP-8841', type: 'Pothole', ward: 'GVMC-W12', status: 'Matched', time: 'Just now' },
    { id: 'CMP-8842', type: 'Waterlogging', ward: 'GVMC-W12', status: 'En Route', time: '2m ago' },
    { id: 'CMP-8843', type: 'Obstruction', ward: 'GVMC-W12', status: 'Assigned', time: '5m ago' },
  ]);

  // Simulate live incoming feeds
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['Pothole', 'Waterlogging', 'Road Obstruction', 'Signal Issue'];
      const statuses = ['Received', 'Matched', 'Assigned'];
      const newInc = {
        id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
        type: types[Math.floor(Math.random() * types.length)],
        ward: 'GVMC-W12',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        time: 'Just now',
      };
      setLiveIncidents((prev) => [newInc, ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="live-preview" className="py-28 px-6 bg-[#faf5d0] border-t border-[#d4cc9a]/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#bc6c25]">
            Live Operational Demo
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#283618] tracking-tight mt-2">
            Command Center Preview
          </h2>
          <p className="text-base text-[#606c38] mt-3">
            Real-time feed simulation operating at sub-5-second dispatch latency.
          </p>
        </div>

        {/* Dashboard Shell Preview */}
        <div className="rounded-3xl bg-[#fefae0] border border-[#d4cc9a] shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-[#d4cc9a]/50 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#606c38] animate-ping" />
              <span className="text-sm font-bold text-[#283618]">
                Visakhapatnam Operations Feed — Ward GVMC-W12
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#606c38]/10 text-[#606c38] text-xs font-bold">
                WebSocket: Connected
              </span>
              <span className="px-3 py-1 rounded-full bg-[#dda15e]/20 text-[#bc6c25] text-xs font-bold">
                Sensor Matching: Active
              </span>
            </div>
          </div>

          {/* Body Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Ticker */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#606c38] mb-2">
                Incoming Incident Stream
              </h4>
              {liveIncidents.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#faf5d0] border border-[#d4cc9a]/80 flex items-center justify-between transition-all duration-300 hover:border-[#dda15e] animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#dda15e]/20 text-[#bc6c25] flex items-center justify-center font-bold text-xs">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#283618]">{item.type}</div>
                      <div className="text-xs text-[#606c38]">{item.id} • {item.ward}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-[#dda15e]/20 text-[#bc6c25] text-xs font-bold">
                      {item.status}
                    </span>
                    <span className="text-xs font-mono text-[#8a9460]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#606c38] mb-2">
                Live Metrics
              </h4>
              <div className="p-5 rounded-2xl bg-[#faf5d0] border border-[#d4cc9a]/80">
                <div className="text-xs text-[#606c38] font-medium">Avg Dispatch Latency</div>
                <div className="text-3xl font-extrabold text-[#283618] mt-1">2.4s</div>
                <div className="text-[11px] text-[#606c38] mt-1">↓ 68% faster than baseline</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#faf5d0] border border-[#d4cc9a]/80">
                <div className="text-xs text-[#606c38] font-medium">Sensor Match Rate</div>
                <div className="text-3xl font-extrabold text-[#dda15e] mt-1">94.2%</div>
                <div className="text-[11px] text-[#606c38] mt-1">150m geospatial radius</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
