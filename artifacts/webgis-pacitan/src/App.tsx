import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlaceCategory, GeoFeature } from "@/data/pacitan-data";

import LoadingScreen from "@/components/LoadingScreen";
import MapView from "@/components/MapView";
import LayerControl from "@/components/LayerControl";
import SearchBar from "@/components/SearchBar";
import InfoPanel from "@/components/InfoPanel";

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
    accommodation: true
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeoFeature[]>([]);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#0f4c6b]">
      {/* Map Layer */}
      <MapView 
        visibleLayers={visibleLayers}
        selectedPlace={selectedPlace}
        onSelectPlace={setSelectedPlace}
        searchQuery={searchQuery}
        searchResults={searchResults}
        onSearchResults={setSearchResults}
      />

      {/* Floating UI Overlays */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex flex-col gap-4 z-[1000]">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="glass-panel p-4 rounded-2xl pointer-events-auto flex flex-col">
            <h1 className="text-2xl font-bold text-primary tracking-tight">WebGIS Pacitan</h1>
            <p className="text-sm font-medium text-muted-foreground">Kota 1001 Goa</p>
          </div>

          <div className="w-full md:w-96 pointer-events-auto">
            <SearchBar 
              query={searchQuery} 
              onQueryChange={setSearchQuery} 
              onSelectResult={setSelectedPlace}
              results={searchResults}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 items-start justify-between relative h-full">
          <div className="pointer-events-auto">
            <LayerControl 
              visibleLayers={visibleLayers} 
              onLayerChange={setVisibleLayers} 
            />
          </div>
        </div>
      </div>

      <InfoPanel 
        place={selectedPlace} 
        onClose={() => setSelectedPlace(null)} 
      />

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
