import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Plus, Minus, Navigation } from "lucide-react";
import {
  pacitanData,
  PlaceFeature,
  RoadFeature,
  PlaceCategory,
  GeoFeature,
  categoryConfig,
  PACITAN_CENTER,
} from "@/data/pacitan-data";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createMarkerIcon(category: PlaceCategory, selected: boolean) {
  const cfg = categoryConfig[category];
  const size = selected ? 44 : 36;
  return L.divIcon({
    className: "",
    html: `<div style="
      background: ${cfg.color};
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${selected ? 22 : 18}px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.35), 0 0 0 ${selected ? "4px" : "2px"} rgba(255,255,255,0.8);
      border: 2px solid white;
    ">${cfg.icon}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

const ROAD_STYLES: Record<string, { color: string; weight: number; opacity: number; dash?: string }> = {
  primary:     { color: "#e74c3c", weight: 4,   opacity: 0.8 },
  secondary:   { color: "#f39c12", weight: 3,   opacity: 0.75 },
  tertiary:    { color: "#3498db", weight: 2.5, opacity: 0.7, dash: "8 5" },
  residential: { color: "#95a5a6", weight: 1.5, opacity: 0.6, dash: "4 4" },
};

// ── inner components that must live inside <MapContainer> ──────────────────

function CoordDisplay() {
  const [coord, setCoord] = useState<string>("Arahkan kursor ke peta");

  useMapEvents({
    mousemove(e) {
      setCoord(`${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
    },
  });

  return (
    <div
      className="absolute bottom-4 left-4 z-[1000] px-3 py-1.5 rounded-lg text-xs font-mono pointer-events-none"
      style={{
        background: "rgba(10, 30, 45, 0.82)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(56, 178, 216, 0.18)",
        color: "rgba(255,255,255,0.55)",
      }}
    >
      {coord}
    </div>
  );
}

function GPSLocator({
  locating,
  onLocated,
  onError,
}: {
  locating: boolean;
  onLocated: (latlng: L.LatLng) => void;
  onError: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!locating) return;
    map.locate({ setView: true, maxZoom: 15 });

    const onFound = (e: L.LocationEvent) => onLocated(e.latlng);
    const onErr = () => onError();
    map.on("locationfound", onFound);
    map.on("locationerror", onErr);

    return () => {
      map.off("locationfound", onFound);
      map.off("locationerror", onErr);
    };
  }, [locating]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function MapControls({
  onLocate,
  locating,
}: {
  onLocate: () => void;
  locating: boolean;
}) {
  const map = useMap();

  const btnBase: React.CSSProperties = {
    background: "rgba(10, 30, 45, 0.90)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(56, 178, 216, 0.25)",
    borderRadius: "0.75rem",
    color: "white",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div className="absolute right-4 bottom-28 z-[1000] flex flex-col gap-2">
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => map.zoomIn()}
        data-testid="button-zoom-in"
        style={btnBase}
        title="Zoom In"
      >
        <Plus size={18} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => map.zoomOut()}
        data-testid="button-zoom-out"
        style={btnBase}
        title="Zoom Out"
      >
        <Minus size={18} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onLocate}
        data-testid="button-gps-locate"
        style={{
          ...btnBase,
          background: locating ? "rgba(56, 178, 216, 0.28)" : btnBase.background,
          border: locating ? "1px solid rgba(56, 178, 216, 0.65)" : btnBase.border,
        }}
        title="Lokasi Saya (GPS)"
      >
        <Navigation size={17} style={{ color: locating ? "#38b2d8" : "white" }} />
      </motion.button>
    </div>
  );
}

// ── main export ────────────────────────────────────────────────────────────

interface MapViewProps {
  visibleLayers: Record<PlaceCategory, boolean>;
  selectedPlace: GeoFeature | null;
  onSelectPlace: (feature: GeoFeature | null) => void;
  searchQuery: string;
  searchResults: GeoFeature[];
  onSearchResults: (results: GeoFeature[]) => void;
}

export default function MapView({ visibleLayers, selectedPlace, onSelectPlace }: MapViewProps) {
  const [locating, setLocating] = useState(false);
  const [userPos, setUserPos] = useState<L.LatLng | null>(null);

  const handleLocated = useCallback((latlng: L.LatLng) => {
    setUserPos(latlng);
    setLocating(false);
  }, []);

  const handleLocateError = useCallback(() => {
    setLocating(false);
  }, []);

  // Separate point features by category (respecting toggle)
  const pointFeatures = pacitanData.features.filter((f): f is PlaceFeature => {
    if (f.geometry.type !== "Point") return false;
    return visibleLayers[(f as PlaceFeature).properties.category] !== false;
  });

  // Road features
  const roadFeatures = visibleLayers["road"]
    ? pacitanData.features.filter((f): f is RoadFeature => f.geometry.type === "LineString")
    : [];

  return (
    <div className="absolute inset-0 w-full h-full" data-testid="map-container">
      <MapContainer
        center={PACITAN_CENTER}
        zoom={12}
        minZoom={9}
        maxZoom={18}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Roads */}
        {roadFeatures.map((f, idx) => {
          const type = f.properties.road_type ?? "tertiary";
          const style = ROAD_STYLES[type] ?? ROAD_STYLES.tertiary;
          const positions = f.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng] as [number, number]
          );
          return (
            <Polyline
              key={`road-${idx}`}
              positions={positions}
              color={style.color}
              weight={style.weight}
              opacity={style.opacity}
              dashArray={style.dash}
            />
          );
        })}

        {/* Place Markers */}
        {pointFeatures.map((f) => {
          const [lng, lat] = f.geometry.coordinates;
          const isSelected =
            selectedPlace?.geometry.type === "Point" &&
            (selectedPlace as PlaceFeature).properties.osm_id === f.properties.osm_id;

          return (
            <Marker
              key={f.properties.osm_id}
              position={[lat, lng]}
              icon={createMarkerIcon(f.properties.category, isSelected)}
              eventHandlers={{ click: () => onSelectPlace(f) }}
            />
          );
        })}

        {/* GPS "You are here" marker */}
        {userPos && (
          <Marker
            position={userPos}
            icon={L.divIcon({
              className: "",
              html: `<div style="
                width:20px;height:20px;
                background:#38b2d8;border-radius:50%;
                border:3px solid white;
                box-shadow:0 0 0 8px rgba(56,178,216,0.25),0 3px 10px rgba(0,0,0,0.4);
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
        )}

        <CoordDisplay />
        <GPSLocator locating={locating} onLocated={handleLocated} onError={handleLocateError} />
        <MapControls onLocate={() => setLocating(true)} locating={locating} />
      </MapContainer>

      {/* Attribution */}
      <div
        className="absolute bottom-4 right-4 z-[999] text-xs px-2 py-1 rounded pointer-events-none"
        style={{ background: "rgba(10,30,45,0.7)", color: "rgba(255,255,255,0.4)" }}
      >
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
