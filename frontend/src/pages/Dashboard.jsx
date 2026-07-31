import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  AlertTriangle, Users, Radio, TrendingUp, Clock,
  CheckCircle2, MapPin, ArrowUpRight,
} from 'lucide-react';

import DashboardLayout from '../components/Layout/DashboardLayout';
import CinematicLoader from '../components/Loader/CinematicLoader';
import { StatsSkeleton, IncidentFeedSkeleton, MapSkeleton } from '../components/Loader/SkeletonLoaders';
import StatCard from '../components/Stats/StatCard';
import LiveMap from '../components/Map/LiveMap';
import TriagePanel from '../components/Triage/TriagePanel';
import NotificationCenter from '../components/Notifications/NotificationCenter';
import useWebSocket from '../hooks/useWebSocket';

gsap.registerPlugin(useGSAP);

/**
 * Dashboard — Primary operator view.
 * 
 * Entrance animation: Logo → Navbar → Stats stagger → Map expand → Triage slide → Buttons interactive.
 * Real-time animations driven by WebSocket events, not ScrollTrigger.
 */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [sensorEvents, setSensorEvents] = useState([]);
  const [fieldTeams, setFieldTeams] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Refs for entrance animation
  const statsRef = useRef(null);
  const mapRef = useRef(null);
  const triageRef = useRef(null);
  const chartsRef = useRef(null);

  // Handle incoming WebSocket events
  const handleWsMessage = useCallback((event) => {
    if (!synced) setSynced(true);

    switch (event.type) {
      case 'complaint.new':
        setComplaints((prev) => [event.data, ...prev.slice(0, 49)]);
        addNotification({
          title: `New Complaint: ${event.data.type?.replace('_', ' ')}`,
          message: event.data.description,
          priority: 'high',
        });
        break;

      case 'sensor.new':
        setSensorEvents((prev) => [event.data, ...prev.slice(0, 49)]);
        addNotification({
          title: `Sensor Event: ${event.data.event_type?.replace('_', ' ')}`,
          message: `Asset ${event.data.asset_id} — Confidence: ${(event.data.confidence * 100).toFixed(0)}%`,
          priority: 'medium',
        });
        break;

      case 'team.update':
        setFieldTeams((prev) => {
          const idx = prev.findIndex((t) => t.team_id === event.data.team_id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = event.data;
            return updated;
          }
          return [event.data, ...prev];
        });
        break;

      case 'assignment.new':
        addNotification({
          title: `Team ${event.data.team_id} Dispatched`,
          message: `ETA: ${event.data.eta_minutes} min — Priority: ${event.data.priority}`,
          priority: event.data.priority === 'high' ? 'high' : 'low',
        });
        // Update complaint status
        setComplaints((prev) =>
          prev.map((c) =>
            c.complaint_id === event.data.incident_id
              ? { ...c, status: 'assigned', assigned_team_id: event.data.team_id }
              : c
          )
        );
        break;

      default:
        break;
    }
  }, [synced]);

  const { status: wsStatus } = useWebSocket('ws://localhost:3001/ws', {
    onMessage: handleWsMessage,
    mockMode: true,
  });

  const addNotification = useCallback((notif) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    setNotifications((prev) => [{ id, time, ...notif }, ...prev.slice(0, 7)]);

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 8000);
  }, []);

  const handleDismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleDispatch = useCallback((incident) => {
    // Simulate dispatch
    setComplaints((prev) =>
      prev.map((c) =>
        c.complaint_id === incident.complaint_id
          ? { ...c, status: 'assigned' }
          : c
      )
    );
    addNotification({
      title: 'Team Dispatched',
      message: `Nearest team assigned to ${incident.complaint_id}`,
      priority: 'low',
    });
  }, [addNotification]);

  // Entrance animation (runs after loader completes)
  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Stats cards stagger upward
    if (statsRef.current) {
      tl.fromTo(
        statsRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
        0.1
      );
    }

    // Map expands into view
    if (mapRef.current) {
      tl.fromTo(
        mapRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6 },
        0.3
      );
    }

    // Triage panel slides in from right
    if (triageRef.current) {
      tl.fromTo(
        triageRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 },
        0.4
      );
    }

    // Charts section
    if (chartsRef.current) {
      tl.fromTo(
        chartsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.4 },
        0.55
      );
    }
  }, { dependencies: [loading] });

  // Generate initial mock data
  useEffect(() => {
    if (!loading) {
      // Seed some initial field teams
      setFieldTeams([
        { team_id: 'FT-01', status: 'available', location: { lat: 17.689, lng: 83.217 }, updated_at: new Date().toISOString() },
        { team_id: 'FT-02', status: 'en_route', location: { lat: 17.685, lng: 83.221 }, updated_at: new Date().toISOString() },
        { team_id: 'FT-03', status: 'available', location: { lat: 17.691, lng: 83.215 }, updated_at: new Date().toISOString() },
        { team_id: 'FT-04', status: 'on_site', location: { lat: 17.684, lng: 83.219 }, updated_at: new Date().toISOString() },
        { team_id: 'FT-05', status: 'available', location: { lat: 17.688, lng: 83.222 }, updated_at: new Date().toISOString() },
      ]);

      // Seed initial complaints to make the incident feed overflow and scrollable
      setComplaints([
        {
          complaint_id: 'CMP-POTH001',
          type: 'pothole',
          description: 'Deep pothole on the main road lane causing traffic slow-down.',
          location: { lat: 17.689, lng: 83.217 },
          ward_id: 'GVMC-W12',
          status: 'received',
          reported_at: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          complaint_id: 'CMP-WAT002',
          type: 'waterlogging',
          description: 'Waterlogging at the intersection near the central market.',
          location: { lat: 17.685, lng: 83.221 },
          ward_id: 'GVMC-W12',
          status: 'assigned',
          assigned_team_id: 'FT-02',
          reported_at: new Date(Date.now() - 15 * 60000).toISOString(),
        },
        {
          complaint_id: 'CMP-LIGHT003',
          type: 'streetlight',
          description: 'Multiple streetlights blinking or completely out of order.',
          location: { lat: 17.691, lng: 83.215 },
          ward_id: 'GVMC-W12',
          status: 'received',
          reported_at: new Date(Date.now() - 25 * 60000).toISOString(),
        },
        {
          complaint_id: 'CMP-OBS004',
          type: 'road_obstruction',
          description: 'Fallen tree branch blocking the left pedestrian walkway.',
          location: { lat: 17.684, lng: 83.219 },
          ward_id: 'GVMC-W12',
          status: 'in-progress',
          assigned_team_id: 'FT-04',
          reported_at: new Date(Date.now() - 35 * 60000).toISOString(),
        },
        {
          complaint_id: 'CMP-POTH005',
          type: 'pothole',
          description: 'Aggressive pothole group near the metro station exit.',
          location: { lat: 17.688, lng: 83.222 },
          ward_id: 'GVMC-W12',
          status: 'received',
          reported_at: new Date(Date.now() - 45 * 60000).toISOString(),
        },
        {
          complaint_id: 'CMP-WAT006',
          type: 'waterlogging',
          description: 'Minor flooding in the residential street after brief shower.',
          location: { lat: 17.687, lng: 83.220 },
          ward_id: 'GVMC-W12',
          status: 'received',
          reported_at: new Date(Date.now() - 55 * 60000).toISOString(),
        },
        {
          complaint_id: 'CMP-LIGHT007',
          type: 'streetlight',
          description: 'Streetlight pole #45 completely dark for 3 consecutive days.',
          location: { lat: 17.690, lng: 83.216 },
          ward_id: 'GVMC-W12',
          status: 'received',
          reported_at: new Date(Date.now() - 65 * 60000).toISOString(),
        },
        {
          complaint_id: 'CMP-OBS008',
          type: 'road_obstruction',
          description: 'Discarded construction material on the road shoulder.',
          location: { lat: 17.683, lng: 83.218 },
          ward_id: 'GVMC-W12',
          status: 'received',
          reported_at: new Date(Date.now() - 75 * 60000).toISOString(),
        }
      ]);
    }
  }, [loading]);

  const activeComplaints = complaints.filter((c) => c.status !== 'resolved').length;
  const availableTeams = fieldTeams.filter((t) => t.status === 'available').length;
  const matchRate = complaints.length > 0 ? Math.min(92, 70 + complaints.length * 2) : 0;
  const avgLatency = complaints.length > 0 ? Math.max(3, 12 - complaints.length * 0.5) : 0;

  return (
    <>
      {loading && <CinematicLoader onComplete={handleLoaderComplete} />}

      <DashboardLayout wsStatus={wsStatus} activeIncidents={activeComplaints}>
        {/* Notifications disabled
        <NotificationCenter
          notifications={notifications}
          onDismiss={handleDismissNotification}
        />
        */}

        <div className="dashboard-grid" style={{ gap: 'var(--space-6)' }}>
          {/* Statistics Row */}
          {!synced && loading ? (
            <StatsSkeleton />
          ) : (
            <div className="dashboard-grid-stats" ref={statsRef}>
              <StatCard
                label="Active Incidents"
                value={activeComplaints}
                trend={`${complaints.length} total`}
                trendDirection="up"
                icon={<AlertTriangle size={18} />}
                iconColor="orange"
              />
              <StatCard
                label="Available Teams"
                value={availableTeams}
                trend={`${fieldTeams.length} total`}
                trendDirection="up"
                icon={<Users size={18} />}
                iconColor="blue"
              />
              <StatCard
                label="Match Rate"
                value={matchRate}
                suffix="%"
                trend="Target: 90%"
                trendDirection="up"
                icon={<Radio size={18} />}
                iconColor="green"
              />
              <StatCard
                label="Avg. Dispatch Time"
                value={Math.round(avgLatency)}
                suffix="s"
                trend="< 5s target"
                trendDirection="down"
                icon={<Clock size={18} />}
                iconColor="red"
              />
            </div>
          )}

          {/* Quick Stats / Charts placeholder row */}
          <div className="dashboard-grid-charts" ref={chartsRef}>
            <div className="card" style={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span className="text-sm font-semibold">Complaint Volume</span>
                <span className="badge badge-accent">Today</span>
              </div>
              <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                {[35, 52, 41, 68, 55, 72, 48, 63, 45, 58, 70, 80].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      background: i === 11 ? 'var(--accent-gradient)' : 'var(--accent-light)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="card" style={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span className="text-sm font-semibold">Assignment Latency</span>
                <span className="badge badge-success">On Track</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `conic-gradient(var(--accent-primary) ${85 * 3.6}deg, var(--accent-light) 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--accent-primary)',
                  }}>
                    85%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Under 5s Target</div>
                  <div className="text-xs text-secondary" style={{ marginTop: 4 }}>17 of 20 incidents dispatched within SLA</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span className="text-sm font-semibold">Team Utilization</span>
                <span className="badge badge-info">Live</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                {[
                  { label: 'Available', value: 60, color: 'var(--status-success)' },
                  { label: 'En Route', value: 20, color: 'var(--status-info)' },
                  { label: 'On Site', value: 15, color: 'var(--status-warning)' },
                  { label: 'Offline', value: 5, color: 'var(--text-tertiary)' },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="text-xs text-secondary">{item.label}</span>
                      <span className="text-xs font-semibold">{item.value}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${item.value}%`,
                        background: item.color,
                        borderRadius: 3,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map + Triage Panel */}
          <div className="dashboard-grid-main">
            <div ref={mapRef} style={{ opacity: 0, height: '100%' }}>
              <LiveMap
                complaints={complaints}
                sensorEvents={sensorEvents}
                fieldTeams={fieldTeams}
                selectedIncident={selectedIncident}
                onMarkerClick={(type, data) => {
                  if (type === 'complaint') setSelectedIncident(data);
                }}
              />
            </div>

            <div ref={triageRef} style={{ opacity: 0, height: '100%' }}>
              <TriagePanel
                incidents={complaints}
                selectedId={selectedIncident?.complaint_id}
                onSelectIncident={setSelectedIncident}
                onDispatch={handleDispatch}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
