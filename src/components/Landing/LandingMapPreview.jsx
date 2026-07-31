import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LandingMapPreview() {
  const position = [17.6868, 83.2185]; // Visakhapatnam

  return (
    <section id="gis-map" className="py-28 px-6 bg-[#fefae0]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#bc6c25]">
            GIS Heatmap & Routing Matrix
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#283618] tracking-tight mt-2">
            Interactive Pilot Zone View
          </h2>
        </div>

        <div className="h-[460px] rounded-3xl overflow-hidden border border-[#d4cc9a] shadow-xl relative">
          <MapContainer
            center={position}
            zoom={14}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customIcon}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-xs text-[#283618]">Incident CMP-8841</div>
                  <div className="text-[11px] text-[#606c38]">Pothole Reported • 12m ago</div>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={position}
              radius={150}
              pathOptions={{ color: '#bc6c25', fillColor: '#dda15e', fillOpacity: 0.3 }}
            />
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
