import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { Layers, ZoomIn, ZoomOut, Locate, Navigation } from 'lucide-react';
import { IconButton } from '../UI/Buttons';
import { MapSkeleton } from '../Loader/SkeletonLoaders';

/**
 * LiveMap — Mapbox GL JS powered real-time map.
 * 
 * Features:
 *  - Animated marker placement (drop + ripple)
 *  - Pulsing active incidents
 *  - Smooth camera fly-to on new events
 *  - Hover effects on markers
 *  - Soft glow on selected markers
 *  - SVG routing path animation (mock)
 * 
 * Falls back to a styled placeholder if Mapbox token is unavailable.
 */

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Visakhapatnam center coords
const DEFAULT_CENTER = [83.2185, 17.6868];
const DEFAULT_ZOOM = 14;

export default function LiveMap({
  complaints = [],
  sensorEvents = [],
  fieldTeams = [],
  selectedIncident = null,
  onMarkerClick,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(!MAPBOX_TOKEN);

  // Initialize Mapbox
  useEffect(() => {
    if (useFallback || !mapContainerRef.current) return;

    let map;
    const initMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        await import('mapbox-gl/dist/mapbox-gl.css');

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
        });

        map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

        map.on('load', () => {
          mapRef.current = map;
          setMapLoaded(true);
        });
      } catch (err) {
        console.error('[LiveMap] Failed to initialize Mapbox:', err);
        setUseFallback(true);
      }
    };

    initMap();

    return () => {
      map?.remove();
    };
  }, [useFallback]);

  // Add/update complaint markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    complaints.forEach((complaint) => {
      const markerId = `complaint-${complaint.complaint_id}`;
      if (markersRef.current[markerId]) return;

      addMarker({
        id: markerId,
        type: 'complaint',
        lng: complaint.location.lng,
        lat: complaint.location.lat,
        color: 'var(--status-danger)',
        label: complaint.type,
        onClick: () => onMarkerClick?.('complaint', complaint),
      });
    });
  }, [complaints, mapLoaded, onMarkerClick]);

  // Add/update sensor event markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    sensorEvents.forEach((event) => {
      const markerId = `sensor-${event.event_id}`;
      if (markersRef.current[markerId]) return;

      addMarker({
        id: markerId,
        type: 'sensor',
        lng: event.location.lng,
        lat: event.location.lat,
        color: 'var(--status-warning)',
        label: event.event_type,
        onClick: () => onMarkerClick?.('sensor', event),
      });
    });
  }, [sensorEvents, mapLoaded, onMarkerClick]);

  // Add/update field team markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    fieldTeams.forEach((team) => {
      const markerId = `team-${team.team_id}`;
      const existingMarker = markersRef.current[markerId];

      if (existingMarker) {
        // Update position smoothly
        existingMarker.setLngLat([team.location.lng, team.location.lat]);
        return;
      }

      addMarker({
        id: markerId,
        type: 'team',
        lng: team.location.lng,
        lat: team.location.lat,
        color: 'var(--status-info)',
        label: team.team_id,
        onClick: () => onMarkerClick?.('team', team),
      });
    });
  }, [fieldTeams, mapLoaded, onMarkerClick]);

  // Fly to selected incident
  useEffect(() => {
    if (!mapRef.current || !selectedIncident) return;

    mapRef.current.flyTo({
      center: [selectedIncident.location.lng, selectedIncident.location.lat],
      zoom: 16,
      duration: 1200,
      essential: true,
    });
  }, [selectedIncident]);

  const addMarker = useCallback(async ({ id, type, lng, lat, color, label, onClick }) => {
    if (!mapRef.current) return;

    const mapboxgl = (await import('mapbox-gl')).default;

    // Create custom marker element
    const el = document.createElement('div');
    el.className = `map-marker map-marker-${type}`;
    el.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid var(--bg-primary);
      box-shadow: 0 2px 8px rgba(40,54,24,0.15);
      cursor: pointer;
      transition: box-shadow 0.2s ease;
      position: relative;
    `;

    // Pulse ring for complaints
    if (type === 'complaint') {
      const pulse = document.createElement('div');
      pulse.style.cssText = `
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid ${color};
        opacity: 0;
      `;
      el.appendChild(pulse);

      // GSAP ripple animation
      gsap.fromTo(pulse,
        { scale: 0.8, opacity: 0.8 },
        { scale: 1.8, opacity: 0, duration: 1.5, repeat: -1, ease: 'power1.out' }
      );
    }

    // Hover glow
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { boxShadow: `0 0 16px 4px ${color}44`, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { boxShadow: '0 2px 8px rgba(0,0,0,0.2)', duration: 0.2 });
    });

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    // Marker drop animation
    gsap.fromTo(el,
      { y: -40, opacity: 0, scale: 0.5 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'bounce.out' }
    );

    el.addEventListener('click', () => onClick?.());

    markersRef.current[id] = marker;
  }, []);

  // Fallback map (no Mapbox token)
  if (useFallback) {
    return (
      <div className="map-container" style={{ background: 'var(--bg-section)', position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '100%',
          minHeight: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(circle at 30% 40%, var(--accent-light) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(96, 108, 56, 0.08) 0%, transparent 35%),
            var(--bg-section)
          `,
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Simulated grid lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(var(--border-light) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-light) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.5,
          }} />

          {/* Simulated markers */}
          {complaints.map((c, i) => {
            const x = 20 + (i * 17) % 60;
            const y = 20 + (i * 23) % 60;
            return (
              <div
                key={c.complaint_id}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--status-danger)',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 2px 6px rgba(188,108,37,0.35)',
                  cursor: 'pointer',
                }}
                onClick={() => onMarkerClick?.('complaint', c)}
              />
            );
          })}

          {fieldTeams.map((t, i) => {
            const x = 30 + (i * 19) % 50;
            const y = 30 + (i * 29) % 50;
            return (
              <div
                key={t.team_id}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--status-info)',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 2px 6px rgba(96,108,56,0.3)',
                  cursor: 'pointer',
                }}
                onClick={() => onMarkerClick?.('team', t)}
              />
            );
          })}

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Navigation size={32} color="var(--accent-primary)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>
              Visakhapatnam — Ward GVMC-W12
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
              {MAPBOX_TOKEN ? 'Map loading...' : 'Set VITE_MAPBOX_TOKEN for full map'}
            </p>
          </div>
        </div>

        {/* Map controls overlay */}
        <div className="map-overlay-controls">
          <IconButton icon={ZoomIn} label="Zoom in" />
          <IconButton icon={ZoomOut} label="Zoom out" />
          <IconButton icon={Locate} label="Center on ward" />
          <IconButton icon={Layers} label="Toggle layers" />
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="map-legend-item">
            <span className="map-legend-dot" style={{ background: 'var(--status-danger)' }} />
            <span>Complaints</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-dot" style={{ background: 'var(--status-warning)' }} />
            <span>Sensor Events</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-dot" style={{ background: 'var(--status-info)' }} />
            <span>Field Teams</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      {!mapLoaded && <MapSkeleton />}
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', minHeight: 500, visibility: mapLoaded ? 'visible' : 'hidden' }}
      />

      {/* Map controls overlay */}
      <div className="map-overlay-controls">
        <IconButton icon={ZoomIn} label="Zoom in" onClick={() => mapRef.current?.zoomIn()} />
        <IconButton icon={ZoomOut} label="Zoom out" onClick={() => mapRef.current?.zoomOut()} />
        <IconButton icon={Locate} label="Center on ward" onClick={() => mapRef.current?.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })} />
        <IconButton icon={Layers} label="Toggle layers" />
      </div>

      {/* Legend */}
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: 'var(--status-danger)' }} />
          <span>Complaints</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: 'var(--status-warning)' }} />
          <span>Sensor Events</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: 'var(--status-info)' }} />
          <span>Field Teams</span>
        </div>
      </div>
    </div>
  );
}
