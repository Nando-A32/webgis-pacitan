import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Clock, Star } from "lucide-react";
import { GeoFeature, PlaceFeature, categoryConfig } from "@/data/pacitan-data";

interface InfoPanelProps {
  place: GeoFeature | null;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-400"}
        />
      ))}
      <span className="text-sm font-semibold ml-1" style={{ color: "#f0c060" }}>{rating.toFixed(1)}</span>
    </div>
  );
}

export default function InfoPanel({ place, onClose }: InfoPanelProps) {
  const isPlace = place && place.geometry.type === "Point";
  const feature = isPlace ? (place as PlaceFeature) : null;

  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          key="info-panel"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-4 z-[1001] w-80 md:w-96 max-h-[70vh] overflow-y-auto"
          style={{
            background: "rgba(10, 30, 45, 0.92)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 178, 216, 0.2)",
            borderRadius: "1.25rem",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            className="relative p-5 pb-4"
            style={{ borderBottom: "1px solid rgba(56, 178, 216, 0.15)" }}
          >
            <button
              onClick={onClose}
              data-testid="button-close-info"
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <X size={16} className="text-white" />
            </button>

            {(() => {
              const cat = feature.properties.category;
              const cfg = categoryConfig[cat];
              return (
                <div className="flex items-start gap-3 pr-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 mt-0.5"
                    style={{ background: cfg.color + "30", border: `1px solid ${cfg.color}60` }}
                  >
                    {cfg.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight mb-1">
                      {feature.properties.name}
                    </h2>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: cfg.color + "25", color: cfg.color, border: `1px solid ${cfg.color}40` }}
                    >
                      {feature.properties.type_label}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {feature.properties.rating && (
              <StarRating rating={feature.properties.rating} />
            )}

            {feature.properties.description && (
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                {feature.properties.description}
              </p>
            )}

            <div className="space-y-2.5">
              {feature.properties.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#38b2d8" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {feature.properties.address}
                  </span>
                </div>
              )}

              {feature.properties.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="flex-shrink-0" style={{ color: "#38b2d8" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {feature.properties.phone}
                  </span>
                </div>
              )}

              {feature.properties.open_hours && (
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="flex-shrink-0" style={{ color: "#38b2d8" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {feature.properties.open_hours}
                  </span>
                </div>
              )}
            </div>

            {/* Coordinates */}
            <div
              className="text-xs px-3 py-2 rounded-lg font-mono"
              style={{ background: "rgba(56, 178, 216, 0.1)", color: "rgba(255,255,255,0.4)" }}
            >
              {(feature.geometry.coordinates[1]).toFixed(6)}, {(feature.geometry.coordinates[0]).toFixed(6)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
