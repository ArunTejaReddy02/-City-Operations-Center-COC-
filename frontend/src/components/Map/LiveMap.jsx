import { useRef, useEffect } from 'react';
import { Map, MapMarker, MarkerContent, MapControls } from '@/components/ui/map';

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
  const mapRef = useRef(null);

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
      <Map
        ref={mapRef}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        pitch={0}
        bearing={0}
        styles={{ 
          light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', 
          dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' 
        }}
      >
        <MapControls position="bottom-right" showZoom showCompass />

        {complaints.map((complaint) => {
          const id = complaint.id || complaint.complaint_id;
          const lng = complaint.longitude || complaint.location?.lng || DEFAULT_CENTER[0];
          const lat = complaint.latitude || complaint.location?.lat || DEFAULT_CENTER[1];

          return (
            <MapMarker
              key={`complaint-${id}`}
              longitude={lng}
              latitude={lat}
              onClick={() => onMarkerClick?.('complaint', complaint)}
            >
              <MarkerContent>
                <div
                  className="map-marker map-marker-complaint"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#e63946',
                    border: '3px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  title={complaint.title || 'Complaint'}
                />
              </MarkerContent>
            </MapMarker>
          );
        })}
      </Map>
    </div>
  );
}
