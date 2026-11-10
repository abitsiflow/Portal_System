/**
 * Tourist Portal Subsystem · Authenticated Dashboard & Booking System
 * Manages Home & Explore views, bookings, favorites, and dual QR code pass generation.
 */

(async () => {
  const { data, error } = await window.sb.auth.getSession();

  console.log("Session:", data.session);
  console.log("Error:", error);
  console.log("User:", data.session?.user);
})();

// 10 Real-world Philippine Pairs with authentic data
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
        "https://images.unsplash.com/photo-1736122094944-da4deea774ab?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      fee: 75,
      desc: "16th-century Spanish stone fortress, Jose Rizal Shrine, and historic cobblestone lanes.",
      fee: 75,
      hours: "8:00 AM – 9:00 PM",
    },
    hotel: {
      name: "The Manila Hotel",
      tag: "5-Star Luxury Heritage",
      image:
        "https://www.bambootravel.co.uk/files/img_cache/50374/1400__1509985537_Capture.JPG?1509985539",
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
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
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
        "https://upload.wikimedia.org/wikipedia/commons/a/a3/Santo_Nino_Basilica.jpg",
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
        "https://upload.wikimedia.org/wikipedia/commons/d/da/Mines_View_Park%2C_Baguio_City_Philippines.jpg",
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
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80",
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
        "https://res.klook.com/image/upload/fl_lossy.progressive%2Cq_85/c_fill%2Cw_1000/v1619064676/blog/jftd5xa1wvu1e6eloadc.jpg",
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
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
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
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
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
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
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
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
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

// App State
let appState = {
  activeScreen: "home",
  favorites: new Set(
    JSON.parse(
      localStorage.getItem("tp_favorites") || '["boracay", "palawan"]',
    ),
  ),
  bookings: JSON.parse(localStorage.getItem("tp_bookings") || "[]"),
  exploreFilter: "all",
  exploreSearch: "",
  currentBookingTarget: null,
  packageType: "combined", // 'combined', 'spot_only', 'hotel_only'
};

let roomLines = [];
let nextRoomId = 1;

const roomCategories = [
  { name: "Economy Room", rate: 5500, maxGuests: 2 },
  { name: "Standard Room", rate: 8200, maxGuests: 2 },
  { name: "Family Room", rate: 12500, maxGuests: 6 },
  { name: "Executive Room", rate: 16800, maxGuests: 3 },
  { name: "Presidential Suite", rate: 20500, maxGuests: 6 },
  { name: "Penthouse Suite", rate: 24000, maxGuests: 6 },
];

function addRoomSelection() {
  roomLines.push({
    id: nextRoomId++,
    roomType: "Economy Room",
    guests: 1,
  });

  renderRoomSelections();
  updateBookingSummary();
}

function removeRoomSelection(roomId) {
  if (roomLines.length === 1) {
    showToast("At least one room is required.");
    return;
  }

  roomLines = roomLines.filter((room) => room.id !== roomId);

  renderRoomSelections();
  updateBookingSummary();
}

function updateRoomType(roomId, roomType) {
  const room = roomLines.find((item) => item.id === roomId);
  const category = roomCategories.find((item) => item.name === roomType);

  if (!room || !category) return;

  room.roomType = roomType;

  // Ensure guest count does not exceed room capacity.
  room.guests = Math.min(room.guests, category.maxGuests);

  renderRoomSelections();
  updateBookingSummary();
}

function updateRoomGuestCount(roomId, guestCount) {
  const room = roomLines.find((item) => item.id === roomId);

  if (!room) return;

  room.guests = Number(guestCount);

  updateBookingSummary();
}

function renderRoomSelections() {
  const container = document.getElementById("roomSelections");

  if (!container) return;

  container.innerHTML = roomLines
    .map((room, index) => {
      const category = roomCategories.find(
        (item) => item.name === room.roomType,
      );

      return `
        <div class="form-panel" style="margin-bottom: 12px; padding: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <strong>Room ${index + 1}</strong>

            <button
              type="button"
              class="btn btn-secondary"
              onclick="removeRoomSelection(${room.id})"
              style="padding:6px 10px;"
            >
              Remove
            </button>
          </div>

          <div class="booking-form-grid">
            <div class="explore-field">
              <label>Room Category</label>

              <select
                onchange="updateRoomType(${room.id}, this.value)"
              >
                ${roomCategories
                  .map(
                    (option) => `
                      <option
                        value="${option.name}"
                        ${room.roomType === option.name ? "selected" : ""}
                      >
                        ${option.name} - ₱${option.rate.toLocaleString()}/night
                      </option>
                    `,
                  )
                  .join("")}
              </select>
            </div>

            <div class="explore-field">
              <label>Number of Guests</label>

              <select
                onchange="updateRoomGuestCount(${room.id}, this.value)"
              >
                ${Array.from({ length: category.maxGuests }, (_, i) => i + 1)
                  .map(
                    (count) => `
                      <option
                        value="${count}"
                        ${room.guests === count ? "selected" : ""}
                      >
                        ${count} ${count === 1 ? "Guest" : "Guests"}
                      </option>
                    `,
                  )
                  .join("")}
              </select>
            </div>
          </div>

          <small style="color:var(--muted);">
            Maximum capacity: ${category.maxGuests} guests
          </small>
        </div>
      `;
    })
    .join("");
}

/* ─── Initialization ─── */
document.addEventListener("DOMContentLoaded", () => {
  // Check URL query parameters for initial screen
  const urlParams = new URLSearchParams(window.location.search);
  const requestedView = urlParams.get("view");
  if (
    requestedView &&
    [
      "home",
      "explore",
      "planner",
      "trips",
      "favorites",
      "qr",
      "profile",
    ].includes(requestedView)
  ) {
    appState.activeScreen = requestedView;
  }

  // Setup default bookings if none exist
  if (appState.bookings.length === 0) {
    appState.bookings.push({
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
    });
    localStorage.setItem("tp_bookings", JSON.stringify(appState.bookings));
  }

  renderNavigation();
  renderScreen();
  updateFavoritesCount();

  // Initialize Lucide icons if available
  if (window.lucide) {
    lucide.createIcons();
  }
});

/* ─── Navigation & Views ─── */
function navigate(screen) {
  appState.activeScreen = screen;
  window.history.replaceState({}, "", `?view=${screen}`);
  renderNavigation();
  renderScreen();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderNavigation() {
  document.querySelectorAll(".nav-item-btn, .mobile-nav-btn").forEach((btn) => {
    const target = btn.getAttribute("data-screen");
    btn.classList.toggle("active", target === appState.activeScreen);
  });
}

function renderScreen() {
  const container = document.getElementById("viewContainer");
  if (!container) return;

  switch (appState.activeScreen) {
    case "explore":
      container.innerHTML = getExploreViewHtml();
      setupExploreEvents();
      break;
    case "trips":
      getTripsViewHtml();
      break;
    case "favorites":
      container.innerHTML = getFavoritesViewHtml();
      break;
    case "qr":
      getQrPassesViewHtml();
      break;
    case "planner":
      container.innerHTML = getPlannerViewHtml();
      break;
    case "profile":
      container.innerHTML = getProfileViewHtml();
      break;
    case "home":
    default:
      container.innerHTML = getHomeViewHtml();
      break;
  }
}

/* ─── Home Screen View ─── */
function getHomeViewHtml() {
  const latestBooking = appState.bookings[0];
  const pairedItem = latestBooking
    ? destinationsData[latestBooking.pairIndex]
    : destinationsData[1];

  return `
    <!-- Hero Welcome Banner -->
    <div class="dashboard-hero">
      <div class="hero-left">
        <p class="eyebrow" style="color:var(--teal-light); margin-bottom:6px;">Traveler Dashboard &middot; Verified Status</p>
        <h1>Welcome back, Alex</h1>
        <p>Your portal for discovering verified Philippine destinations, reserving nearby stays, and accessing scannable digital passes.</p>
      </div>
      <div class="hero-action-box">
        <button type="button" class="btn btn-primary" style="background:#fff; color:var(--navy); border-color:#fff;" onclick="navigate('explore')">
          Explore Destinations
        </button>
        <button type="button" class="btn btn-secondary" style="background:transparent; color:#fff; border-color:rgba(255,255,255,0.4);" onclick="navigate('qr')">
          View My Passes
        </button>
      </div>
    </div>

    <!-- Quick Metric Cards -->
    <div class="metrics-row">
      <div class="metric-card" onclick="navigate('explore')">
        <div class="metric-icon-box">
          <i data-lucide="compass"></i>
        </div>
        <strong>Explore 10 Pairs</strong>
        <p>Discover iconic attractions matched with adjacent verified hotels.</p>
        <span class="btn btn-secondary">Explore Now</span>
      </div>

      <div class="metric-card" onclick="openBookingModal(4, 'hotel_only')">
        <div class="metric-icon-box purple">
          <i data-lucide="ticket"></i>
        </div>
        <strong>Book Stay &amp; Spot</strong>
        <p>Reserve accommodations and instant entrance tickets in one flow.</p>
        <span class="btn btn-primary">Book Vacation</span>
      </div>

      <div class="metric-card" onclick="navigate('qr')">
        <div class="metric-icon-box amber">
          <i data-lucide="qr-code"></i>
        </div>
        <strong>Digital QR Passes</strong>
        <p>Instant verification passes for attraction entry and hotel check-in.</p>
        <span class="btn btn-secondary">Open Passes</span>
      </div>

      <div class="metric-card" onclick="navigate('trips')">
        <div class="metric-icon-box coral">
          <i data-lucide="briefcase"></i>
        </div>
        <strong>My Active Bookings</strong>
        <p>${appState.bookings.length} confirmed trip reservations with digital passes.</p>
        <span class="btn btn-secondary">View Bookings</span>
      </div>
    </div>

    <!-- Upcoming Trip Banner -->
    <div class="active-trip-panel">
      <div class="active-trip-left">
        <div class="active-trip-icon">
          <i data-lucide="calendar-check"></i>
        </div>
        <div class="active-trip-info">
          <strong>Upcoming: ${pairedItem.spot.name} + ${pairedItem.hotel.name}</strong>
          <p>${latestBooking ? latestBooking.checkInDate : "14 Nov 2026"} &middot; ${pairedItem.location} &middot; Dual QR Passes Issued</p>
        </div>
      </div>
      <div style="display:flex; gap:10px;">
        <button type="button" class="btn btn-primary" onclick="showGeneratedDualPass(${JSON.stringify(latestBooking).replace(/"/g, "&quot;")})">
          View QR Passes
        </button>
        <button type="button" class="btn btn-secondary" onclick="navigate('trips')">
          Manage Trip
        </button>
      </div>
    </div>

    <!-- Featured Popular Spots & Stays Section -->
    <div class="section-head">
      <div>
        <h2>Featured Destinations &amp; Stays</h2>
        <p>Verified close-proximity spots paired with premier accommodations.</p>
      </div>
      <button type="button" class="btn btn-secondary" onclick="navigate('explore')">
        View All 10 Pairs &rarr;
      </button>
    </div>

    <div class="cards-grid">
      ${destinationsData
        .slice(0, 6)
        .map((item, idx) => renderDestinationCard(item, idx))
        .join("")}
    </div>
  `;
}

/* ─── Explore Screen View ─── */
function getExploreViewHtml() {
  return `
    <div class="section-head" style="margin-bottom:16px;">
      <div>
        <p class="eyebrow">Explore Destinations &amp; Verified Stays</p>
        <h2>Find Your Perfect Match</h2>
        <p>Discover attractions and hotels positioned next to each other across the Philippines.</p>
      </div>
    </div>

    <!-- Controls Bar -->
    <div class="explore-controls-bar">
      <div class="explore-filter-grid">
        <div class="explore-field">
          <label for="exploreSearchInput">Search Destinations, Spots, or Hotels</label>
          <input type="text" id="exploreSearchInput" placeholder="Try 'Boracay', 'Calle Crisologo', 'Intramuros'..." value="${appState.exploreSearch}" />
        </div>

        <div class="explore-field">
          <label for="categoryFilter">Category</label>
          <select id="categoryFilter">
            <option value="all" ${appState.exploreFilter === "all" ? "selected" : ""}>All Categories</option>
            <option value="heritage" ${appState.exploreFilter === "heritage" ? "selected" : ""}>Heritage &amp; History</option>
            <option value="beaches" ${appState.exploreFilter === "beaches" ? "selected" : ""}>Beaches &amp; Islands</option>
            <option value="mountain" ${appState.exploreFilter === "mountain" ? "selected" : ""}>Mountain Escapes</option>
            <option value="urban" ${appState.exploreFilter === "urban" ? "selected" : ""}>Urban &amp; Culture</option>
            <option value="nature" ${appState.exploreFilter === "nature" ? "selected" : ""}>Nature &amp; Wonders</option>
          </select>
        </div>

        <div class="explore-field">
          <label>Filter Reset</label>
          <button type="button" class="btn btn-secondary" style="width:100%;" onclick="resetExploreFilters()">
            Clear Filters
          </button>
        </div>
      </div>

      <div class="explore-type-pills">
        <button type="button" class="type-pill ${appState.exploreFilter === "all" ? "active" : ""}" onclick="setExploreFilter('all')">All (10)</button>
        <button type="button" class="type-pill ${appState.exploreFilter === "heritage" ? "active" : ""}" onclick="setExploreFilter('heritage')">Heritage &amp; History</button>
        <button type="button" class="type-pill ${appState.exploreFilter === "beaches" ? "active" : ""}" onclick="setExploreFilter('beaches')">Beaches &amp; Islands</button>
        <button type="button" class="type-pill ${appState.exploreFilter === "mountain" ? "active" : ""}" onclick="setExploreFilter('mountain')">Mountain Escapes</button>
        <button type="button" class="type-pill ${appState.exploreFilter === "urban" ? "active" : ""}" onclick="setExploreFilter('urban')">Urban &amp; Culture</button>
        <button type="button" class="type-pill ${appState.exploreFilter === "nature" ? "active" : ""}" onclick="setExploreFilter('nature')">Nature &amp; Volcanoes</button>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="cards-grid" id="exploreCardsGrid">
      ${getFilteredDestinations()
        .map((item) =>
          renderDestinationCard(item, destinationsData.indexOf(item)),
        )
        .join("")}
    </div>
  `;
}

function getFilteredDestinations() {
  return destinationsData.filter((item) => {
    const matchesCategory =
      appState.exploreFilter === "all" ||
      item.category === appState.exploreFilter;
    const query = appState.exploreSearch.toLowerCase();
    const matchesQuery =
      !query ||
      item.spot.name.toLowerCase().includes(query) ||
      item.hotel.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });
}

function setupExploreEvents() {
  const input = document.getElementById("exploreSearchInput");
  if (input) {
    input.addEventListener("input", (e) => {
      appState.exploreSearch = e.target.value.trim();
      updateExploreGrid();
    });
  }

  const select = document.getElementById("categoryFilter");
  if (select) {
    select.addEventListener("change", (e) => {
      appState.exploreFilter = e.target.value;
      updateExploreGrid();
    });
  }
}

function setExploreFilter(category) {
  appState.exploreFilter = category;
  renderScreen();
  if (window.lucide) lucide.createIcons();
}

function resetExploreFilters() {
  appState.exploreFilter = "all";
  appState.exploreSearch = "";
  renderScreen();
  if (window.lucide) lucide.createIcons();
}

function updateExploreGrid() {
  const grid = document.getElementById("exploreCardsGrid");
  if (grid) {
    const items = getFilteredDestinations();
    grid.innerHTML = items.length
      ? items
          .map((item) =>
            renderDestinationCard(item, destinationsData.indexOf(item)),
          )
          .join("")
      : `<div class="form-panel" style="grid-column:1/-1; text-align:center; padding:48px;">
          <h3>No matching destinations</h3>
          <p class="subtle">Try adjusting your search criteria.</p>
        </div>`;
    if (window.lucide) lucide.createIcons();
  }
}

/* ─── Destination Card Renderer ─── */
function renderDestinationCard(item, index) {
  const isFav = appState.favorites.has(item.id);

  return `
    <article class="dest-card">
      <div class="dest-card-media">
        <img src="${item.spot.image}" alt="${item.spot.name}" loading="lazy" />
        <span class="card-tag-badge">${item.category.toUpperCase()}</span>
        <button type="button" class="fav-toggle-btn ${isFav ? "favorited" : ""}" onclick="toggleFavorite('${item.id}', this)" aria-label="Save to favorites">
          <i data-lucide="heart"></i>
        </button>
      </div>

      <div class="dest-card-body">
        <div class="dest-location-row">
          <i data-lucide="map-pin"></i>
          <span>${item.location}</span>
        </div>

        <h3 class="dest-card-title">${item.spot.name}</h3>
        <p class="dest-card-desc">${item.spot.desc}</p>

        <div class="paired-hotel-chip">
          <span>Hotel: <strong>${item.hotel.name}</strong></span>
          <span style="font-weight:700; color:var(--teal);">&#8369;${item.hotel.rate.toLocaleString()} / night</span>
        </div>

        <div class="dest-card-actions">
          <button type="button" class="btn btn-secondary" onclick="openDetailModal(${index}, 'hotel_only')">
            Details
          </button>
          <button type="button" class="btn btn-primary" onclick="openBookingModal(${index}, 'hotel_only')">
            Book Stay &amp; Pass
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ─── Booking Modal & QR Generation ─── */

function openBookingModal(pairIndex, defaultPackage = "hotel_only") {
  const item = destinationsData[pairIndex];

  if (!item) {
    showToast("Destination not found.");
    return;
  }

  appState.currentBookingTarget = item;
  appState.packageType = defaultPackage;

  const modal = document.getElementById("bookingModal");

  if (!modal) return;

  document.getElementById("bookingModalTitle").textContent =
    `Book Hotel · ${item.hotel.name}`;

  document.getElementById("modalTargetHotelName").textContent = item.hotel.name;

  document.getElementById("modalTargetDistance").textContent = item.distance;

  // Reset room selections whenever the modal opens.
  roomLines = [];
  nextRoomId = 1;
  addRoomSelection();

  // Default dates: 14 days from today, 3 nights.
  const today = new Date();
  const checkIn = new Date(today);

  checkIn.setDate(today.getDate() + 14);

  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 3);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  document.getElementById("bookCheckIn").value = formatDate(checkIn);
  document.getElementById("bookCheckOut").value = formatDate(checkOut);
  document.getElementById("bookVisitDate").value = formatDate(checkIn);

  selectBookingPackage(defaultPackage);

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function selectBookingPackage(type) {
  appState.packageType = type;

  document.querySelectorAll(".package-choice").forEach((card) => {
    card.classList.toggle(
      "selected",
      card.getAttribute("data-package") === type,
    );
  });

  const isHotel = type === "hotel_only";

  document
    .getElementById("hotelRoomSelection")
    .classList.toggle("hidden", !isHotel);

  document
    .getElementById("hotelDateSelection")
    .classList.toggle("hidden", !isHotel);

  document
    .getElementById("spotDateSelection")
    .classList.toggle("hidden", isHotel);

  document.getElementById("bookCheckIn").required = isHotel;
  document.getElementById("bookCheckOut").required = isHotel;
  document.getElementById("bookVisitDate").required = !isHotel;

  document.getElementById("confirmBookingBtn").textContent = isHotel
    ? "Confirm Hotel Reservation"
    : "Attraction Reservation";

  updateBookingSummary();
}

function updateBookingSummary() {
  const packageName = document.getElementById("summaryPackageName");
  const nightsGuests = document.getElementById("summaryNightsGuests");

  const subtotalElement = document.getElementById("summarySubtotal");
  const vatElement = document.getElementById("summaryVat");
  const totalElement = document.getElementById("summaryGrandTotal");
  const downpaymentElement = document.getElementById("summaryDownpayment");
  const remainingElement = document.getElementById("summaryRemaining");

  if (appState.packageType !== "hotel_only") {
    packageName.textContent = "Attraction Reservation";
    nightsGuests.textContent = "Attraction Entry";

    subtotalElement.textContent = "Not applicable";
    vatElement.textContent = "Not applicable";
    totalElement.textContent = "Not applicable";
    downpaymentElement.textContent = "Not applicable";
    remainingElement.textContent = "Not applicable";

    return;
  }

  const checkInValue = document.getElementById("bookCheckIn").value;
  const checkOutValue = document.getElementById("bookCheckOut").value;

  let nights = 0;

  if (checkInValue && checkOutValue) {
    const start = new Date(`${checkInValue}T00:00:00`);
    const end = new Date(`${checkOutValue}T00:00:00`);

    nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  packageName.textContent = "Hotel Room Reservation";

  const totalGuests = roomLines.reduce(
    (total, room) => total + Number(room.guests),
    0,
  );

  nightsGuests.textContent = `${Math.max(0, nights)} Nights · ${roomLines.length} Rooms · ${totalGuests} Guests`;

  if (nights <= 0 || roomLines.length === 0) {
    subtotalElement.textContent = "₱0.00";
    vatElement.textContent = "₱0.00";
    totalElement.textContent = "₱0.00";
    downpaymentElement.textContent = "₱0.00";
    remainingElement.textContent = "₱0.00";

    return;
  }

  const subtotal = roomLines.reduce((total, room) => {
    const category = roomCategories.find((item) => item.name === room.roomType);

    return total + category.rate * nights;
  }, 0);

  const vat = subtotal * 0.12;
  const grandTotal = subtotal + vat;
  const downpayment = grandTotal * 0.3;
  const remaining = grandTotal - downpayment;

  const formatCurrency = (amount) =>
    `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  subtotalElement.textContent = formatCurrency(subtotal);
  vatElement.textContent = formatCurrency(vat);
  totalElement.textContent = formatCurrency(grandTotal);
  downpaymentElement.textContent = formatCurrency(downpayment);
  remainingElement.textContent = formatCurrency(remaining);
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ─── Confirm Booking & Issue Dual Passes ─── */
async function processConfirmBooking(e) {
  e.preventDefault();

  if (appState.packageType !== "hotel_only") {
    showToast("Attraction-only reservations are not connected yet.");
    return;
  }

  const item = appState.currentBookingTarget;

  if (!item) {
    showToast("Please select a destination first.");
    return;
  }

  if (!window.sb) {
    showToast("Supabase connection is not initialized.");
    return;
  }

  const guestName = document.getElementById("bookGuestName").value.trim();

  const guestEmail = document.getElementById("bookGuestEmail").value.trim();

  const contactNumber = document
    .getElementById("bookGuestContact")
    .value.trim();

  const address = document.getElementById("bookGuestAddress").value.trim();

  const checkInDate = document.getElementById("bookCheckIn").value;
  const checkOutDate = document.getElementById("bookCheckOut").value;

  if (!guestName || !guestEmail || !contactNumber || !address) {
    showToast("Please complete all guest information.");
    return;
  }

  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
    showToast("Check-out must be later than check-in.");
    return;
  }

  if (roomLines.length === 0) {
    showToast("Please add at least one room.");
    return;
  }

  // Validate room capacity.
  for (const room of roomLines) {
    const category = roomCategories.find((item) => item.name === room.roomType);

    if (!category || room.guests < 1 || room.guests > category.maxGuests) {
      showToast(`Invalid guest count for ${room.roomType}.`);
      return;
    }
  }

  const rooms = roomLines.map((room) => ({
    room_type: room.roomType,
    number_of_guests: Number(room.guests),
  }));

  const confirmButton = document.getElementById("confirmBookingBtn");

  confirmButton.disabled = true;
  confirmButton.textContent = "Processing Reservation...";

  try {
    const { data, error } = await window.sb.rpc("create_online_reservation", {
      p_hotel_name: item.hotel.name,
      p_guest_name: guestName,
      p_contact_number: contactNumber,
      p_email: guestEmail,
      p_address: address,
      p_check_in: `${checkInDate}T14:00:00+08:00`,
      p_check_out: `${checkOutDate}T12:00:00+08:00`,
      p_rooms: rooms,
    });

    if (error) {
      throw error;
    }

    if (!data || !data.success) {
      throw new Error(data?.message || "Reservation could not be created.");
    }

    closeBookingModal();

    showToast("Reservation saved successfully!");

    showHotelReservationQR({
      bookingReference: data.booking_reference,
      hotelName: item.hotel.name,
      guestName,
      checkInDate,
      checkOutDate,
      rooms,
      totalAmount: data.total_amount,
      downpayment: data.downpayment_amount,
      remainingBalance: data.remaining_balance,
      paymentStatus: data.payment_status,
    });
  } catch (error) {
    console.error("Reservation error:", error);

    showToast(
      error.message || "Something went wrong while saving your reservation.",
    );
  } finally {
    confirmButton.disabled = false;
    confirmButton.textContent = "Confirm Hotel Reservation";
  }
}

function showHotelReservationQR(booking) {
  const modal = document.getElementById("qrPassModal");

  if (!modal) return;

  const passCards = modal.querySelectorAll(".pass-ticket-card");

  // Hide the attraction QR card.
  if (passCards[0]) {
    passCards[0].style.display = "none";
  }

  // Show the hotel QR card.
  if (passCards[1]) {
    passCards[1].style.display = "";
  }

  const qrData = encodeURIComponent(
    `HOTEL-RESERVATION|REF:${booking.bookingReference}|STATUS:${booking.paymentStatus}`,
  );

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}`;

  document.getElementById("passHotelName").textContent = booking.hotelName;

  document.getElementById("passHotelQrImg").src = qrUrl;

  document.getElementById("passHotelCode").textContent =
    booking.bookingReference;

  document.getElementById("passHotelGuest").textContent = booking.guestName;

  document.getElementById("passHotelDates").textContent =
    `${booking.checkInDate} to ${booking.checkOutDate}`;

  document.getElementById("passHotelRoom").textContent =
    `${booking.rooms.length} room(s) · ${booking.paymentStatus}`;

  const heading = modal.querySelector(".modal-header-banner h3");

  if (heading) {
    heading.textContent = "Your Hotel Reservation QR";
  }

  const statusPill = passCards[1]?.querySelector(".pass-status-pill");

  if (statusPill) {
    statusPill.textContent = "PENDING PAYMENT";
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

/* ─── Show Generated Dual QR Passes Modal ─── */
function showGeneratedDualPass(booking) {
  const item = destinationsData[booking.pairIndex] || destinationsData[0];
  const modal = document.getElementById("qrPassModal");
  if (!modal) return;

  // 1. Generate Attraction Pass QR Code
  const spotQrData = encodeURIComponent(
    `VALID-TOURIST-PASS|ID:${booking.touristPassId}|SPOT:${item.spot.name}|HOLDER:${booking.guestName}|DATE:${booking.visitDate}|GUESTS:${booking.guestCount}`,
  );
  const spotQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${spotQrData}`;

  // 2. Generate Hotel Check-in QR Code
  const hotelQrData = encodeURIComponent(
    `VALID-HOTEL-RESERVATION|ID:${booking.hotelResId}|HOTEL:${item.hotel.name}|GUEST:${booking.guestName}|CHECKIN:${booking.checkInDate}|CHECKOUT:${booking.checkOutDate}`,
  );
  const hotelQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${hotelQrData}`;

  // Populate QR Modal DOM
  document.getElementById("passSpotName").textContent = item.spot.name;
  document.getElementById("passSpotQrImg").src = spotQrUrl;
  document.getElementById("passSpotCode").textContent = booking.touristPassId;
  document.getElementById("passSpotHolder").textContent = booking.guestName;
  document.getElementById("passSpotDate").textContent = booking.visitDate;
  document.getElementById("passSpotGuests").textContent =
    `${booking.guestCount} Visitors`;

  document.getElementById("passHotelName").textContent = item.hotel.name;
  document.getElementById("passHotelQrImg").src = hotelQrUrl;
  document.getElementById("passHotelCode").textContent = booking.hotelResId;
  document.getElementById("passHotelGuest").textContent = booking.guestName;
  document.getElementById("passHotelDates").textContent =
    `${booking.checkInDate} to ${booking.checkOutDate}`;
  document.getElementById("passHotelRoom").textContent =
    `${item.hotel.tag} (Confirmed)`;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeQrPassModal() {
  const modal = document.getElementById("qrPassModal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

async function loadMyReservations() {
  const { data, error } = await window.sb
    .from("hotel_reservations")
    .select(
      `
      *,
      hotel_records (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load reservations:", error);
    showToast("Unable to load your reservations.");
    return [];
  }

  return data || [];
}
/* ─── Trips View ─── */
async function getTripsViewHtml() {
  const container = document.getElementById("viewContainer");

  const reservations = await loadMyReservations();

  if (!container) return;

  if (appState.activeScreen !== "trips") return;

  container.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">My Reservations</p>
        <h2>Hotel Bookings</h2>
        <p>Manage your hotel reservations and payment details.</p>
      </div>
      <button class="btn btn-primary" onclick="navigate('explore')">
        Book Another Hotel
      </button>
    </div>

    ${
      reservations.length === 0
        ? `
          <div class="form-panel" style="text-align:center;padding:48px;">
            <h3>No Reservations Yet</h3>
            <p class="subtle">Your hotel reservations will appear here.</p>
          </div>
        `
        : reservations
            .map(
              (b) => `
          <div class="dest-card" style="margin-bottom:20px;">
            <div class="dest-card-body">
              <span class="eyebrow">
                ${b.booking_reference}
              </span>

              <h3>${b.hotel_name}</h3>

              <p>
                Guest: <strong>${b.guest_name}</strong>
              </p>

              <p>
                Check-in: ${b.check_in}
                · Check-out: ${b.check_out}
              </p>

              <p>
                Rooms: ${b.hotel_records?.length || 0}
              </p>

              <p>
                Total: ₱${Number(b.total_amount).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <p>
                Downpayment: ₱${Number(b.downpayment_amount).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                  },
                )}
              </p>

              <span class="tag tag--teal">
                ${b.payment_status}
              </span>
            </div>
          </div>
        `,
            )
            .join("")
    }
  `;
}

/* ─── Favorites View ─── */
function getFavoritesViewHtml() {
  const favItems = destinationsData.filter((x) => appState.favorites.has(x.id));

  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">Saved Travel Ideas</p>
        <h2>Your Favorite Destinations</h2>
        <p>Quick access to destinations and hotels you've bookmarked.</p>
      </div>
    </div>

    ${
      favItems.length
        ? `
      <div class="cards-grid">
        ${favItems.map((item) => renderDestinationCard(item, destinationsData.indexOf(item))).join("")}
      </div>
    `
        : `
      <div class="form-panel" style="text-align:center; padding:48px;">
        <h3>No saved favorites yet</h3>
        <p class="subtle">Click the heart icon on any destination card to bookmark it here.</p>
        <button type="button" class="btn btn-primary" onclick="navigate('explore')">Explore Destinations</button>
      </div>
    `
    }
  `;
}

/* ─── QR Passes View (Direct from Sidebar) ─── */

async function getQrPassesViewHtml() {
  const container = document.getElementById("viewContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="form-panel">
      <p>Loading your reservation QR pass...</p>
    </div>
  `;

  const reservations = await loadMyReservations();

  // Prevent rendering if the user navigated to another screen.
  if (appState.activeScreen !== "qr") return;

  if (!reservations.length) {
    container.innerHTML = `
      <div class="section-head">
        <div>
          <h2>My QR Passes</h2>
          <p>No reservation passes available yet.</p>
        </div>
      </div>

      <div class="empty-state">
        <h3>No Hotel QR Pass Yet</h3>
        <p>Make a hotel reservation to generate your QR pass.</p>
        <button class="btn-primary" onclick="navigate('explore')">
          Explore Hotels
        </button>
      </div>
    `;
    return;
  }

  const latest = reservations[0];

  const qrPayload = encodeURIComponent(
    `HOTEL-RESERVATION|REF:${latest.booking_reference}|STATUS:${latest.payment_status}`,
  );

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrPayload}`;

  const formatCurrency = (amount) =>
    `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const roomCount = latest.hotel_records?.length || 0;

  container.innerHTML = `
    <div class="section-head">
      <div>
        <h2>My QR Passes</h2>
        <p>Your hotel reservation check-in reference.</p>
      </div>
    </div>

    <div class="passes-display-grid">
      <div class="pass-ticket-card">
        <div class="pass-ticket-header hotel-theme">
          <div>
            <strong>Hotel Reservation Pass</strong>
            <p>${latest.hotel_name}</p>
          </div>
          <span class="status-pill">
            ${(latest.payment_status || "pending").toUpperCase()}
          </span>
        </div>

        <div class="pass-qr-area">
          <img
            src="${qrUrl}"
            alt="Hotel reservation QR code"
            width="220"
            height="220"
          />
          <strong>${latest.booking_reference}</strong>
          <small>Present this QR code to the hotel staff.</small>
        </div>

        <div class="pass-details-list">
          <div>
            <span>Guest Name</span>
            <strong>${latest.guest_name}</strong>
          </div>
          <div>
            <span>Check-in</span>
            <strong>${formatDate(latest.check_in)}</strong>
          </div>
          <div>
            <span>Check-out</span>
            <strong>${formatDate(latest.check_out)}</strong>
          </div>
          <div>
            <span>Number of Rooms</span>
            <strong>${roomCount}</strong>
          </div>
          <div>
            <span>Total Amount</span>
            <strong>${formatCurrency(latest.total_amount)}</strong>
          </div>
          <div>
            <span>Downpayment</span>
            <strong>${formatCurrency(latest.downpayment_amount)}</strong>
          </div>
        </div>

        <div class="pass-ticket-footer">
          <small>Keep this QR code for hotel reservation verification.</small>
          <button class="btn-primary" onclick="window.print()">
            Print QR Pass
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ─── Chatbot Trip Planner State & Logic ─── */
let chatHistory = [
  {
    sender: "bot",
    text: "Mabuhay Alex! 🌴 I am your AI Itinerary Planner. Where would you like to travel in the Philippines? Tell me your destination, number of days, or budget (e.g. <em>'Plan a 3-day beach trip to Boracay'</em>, <em>'2 days in Baguio'</em>, or <em>'Historical tour in Manila'</em>) and I will generate your day-by-day schedule with paired stays and instant QR booking!",
    time: "Just now",
  },
];

let activeItinerary = {
  pairIndex: 1, // Boracay
  days: 3,
  budget: 40500,
  title: "Boracay Island Coastal Escape",
  schedule: [
    {
      day: "Day 1: Arrival & Sunset Sailing",
      items: [
        {
          time: "02:00 PM",
          text: "Speedboat transfer & VIP Check-in at Discovery Shores Boracay",
        },
        {
          time: "04:30 PM",
          text: "Beachfront walk & photo op at Willy's Rock grotto",
        },
        {
          time: "05:30 PM",
          text: "Paraw sunset sailing across White Beach Station 1",
        },
        {
          time: "07:30 PM",
          text: "Seafood dinner buffet by the beach with acoustic music",
        },
      ],
    },
    {
      day: "Day 2: Marine Sanctuary & Watersports",
      items: [
        { time: "08:00 AM", text: "Buffet breakfast at Terra Wellness Cafe" },
        {
          time: "09:30 AM",
          text: "Crystal kayaking & paddleboarding around Station 1",
        },
        {
          time: "01:30 PM",
          text: "Island hopping & snorkeling at Coral Garden",
        },
        {
          time: "06:00 PM",
          text: "Sunset cocktails at the Discovery Shores 360° infinity pool",
        },
      ],
    },
    {
      day: "Day 3: Souvenirs & Relaxed Departure",
      items: [
        {
          time: "09:00 AM",
          text: "Morning shoreline stroll & D'Mall souvenir shopping",
        },
        {
          time: "11:30 AM",
          text: "Hotel check-out & private speedboat transfer back to Caticlan",
        },
      ],
    },
  ],
};

/* ─── Planner View (Chatbot Interface + Live Panel) ─── */
function getPlannerViewHtml() {
  const item =
    destinationsData[activeItinerary.pairIndex] || destinationsData[1];

  return `
    <div class="section-head" style="margin-bottom:18px;">
      <div>
        <p class="eyebrow">AI Travel Assistant &middot; Conversational Itinerary Builder</p>
        <h2>Trip Planner Chatbot</h2>
        <p>Chat with our AI bot to generate custom day-by-day itineraries, estimate budgets, and generate booking QR passes.</p>
      </div>
      <button type="button" class="btn btn-primary" onclick="openBookingModal(${activeItinerary.pairIndex}, 'combined')">
        Book Active Itinerary
      </button>
    </div>

    <div class="planner-chat-layout">
      <!-- Left Column: Interactive Chatbot -->
      <div class="chat-card">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-bot-identity">
            <div class="bot-avatar-circle">
              <i data-lucide="bot"></i>
              <span class="online-beacon" title="Online & Ready"></span>
            </div>
            <div class="bot-title-group">
              <h3>TravelBot AI Assistant</h3>
              <span><i data-lucide="sparkles" style="width:12px; height:12px;"></i> AI Trip Planner &middot; Active</span>
            </div>
          </div>
          <button type="button" class="chat-reset-btn" onclick="resetChatConversation()">
            Clear Chat
          </button>
        </div>

        <!-- Chat Messages Feed -->
        <div class="chat-messages" id="chatMessagesFeed">
          ${renderChatMessagesHtml()}
        </div>

        <!-- Quick Prompt Suggestions -->
        <div class="chat-quick-prompts">
          <button type="button" class="prompt-pill" onclick="sendQuickPrompt('Plan 3 days in Boracay with beach activities')">
            🏖️ 3 Days in Boracay
          </button>
          <button type="button" class="prompt-pill" onclick="sendQuickPrompt('Create 2 days Baguio mountain getaway')">
            🏔️ 2 Days in Baguio
          </button>
          <button type="button" class="prompt-pill" onclick="sendQuickPrompt('4 days luxury island hopping in El Nido Palawan')">
            🌊 4 Days in El Nido
          </button>
          <button type="button" class="prompt-pill" onclick="sendQuickPrompt('1 day historical walking tour in Manila Intramuros')">
            🏰 1 Day in Intramuros
          </button>
          <button type="button" class="prompt-pill" onclick="sendQuickPrompt('Weekend relaxing trip in Tagaytay Volcano Ridge')">
            🌋 Weekend in Tagaytay
          </button>
          <button type="button" class="prompt-pill" onclick="sendQuickPrompt('2 days heritage cobblestone walk in Vigan')">
            🏛️ 2 Days in Vigan
          </button>
          <button type="button" class="prompt-pill" onclick="sendQuickPrompt('3 days surfing and beach in Siargao Cloud 9')">
            🏄 3 Days in Siargao
          </button>
        </div>

        <!-- Chat Input Bar -->
        <form class="chat-input-bar" onsubmit="handleChatSubmit(event)">
          <input
            type="text"
            id="chatUserInput"
            placeholder="Tell AI where you want to go (e.g. 'Plan 3 days in Boracay under 15k')..."
            autocomplete="off"
          />
          <button type="submit" class="chat-send-btn" title="Send request">
            <i data-lucide="send"></i>
          </button>
        </form>
      </div>

      <!-- Right Column: Live Itinerary Display -->
      <div class="live-itinerary-card" id="liveItineraryContainer">
        ${renderLiveItineraryHtml()}
      </div>
    </div>
  `;
}

/* ─── Render Chat Messages Feed ─── */
function renderChatMessagesHtml() {
  return (
    chatHistory
      .map(
        (msg) => `
    <div class="chat-row ${msg.sender === "user" ? "user-row" : "bot-row"}">
      <div class="chat-bubble">
        ${msg.text}
        <span class="chat-time">${msg.time}</span>
      </div>
    </div>
  `,
      )
      .join("") +
    `<div id="chatTypingPlaceholder" class="hidden">
    <div class="chat-row bot-row">
      <div class="typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  </div>`
  );
}

function updateChatFeedDom() {
  const feed = document.getElementById("chatMessagesFeed");
  if (feed) {
    feed.innerHTML = renderChatMessagesHtml();
    feed.scrollTop = feed.scrollHeight;
    if (window.lucide) lucide.createIcons();
  }
}

/* ─── Render Live Itinerary Panel ─── */
function renderLiveItineraryHtml() {
  const item =
    destinationsData[activeItinerary.pairIndex] || destinationsData[1];

  return `
    <!-- Destination Header Media -->
    <div class="itinerary-hero-header">
      <img src="${item.spot.image}" alt="${item.spot.name}" />
      <div class="itinerary-hero-overlay">
        <span class="tag tag--teal" style="width:fit-content; margin-bottom:4px;">${item.category.toUpperCase()} DESTINATION</span>
        <h3>${item.spot.name}</h3>
        <span class="small" style="color:#d4fbf4;">Paired Stay: <b>${item.hotel.name}</b> (${item.distance})</span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="itinerary-stats-row">
      <div class="itinerary-stat-item">
        <strong>${activeItinerary.days} Days</strong>
        <span>Duration</span>
      </div>
      <div class="itinerary-stat-item">
        <strong>${item.location}</strong>
        <span>Location</span>
      </div>
      <div class="itinerary-stat-item">
        <strong style="color:var(--teal);">₱${activeItinerary.budget.toLocaleString()}</strong>
        <span>Estimated Total</span>
      </div>
    </div>

    <!-- Timeline Schedule -->
    <div class="itinerary-timeline-feed">
      ${activeItinerary.schedule
        .map(
          (dayBlock) => `
        <div class="timeline-day-block">
          <div class="timeline-day-title">${dayBlock.day}</div>
          <div class="timeline-item-list">
            ${dayBlock.items
              .map(
                (it) => `
              <div class="timeline-item-row">
                <b>${it.time}</b> &middot; ${it.text}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `,
        )
        .join("")}
    </div>

    <!-- Action Buttons -->
    <div class="itinerary-action-box">
      <button type="button" class="btn btn-primary" onclick="openBookingModal(${activeItinerary.pairIndex}, 'combined')">
        <i data-lucide="ticket"></i>
        Book This Itinerary &amp; Generate QR Passes
      </button>
      <button type="button" class="btn btn-secondary" onclick="saveItineraryToTrips()">
        <i data-lucide="bookmark"></i>
        Save Itinerary to My Trips
      </button>
    </div>
  `;
}

function updateLiveItineraryDom() {
  const container = document.getElementById("liveItineraryContainer");
  if (container) {
    container.innerHTML = renderLiveItineraryHtml();
    if (window.lucide) lucide.createIcons();
  }
}

/* ─── Chatbot Event Handlers ─── */
function handleChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("chatUserInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  submitChatMessage(text);
  input.value = "";
}

function sendQuickPrompt(promptText) {
  submitChatMessage(promptText);
}

function submitChatMessage(userText) {
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Add user bubble
  chatHistory.push({
    sender: "user",
    text: userText,
    time: now,
  });
  updateChatFeedDom();

  // Show typing indicator
  const typingIndicator = document.getElementById("chatTypingPlaceholder");
  if (typingIndicator) {
    typingIndicator.classList.remove("hidden");
    const feed = document.getElementById("chatMessagesFeed");
    if (feed) feed.scrollTop = feed.scrollHeight;
  }

  // AI Response Simulation with Smart Intent Parsing
  setTimeout(() => {
    const aiResult = generateAiItineraryFromPrompt(userText);

    // Hide typing indicator
    if (typingIndicator) typingIndicator.classList.add("hidden");

    // Add bot response
    chatHistory.push({
      sender: "bot",
      text: aiResult.reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Update active itinerary
    if (aiResult.itinerary) {
      activeItinerary = aiResult.itinerary;
      updateLiveItineraryDom();
      showToast(
        `Itinerary generated for ${destinationsData[activeItinerary.pairIndex].spot.name}!`,
      );
    }

    updateChatFeedDom();
  }, 750);
}

function resetChatConversation() {
  chatHistory = [
    {
      sender: "bot",
      text: "Mabuhay! Chat restarted. Tell me your dream Philippine destination and how many days you'd like to spend, and I'll generate your plan!",
      time: "Just now",
    },
  ];
  updateChatFeedDom();
}

function saveItineraryToTrips() {
  const item = destinationsData[activeItinerary.pairIndex];
  showToast(
    `Itinerary saved: ${item.spot.name} (${activeItinerary.days} Days)`,
  );
}

/* ─── AI Itinerary Parsing Engine ─── */
function generateAiItineraryFromPrompt(prompt) {
  const lower = prompt.toLowerCase();

  // 1. Destination Matching
  let targetIndex = 1; // Default: Boracay
  if (
    lower.includes("boracay") ||
    lower.includes("willy") ||
    lower.includes("white beach")
  ) {
    targetIndex = 1;
  } else if (
    lower.includes("el nido") ||
    lower.includes("palawan") ||
    lower.includes("lagoon") ||
    lower.includes("bacuit")
  ) {
    targetIndex = 4;
  } else if (
    lower.includes("baguio") ||
    lower.includes("benguet") ||
    lower.includes("mines view") ||
    lower.includes("pine")
  ) {
    targetIndex = 3;
  } else if (
    lower.includes("manila") ||
    lower.includes("intramuros") ||
    lower.includes("fort santiago") ||
    lower.includes("rizal")
  ) {
    targetIndex = 0;
  } else if (
    lower.includes("cebu") ||
    lower.includes("santo nino") ||
    lower.includes("magellan") ||
    lower.includes("basilica")
  ) {
    targetIndex = 2;
  } else if (
    lower.includes("tagaytay") ||
    lower.includes("taal") ||
    lower.includes("volcano lake") ||
    lower.includes("sky ranch")
  ) {
    targetIndex = 5;
  } else if (
    lower.includes("bohol") ||
    lower.includes("panglao") ||
    lower.includes("alona") ||
    lower.includes("balicasag")
  ) {
    targetIndex = 6;
  } else if (
    lower.includes("vigan") ||
    lower.includes("crisologo") ||
    lower.includes("ilocos") ||
    lower.includes("kalesa")
  ) {
    targetIndex = 7;
  } else if (
    lower.includes("siargao") ||
    lower.includes("cloud 9") ||
    lower.includes("surf") ||
    lower.includes("general luna")
  ) {
    targetIndex = 8;
  } else if (
    lower.includes("mayon") ||
    lower.includes("albay") ||
    lower.includes("cagsawa") ||
    lower.includes("legazpi") ||
    lower.includes("bicol")
  ) {
    targetIndex = 9;
  }

  // 2. Days Extraction
  let days = 3;
  const dayMatch = lower.match(/(\d+)\s*(?:day|days|araw)/);
  if (dayMatch && dayMatch[1]) {
    days = Math.min(5, Math.max(1, parseInt(dayMatch[1])));
  } else if (lower.includes("weekend")) {
    days = 2;
  } else if (
    lower.includes("1 day") ||
    lower.includes("isang araw") ||
    lower.includes("day tour")
  ) {
    days = 1;
  }

  const destination = destinationsData[targetIndex];
  const hotelRate = destination.hotel.rate;
  const spotFee = destination.spot.fee;
  const estimatedBudget =
    hotelRate * Math.max(1, days - 1) + spotFee * 2 + days * 1200;

  // 3. Build Schedule dynamically based on destination & days
  const generatedSchedule = [];

  // Day 1: Arrival & Core Spot
  generatedSchedule.push({
    day: `Day 1: Arrival & Exploring ${destination.spot.name}`,
    items: [
      {
        time: "01:30 PM",
        text: `Check-in and room orientation at <strong>${destination.hotel.name}</strong> (${destination.hotel.tag})`,
      },
      {
        time: "03:30 PM",
        text: `Visit <strong>${destination.spot.name}</strong> (${destination.distance} from hotel)`,
      },
      {
        time: "05:30 PM",
        text: `Scenic photography and sunset viewpoint walk`,
      },
      {
        time: "07:30 PM",
        text: `Welcome dinner featuring local culinary specialties`,
      },
    ],
  });

  if (days >= 2) {
    generatedSchedule.push({
      day: `Day 2: Cultural Highlights & Signature Activities`,
      items: [
        {
          time: "08:00 AM",
          text: `Buffet breakfast at ${destination.hotel.name}`,
        },
        {
          time: "09:30 AM",
          text: `Signature guided activity: ${destination.spot.desc.split(".")[0]}`,
        },
        {
          time: "01:30 PM",
          text: `Leisure afternoon rest, pool recovery, or local cafe hopping`,
        },
        {
          time: "06:30 PM",
          text: `Evening heritage walk or sunset cocktails at the hotel lounge`,
        },
      ],
    });
  }

  if (days >= 3) {
    generatedSchedule.push({
      day: `Day 3: Scenic Excursions & Souvenir Market`,
      items: [
        {
          time: "08:30 AM",
          text: `Morning mountain/beach walk around the local community`,
        },
        {
          time: "10:30 AM",
          text: `Handcrafted artisan souvenir shopping & delicacy tasting`,
        },
        {
          time: "02:00 PM",
          text: `Spa treatment or recreational sports at ${destination.hotel.name}`,
        },
        { time: "07:00 PM", text: `Farewell dinner banquet` },
      ],
    });
  }

  if (days >= 4) {
    generatedSchedule.push({
      day: `Day 4: Deep Nature Discovery & Island Adventures`,
      items: [
        {
          time: "08:00 AM",
          text: `Early morning boat/eco-trail excursion to nearby marine/forest reserves`,
        },
        { time: "12:30 PM", text: `Picnic lunch by the scenic viewpoint` },
        { time: "04:30 PM", text: `Sunset leisure time at the hotel pool bar` },
      ],
    });
  }

  if (days >= 5) {
    generatedSchedule.push({
      day: `Day 5: Relaxed Breakfast & Departure`,
      items: [
        { time: "09:00 AM", text: `Farewell breakfast & packaging keepsakes` },
        {
          time: "11:30 AM",
          text: `Check-out at ${destination.hotel.name} with airport/terminal transfer`,
        },
      ],
    });
  }

  const botReply = `
    Done! ✨ I have generated your customized <strong>${days}-Day Itinerary</strong> for <strong>${destination.spot.name}</strong> paired with <strong>${destination.hotel.name}</strong> (${destination.distance}).<br><br>
    📍 <strong>Location:</strong> ${destination.location}<br>
    💰 <strong>Estimated Budget:</strong> ~₱${estimatedBudget.toLocaleString()}<br><br>
    Check out the <strong>Live Itinerary Panel</strong> on your right. You can click <strong>'Book This Itinerary'</strong> to reserve your stay and instantly generate your <strong>Dual QR Passes</strong>!
  `;

  return {
    reply: botReply,
    itinerary: {
      pairIndex: targetIndex,
      days: days,
      budget: estimatedBudget,
      title: `${destination.spot.name} Vacation`,
      schedule: generatedSchedule,
    },
  };
}

/* ─── Profile View ─── */
function getProfileViewHtml() {
  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">Traveler Profile &amp; Preferences</p>
        <h2>Account Settings</h2>
        <p>Manage your traveler credentials and notification preferences.</p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:24px;">
      <div class="form-panel">
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
          <div style="width:72px; height:72px; border-radius:50%; background:var(--navy); color:#fff; display:grid; place-items:center; font-size:24px; font-weight:700;">
            AT
          </div>
          <div>
            <h3 style="margin:0;">Alex Traveler</h3>
            <p class="small subtle" style="margin:2px 0 0;">alex.traveler@example.com &middot; Verified Traveler</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div class="explore-field">
            <label>Full Name</label>
            <input type="text" value="Alex Traveler" />
          </div>
          <div class="explore-field">
            <label>Email Address</label>
            <input type="email" value="alex.traveler@example.com" />
          </div>
          <div class="explore-field">
            <label>Primary Phone</label>
            <input type="text" value="+63 917 555 0192" />
          </div>
          <div class="explore-field">
            <label>Travel Preference</label>
            <select>
              <option selected>Balanced Pace (Culture &amp; Coast)</option>
              <option>Relaxed Luxury</option>
              <option>Active Exploration</option>
            </select>
          </div>
        </div>

        <button type="button" class="btn btn-primary" style="margin-top:20px;" onclick="showToast('Profile preferences saved successfully.')">
          Save Changes
        </button>
      </div>

      <div class="form-panel">
        <h3>Digital ID Status</h3>
        <p class="small"><b>Tourist ID:</b> TP-PH-2026-8842</p>
        <p class="small"><b>Verification:</b> Verified Government Issued ID</p>
        <p class="small"><b>Membership:</b> Premier Traveler Club</p>
        <hr style="border:0; border-top:1px solid var(--line); margin:16px 0;" />
        <button type="button" class="btn btn-secondary" style="width:100%;" onclick="navigate('qr')">
          View Active Passes
        </button>
      </div>
    </div>
  `;
}

/* ─── Detail Modal ─── */
function openDetailModal(index) {
  const item = destinationsData[index];
  if (!item) return;

  const modal = document.getElementById("spotDetailModal");
  if (!modal) return;

  document.getElementById("detailModalTitle").textContent =
    `${item.spot.name} + ${item.hotel.name}`;
  document.getElementById("detailSpotName").textContent = item.spot.name;
  document.getElementById("detailSpotDesc").textContent = item.spot.desc;
  document.getElementById("detailSpotFee").textContent =
    item.spot.fee > 0 ? `₱${item.spot.fee}` : "Free Admission";
  document.getElementById("detailSpotHours").textContent = item.spot.hours;
  document.getElementById("detailHotelName").textContent = item.hotel.name;
  document.getElementById("detailHotelDesc").textContent = item.hotel.desc;
  document.getElementById("detailHotelRate").textContent =
    `₱${item.hotel.rate.toLocaleString()} / night`;
  document.getElementById("detailLocation").textContent = item.location;
  document.getElementById("detailDistance").textContent = item.distance;
  document.getElementById("detailSpotImg").src = item.spot.image;
  document
    .getElementById("detailModalBookBtn")
    .setAttribute(
      "onclick",
      `closeDetailModal(); openBookingModal(${index}, 'combined');`,
    );

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeDetailModal() {
  const modal = document.getElementById("spotDetailModal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ─── Utility Helpers ─── */
function toggleFavorite(id, btn) {
  if (appState.favorites.has(id)) {
    appState.favorites.delete(id);
    if (btn) btn.classList.remove("favorited");
    showToast("Removed from favorites");
  } else {
    appState.favorites.add(id);
    if (btn) btn.classList.add("favorited");
    showToast("Saved to favorites!");
  }
  localStorage.setItem("tp_favorites", JSON.stringify([...appState.favorites]));
  updateFavoritesCount();

  if (appState.activeScreen === "favorites") {
    renderScreen();
  }
}

function updateFavoritesCount() {
  const badge = document.getElementById("favCountBadge");
  if (badge) {
    badge.textContent = appState.favorites.size;
  }
}

function showToast(msg) {
  const toast = document.getElementById("appToast");
  if (toast) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 2800);
  }
}

function printPasses(bookingId) {
  window.print();
}
