import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation2, X, ChevronDown, Loader2,
  MapPin, Clock, Ruler, RotateCcw, Route
} from "lucide-react";
import { pacitanData, PlaceFeature, categoryConfig } from "@/data/pacitan-data";
import L from "leaflet";

export interface RouteInfo {
  distance: number;
  duration: number;
  geometry: [number, number][];
}

interface RoutePanelProps {
  userPos: L.LatLng | null;
  routeInfo: RouteInfo | null;
  onRouteFound: (info: RouteInfo) => void;
  onRouteClear: () => void;
}

const ALL_PLACES = pacitanData.features.filter(
  (f): f is PlaceFeature => f.geometry.type === "Point" && !!f.properties.name
) as PlaceFeature[];

type OriginType = "gps" | "place";

function PlaceSelect({
  value,
  onChange,
  placeholder,
  excludeId,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  excludeId?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = ALL_PLACES.filter(
    (p) =>
      p.properties.osm_id !== excludeId &&
      p.properties.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const selected = ALL_PLACES.find((p) => String(p.properties.osm_id) === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: open ? "1px solid rgba(56,178,216,0.5)" : "1px solid rgba(255,255,255,0.1)",
          boxShadow: open ? "0 0 0 3px rgba(56,178,216,0.1)" : "none",
        }}
      >
        {selected ? (
          <>
            <span className="text-sm">{categoryConfig[selected.properties.category].icon}</span>
            <span className="flex-1 text-xs font-semibold text-white truncate">
              {selected.properties.name}
            </span>
          </>
        ) : (
          <span className="flex-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            {placeholder}
          </span>
        )}
        <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.13 }}
            className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50"
            style={{
              background: "rgba(8, 22, 34, 0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(56,178,216,0.2)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div className="p-2 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari tempat..."
                className="w-full bg-transparent outline-none text-xs text-white placeholder:text-white/30 px-2 py-1"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Tidak ditemukan
                </p>
              ) : (
                filtered.map((p) => {
                  const cfg = categoryConfig[p.properties.category];
                  return (
                    <button
                      key={p.properties.osm_id}
                      type="button"
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(56,178,216,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                      onClick={() => {
                        onChange(String(p.properties.osm_id));
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: cfg.color + "25" }}
                      >
                        {cfg.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {p.properties.name}
                        </p>
                        <p className="text-xs truncate" style={{ color: cfg.color, opacity: 0.8 }}>
                          {cfg.label}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} menit`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h} jam ${rem} menit` : `${h} jam`;
}

export default function RoutePanel({ userPos, routeInfo, onRouteFound, onRouteClear }: RoutePanelProps) {
  const [open, setOpen] = useState(false);
  const [originType, setOriginType] = useState<OriginType>("gps");
  const [originId, setOriginId] = useState("");
  const [destId, setDestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originPlace = ALL_PLACES.find((p) => String(p.properties.osm_id) === originId);
  const destPlace = ALL_PLACES.find((p) => String(p.properties.osm_id) === destId);

  // Determine if we can search
  const canSearch =
    destId &&
    ((originType === "gps" && userPos) || (originType === "place" && originId));

  async function handleSearch() {
    if (!canSearch) return;
    setLoading(true);
    setError(null);

    try {
      let originLng: number, originLat: number;

      if (originType === "gps" && userPos) {
        originLat = userPos.lat;
        originLng = userPos.lng;
      } else if (originPlace) {
        [originLng, originLat] = originPlace.geometry.coordinates;
      } else {
        throw new Error("Origin tidak valid");
      }

      const [destLng, destLat] = destPlace!.geometry.coordinates;

      const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil rute");

      const data = await res.json();
      if (!data.routes?.length) throw new Error("Rute tidak ditemukan");

      const route = data.routes[0];
      const geometry: [number, number][] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );
      const { distance, duration } = route.legs[0];

      onRouteFound({ distance, duration, geometry });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal mengambil rute");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    onRouteClear();
    setOriginId("");
    setDestId("");
    setError(null);
  }

  // Close dropdown on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10, 30, 45, 0.88)",
        backdropFilter: "blur(20px)",
        border: routeInfo
          ? "1px solid rgba(56,178,216,0.4)"
          : "1px solid rgba(56, 178, 216, 0.2)",
        boxShadow: routeInfo
          ? "0 8px 32px rgba(56,178,216,0.15)"
          : "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: "200px",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="button-route-toggle"
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{ borderBottom: open ? "1px solid rgba(56, 178, 216, 0.12)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <Route size={15} style={{ color: routeInfo ? "#38b2d8" : "#38b2d8" }} />
          <span className="text-xs font-bold text-white">Rute Perjalanan</span>
          {routeInfo && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(56,178,216,0.2)", color: "#38b2d8" }}
            >
              Aktif
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3">
              {/* Route result card */}
              <AnimatePresence>
                {routeInfo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="rounded-xl p-3 space-y-2"
                    style={{
                      background: "rgba(56,178,216,0.1)",
                      border: "1px solid rgba(56,178,216,0.25)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Ruler size={12} style={{ color: "#38b2d8" }} />
                      <span className="text-xs font-bold text-white">
                        {formatDistance(routeInfo.distance)}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <Clock size={12} style={{ color: "#f0c060" }} />
                      <span className="text-xs font-semibold" style={{ color: "#f0c060" }}>
                        {formatDuration(routeInfo.duration)}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Estimasi rute mengemudi
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Origin */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Asal
                  </span>
                </div>

                {/* GPS / Place toggle */}
                <div
                  className="flex rounded-xl overflow-hidden p-0.5"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {(["gps", "place"] as OriginType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOriginType(t)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: originType === t ? "rgba(56,178,216,0.25)" : "transparent",
                        color: originType === t ? "#38b2d8" : "rgba(255,255,255,0.35)",
                        border: originType === t ? "1px solid rgba(56,178,216,0.3)" : "1px solid transparent",
                      }}
                    >
                      {t === "gps" ? (
                        <>
                          <Navigation2 size={11} />
                          <span>Lokasi Saya</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={11} />
                          <span>Pilih Tempat</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                {originType === "gps" ? (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {userPos ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {userPos.lat.toFixed(5)}°, {userPos.lng.toFixed(5)}°
                        </span>
                      </>
                    ) : (
                      <>
                        <Navigation2 size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                          Klik tombol GPS di peta dulu
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <PlaceSelect
                    value={originId}
                    onChange={setOriginId}
                    placeholder="Pilih tempat asal..."
                    excludeId={destPlace?.properties.osm_id}
                  />
                )}
              </div>

              {/* Arrow between */}
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(56,178,216,0.12)" }}
                >
                  <ChevronDown size={12} style={{ color: "#38b2d8" }} />
                </div>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Destination */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Tujuan
                  </span>
                </div>
                <PlaceSelect
                  value={destId}
                  onChange={setDestId}
                  placeholder="Pilih tempat tujuan..."
                  excludeId={originPlace?.properties.osm_id}
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    <X size={12} style={{ color: "#ef4444", flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: "#ef4444" }}>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={!canSearch || loading}
                  data-testid="button-find-route"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: canSearch && !loading ? "linear-gradient(135deg, #38b2d8, #0f6e99)" : "rgba(255,255,255,0.07)",
                    color: canSearch && !loading ? "white" : "rgba(255,255,255,0.3)",
                    cursor: canSearch && !loading ? "pointer" : "not-allowed",
                    boxShadow: canSearch && !loading ? "0 4px 16px rgba(56,178,216,0.3)" : "none",
                  }}
                >
                  {loading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Route size={13} />
                  )}
                  {loading ? "Mencari..." : "Cari Rute"}
                </button>

                {(routeInfo || originId || destId) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    data-testid="button-clear-route"
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    title="Hapus rute"
                  >
                    <RotateCcw size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
