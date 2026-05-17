export type PlaceCategory =
  | "museum"
  | "hotel"
  | "guest_house"
  | "attraction"
  | "hospital"
  | "restaurant"
  | "road"
  | "accommodation";

export interface PlaceFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    osm_id: number;
    category: PlaceCategory;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    rating?: number;
    open_hours?: string;
    type_label: string;
  };
}

export interface RoadFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
  properties: {
    name: string;
    road_type: "primary" | "secondary" | "tertiary" | "residential";
  };
}

export type GeoFeature = PlaceFeature | RoadFeature;

export interface FeatureCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}

export const pacitanData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // ===== TOURIST ATTRACTIONS =====
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [110.9472838, -8.2235831] },
      properties: {
        osm_id: 4586487690,
        category: "attraction",
        name: "Pantai Klayar",
        description:
          "Pantai eksotis dengan batu karang unik dan air mancur alami yang memukau. Terkenal dengan 'Seruling Samudra' dari celah batu karang.",
        address: "Desa Sendang, Kecamatan Donorojo, Pacitan",
        open_hours: "06:00 - 18:00",
        rating: 4.7,
        type_label: "Wisata Pantai",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1073, -8.2172] },
      properties: {
        osm_id: 100001,
        category: "attraction",
        name: "Pantai Teleng Ria",
        description:
          "Pantai utama Pacitan yang dekat dengan kota. Pasir putih dengan panorama perbukitan hijau, cocok untuk keluarga.",
        address: "Kecamatan Pacitan",
        open_hours: "Selalu buka",
        rating: 4.3,
        type_label: "Wisata Pantai",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0387, -8.2193] },
      properties: {
        osm_id: 100002,
        category: "attraction",
        name: "Goa Gong",
        description:
          "Gua stalaktit dan stalagmit terbesar dan termegah di Asia Tenggara. Stalaktit berbunyi seperti gong ketika dipukul.",
        address: "Desa Bomo, Kecamatan Punung, Pacitan",
        open_hours: "08:00 - 17:00",
        rating: 4.8,
        type_label: "Wisata Alam & Gua",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0412, -8.2135] },
      properties: {
        osm_id: 100003,
        category: "attraction",
        name: "Goa Tabuhan",
        description:
          "Gua unik dengan stalaktit yang bisa menghasilkan bunyi musik seperti gamelan ketika dipukul.",
        address: "Kecamatan Punung, Pacitan",
        open_hours: "08:00 - 17:00",
        rating: 4.4,
        type_label: "Wisata Alam & Gua",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1685, -8.1945] },
      properties: {
        osm_id: 100004,
        category: "attraction",
        name: "Pantai Srau",
        description:
          "Pantai tersembunyi dengan tebing batu karang yang dramatis dan ombak yang cocok untuk surfing.",
        address: "Kecamatan Pringkuku, Pacitan",
        open_hours: "Selalu buka",
        rating: 4.5,
        type_label: "Wisata Pantai",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0963, -8.2264] },
      properties: {
        osm_id: 100005,
        category: "attraction",
        name: "Pantai Watukarung",
        description:
          "Pantai selancar kelas dunia dengan ombak sempurna. Dikenal di kalangan internasional sebagai spot surfing terbaik.",
        address: "Desa Watukarung, Kecamatan Pringkuku, Pacitan",
        open_hours: "Selalu buka",
        rating: 4.6,
        type_label: "Wisata Pantai & Surfing",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [110.9834927, -8.2369244] },
      properties: {
        osm_id: 9699701354,
        category: "attraction",
        name: "Kali Cokel",
        description:
          "Aliran sungai yang jernih dengan pemandangan alam yang indah, cocok untuk pemandian alam.",
        address: "Pacitan",
        open_hours: "Selalu buka",
        rating: 4.2,
        type_label: "Wisata Alam",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1022, -8.1895] },
      properties: {
        osm_id: 100006,
        category: "attraction",
        name: "Puncak Batu Putih",
        description:
          "Bukit batu putih dengan pemandangan panorama kota Pacitan dan lautan selatan yang menakjubkan.",
        address: "Kecamatan Pacitan",
        open_hours: "06:00 - 18:00",
        rating: 4.3,
        type_label: "Wisata Alam",
      },
    },

    // ===== MUSEUMS =====
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.3237656, -8.2130887] },
      properties: {
        osm_id: 10825663327,
        category: "museum",
        name: "Kawedanan Lorog",
        description:
          "Bangunan bersejarah peninggalan masa kolonial yang kini menjadi destinasi wisata sejarah di Pacitan.",
        address: "Lorog, Pacitan",
        open_hours: "08:00 - 16:00",
        rating: 4.0,
        type_label: "Museum & Sejarah",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.3178088, -8.2208927] },
      properties: {
        osm_id: 10825663323,
        category: "museum",
        name: "Gedung Krida Bhakti",
        description:
          "Pusat kebudayaan dan gedung bersejarah yang menjadi pusat berbagai acara budaya Pacitan.",
        address: "Lorog, Pacitan",
        open_hours: "08:00 - 17:00",
        rating: 3.9,
        type_label: "Museum & Budaya",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1042, -8.1978] },
      properties: {
        osm_id: 100007,
        category: "museum",
        name: "Museum Pacitan",
        description:
          "Museum yang menyimpan koleksi benda-benda bersejarah dan artefak budaya masyarakat Pacitan.",
        address: "Jl. Gatot Subroto, Pacitan",
        open_hours: "08:00 - 16:00 (Senin-Jumat)",
        rating: 4.1,
        type_label: "Museum & Sejarah",
      },
    },

    // ===== HOSPITALS =====
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0987, -8.1985] },
      properties: {
        osm_id: 200001,
        category: "hospital",
        name: "RSUD Dr. Darsono Pacitan",
        description:
          "Rumah Sakit Umum Daerah utama Kabupaten Pacitan dengan fasilitas lengkap dan layanan 24 jam.",
        address: "Jl. Jaksa Agung Suprapto, Pacitan",
        phone: "(0357) 881118",
        open_hours: "24 jam",
        rating: 4.2,
        type_label: "Rumah Sakit Umum",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1015, -8.1972] },
      properties: {
        osm_id: 200002,
        category: "hospital",
        name: "Puskesmas Pacitan",
        description:
          "Pusat Kesehatan Masyarakat Kota Pacitan yang melayani kesehatan dasar warga kota.",
        address: "Jl. A. Yani, Pacitan",
        phone: "(0357) 881234",
        open_hours: "07:30 - 15:30 (Senin-Sabtu)",
        rating: 4.0,
        type_label: "Puskesmas",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0968, -8.2010] },
      properties: {
        osm_id: 200003,
        category: "hospital",
        name: "RS Muslimat NU Pacitan",
        description: "Rumah sakit swasta berbasis Islam yang melayani masyarakat Pacitan.",
        address: "Jl. Jend. Sudirman, Pacitan",
        phone: "(0357) 882345",
        open_hours: "24 jam",
        rating: 4.1,
        type_label: "Rumah Sakit Swasta",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1055, -8.1932] },
      properties: {
        osm_id: 200004,
        category: "hospital",
        name: "Klinik Utama Pacitan",
        description:
          "Klinik kesehatan lengkap dengan dokter spesialis dan fasilitas modern.",
        address: "Jl. Letjen Suprapto, Pacitan",
        phone: "(0357) 883456",
        open_hours: "08:00 - 21:00",
        rating: 4.3,
        type_label: "Klinik Kesehatan",
      },
    },

    // ===== HOTELS =====
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.3207614, -8.2171418] },
      properties: {
        osm_id: 10825663324,
        category: "hotel",
        name: "Hotel Surya Dharma",
        description:
          "Hotel nyaman di pusat kota dengan fasilitas modern dan pelayanan ramah.",
        address: "Lorog, Pacitan",
        phone: "(0357) 881111",
        open_hours: "24 jam",
        rating: 4.0,
        type_label: "Hotel",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1038, -8.1965] },
      properties: {
        osm_id: 300001,
        category: "hotel",
        name: "Hotel Remaja Pacitan",
        description:
          "Hotel bintang dua di pusat kota Pacitan, dekat dengan pusat perbelanjaan dan kuliner.",
        address: "Jl. Ahmad Yani, Pacitan",
        phone: "(0357) 882111",
        open_hours: "24 jam",
        rating: 4.1,
        type_label: "Hotel",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1012, -8.1958] },
      properties: {
        osm_id: 300002,
        category: "hotel",
        name: "Hotel Graha Pacitan",
        description:
          "Hotel modern dengan pemandangan indah dan fasilitas kolam renang serta restoran.",
        address: "Jl. Gatot Subroto, Pacitan",
        phone: "(0357) 882222",
        open_hours: "24 jam",
        rating: 4.3,
        type_label: "Hotel",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0975, -8.2168] },
      properties: {
        osm_id: 300003,
        category: "hotel",
        name: "Pacitan Beach Hotel",
        description:
          "Hotel tepi pantai dengan pemandangan Teleng Ria yang memukau dan suasana tropis.",
        address: "Pantai Teleng Ria, Pacitan",
        phone: "(0357) 883333",
        open_hours: "24 jam",
        rating: 4.4,
        type_label: "Hotel Tepi Pantai",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0955, -8.2145] },
      properties: {
        osm_id: 300004,
        category: "hotel",
        name: "Samudra Inn",
        description:
          "Penginapan nyaman dengan nuansa bahari dekat pantai utama Pacitan.",
        address: "Kecamatan Pacitan",
        phone: "(0357) 884444",
        open_hours: "24 jam",
        rating: 4.0,
        type_label: "Hotel",
      },
    },

    // ===== ACCOMMODATIONS (Guest Houses & Homestays) =====
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [110.9745063, -8.2364395] },
      properties: {
        osm_id: 6403216076,
        category: "accommodation",
        name: "Prapto Homestay",
        description:
          "Homestay nyaman dekat Pantai Klayar dengan suasana pedesaan yang asri dan harga terjangkau.",
        address: "Dekat Pantai Klayar, Pacitan",
        phone: "0812-3456-7890",
        open_hours: "24 jam",
        rating: 4.2,
        type_label: "Homestay",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [110.9747891, -8.2378269] },
      properties: {
        osm_id: 8401225027,
        category: "accommodation",
        name: "Desa Limasan Retreat",
        description:
          "Penginapan butik unik dalam rumah tradisional Jawa dengan pengalaman desa yang autentik.",
        address: "Dekat Pantai Klayar, Pacitan",
        open_hours: "24 jam",
        rating: 4.5,
        type_label: "Retreat & Villa",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [110.9742035, -8.2360021] },
      properties: {
        osm_id: 10206702717,
        category: "accommodation",
        name: "Sackstone Guesthouse",
        description:
          "Guesthouse nyaman dan bersih untuk para backpacker yang ingin menikmati keindahan Klayar.",
        address: "Dekat Pantai Klayar, Pacitan",
        open_hours: "24 jam",
        rating: 4.3,
        type_label: "Guest House",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0915, -8.2205] },
      properties: {
        osm_id: 400001,
        category: "accommodation",
        name: "Klayar Surf Camp",
        description:
          "Camp bagi para surfer dengan fasilitas penyewaan papan selancar dan kursus surfing.",
        address: "Kecamatan Pringkuku, Pacitan",
        open_hours: "24 jam",
        rating: 4.6,
        type_label: "Surf Camp",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1065, -8.1978] },
      properties: {
        osm_id: 400002,
        category: "accommodation",
        name: "Villa Bukit Pacitan",
        description:
          "Villa privat di perbukitan dengan pemandangan laut dan hutan yang spektakuler.",
        address: "Kecamatan Pacitan",
        open_hours: "24 jam",
        rating: 4.4,
        type_label: "Villa",
      },
    },

    // ===== RESTAURANTS =====
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1052, -8.1990] },
      properties: {
        osm_id: 500001,
        category: "restaurant",
        name: "Rumah Makan Bu Parti",
        description:
          "Warung makan legendaris dengan menu masakan Jawa otentik, terkenal dengan nasi pecel dan lodeh.",
        address: "Jl. Ahmad Yani, Pacitan",
        open_hours: "07:00 - 21:00",
        rating: 4.5,
        type_label: "Warung Masakan Jawa",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1038, -8.1982] },
      properties: {
        osm_id: 500002,
        category: "restaurant",
        name: "RM Sari Laut Pacitan",
        description:
          "Restoran seafood segar terbaik di Pacitan dengan menu ikan bakar, udang, dan cumi hasil tangkapan nelayan lokal.",
        address: "Jl. Gatot Subroto, Pacitan",
        open_hours: "10:00 - 22:00",
        rating: 4.6,
        type_label: "Restoran Seafood",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1025, -8.1975] },
      properties: {
        osm_id: 500003,
        category: "restaurant",
        name: "Warung Kopi Pacitan",
        description:
          "Kafe kekinian dengan kopi lokal Pacitan, camilan tradisional, dan suasana nyaman untuk bersantai.",
        address: "Jl. Diponegoro, Pacitan",
        open_hours: "07:00 - 23:00",
        rating: 4.3,
        type_label: "Kafe & Kopi",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.0998, -8.1995] },
      properties: {
        osm_id: 500004,
        category: "restaurant",
        name: "Resto Pandan View",
        description:
          "Restoran dengan pemandangan laut yang indah dan menu masakan Indonesia dan western.",
        address: "Jl. Letjen Suprapto, Pacitan",
        open_hours: "11:00 - 22:00",
        rating: 4.4,
        type_label: "Restoran",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1075, -8.2155] },
      properties: {
        osm_id: 500005,
        category: "restaurant",
        name: "Warung Teleng Ria",
        description:
          "Warung makan pantai dengan ikan bakar segar dan minuman kelapa muda langsung di tepi pantai Teleng Ria.",
        address: "Pantai Teleng Ria, Pacitan",
        open_hours: "09:00 - 20:00",
        rating: 4.2,
        type_label: "Warung Pantai",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [110.9725, -8.2355] },
      properties: {
        osm_id: 500006,
        category: "restaurant",
        name: "Warung Klayar",
        description:
          "Warung makan dekat Pantai Klayar dengan menu lokal yang segar dan pemandangan alam yang menakjubkan.",
        address: "Dekat Pantai Klayar, Pacitan",
        open_hours: "08:00 - 18:00",
        rating: 4.1,
        type_label: "Warung Makan",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1042, -8.2003] },
      properties: {
        osm_id: 500007,
        category: "restaurant",
        name: "Mie Ayam Pak Bambang",
        description:
          "Warung mie ayam dan bakso paling populer di Pacitan sejak 1985, dengan kuah kaldu spesial.",
        address: "Pasar Kota Pacitan",
        open_hours: "06:00 - 15:00",
        rating: 4.7,
        type_label: "Warung Mie & Bakso",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [111.1060, -8.1985] },
      properties: {
        osm_id: 500008,
        category: "restaurant",
        name: "Rumah Makan Nusantara",
        description:
          "Restoran dengan menu lengkap masakan Nusantara, cocok untuk makan keluarga dan rombongan.",
        address: "Jl. Jend. Sudirman, Pacitan",
        open_hours: "09:00 - 22:00",
        rating: 4.2,
        type_label: "Restoran",
      },
    },

    // ===== ROADS =====
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [111.0900, -8.1960],
          [111.0950, -8.1965],
          [111.1000, -8.1970],
          [111.1050, -8.1975],
          [111.1100, -8.1980],
          [111.1150, -8.1985],
        ],
      },
      properties: {
        name: "Jl. Ahmad Yani",
        road_type: "primary",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [111.0920, -8.1940],
          [111.0930, -8.1960],
          [111.0940, -8.1985],
          [111.0955, -8.2010],
          [111.0970, -8.2040],
          [111.1000, -8.2100],
          [111.1020, -8.2172],
        ],
      },
      properties: {
        name: "Jl. Jend. Sudirman",
        road_type: "primary",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [111.0880, -8.1970],
          [111.0920, -8.1970],
          [111.0970, -8.1975],
          [111.1030, -8.1985],
          [111.1070, -8.2000],
          [111.1100, -8.2015],
        ],
      },
      properties: {
        name: "Jl. Gatot Subroto",
        road_type: "secondary",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [111.1000, -8.1950],
          [111.1000, -8.1975],
          [111.1000, -8.2000],
          [111.1000, -8.2030],
          [111.1000, -8.2060],
        ],
      },
      properties: {
        name: "Jl. Diponegoro",
        road_type: "secondary",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [110.9400, -8.2200],
          [110.9450, -8.2220],
          [110.9472, -8.2235],
        ],
      },
      properties: {
        name: "Jl. Menuju Pantai Klayar",
        road_type: "tertiary",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [111.0300, -8.2100],
          [111.0350, -8.2150],
          [111.0387, -8.2193],
        ],
      },
      properties: {
        name: "Jl. Menuju Goa Gong",
        road_type: "tertiary",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [111.0800, -8.1960],
          [111.0850, -8.1962],
          [111.0900, -8.1960],
          [111.0950, -8.1958],
          [111.1000, -8.1955],
          [111.1050, -8.1952],
          [111.1100, -8.1960],
          [111.1150, -8.1975],
          [111.1685, -8.1945],
        ],
      },
      properties: {
        name: "Jalan Lintas Selatan",
        road_type: "primary",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [111.1050, -8.1975],
          [111.1045, -8.2000],
          [111.1040, -8.2040],
          [111.1038, -8.2080],
          [111.1040, -8.2120],
          [111.1050, -8.2160],
          [111.1073, -8.2172],
        ],
      },
      properties: {
        name: "Jl. Letjen Suprapto",
        road_type: "secondary",
      },
    },
  ],
};

export const PACITAN_CENTER: [number, number] = [-8.1990, 111.1050];
export const PACITAN_BOUNDS = {
  north: -8.1500,
  south: -8.3000,
  east: 111.4000,
  west: 110.8500,
};

export const categoryConfig: Record<PlaceCategory, { color: string; icon: string; label: string }> = {
  attraction: { color: "#0ea5e9", icon: "🏖️", label: "Wisata" },
  museum: { color: "#8b5cf6", icon: "🏛️", label: "Museum & Sejarah" },
  hospital: { color: "#ef4444", icon: "🏥", label: "Rumah Sakit" },
  hotel: { color: "#f59e0b", icon: "🏨", label: "Hotel" },
  accommodation: { color: "#10b981", icon: "🏡", label: "Akomodasi" },
  restaurant: { color: "#f97316", icon: "🍽️", label: "Restoran" },
  road: { color: "#6b7280", icon: "🛣️", label: "Jalan" },
  guest_house: { color: "#10b981", icon: "🏘️", label: "Guest House" },
};
