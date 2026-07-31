import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Plus, Minus, Compass } from "lucide-react";

// Global script loading state
let isScriptLoading = false;
let scriptLoaded = false;
const scriptCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(callback: () => void) {
  if (scriptLoaded) {
    callback();
    return;
  }
  scriptCallbacks.push(callback);
  if (isScriptLoading) return;
  isScriptLoading = true;

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBdua__bO_ArJEfbvvziK8WhCCCgY6RreI&libraries=places,geometry`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    scriptLoaded = true;
    scriptCallbacks.forEach((cb) => cb());
  };
  document.head.appendChild(script);
}

// React context for the Google Map instance
type MapContextValue = {
  map: any; // google.maps.Map
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

// Custom overlay class for rendering custom React elements as map markers
let ReactOverlayClass: any = null;

function getReactOverlayClass() {
  if (ReactOverlayClass) return ReactOverlayClass;

  const google = (window as any).google;
  if (!google || !google.maps || !google.maps.OverlayView) return null;

  class ReactOverlay extends google.maps.OverlayView {
    private element: HTMLDivElement;
    private latlng: any;

    constructor(element: HTMLDivElement, latlng: any) {
      super();
      this.element = element;
      this.latlng = latlng;
    }

    onAdd() {
      const panes = this.getPanes();
      if (panes) {
        panes.overlayMouseTarget.appendChild(this.element);
      }
    }

    draw() {
      const projection = this.getProjection();
      if (!projection) return;
      const position = projection.fromLatLngToDivPixel(this.latlng);
      if (position) {
        this.element.style.left = position.x + "px";
        this.element.style.top = position.y + "px";
        this.element.style.position = "absolute";
        this.element.style.transform = "translate(-50%, -50%)";
      }
    }

    onRemove() {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
  }

  ReactOverlayClass = ReactOverlay;
  return ReactOverlay;
}

// Map Ref Type
export type MapRef = {
  flyTo: (options: { center: [number, number]; zoom?: number; duration?: number }) => void;
  easeTo: (options: { pitch?: number; bearing?: number; duration?: number }) => void;
};

// Map Component
export const Map = forwardRef<
  MapRef,
  {
    center: [number, number]; // [lng, lat]
    zoom: number;
    children?: ReactNode;
    className?: string;
    styles?: any;
    theme?: "light" | "dark";
  }
>(({ center, zoom, children, className }, ref) => {
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || map) return;

    const google = (window as any).google;
    const mapInstance = new google.maps.Map(containerRef.current, {
      center: { lat: center[1], lng: center[0] },
      zoom: zoom,
      disableDefaultUI: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(mapInstance);
  }, [isLoaded, map]);

  // Handle center updates from props
  useEffect(() => {
    if (map) {
      const currentCenter = map.getCenter();
      if (
        !currentCenter ||
        Math.abs(currentCenter.lng() - center[0]) > 0.0001 ||
        Math.abs(currentCenter.lat() - center[1]) > 0.0001
      ) {
        map.setCenter({ lat: center[1], lng: center[0] });
      }
    }
  }, [center, map]);

  // Handle zoom updates from props
  useEffect(() => {
    if (map && map.getZoom() !== zoom) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  useImperativeHandle(ref, () => ({
    flyTo: ({ center, zoom }) => {
      if (map) {
        map.panTo({ lat: center[1], lng: center[0] });
        if (zoom !== undefined) {
          map.setZoom(zoom);
        }
      }
    },
    easeTo: ({ pitch, bearing }) => {
      if (map) {
        if (pitch !== undefined) map.setTilt(pitch);
        if (bearing !== undefined) map.setHeading(bearing);
      }
    },
  }));

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {map && (
        <MapContext.Provider value={{ map, isLoaded }}>
          {children}
        </MapContext.Provider>
      )}
    </div>
  );
});

Map.displayName = "Map";

// Marker Context
const MarkerContext = createContext<{ container: HTMLDivElement } | null>(null);

// MapMarker Component
export function MapMarker({
  longitude,
  latitude,
  onClick,
  children,
}: {
  longitude: number;
  latitude: number;
  onClick?: () => void;
  children: ReactNode;
}) {
  const { map } = useMap();
  const [container] = useState(() => {
    const div = document.createElement("div");
    div.style.cursor = "pointer";
    div.style.position = "absolute";
    return div;
  });

  useEffect(() => {
    if (!map) return;

    const google = (window as any).google;
    const OverlayClass = getReactOverlayClass();
    if (!OverlayClass) return;

    const latlng = new google.maps.LatLng(latitude, longitude);
    const overlay = new OverlayClass(container, latlng);
    overlay.setMap(map);

    let clickListener: any = null;
    if (onClick) {
      clickListener = container.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
      });
    }

    return () => {
      overlay.setMap(null);
      if (onClick && clickListener) {
        container.removeEventListener("click", clickListener);
      }
    };
  }, [map, latitude, longitude, onClick, container]);

  return (
    <MarkerContext.Provider value={{ container }}>
      {children}
    </MarkerContext.Provider>
  );
}

// MarkerContent Component
export function MarkerContent({ children }: { children: ReactNode }) {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("MarkerContent must be used within MapMarker");
  }
  return createPortal(children, context.container);
}

// MapControls Component
export function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
}) {
  const { map } = useMap();

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-12 right-4",
  };

  return (
    <div
      className={`absolute z-10 flex flex-col gap-2 ${positionClasses[position]}`}
      style={{ pointerEvents: "auto" }}
    >
      {showZoom && (
        <div className="flex flex-col rounded-lg overflow-hidden border border-[#d4cc9a] bg-[#faf5d0] shadow-md">
          <button
            onClick={() => map?.setZoom((map.getZoom() || 14) + 1)}
            className="p-2 text-[#283618] hover:bg-[#bc6c25] hover:text-[#fefae0] transition-colors"
            title="Zoom In"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => map?.setZoom((map.getZoom() || 14) - 1)}
            className="p-2 text-[#283618] border-t border-[#d4cc9a] hover:bg-[#bc6c25] hover:text-[#fefae0] transition-colors"
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>
        </div>
      )}
      {showCompass && (
        <button
          onClick={() => {
            map?.setHeading(0);
            map?.setTilt(0);
          }}
          className="p-2 rounded-lg border border-[#d4cc9a] bg-[#faf5d0] text-[#283618] shadow-md hover:bg-[#bc6c25] hover:text-[#fefae0] transition-colors"
          title="Reset Orientation"
        >
          <Compass size={18} />
        </button>
      )}
    </div>
  );
}
