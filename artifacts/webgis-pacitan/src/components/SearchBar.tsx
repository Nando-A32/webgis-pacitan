import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pacitanData, GeoFeature, PlaceFeature, categoryConfig } from "@/data/pacitan-data";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  results: GeoFeature[];
  onSelectResult: (feature: GeoFeature) => void;
}

export default function SearchBar({ query, onQueryChange, results, onSelectResult }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {}, [query]);

  const filteredResults = query.length >= 1
    ? pacitanData.features.filter((f) => {
        if (f.geometry.type !== "Point") return false;
        const p = (f as PlaceFeature).properties;
        const lower = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(lower) ||
          (p.description && p.description.toLowerCase().includes(lower)) ||
          p.type_label.toLowerCase().includes(lower)
        );
      }).slice(0, 6)
    : [];

  const showDropdown = focused && filteredResults.length > 0;

  return (
    <div className="relative w-full">
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all"
        style={{
          background: "rgba(10, 30, 45, 0.88)",
          backdropFilter: "blur(20px)",
          border: focused ? "1px solid rgba(56, 178, 216, 0.5)" : "1px solid rgba(56, 178, 216, 0.2)",
          boxShadow: focused ? "0 0 0 3px rgba(56, 178, 216, 0.1)" : "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        <Search size={18} style={{ color: "#38b2d8" }} className="flex-shrink-0" />
        <input
          ref={inputRef}
          type="search"
          data-testid="input-search"
          placeholder="Cari tempat di Pacitan..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:font-normal"
          style={{ color: "white" }}
        />
        {query && (
          <button
            onClick={() => { onQueryChange(""); }}
            data-testid="button-clear-search"
            className="flex-shrink-0 p-0.5 rounded-full transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
            style={{
              background: "rgba(10, 30, 45, 0.96)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(56, 178, 216, 0.2)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            }}
          >
            {filteredResults.map((feature, idx) => {
              const f = feature as PlaceFeature;
              const cfg = categoryConfig[f.properties.category];
              return (
                <button
                  key={f.properties.osm_id}
                  data-testid={`button-search-result-${idx}`}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={{ borderBottom: idx < filteredResults.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(56, 178, 216, 0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => {
                    onSelectResult(feature);
                    onQueryChange(f.properties.name);
                    setFocused(false);
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: cfg.color + "25" }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{f.properties.name}</p>
                    <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {f.properties.type_label}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
