import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronDown } from "lucide-react";

const ROAD_LEGEND = [
  { type: "Jalan Primer", color: "#e74c3c", dash: false, weight: 4 },
  { type: "Jalan Sekunder", color: "#f39c12", dash: false, weight: 3 },
  { type: "Jalan Tersier", color: "#3498db", dash: true, weight: 2.5 },
  { type: "Jalan Lokal", color: "#95a5a6", dash: true, weight: 1.5 },
];

export default function MapLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10, 30, 45, 0.88)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(56, 178, 216, 0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: "170px",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="button-legend-toggle"
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{ borderBottom: open ? "1px solid rgba(56, 178, 216, 0.12)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <Map size={15} style={{ color: "#38b2d8" }} />
          <span className="text-xs font-bold text-white">Legenda Jalan</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 space-y-2.5"
          >
            {ROAD_LEGEND.map((r) => (
              <div key={r.type} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 flex items-center">
                  <div
                    style={{
                      width: "100%",
                      height: r.weight,
                      background: r.dash
                        ? `repeating-linear-gradient(90deg, ${r.color} 0, ${r.color} 5px, transparent 5px, transparent 9px)`
                        : r.color,
                      borderRadius: 2,
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {r.type}
                </span>
              </div>
            ))}

            {/* basemap note */}
            <div
              className="text-xs pt-1 mt-1"
              style={{
                color: "rgba(255,255,255,0.25)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Sumber: OpenStreetMap
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
