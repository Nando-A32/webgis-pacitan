# WebGIS Pacitan

Aplikasi WebGIS interaktif untuk Kabupaten Pacitan, Jawa Timur — "Kota 1001 Goa". Platform peta berbasis web yang menampilkan informasi lokasi wisata, hotel, restoran, rumah sakit, museum, akomodasi, dan jaringan jalan di Pacitan.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/webgis-pacitan run dev` — run the WebGIS frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Leaflet (react-leaflet)
- Map: OpenStreetMap tiles via Leaflet.js
- Styling: Tailwind CSS v4, Framer Motion animations
- API: Express 5 (api-server, unused by main app)
- Data: Static GeoJSON embedded in TypeScript (no DB needed)

## Where things live

- `artifacts/webgis-pacitan/src/data/pacitan-data.ts` — All GeoJSON place + road data
- `artifacts/webgis-pacitan/src/components/MapView.tsx` — Leaflet map with markers, roads, GPS
- `artifacts/webgis-pacitan/src/components/LoadingScreen.tsx` — animated loading overlay
- `artifacts/webgis-pacitan/src/components/InfoPanel.tsx` — location detail slide-in panel
- `artifacts/webgis-pacitan/src/components/LayerControl.tsx` — layer toggle panel
- `artifacts/webgis-pacitan/src/components/SearchBar.tsx` — search with dropdown
- `artifacts/webgis-pacitan/src/App.tsx` — root layout (full-screen map)

## Architecture decisions

- Frontend-only: all map data is static TypeScript — no backend or database needed
- react-leaflet wraps Leaflet.js for React integration
- Leaflet default icon bug fixed by manually setting CDN URLs
- Custom L.divIcon() used for colored category markers
- All UI panels float over the map using absolute positioning + z-index layers
- Framer Motion handles loading screen fade and info panel slide animations

## Product

- **Loading Screen:** Animated branded overlay that fades in on load then disappears after 2.2 seconds
- **Interactive Map:** Full-screen OpenStreetMap with zoom/pan, centered on Pacitan
- **Layer Control:** Toggle 7 categories on/off — Wisata, Museum, Rumah Sakit, Hotel, Akomodasi, Restoran, Jalan
- **Search:** Type to filter locations, click results to select
- **Location Popup:** Click any marker to open detailed info panel (name, description, hours, phone, rating, coordinates)
- **GPS Locate:** Button to center map on user's current position
- **Roads:** Colored polylines for primary (red), secondary (amber), tertiary (blue) roads
- **Coordinate Display:** Live mouse coordinate readout on map

## Data categories

- 8 Tourist Attractions (Pantai Klayar, Goa Gong, Teleng Ria, dll)
- 3 Museums (Kawedanan Lorog, Gedung Krida Bhakti, dll)
- 4 Hospitals/Clinics (RSUD Dr. Darsono, Puskesmas, dll)
- 5 Hotels
- 5 Accommodations/Homestays
- 8 Restaurants/Warung
- 8 Road polylines

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Leaflet CSS must be imported via index.css: `@import "leaflet/dist/leaflet.css";`
- Leaflet default icon bug: must delete `_getIconUrl` and set CDN icon URLs manually
- Map container needs `zoomControl={false}` to use custom zoom buttons
- z-index: Leaflet panes use z-index 400+, UI overlays need z-index 1000+

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Leaflet docs: https://leafletjs.com/reference.html
- react-leaflet docs: https://react-leaflet.js.org/
