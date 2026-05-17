import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronDown } from "lucide-react";
import { PlaceCategory, categoryConfig, pacitanData, PlaceFeature } from "@/data/pacitan-data";

interface LayerControlProps {
  visibleLayers: Record<PlaceCategory, boolean>;
  onLayerChange: (layers: Record<PlaceCategory, boolean>) => void;
}

const CATEGORIES: PlaceCategory[] = [
  "attraction",
  "museum",
  "hospital",
  "hotel",
  "accommodation",
  "restaurant",
  "road",
];

function getCategoryCount(cat: PlaceCategory): number {
  return pacitanData.features.filter((f) => {
    if (cat === "road") return f.geometry.type === "LineString";
    if (f.geometry.type !== "Point") return false;
    const p = (f as PlaceFeature).properties;
    return p.category === cat;
  }).length;
}

export default function LayerControl({ visibleLayers, onLayerChange }: LayerControlProps) {
  const [expanded, setExpanded] = useState(true);

  const toggle = (cat: PlaceCategory) => {
    onLayerChange({ ...visibleLayers, [cat]: !visibleLayers[cat] });
  };

  const allOn = Object.values(visibleLayers).every(Boolean);
  const toggleAll = () => {
    const newVal = !allOn;
    const updated = Object.fromEntries(
      Object.keys(visibleLayers).map((k) => [k, newVal])
    ) as Record<PlaceCategory, boolean>;
    onLayerChange(updated);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10, 30, 45, 0.88)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(56, 178, 216, 0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: "200px",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        data-testid="button-layer-toggle-panel"
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{ borderBottom: expanded ? "1px solid rgba(56, 178, 216, 0.15)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: "#38b2d8" }} />
          <span className="text-sm font-bold text-white">Kontrol Layer</span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Toggle All */}
            <div className="px-4 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={toggleAll}
                data-testid="button-toggle-all-layers"
                className="text-xs font-semibold transition-colors"
                style={{ color: allOn ? "#38b2d8" : "rgba(255,255,255,0.4)" }}
              >
                {allOn ? "Sembunyikan Semua" : "Tampilkan Semua"}
              </button>
            </div>

            {/* Category Toggles */}
            <div className="p-2">
              {CATEGORIES.map((cat) => {
                const cfg = categoryConfig[cat];
                const count = getCategoryCount(cat);
                const active = visibleLayers[cat];

                return (
                  <button
                    key={cat}
                    onClick={() => toggle(cat)}
                    data-testid={`button-layer-${cat}`}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all mb-0.5"
                    style={{
                      background: active ? cfg.color + "18" : "transparent",
                      opacity: active ? 1 : 0.5,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{
                        background: active ? cfg.color + "30" : "rgba(255,255,255,0.06)",
                        border: active ? `1px solid ${cfg.color}50` : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {cfg.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{cfg.label}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="text-xs font-mono px-1.5 py-0.5 rounded-md"
                        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                      >
                        {count}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: active ? cfg.color : "rgba(255,255,255,0.2)" }}
                      >
                        {active && (
                          <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
