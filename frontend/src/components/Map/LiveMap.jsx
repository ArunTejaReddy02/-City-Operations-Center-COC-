import { useRef, useEffect, useCallback, useState } from 'react';
import { MapSkeleton } from '../Loader/SkeletonLoaders';

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

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map;
    const initMap = async () => {
      try {
        const maplibregl = (await import('maplibre-gl')).default;

        map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
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
        });
      } catch (err) {
        console.error('[LiveMap] Failed to initialize MapLibre GL:', err);
      }
    };

    initMap();

    return () => {
      map?.remove();
    };
  }, []);

  const addMarker = useCallback(async ({ id, type, lng, lat, color, label, onClick }) => {
    if (!mapRef.current) return;

    const maplibregl = (await import('maplibre-gl')).default;

    const el = document.createElement('div');
    el.className = `map-marker map-marker-${type}`;
    el.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: transform 0.2s ease;
      position: relative;
    `;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    el.addEventListener('click', onClick);
    markersRef.current[id] = marker;
  }, []);

  // Add/update complaint markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    complaints.forEach((complaint) => {
      const markerId = `complaint-${complaint.id || complaint.complaint_id}`;
      if (markersRef.current[markerId]) return;

      const lng = complaint.longitude || complaint.location?.lng || 83.2185;
      const lat = complaint.latitude || complaint.location?.lat || 17.6868;

      addMarker({
        id: markerId,
        type: 'complaint',
        lng,
        lat,
        color: '#e63946',
        label: complaint.title || 'Complaint',
        onClick: () => onMarkerClick?.('complaint', complaint),
      });
    });
  }, [complaints, mapLoaded, addMarker, onMarkerClick]);

  // Fly to selected incident
  useEffect(() => {
    if (!mapRef.current || !selectedIncident) return;

    const lng = selectedIncident.longitude || selectedIncident.location?.lng || DEFAULT_CENTER[0];
    const lat = selectedIncident.latitude || selectedIncident.location?.lat || DEFAULT_CENTER[1];

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 16,
      duration: 1200,
      essential: true,
    });
  }, [selectedIncident]);

  return (
    <div className="map-container relative w-full h-full min-h-[450px]">
      {!mapLoaded && <MapSkeleton />}
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', minHeight: '450px', visibility: mapLoaded ? 'visible' : 'hidden' }}
      />


    </div>
  );
}
