import { motion } from "framer-motion";
import { PlaceCategory, categoryConfig, pacitanData, PlaceFeature } from "@/data/pacitan-data";

interface StatsBarProps {
  visibleLayers: Record<PlaceCategory, boolean>;
}

const SHOWN_CATS: PlaceCategory[] = ["attraction", "museum", "hospital", "hotel", "accommodation", "restaurant"];

export default function StatsBar({ visibleLayers }: StatsBarProps) {
  const counts = SHOWN_CATS.map((cat) => ({
    cat,
    total: pacitanData.features.filter(
      (f) => f.geometry.type === "Point" && (f as PlaceFeature).properties.category === cat
    ).length,
    visible: visibleLayers[cat],
  }));

  const totalVisible = counts.reduce((sum, c) => sum + (c.visible ? c.total : 0), 0);
  const totalAll = counts.reduce((sum, c) => sum + c.total, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="absolute bottom-0 left-0 right-0 z-[1000] pointer-events-none"
    >
      <div
        className="flex items-center gap-0 overflow-x-auto"
        style={{
          background: "rgba(8, 24, 36, 0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(56, 178, 216, 0.15)",
        }}
      >
        {/* Total badge */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5"
          style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#38b2d8" }} />
          <span className="text-xs font-semibold" style={{ color: "#38b2d8" }}>
            {totalVisible}
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            / {totalAll} lokasi
          </span>
        </div>

        {/* Per-category chips */}
        <div className="flex items-center">
          {counts.map((c, i) => {
            const cfg = categoryConfig[c.cat];
            return (
              <div
                key={c.cat}
                className="flex items-center gap-1.5 px-3 py-2.5 flex-shrink-0"
                style={{
                  borderRight: i < counts.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  opacity: c.visible ? 1 : 0.3,
                }}
              >
                <span className="text-sm leading-none">{cfg.icon}</span>
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: c.visible ? cfg.color : "rgba(255,255,255,0.3)" }}
                >
                  {c.total}
                </span>
                <span
                  className="text-xs hidden sm:block truncate max-w-[60px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {cfg.label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Spacer for right controls */}
        <div className="flex-1" />

        {/* Coordinates placeholder on right — just decorative branding */}
        <div
          className="flex-shrink-0 px-4 py-2.5 hidden md:flex items-center gap-2"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
            Pacitan, Jawa Timur
          </span>
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
            7°01'S 111°06'E
          </span>
        </div>
      </div>
    </motion.div>
  );
}
