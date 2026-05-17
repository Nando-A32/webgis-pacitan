import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

// ── Fixed-position dropdown (escapes overflow-hidden parents) ─────────────────

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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = ALL_PLACES.filter(
    (p) =>
      p.properties.osm_id !== excludeId &&
      p.properties.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 7);

  const selected = ALL_PLACES.find((p) => String(p.properties.osm_id) === value);

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    }
    setOpen((v) => !v);
  }

  // Close on outside click or ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        // small delay so clicks inside dropdown register first
        setTimeout(() => setOpen(false), 120);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onDown); };
  }, [open]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else setQuery("");
  }, [open]);

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.13 }}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 9999,
            background: "rgba(6, 18, 28, 0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56,178,216,0.25)",
            borderRadius: "0.875rem",
            boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
            overflow: "hidden",
          }}
        >
          {/* Search input */}
          <div
            className="flex items-center gap-2 px-3 py-2.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tempat..."
              className="flex-1 bg-transparent outline-none text-xs text-white"
              style={{ caretColor: "#38b2d8" }}
            />
            {query && (
              <button onClick={() => setQuery("")} className="flex-shrink-0">
                <X size={11} style={{ color: "rgba(255,255,255,0.35)" }} />
              </button>
            )}
          </div>

          {/* Results list */}
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <p className="text-xs text-center py-5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Tidak ditemukan
              </p>
            ) : (
              filtered.map((p, i) => {
                const cfg = categoryConfig[p.properties.category];
                return (
                  <button
                    key={p.properties.osm_id}
                    type="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(56,178,216,0.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    onMouseDown={(e) => e.preventDefault()} // prevent blur before click
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
                      <p className="text-xs font-semibold text-white truncate">{p.properties.name}</p>
                      <p className="text-xs truncate" style={{ color: cfg.color, opacity: 0.75 }}>
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
  );

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: open ? "1px solid rgba(56,178,216,0.5)" : "1px solid rgba(255,255,255,0.1)",
          boxShadow: open ? "0 0 0 3px rgba(56,178,216,0.1)" : "none",
        }}
      >
        {selected ? (
          <>
            <span className="text-sm leading-none">{categoryConfig[selected.properties.category].icon}</span>
            <span className="flex-1 text-xs font-semibold text-white truncate">
              {selected.properties.name}
            </span>
          </>
        ) : (
          <span className="flex-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            {placeholder}
          </span>
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
        </motion.div>
      </button>

      {createPortal(dropdown, document.body)}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── RoutePanel ────────────────────────────────────────────────────────────────

export default function RoutePanel({ userPos, routeInfo, onRouteFound, onRouteClear }: RoutePanelProps) {
  const [open, setOpen] = useState(false);
  const [originType, setOriginType] = useState<OriginType>("gps");
  const [originId, setOriginId] = useState("");
  const [destId, setDestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originPlace = ALL_PLACES.find((p) => String(p.properties.osm_id) === originId);
  const destPlace = ALL_PLACES.find((p) => String(p.properties.osm_id) === destId);

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
      onRouteFound({ distance: route.legs[0].distance, duration: route.legs[0].duration, geometry });
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

  return (
    <div
      className="rounded-2xl"
      style={{
        background: "rgba(10, 30, 45, 0.88)",
        backdropFilter: "blur(20px)",
        border: routeInfo ? "1px solid rgba(56,178,216,0.4)" : "1px solid rgba(56,178,216,0.2)",
        boxShadow: routeInfo ? "0 8px 32px rgba(56,178,216,0.15)" : "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: "200px",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="button-route-toggle"
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors"
        style={{ borderBottom: open ? "1px solid rgba(56,178,216,0.12)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <Route size={15} style={{ color: "#38b2d8" }} />
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
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
        </motion.div>
      </button>

      {/* Expandable body — no overflow-hidden so dropdowns can escape */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "visible" }}
          >
            <div className="px-3 pb-3 pt-2 space-y-3">

              {/* Route result */}
              <AnimatePresence>
                {routeInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl p-3"
                    style={{
                      background: "rgba(56,178,216,0.1)",
                      border: "1px solid rgba(56,178,216,0.25)",
                    }}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Ruler size={12} style={{ color: "#38b2d8" }} />
                        <span className="text-xs font-bold text-white">
                          {formatDistance(routeInfo.distance)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} style={{ color: "#f0c060" }} />
                        <span className="text-xs font-semibold" style={{ color: "#f0c060" }}>
                          {formatDuration(routeInfo.duration)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Estimasi rute mengemudi
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Origin ── */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#34d399" }} />
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Asal
                  </span>
                </div>

                {/* Toggle GPS / Place */}
                <div
                  className="flex rounded-xl p-0.5 gap-0.5"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {(["gps", "place"] as OriginType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOriginType(t)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: originType === t ? "rgba(56,178,216,0.22)" : "transparent",
                        color: originType === t ? "#38b2d8" : "rgba(255,255,255,0.35)",
                        border: originType === t ? "1px solid rgba(56,178,216,0.3)" : "1px solid transparent",
                      }}
                    >
                      {t === "gps" ? <Navigation2 size={11} /> : <MapPin size={11} />}
                      <span>{t === "gps" ? "Lokasi Saya" : "Pilih Tempat"}</span>
                    </button>
                  ))}
                </div>

                {originType === "gps" ? (
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {userPos ? (
                      <>
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }}
                        />
                        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {userPos.lat.toFixed(5)}°, {userPos.lng.toFixed(5)}°
                        </span>
                      </>
                    ) : (
                      <>
                        <Navigation2 size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                          Aktifkan GPS di peta terlebih dulu
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

              {/* Arrow divider */}
              <div className="flex items-center gap-2 px-1 py-0.5">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(56,178,216,0.12)", border: "1px solid rgba(56,178,216,0.2)" }}
                >
                  <ChevronDown size={11} style={{ color: "#38b2d8" }} />
                </div>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* ── Destination ── */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#f87171" }} />
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
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
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
                  >
                    <X size={12} style={{ color: "#ef4444", flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: "#ef4444" }}>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={!canSearch || loading}
                  data-testid="button-find-route"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: canSearch && !loading
                      ? "linear-gradient(135deg, #38b2d8, #0d6a93)"
                      : "rgba(255,255,255,0.07)",
                    color: canSearch && !loading ? "white" : "rgba(255,255,255,0.25)",
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
                    title="Hapus rute"
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.15)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                  >
                    <RotateCcw size={13} style={{ color: "rgba(255,255,255,0.45)" }} />
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
