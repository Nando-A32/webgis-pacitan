import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlaceCategory, GeoFeature } from "@/data/pacitan-data";
import { motion, AnimatePresence } from "framer-motion";

import LoadingScreen from "@/components/LoadingScreen";
import MapView from "@/components/MapView";
import LayerControl from "@/components/LayerControl";
import SearchBar from "@/components/SearchBar";
import InfoPanel from "@/components/InfoPanel";
import StatsBar from "@/components/StatsBar";
import MapLegend from "@/components/MapLegend";

const queryClient = new QueryClient();

function WebGIS() {
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<GeoFeature | null>(null);

  const [visibleLayers, setVisibleLayers] = useState<Record<PlaceCategory, boolean>>({
    museum: true,
    hotel: true,
    guest_house: true,
    attraction: true,
    hospital: true,
    restaurant: true,
    road: true,
    accommodation: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeoFeature[]>([]);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#0a1828]">
      {/* Map Layer */}
      <MapView
        visibleLayers={visibleLayers}
        selectedPlace={selectedPlace}
        onSelectPlace={setSelectedPlace}
        searchQuery={searchQuery}
        searchResults={searchResults}
        onSearchResults={setSearchResults}
      />

      {/* ── Top UI Row ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute top-0 left-0 right-0 p-3 md:p-4 pointer-events-none flex gap-3 z-[1000]"
          >
            {/* Branding card */}
            <div
              className="pointer-events-auto flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-2xl"
              style={{
                background: "rgba(8, 22, 34, 0.90)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(56, 178, 216, 0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #38b2d8, #0f6e99)" }}
              >
                🗺️
              </div>
              <div>
                <h1
                  className="text-sm font-bold text-white leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.01em" }}
                >
                  WebGIS Pacitan
                </h1>
                <p className="text-xs font-medium" style={{ color: "#38b2d8" }}>Kota 1001 Goa</p>
              </div>
            </div>

            {/* Search bar */}
            <div className="pointer-events-auto flex-1 max-w-md">
              <SearchBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onSelectResult={(place) => {
                  setSelectedPlace(place);
                  setSearchQuery("");
                }}
                results={searchResults}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Left sidebar: Layer control + Legend ────────────────────── */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute left-3 md:left-4 top-20 z-[1000] pointer-events-auto flex flex-col gap-2"
          >
            <LayerControl visibleLayers={visibleLayers} onLayerChange={setVisibleLayers} />
            <MapLegend />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Info Panel (right side) ──────────────────────────────────── */}
      <InfoPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />

      {/* ── Bottom Stats Bar ─────────────────────────────────────────── */}
      <AnimatePresence>
        {!loading && <StatsBar visibleLayers={visibleLayers} />}
      </AnimatePresence>

      {/* ── Loading Screen ────────────────────────────────────────────── */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WebGIS />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
