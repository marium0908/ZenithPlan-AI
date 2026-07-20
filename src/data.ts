import { Destination } from "./types";

export const initialDestinations: Destination[] = [
  {
    id: "dest-1",
    title: "Costa Rica Cloud Forest Canopy Tour",
    shortDescription: "Immerse yourself in biodiversity with zip-lining, sustainable eco-lodges, and active wildlife conservation trails.",
    description: "Nestled in the lush Monteverde highlands, this eco-adventure brings you face-to-face with exotic flora and rare fauna like the Resplendent Quetzal. Learn about carbon-neutral canopy research, stay in a fully solar-powered treehouse resort, and participate in direct reforestation tree-planting programs led by certified local naturalists.",
    category: "Eco-Tourism",
    budget: 1450,
    rating: 4.9,
    location: "Monteverde, Costa Rica",
    images: [
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565118531796-763e5082d113?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 5,
    specifications: {
      bestTime: "December to April",
      difficulty: "Moderate",
      carbonFootprint: "85",
      accommodation: "Monteverde Forest Canopy Eco-Lodge"
    },
    reviews: [
      {
        id: "rev-1-1",
        user: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "The treehouse stay was breathtaking. Planting a native cedar tree was the highlight of my trip! Fully zero-waste practices were strictly followed.",
        date: "2026-06-12"
      },
      {
        id: "rev-1-2",
        user: "David Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 4.8,
        text: "Incredible biodiversity. The night walk guide was extremely knowledgeable. Felt great supporting local eco-entrepreneurs.",
        date: "2026-07-01"
      }
    ]
  },
  {
    id: "dest-2",
    title: "Kyoto Heritage & Zen Cycling",
    shortDescription: "A carbon-neutral cultural journey exploring ancient temples, bamboo forests, and organic tea ceremonies by electric bicycle.",
    description: "Explore the hidden, quiet alleyways of Kyoto on custom electric bamboo-frame bicycles. Visit local preserved heritage wooden townhouses (machiya), participate in an authentic, slow tea ceremony featuring certified organic Uji Matcha, and enjoy local farm-to-table Buddhist vegetarian meals (shojin ryori) that promote local agriculture.",
    category: "Cultural",
    budget: 1850,
    rating: 4.8,
    location: "Kyoto, Japan",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 4,
    specifications: {
      bestTime: "October to November (Autumn) or April (Cherry Blossoms)",
      difficulty: "Easy",
      carbonFootprint: "42",
      accommodation: "Kyoto Machiya Heritage Guesthouse"
    },
    reviews: [
      {
        id: "rev-2-1",
        user: "Emily Watson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "Biking through the Arashiyama outskirts early in the morning was serene. Highly recommend the plant-based Buddhist tasting menu!",
        date: "2026-05-18"
      }
    ]
  },
  {
    id: "dest-3",
    title: "Icelandic Volcanic Hot Springs & Geothermal Trek",
    shortDescription: "Hike along active geothermal vents, visit clean hydro-power stations, and soak in natural mineral pools.",
    description: "Venture deep into Iceland's volcanic rift valleys. Witness majestic bubbling geysers, towering glaciers, and black-sand fields. Learn how Iceland produces 100% renewable geothermal energy. Rest in premium eco-luxury domes with skylights perfect for watching the dancing Northern Lights.",
    category: "Adventure",
    budget: 2400,
    rating: 4.95,
    location: "Reykjanes Peninsula, Iceland",
    images: [
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 6,
    specifications: {
      bestTime: "June to August (Midnight Sun) or October to March (Aurora)",
      difficulty: "Hard",
      carbonFootprint: "110",
      accommodation: "Hella Geothermal Eco-Resort"
    },
    reviews: [
      {
        id: "rev-3-1",
        user: "Marcus Aurelius",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "Breathtaking landscapes. Standing beside a geothermal turbine and realizing how clean energy works in tandem with local communities was inspiring.",
        date: "2026-06-25"
      }
    ]
  },
  {
    id: "dest-4",
    title: "Patagonia Zero-Waste Glacier Expedition",
    shortDescription: "A premium zero-footprint expedition across the dramatic fjords, icebergs, and soaring granite peaks of Torres del Paine.",
    description: "Explore the wild frontier of Patagonia. Trek along ancient blue ice sheets, camp under starlit southern skies in geodesic domes, and support rewilding programs. This expedition operates on strict Leave-No-Trace principles and partners directly with local indigenous mapuche park wardens.",
    category: "Adventure",
    budget: 2950,
    rating: 4.9,
    location: "Torres del Paine, Chile",
    images: [
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 7,
    specifications: {
      bestTime: "November to March",
      difficulty: "Hard",
      carbonFootprint: "165",
      accommodation: "EcoCamp Patagonia Geodesic Domes"
    },
    reviews: [
      {
        id: "rev-4-1",
        user: "Lucas Miller",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
        rating: 4.9,
        text: "The raw winds, beautiful glaciers, and absolute silence of Patagonia are unforgettable. The geodesic dome camp is an engineering marvel.",
        date: "2026-04-10"
      }
    ]
  },
  {
    id: "dest-5",
    title: "Tuscany Biodynamic Wine & Cooking Retreat",
    shortDescription: "Savor premium organic gastronomy, study heritage olive groves, and enjoy biodynamic winemaking workshops.",
    description: "Unwind among the rolling cypress-lined hills of rural Tuscany. Learn about regenerative organic agriculture, pick olives in a 400-year-old family-run organic estate, and master historic slow-food cooking techniques using seasonal local herbs, homemade cheese, and zero-sulfite biodynamic Chianti.",
    category: "Luxury Wellness",
    budget: 1650,
    rating: 4.75,
    location: "Siena, Italy",
    images: [
      "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 5,
    specifications: {
      bestTime: "May to October",
      difficulty: "Easy",
      carbonFootprint: "30",
      accommodation: "Villa di Reggello Biodynamic Agriturismo"
    },
    reviews: [
      {
        id: "rev-5-1",
        user: "Clara Benson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "Truly soulful. Learning how biodynamic farms rotate crops to keep soil alive was fascinating. The food was heaven.",
        date: "2026-07-11"
      }
    ]
  },
  {
    id: "dest-6",
    title: "Swiss Alps Solar-Powered Ski Lodge & Wellness",
    shortDescription: "Zero-emission alpine serenity featuring outdoor thermal spas, local herb foraging, and organic wellness spas.",
    description: "Perched high in the Valais Alps, this premium wellness retreat is entirely off-grid, operating solely on passive solar architectures and clean wood pellets. Indulge in warm outdoor pools heated by sustainable biomass, enjoy local flower-infusion skin treatments, and ski on certified eco-managed slopes.",
    category: "Luxury Wellness",
    budget: 2200,
    rating: 4.88,
    location: "Zermatt, Switzerland",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 6,
    specifications: {
      bestTime: "January to April (Skiing) or July to August (Alpine Hiking)",
      difficulty: "Moderate",
      carbonFootprint: "25",
      accommodation: "AlpenGlow Passive Solar Resort"
    },
    reviews: [
      {
        id: "rev-6-1",
        user: "Jonas Keller",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "Looking at the Matterhorn while bathing in mineral spring water heated with mountain geothermal power is an elite feeling.",
        date: "2026-03-04"
      }
    ]
  },
  {
    id: "dest-7",
    title: "Bali Coral Reef Restoration & Scuba Expedition",
    shortDescription: "Learn biological coral micro-fragmentation, plant artificial reefs, and scuba dive in pristine protected marine sanctuaries.",
    description: "Partner with marine biologists in Northern Bali. Learn how to cultivate heat-tolerant coral colonies in the ocean, use specialized subsea tools to glue young corals onto degraded limestone frames, and dive among green sea turtles, colorful schools of fish, and majestic manta rays.",
    category: "Eco-Tourism",
    budget: 1200,
    rating: 4.9,
    location: "Pemuteran, Bali, Indonesia",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522083165195-342750297f46?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 5,
    specifications: {
      bestTime: "May to September",
      difficulty: "Moderate",
      carbonFootprint: "55",
      accommodation: "Pemuteran Reef BioRock Eco Resort"
    },
    reviews: [
      {
        id: "rev-7-1",
        user: "Nadia Rahma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        rating: 4.9,
        text: "The BioRock marine sanctuary is spectacular. Diving down to see a coral frame that my group helped plant is a deep, direct impact.",
        date: "2026-05-30"
      }
    ]
  },
  {
    id: "dest-8",
    title: "Moroccan Sahara Desert Camel Trek & Berber Culture",
    shortDescription: "Sleep in luxurious bio-degradable nomad desert camps, traverse rolling dunes on camelback, and learn desert survival skills.",
    description: "Travel deep into the Erg Chebbi desert with indigenous nomadic guides. Dine on tagines cooked in underground sand ovens, stargaze with zero light pollution, and learn how local water conservation channels (khettaras) support oasis agriculture in arid environments.",
    category: "Cultural",
    budget: 1100,
    rating: 4.85,
    location: "Merzouga, Morocco",
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1489493887462-402b72644d55?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80"
    ],
    duration: 5,
    specifications: {
      bestTime: "October to April",
      difficulty: "Moderate",
      carbonFootprint: "35",
      accommodation: "Sahara Golden Dunes Eco-Camp"
    },
    reviews: [
      {
        id: "rev-8-1",
        user: "Omar Al-Fassi",
        avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80",
        rating: 4.8,
        text: "The quiet of the dunes is absolutely spiritual. Listening to ancient berber flute music under a million stars was unforgettable.",
        date: "2026-04-02"
      }
    ]
  }
];
