import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { Layers, ZoomIn, ZoomOut, Locate, Navigation } from 'lucide-react';
import { IconButton } from '../UI/Buttons';
import { MapSkeleton } from '../Loader/SkeletonLoaders';

/**
 * LiveMap — MapLibre GL JS powered real-time map.
 * 
 * Features:
 *  - Animated marker placement (drop + ripple)
 *  - Pulsing active incidents
 *  - Smooth camera fly-to on new events
 *  - Hover effects on markers
 *  - Soft glow on selected markers
 *  - Style selector (Carto / OSM / OSM 3D)
 */

const MAP_STYLES = {
  carto: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  openstreetmap: 'https://tiles.openfreemap.org/styles/bright',
  openstreetmap3d: 'https://tiles.openfreemap.org/styles/liberty',
};

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
  const [styleKey, setStyleKey] = useState('openstreetmap');

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map;
    const initMap = async () => {
      try {
        const maplibregl = await import('maplibre-gl');
        await import('maplibre-gl/dist/maplibre-gl.css');

        map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: MAP_STYLES[styleKey] || MAP_STYLES.openstreetmap,
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
        });

        map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

        map.on('load', () => {
          mapRef.current = map;
          setMapLoaded(true);
          // Hide complaints and sensor markers when zoomed out too far
          map.on('zoom', () => {
            const zoom = map.getZoom();
            const hide = zoom < 12;
            Object.values(markersRef.current).forEach((m) => {
              if (!m._customType) return;
              if (m._customType === 'team') return; // always show teams
              const el = m.getElement();
              el.style.display = hide ? 'none' : '';
            });
          });
          // Hide complaints and sensor markers when zoomed out too far
          map.on('zoom', () => {
            const zoom = map.getZoom();
            const hide = zoom < 12;
            Object.values(markersRef.current).forEach((m) => {
              if (!m._customType) return;
              if (m._customType === 'team') return; // always show teams
              const el = m.getElement();
              el.style.display = hide ? 'none' : '';
            });
          });
        });
      } catch (err) {
        console.error('[LiveMap] Failed to initialize MapLibre:', err);
      }
    };

    initMap();

    return () => {
      map?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle style changes dynamically
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const is3D = styleKey === 'openstreetmap3d';
    mapRef.current.setStyle(MAP_STYLES[styleKey]);
    mapRef.current.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
  }, [styleKey, mapLoaded]);

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

  // Center map on selected incident (orange spot) and keep it in the middle
  useEffect(() => {
    if (!mapRef.current || !selectedIncident) return;
    const { lng, lat } = selectedIncident.location;
    mapRef.current.easeTo({
      center: [lng, lat],
      zoom: 16,
      duration: 800,
      essential: true,
    });
  }, [selectedIncident]);

  const addMarker = useCallback(async ({ id, type, lng, lat, color, label, onClick }) => {
    if (!mapRef.current) return;

    const maplibregl = await import('maplibre-gl');

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

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
    marker._customType = type;

    // Marker drop animation
    gsap.fromTo(el,
      { y: -40, opacity: 0, scale: 0.5 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'bounce.out' }
    );

    el.addEventListener('click', () => onClick?.());

    markersRef.current[id] = marker;
  }, []);

  return (
    <div className="map-container relative" style={{ height: '100%' }}>
      {!mapLoaded && <MapSkeleton />}

      {/* Map Style Dropdown (matches LandingMapPreview) */}
      <div className="absolute top-4 right-4 z-10" style={{ zIndex: 200 }}>
        <select
          value={styleKey}
          onChange={(e) => setStyleKey(e.target.value)}
          className="bg-[#faf5d0] text-[#283618] rounded-md border border-[#d4cc9a] px-3 py-1.5 text-sm shadow font-semibold focus:outline-none cursor-pointer"
        >
          <option value="carto">Default (Carto)</option>
          <option value="openstreetmap">OpenStreetMap</option>
          <option value="openstreetmap3d">OpenStreetMap 3D</option>
        </select>
      </div>

      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', minHeight: 500, visibility: mapLoaded ? 'visible' : 'hidden' }}
      />

      {/* Map controls overlay */}
      <div className="map-overlay-controls" style={{ zIndex: 10 }}>
        <IconButton icon={ZoomIn} label="Zoom in" onClick={() => mapRef.current?.zoomIn()} />
        <IconButton icon={ZoomOut} label="Zoom out" onClick={() => mapRef.current?.zoomOut()} />
        <IconButton icon={Locate} label="Center on ward" onClick={() => mapRef.current?.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })} />
        <IconButton icon={Layers} label="Toggle layers" />
      </div>

      {/* Legend */}
      <div className="map-legend" style={{ zIndex: 10 }}>
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
