import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Clock, Star, ExternalLink } from "lucide-react";
import { GeoFeature, PlaceFeature, categoryConfig } from "@/data/pacitan-data";

interface InfoPanelProps {
  place: GeoFeature | null;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={star <= Math.round(rounded) ? "fill-amber-400 text-amber-400" : "text-gray-600"}
          />
        ))}
      </div>
      <span className="text-sm font-bold" style={{ color: "#f0c060" }}>{rating.toFixed(1)}</span>
      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>/ 5.0</span>
    </div>
  );
}

function InfoRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(56,178,216,0.12)", border: "1px solid rgba(56,178,216,0.2)" }}
      >
        {icon}
      </div>
      <div className="flex-1 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
        {children}
      </div>
    </div>
  );
}

export default function InfoPanel({ place, onClose }: InfoPanelProps) {
  const isPlace = place && place.geometry.type === "Point";
  const feature = isPlace ? (place as PlaceFeature) : null;

  return (
    <AnimatePresence>
      {feature && (() => {
        const cat = feature.properties.category;
        const cfg = categoryConfig[cat];
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];

        return (
          <motion.div
            key="info-panel"
            initial={{ opacity: 0, x: 80, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-10 right-4 z-[1001] w-80 md:w-96"
            style={{ maxHeight: "calc(100dvh - 100px)" }}
          >
            <div
              className="flex flex-col overflow-hidden"
              style={{
                background: "rgba(8, 22, 34, 0.96)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(56, 178, 216, 0.18)",
                borderRadius: "1.5rem",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              {/* Color accent top bar */}
              <div
                className="h-1.5 w-full flex-shrink-0"
                style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}55)` }}
              />

              {/* Header */}
              <div className="relative p-5 pb-4 flex-shrink-0">
                <button
                  onClick={onClose}
                  data-testid="button-close-info"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.16)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                >
                  <X size={14} className="text-white" />
                </button>

                <div className="flex items-start gap-3.5 pr-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${cfg.color}35, ${cfg.color}15)`,
                      border: `1px solid ${cfg.color}50`,
                      boxShadow: `0 4px 16px ${cfg.color}25`,
                    }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-white leading-tight mb-1.5 pr-2">
                      {feature.properties.name}
                    </h2>
                    <span
                      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: cfg.color + "20",
                        color: cfg.color,
                        border: `1px solid ${cfg.color}40`,
                      }}
                    >
                      {feature.properties.type_label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(56, 178, 216, 0.1)", margin: "0 20px" }} />

              {/* Scrollable Body */}
              <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: "50vh" }}>
                {feature.properties.rating !== undefined && (
                  <StarRating rating={feature.properties.rating} />
                )}

                {feature.properties.description && (
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {feature.properties.description}
                  </p>
                )}

                <div className="space-y-2.5">
                  {feature.properties.address && (
                    <InfoRow icon={<MapPin size={13} style={{ color: "#38b2d8" }} />}>
                      {feature.properties.address}
                    </InfoRow>
                  )}
                  {feature.properties.phone && (
                    <InfoRow icon={<Phone size={13} style={{ color: "#38b2d8" }} />}>
                      <a
                        href={`tel:${feature.properties.phone}`}
                        className="hover:underline"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {feature.properties.phone}
                      </a>
                    </InfoRow>
                  )}
                  {feature.properties.open_hours && (
                    <InfoRow icon={<Clock size={13} style={{ color: "#38b2d8" }} />}>
                      {feature.properties.open_hours}
                    </InfoRow>
                  )}
                </div>

                {/* Coordinates */}
                <div
                  className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(56, 178, 216, 0.08)", border: "1px solid rgba(56,178,216,0.15)" }}
                >
                  <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {lat.toFixed(6)}, {lng.toFixed(6)}
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold ml-2 flex-shrink-0"
                    style={{ color: "#38b2d8" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    <ExternalLink size={12} />
                    Google Maps
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
}
