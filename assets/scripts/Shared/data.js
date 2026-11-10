/**
 * Shared data & helpers for every Tourist Portal page.
 * Loaded first, before shell.js, modals.js and the page script.
 */

// 10 real-world Philippine attraction + hotel pairs
const destinationsData = [
  {
    id: "manila",
    category: "heritage",
    location: "City of Manila",
    distance: "1.1 km (4 mins drive / 12 mins walk)",
    spot: {
      name: "Fort Santiago & Intramuros",
      tag: "Spanish Stone Fortress & Citadel",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/7d/Fort_Santiago%2C_Intramuros.JPG?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
      desc: "16th-century Spanish stone fortress, Jose Rizal Shrine, and historic cobblestone lanes.",
      fee: 75,
      hours: "8:00 AM – 9:00 PM",
    },
    hotel: {
      name: "The Manila Hotel",
      tag: "5-Star Luxury Heritage",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      desc: "Historic luxury hotel opened in 1912 overlooking Manila Bay and Rizal Park.",
      rate: 6200,
      amenities: ["Bay View", "Outdoor Pool", "Spa & Gym", "Buffet Breakfast"],
    },
  },
  {
    id: "boracay",
    category: "beaches",
    location: "Boracay Island, Aklan",
    distance: "0.0 km (Direct beachfront at Station 1)",
    spot: {
      name: "White Beach (Station 1) & Willy's Rock",
      tag: "World-Class White Sand",
      image:
        "https://primer.com.ph/travel/wp-content/uploads/sites/6/2025/10/Feature-Image-Template-1-2.png",
      desc: "Powder-fine white sand, crystal turquoise waters, and Willy's Rock volcanic grotto.",
      fee: 0,
      hours: "Open 24/7",
    },
    hotel: {
      name: "Discovery Shores Boracay",
      tag: "5-Star Beachfront Luxury",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      desc: "Premier beachfront resort featuring infinity pool and Terra Wellness Spa.",
      rate: 13500,
      amenities: [
        "Private Beach",
        "Infinity Pool",
        "Speedboat Transfer",
        "Butler Service",
      ],
    },
  },
  {
    id: "cebu",
    category: "urban",
    location: "Cebu City, Central Visayas",
    distance: "2.4 km (7 mins drive via S. Osmeña Blvd)",
    spot: {
      name: "Basilica del Santo Niño & Magellan's Cross",
      tag: "Oldest Roman Catholic Church",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcg-fgl3cvGqrk2gfyaIStpnBsmFL1qYyytAYJkK2vi4fHJuJOcD8X6c&s=10",
      desc: "Founded in 1565, housing the revered Santo Niño image and neighboring Magellan's Cross.",
      fee: 0,
      hours: "6:00 AM – 7:00 PM",
    },
    hotel: {
      name: "Radisson Blu Hotel Cebu",
      tag: "5-Star Urban Luxury",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      desc: "Upscale hotel near Cebu port with resort-style lagoon pool and Feria buffet.",
      rate: 5400,
      amenities: [
        "Lagoon Pool",
        "Spa & Fitness",
        "Executive Lounge",
        "Direct Mall Access",
      ],
    },
  },
  {
    id: "baguio",
    category: "mountain",
    location: "Outlook Drive, Baguio City",
    distance: "1.2 km (4 mins drive along Outlook Drive)",
    spot: {
      name: "Mines View Park & The Mansion",
      tag: "Highland Pine Mountain Overlook",
      image:
        "https://baguiotransient.net/_next/image?url=%2Fminesview.webp&w=1920&q=75",
      desc: "Panoramic mountain view of the Cordillera gold mines and presidential summer palace.",
      fee: 10,
      hours: "6:00 AM – 6:00 PM",
    },
    hotel: {
      name: "Grand Sierra Pines Baguio",
      tag: "4-Star Eco Mountain Retreat",
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      desc: "Eco-friendly boutique resort surrounded by pine trees with private forest balconies.",
      rate: 4800,
      amenities: [
        "Pine View Balcony",
        "Art Gallery",
        "Fireplace Lounge",
        "Scenic Cafe",
      ],
    },
  },
  {
    id: "palawan",
    category: "beaches",
    location: "Bacuit Bay, El Nido, Palawan",
    distance: "1.5 km (8 mins boat ride across cove)",
    spot: {
      name: "Big Lagoon & Bacuit Bay",
      tag: "Limestone Karst Sea Lagoon",
      image:
        "https://www.journeyera.com/wp-content/uploads/2019/05/big-lagoon-el-nido-palawan-5.jpg",
      desc: "Dramatic soaring limestone cliffs surrounding emerald waters ideal for clear kayaking.",
      fee: 200,
      hours: "7:00 AM – 4:00 PM",
    },
    hotel: {
      name: "El Nido Resorts Miniloc Island",
      tag: "5-Star Overwater Eco Lodge",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      desc: "Cottages built on stilts overwater nestled against sheer karst cliffs.",
      rate: 24000,
      amenities: [
        "Overwater Bungalows",
        "Marine Sports",
        "Private Boat",
        "All-Inclusive Dining",
      ],
    },
  },
  {
    id: "tagaytay",
    category: "mountain",
    location: "Tagaytay City, Cavite",
    distance: "0.3 km (3 mins walk to Sky Ranch)",
    spot: {
      name: "Taal Volcano Ridge & Sky Ranch",
      tag: "Highland Volcano Overlook",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNdWgcQ0_RRbdXZ-reB22dBKQeAECD-1AnjreNa7VdsT2dNlt5QGnSPOTr&s=10",
      desc: "Spectacular ridge view of Taal Volcano inside Taal Lake with cool highland climate.",
      fee: 100,
      hours: "8:00 AM – 8:00 PM",
    },
    hotel: {
      name: "Taal Vista Hotel Tagaytay",
      tag: "4-Star Historic View Hotel",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      desc: "Classic Tudor-style hotel established in 1939 with panoramic ridge viewing gardens.",
      rate: 5100,
      amenities: [
        "Direct Volcano View",
        "Heated Pool",
        "Luxury Spa",
        "Buffet Breakfast",
      ],
    },
  },
  {
    id: "bohol",
    category: "beaches",
    location: "Panglao Island, Bohol",
    distance: "0.0 km (Direct beachfront access)",
    spot: {
      name: "Alona Beach & Coral Sanctuary",
      tag: "White Sand Beach & Marine Sanctuary",
      image:
        "https://img.cnt.traveloka.com/tvlk/blog/2022/09/shutterstock_1672848061.jpg",
      desc: "1.5 km of soft white sand and coral reefs. Jump-off point for Balicasag sea turtles.",
      fee: 0,
      hours: "Open 24/7",
    },
    hotel: {
      name: "Henann Resort Alona Beach",
      tag: "5-Star Premier Beach Resort",
      image:
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      desc: "Massive beachfront resort with 3 lagoon swimming pools directly along the sand.",
      rate: 7200,
      amenities: [
        "3 Lagoon Pools",
        "Beachfront Sunbeds",
        "Sea Breeze Cafe",
        "Full Spa",
      ],
    },
  },
  {
    id: "vigan",
    category: "heritage",
    location: "Vigan City, Ilocos Sur",
    distance: "0.15 km (2 mins walk / 1 block away)",
    spot: {
      name: "Calle Crisologo & Heritage Village",
      tag: "UNESCO World Heritage Street",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/1d/55/bd/calle-crisologo-vigan.jpg?w=1200&h=-1&s=1",
      desc: "Spanish colonial cobblestone thoroughfare with ancestral stone houses and horse kalesas.",
      fee: 0,
      hours: "Open 24/7",
    },
    hotel: {
      name: "Hotel Luna Vigan",
      tag: "4-Star Museum Heritage Hotel",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      desc: "Restored 1882 heritage mansion showcasing Juan Luna artworks and courtyard pool.",
      rate: 4200,
      amenities: [
        "Art Museum",
        "Glass-bottom Pool",
        "Rooftop Lounge",
        "Kalesa Service",
      ],
    },
  },
  {
    id: "siargao",
    category: "beaches",
    location: "General Luna, Siargao Island",
    distance: "0.7 km (2 mins e-trike / 8 mins walk)",
    spot: {
      name: "Cloud 9 Surfing Boardwalk & Tower",
      tag: "Surfing Capital Boardwalk & Reef",
      image:
        "https://siargaohotels.ph/wp-content/uploads/2026/08/Cloud-9-Siargao-Island-Philippines-768x512.jpeg",
      desc: "Famous 3-story wooden viewing pier watching world-championship Pacific barrel waves.",
      fee: 100,
      hours: "5:00 AM – 6:30 PM",
    },
    hotel: {
      name: "Siargao Bleu Resort & Spa",
      tag: "4-Star Luxury Beach Resort",
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      desc: "Oceanfront villas surrounding a 1,600 sqm lagoon pool in General Luna.",
      rate: 6800,
      amenities: [
        "1,600 sqm Pool",
        "Airport Shuttle",
        "Surf Butler",
        "Seafood Bar",
      ],
    },
  },
  {
    id: "albay",
    category: "nature",
    location: "Daraga & Legazpi City, Albay",
    distance: "4.2 km (9 mins drive along scenic highway)",
    spot: {
      name: "Cagsawa Ruins & Mayon Volcano",
      tag: "Perfect Cone Volcano & Historic Belfry",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/8c/40/87/cagsawa-ruins-park.jpg?w=1200&h=1200&s=1",
      desc: "Surviving 1814 belfry ruins with Mayon Volcano perfect cone in the background.",
      fee: 20,
      hours: "6:00 AM – 6:00 PM",
    },
    hotel: {
      name: "The Oriental Hotel Legazpi",
      tag: "4-Star Volcano View Hilltop",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      desc: "Perched atop Taysan Hill with infinity pool directly reflecting Mount Mayon.",
      rate: 4600,
      amenities: [
        "Mayon Infinity Pool",
        "Hilltop Lounge",
        "ATV Concierge",
        "Albay Gulf Panorama",
      ],
    },
  },
];

const roomCategories = [
  { name: "Economy Room", rate: 5500, maxGuests: 2 },
  { name: "Standard Room", rate: 8200, maxGuests: 2 },
  { name: "Family Room", rate: 12500, maxGuests: 6 },
  { name: "Executive Room", rate: 16800, maxGuests: 3 },
  { name: "Presidential Suite", rate: 20500, maxGuests: 6 },
  { name: "Penthouse Suite", rate: 24000, maxGuests: 6 },
];

/* ─── Persistent state (localStorage) ─── */
const favoritesStore = new Set(
  JSON.parse(localStorage.getItem("tp_favorites") || '["boracay", "palawan"]'),
);

function saveFavorites() {
  localStorage.setItem("tp_favorites", JSON.stringify([...favoritesStore]));
}

function getBookings() {
  let bookings = JSON.parse(localStorage.getItem("tp_bookings") || "[]");

  // Seed one demo booking so Home has something to show.
  if (bookings.length === 0) {
    bookings = [
      {
        id: "BK-2026-9041",
        pairIndex: 1, // Boracay
        packageType: "combined",
        guestName: "Alex Traveler",
        guestEmail: "alex.traveler@example.com",
        checkInDate: "2026-11-14",
        checkOutDate: "2026-11-17",
        visitDate: "2026-11-15",
        guestCount: 2,
        totalAmount: 40500,
        touristPassId: "TP-PASS-2026-8842",
        hotelResId: "HTL-RES-2026-5519",
        timestamp: new Date().toISOString(),
      },
    ];
    localStorage.setItem("tp_bookings", JSON.stringify(bookings));
  }

  return bookings;
}

/* ─── Formatters ─── */
function formatPeso(amount) {
  return `₱${Number(amount || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatLongDate(dateValue) {
  const date = new Date(dateValue);
  if (isNaN(date)) return dateValue || "";
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function qrImageUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`;
}
