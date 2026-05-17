import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Navigation, Home, Layers } from "lucide-react";
import {
  pacitanData,
  PlaceFeature,
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

export type BasemapType = "osm" | "satellite" | "dark";

const BASEMAPS: Record<BasemapType, { label: string; icon: string; url: string; attribution: string }> = {
  osm: {
    label: "Peta",
    icon: "🗺️",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  },
  satellite: {
    label: "Satelit",
    icon: "🛰️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri, Maxar, GeoEye",
  },
  dark: {
    label: "Gelap",
    icon: "🌑",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
  },
};

function createMarkerIcon(category: PlaceCategory, selected: boolean) {
  const cfg = categoryConfig[category];
  const size = selected ? 46 : 36;
  const pulse = selected
    ? `<div style="
        position:absolute;
        inset:-6px;
        border-radius:50%;
        border:2px solid ${cfg.color};
        animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;
        opacity:0.6;
      "></div>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      ${pulse}
      <div style="
        position:absolute;inset:0;
        background: ${cfg.color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${selected ? 22 : 17}px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.45), 0 0 0 ${selected ? "3px" : "2px"} rgba(255,255,255,0.85);
        border: 2px solid white;
      ">${cfg.icon}</div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

// ── CoordDisplay ──────────────────────────────────────────────────────────────

function CoordDisplay() {
  const [coord, setCoord] = useState<string>("");

  useMapEvents({
    mousemove(e) {
      setCoord(`${e.latlng.lat.toFixed(5)}°, ${e.latlng.lng.toFixed(5)}°`);
    },
    mouseout() {
      setCoord("");
    },
  });

  return (
    <AnimatePresence>
      {coord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-10 left-4 z-[1000] px-3 py-1.5 rounded-lg text-xs font-mono pointer-events-none"
          style={{
            background: "rgba(8, 22, 34, 0.88)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(56, 178, 216, 0.2)",
            color: "rgba(255,255,255,0.6)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          📍 {coord}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── GPSLocator ────────────────────────────────────────────────────────────────

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

// ── ResetViewButton ───────────────────────────────────────────────────────────

function ResetViewButton() {
  const map = useMap();

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => map.flyTo(PACITAN_CENTER, 12, { duration: 1.2 })}
      data-testid="button-reset-view"
      title="Kembali ke Pacitan"
      className="w-10 h-10 flex items-center justify-center rounded-xl text-white"
      style={{
        background: "rgba(10, 30, 45, 0.90)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(56, 178, 216, 0.25)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
      }}
    >
      <Home size={16} />
    </motion.button>
  );
}

// ── MapControls ───────────────────────────────────────────────────────────────

function MapControls({
  onLocate,
  locating,
  basemap,
  onBasemapChange,
}: {
  onLocate: () => void;
  locating: boolean;
  basemap: BasemapType;
  onBasemapChange: (b: BasemapType) => void;
}) {
  const map = useMap();
  const [showBasemap, setShowBasemap] = useState(false);

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
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
  };

  return (
    <>
      {/* Zoom + GPS + Home buttons */}
      <div className="absolute right-4 bottom-20 z-[1000] flex flex-col gap-2">
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          onClick={() => map.zoomIn()} style={btnBase} title="Zoom In">
          <Plus size={18} />
        </motion.button>

        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          onClick={() => map.zoomOut()} style={btnBase} title="Zoom Out">
          <Minus size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          onClick={onLocate}
          title="Lokasi Saya (GPS)"
          style={{
            ...btnBase,
            background: locating ? "rgba(56, 178, 216, 0.28)" : btnBase.background,
            border: locating ? "1px solid rgba(56, 178, 216, 0.65)" : btnBase.border,
          }}
        >
          <Navigation size={17} style={{ color: locating ? "#38b2d8" : "white" }} />
        </motion.button>

        <ResetViewButton />

        {/* Basemap toggle button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={() => setShowBasemap((v) => !v)}
            title="Ganti Basemap"
            style={{
              ...btnBase,
              background: showBasemap ? "rgba(56, 178, 216, 0.25)" : btnBase.background,
              border: showBasemap ? "1px solid rgba(56, 178, 216, 0.55)" : btnBase.border,
            }}
          >
            <Layers size={16} style={{ color: showBasemap ? "#38b2d8" : "white" }} />
          </motion.button>

          <AnimatePresence>
            {showBasemap && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-12 top-0 rounded-xl overflow-hidden"
                style={{
                  background: "rgba(8, 22, 34, 0.96)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(56, 178, 216, 0.2)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  minWidth: 130,
                }}
              >
                {(Object.keys(BASEMAPS) as BasemapType[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { onBasemapChange(key); setShowBasemap(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                    style={{
                      background: basemap === key ? "rgba(56, 178, 216, 0.15)" : "transparent",
                      borderLeft: basemap === key ? "2px solid #38b2d8" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => { if (basemap !== key) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { if (basemap !== key) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span className="text-base">{BASEMAPS[key].icon}</span>
                    <span className="text-xs font-semibold text-white">{BASEMAPS[key].label}</span>
                    {basemap === key && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#38b2d8" }} />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ── FitRouteBounds ────────────────────────────────────────────────────────────

function FitRouteBounds({ geometry }: { geometry: [number, number][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!geometry || geometry.length === 0) return;
    const bounds = L.latLngBounds(geometry.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, duration: 1.2 });
  }, [geometry]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// ── main export ───────────────────────────────────────────────────────────────

interface MapViewProps {
  visibleLayers: Record<PlaceCategory, boolean>;
  selectedPlace: GeoFeature | null;
  onSelectPlace: (feature: GeoFeature | null) => void;
  searchQuery: string;
  searchResults: GeoFeature[];
  onSearchResults: (results: GeoFeature[]) => void;
  routeGeometry?: [number, number][] | null;
  onUserLocated?: (latlng: L.LatLng | null) => void;
}

export default function MapView({
  visibleLayers, selectedPlace, onSelectPlace,
  routeGeometry, onUserLocated,
}: MapViewProps) {
  const [locating, setLocating] = useState(false);
  const [userPos, setUserPos] = useState<L.LatLng | null>(null);
  const [basemap, setBasemap] = useState<BasemapType>("osm");

  const handleLocated = useCallback((latlng: L.LatLng) => {
    setUserPos(latlng);
    setLocating(false);
    onUserLocated?.(latlng);
  }, [onUserLocated]);

  const handleLocateError = useCallback(() => {
    setLocating(false);
  }, []);

  const pointFeatures = pacitanData.features.filter((f): f is PlaceFeature => {
    if (f.geometry.type !== "Point") return false;
    return visibleLayers[(f as PlaceFeature).properties.category] !== false;
  });

  const bm = BASEMAPS[basemap];

  return (
    <div className="absolute inset-0 w-full h-full" data-testid="map-container">
      {/* ping animation for selected marker */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <MapContainer
        center={PACITAN_CENTER}
        zoom={12}
        minZoom={9}
        maxZoom={18}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer key={basemap} url={bm.url} attribution={bm.attribution} />

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
            >
              <Tooltip
                direction="top"
                offset={[0, -18]}
                opacity={1}
                permanent={false}
                className="webgis-tooltip"
              >
                <div
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                  style={{
                    background: "rgba(8, 22, 34, 0.92)",
                    color: "white",
                    border: `1px solid ${categoryConfig[f.properties.category].color}55`,
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  }}
                >
                  {categoryConfig[f.properties.category].icon} {f.properties.name}
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {/* Route Polyline */}
        {routeGeometry && routeGeometry.length > 1 && (
          <>
            {/* Shadow / outline */}
            <Polyline
              positions={routeGeometry}
              color="rgba(0,0,0,0.35)"
              weight={9}
              opacity={1}
            />
            {/* Main route line */}
            <Polyline
              positions={routeGeometry}
              color="#38b2d8"
              weight={5}
              opacity={0.9}
            />
            {/* Animated dash overlay */}
            <Polyline
              positions={routeGeometry}
              color="white"
              weight={2}
              opacity={0.6}
              dashArray="10 16"
            />
          </>
        )}

        {/* GPS "You are here" marker */}
        {userPos && (
          <Marker
            position={userPos}
            icon={L.divIcon({
              className: "",
              html: `<div style="position:relative;width:24px;height:24px;">
                <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(56,178,216,0.2);animation:ping 1.6s ease infinite;"></div>
                <div style="position:absolute;inset:0;width:24px;height:24px;background:#38b2d8;border-radius:50%;border:3px solid white;box-shadow:0 3px 12px rgba(56,178,216,0.5);"></div>
              </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Tooltip direction="top" offset={[0, -16]} opacity={1} permanent={false}>
              <div className="px-2 py-1 text-xs font-semibold" style={{ color: "#38b2d8" }}>
                📍 Lokasi Anda
              </div>
            </Tooltip>
          </Marker>
        )}

        <FitRouteBounds geometry={routeGeometry ?? null} />

        <CoordDisplay />
        <GPSLocator locating={locating} onLocated={handleLocated} onError={handleLocateError} />
        <MapControls onLocate={() => setLocating(true)} locating={locating} basemap={basemap} onBasemapChange={setBasemap} />
      </MapContainer>

      {/* Attribution */}
      <div
        className="absolute bottom-8 right-4 z-[999] text-xs px-2 py-1 rounded pointer-events-none"
        style={{ background: "rgba(8,22,34,0.75)", color: "rgba(255,255,255,0.3)" }}
      >
        {bm.attribution}
      </div>
    </div>
  );
}
