/**
 * Tourist Portal Subsystem
 * Refactored Dashboard
 *
 * Responsibilities:
 * - Dashboard navigation
 * - Home and Explore views
 * - Supabase tourist spots and hotels
 * - Favorites
 * - Hotel reservations and QR display
 * - Trip Planner
 * - User Profile
 *
 * Booking modals, room selection, and booking processing
 * are handled by modals.js.
 */

// =====================================================
// 1. APP STATE
// =====================================================

let destinationsData = [];

const appState = {
  activeScreen: "home",
  favorites: new Set(JSON.parse(localStorage.getItem("tp_favorites") || "[]")),
  exploreFilter: "all",
  exploreSearch: "",
  currentUser: null,
  profile: null,
  reservations: [],
  loading: false,
};

let chatHistory = [];
let activeItinerary = null;

// =====================================================
// 2. INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", initializeDashboard);

async function initializeDashboard() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedView = urlParams.get("view");

    const allowedViews = [
      "home",
      "explore",
      "planner",
      "trips",
      "favorites",
      "qr",
      "profile",
    ];

    if (allowedViews.includes(requestedView)) {
      appState.activeScreen = requestedView;
    }

    await loadCurrentUser();
    await loadDashboardData();

    renderNavigation();
    await renderScreen();
    updateFavoritesCount();

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error("Dashboard initialization failed:", error);
    showToast("Unable to initialize dashboard.");
  }
}

// =====================================================
// 3. AUTHENTICATED USER
// =====================================================

async function loadCurrentUser() {
  if (!window.sb) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await window.sb.auth.getSession();

  if (error) {
    throw error;
  }

  const session = data.session;

  if (!session) {
    window.location.href = "../pages/login.html";
    return;
  }

  appState.currentUser = session.user;

  const { data: profile, error: profileError } = await window.sb
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Failed to load profile:", profileError);
  }

  appState.profile = profile || null;
}

// =====================================================
// 4. LOAD DATABASE DATA
// =====================================================

async function loadDashboardData() {
  appState.loading = true;

  try {
    const [spotsResult, hotelsResult] = await Promise.all([
      window.sb
        .from("tourist_spots")
        .select("*")
        .eq("is_active", true)
        .order("name"),

      window.sb.from("hotels").select("*").eq("is_active", true).order("name"),
    ]);

    if (spotsResult.error) {
      throw spotsResult.error;
    }

    if (hotelsResult.error) {
      throw hotelsResult.error;
    }

    const spots = spotsResult.data || [];
    const hotels = hotelsResult.data || [];

    destinationsData = spots.map((spot) => {
      const relatedHotel = hotels.find(
        (hotel) =>
          String(hotel.nearest_spot_id) === String(spot.id) ||
          String(hotel.nearest_spot) === String(spot.name),
      );

      return mapDestinationData(spot, relatedHotel || null);
    });
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    showToast("Unable to load destinations.");
    destinationsData = [];
  } finally {
    appState.loading = false;
  }
}

/**
 * Converts database records into the object structure
 * currently expected by modals.js and the dashboard cards.
 *
 * This is a temporary compatibility layer.
 * It does not contain hardcoded destination records.
 */
function mapDestinationData(spot, hotel) {
  return {
    id: String(spot.id),
    databaseId: spot.id,
    category: spot.category || "other",
    location: [spot.location, spot.city, spot.province]
      .filter(Boolean)
      .join(", "),

    distance: null,

    spot: {
      id: spot.id,
      name: spot.name,
      tag: spot.category || "Tourist Attraction",
      image: spot.image_url || "",
      desc: spot.description || "No description available.",
      fee: spot.entrance_fee,
      hours: spot.opening_hours || "Not specified",
      raw: spot,
    },

    hotel: hotel
      ? {
          id: hotel.id,
          name: hotel.name,
          tag: hotel.category || "Hotel",
          image: hotel.image_url || "",
          desc: hotel.description || "No description available.",
          rate:
            hotel.price_per_night ??
            hotel.nightly_rate ??
            hotel.base_price ??
            0,
          amenities: hotel.amenities || [],
          raw: hotel,
        }
      : null,

    rawSpot: spot,
    rawHotel: hotel,
  };
}

// =====================================================
// 5. NAVIGATION
// =====================================================

function navigate(screen) {
  appState.activeScreen = screen;

  window.history.replaceState({}, "", `?view=${screen}`);

  renderNavigation();
  renderScreen();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function renderNavigation() {
  document
    .querySelectorAll(".nav-item-btn, .mobile-nav-btn")
    .forEach((button) => {
      const target = button.getAttribute("data-screen");

      button.classList.toggle("active", target === appState.activeScreen);
    });
}

async function renderScreen() {
  const container = document.getElementById("viewContainer");

  if (!container) return;

  switch (appState.activeScreen) {
    case "explore":
      container.innerHTML = getExploreViewHtml();
      setupExploreEvents();
      break;

    case "trips":
      await getTripsViewHtml();
      break;

    case "favorites":
      container.innerHTML = getFavoritesViewHtml();
      break;

    case "qr":
      await getQrPassesViewHtml();
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

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =====================================================
// 6. HOME
// =====================================================

function getHomeViewHtml() {
  const userName =
    appState.profile?.full_name ||
    appState.currentUser?.user_metadata?.full_name ||
    appState.currentUser?.email ||
    "Traveler";

  const firstName = userName.split(" ")[0];

  const featuredDestinations = destinationsData.slice(0, 6);

  return `
    <div class="dashboard-hero">
      <div class="hero-left">
        <p class="eyebrow" style="color:var(--teal-light); margin-bottom:6px;">
          Traveler Dashboard
        </p>

        <h1>Welcome back, ${escapeHtml(firstName)}</h1>

        <p>
          Discover Philippine destinations, explore tourist attractions,
          and manage your reservations in one place.
        </p>
      </div>

      <div class="hero-action-box">
        <button
          type="button"
          class="btn btn-primary"
          onclick="navigate('explore')"
        >
          Explore Destinations
        </button>

        <button
          type="button"
          class="btn btn-secondary"
          onclick="navigate('qr')"
        >
          View My Passes
        </button>
      </div>
    </div>

    <div class="metrics-row">
      <div class="metric-card" onclick="navigate('explore')">
        <div class="metric-icon-box">
          <i data-lucide="compass"></i>
        </div>

        <strong>Explore Destinations</strong>
        <p>Discover available tourist attractions.</p>

        <span class="btn btn-secondary">Explore Now</span>
      </div>

      <div class="metric-card" onclick="navigate('planner')">
        <div class="metric-icon-box purple">
          <i data-lucide="map"></i>
        </div>

        <strong>Trip Planner</strong>
        <p>Plan your next Philippine adventure.</p>

        <span class="btn btn-primary">Plan a Trip</span>
      </div>

      <div class="metric-card" onclick="navigate('qr')">
        <div class="metric-icon-box amber">
          <i data-lucide="qr-code"></i>
        </div>

        <strong>Digital QR Passes</strong>
        <p>View your reservation QR references.</p>

        <span class="btn btn-secondary">Open Passes</span>
      </div>

      <div class="metric-card" onclick="navigate('trips')">
        <div class="metric-icon-box coral">
          <i data-lucide="briefcase"></i>
        </div>

        <strong>My Reservations</strong>
        <p>Manage your existing reservations.</p>

        <span class="btn btn-secondary">View Reservations</span>
      </div>
    </div>

    <div class="section-head">
      <div>
        <h2>Featured Tourist Attractions</h2>
        <p>Explore destinations currently available in our database.</p>
      </div>

      <button
        type="button"
        class="btn btn-secondary"
        onclick="navigate('explore')"
      >
        View All &rarr;
      </button>
    </div>

    <div class="cards-grid">
      ${
        featuredDestinations.length
          ? featuredDestinations
              .map((item) => renderDestinationCard(item))
              .join("")
          : `
            <div class="form-panel" style="grid-column:1/-1;text-align:center;">
              <h3>No destinations available</h3>
              <p class="subtle">
                Tourist attractions will appear here once available.
              </p>
            </div>
          `
      }
    </div>
  `;
}

// =====================================================
// 7. EXPLORE
// =====================================================

function getExploreViewHtml() {
  return `
    <div class="section-head" style="margin-bottom:16px;">
      <div>
        <p class="eyebrow">Explore Destinations</p>
        <h2>Discover Tourist Attractions</h2>
        <p>Find destinations available in the Tourist Portal.</p>
      </div>
    </div>

    <div class="explore-controls-bar">
      <div class="explore-filter-grid">
        <div class="explore-field">
          <label for="exploreSearchInput">Search Destinations</label>

          <input
            type="text"
            id="exploreSearchInput"
            placeholder="Search tourist attractions..."
            value="${escapeHtml(appState.exploreSearch)}"
          />
        </div>

        <div class="explore-field">
          <label for="categoryFilter">Category</label>

          <select id="categoryFilter">
            <option value="all">All Categories</option>
            ${getCategoryOptions()}
          </select>
        </div>

        <div class="explore-field">
          <label>Filter Reset</label>

          <button
            type="button"
            class="btn btn-secondary"
            style="width:100%;"
            onclick="resetExploreFilters()"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <div class="cards-grid" id="exploreCardsGrid">
      ${renderFilteredDestinations()}
    </div>
  `;
}

function getCategoryOptions() {
  const categories = [
    ...new Set(destinationsData.map((item) => item.category).filter(Boolean)),
  ];

  return categories
    .map(
      (category) => `
        <option
          value="${escapeHtml(category)}"
          ${appState.exploreFilter === category ? "selected" : ""}
        >
          ${escapeHtml(formatCategory(category))}
        </option>
      `,
    )
    .join("");
}

function formatCategory(category) {
  return String(category)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getFilteredDestinations() {
  const query = appState.exploreSearch.toLowerCase();

  return destinationsData.filter((item) => {
    const matchesCategory =
      appState.exploreFilter === "all" ||
      item.category === appState.exploreFilter;

    const searchableText = [
      item.spot.name,
      item.location,
      item.spot.desc,
      item.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchableText.includes(query);
  });
}

function renderFilteredDestinations() {
  const items = getFilteredDestinations();

  if (!items.length) {
    return `
      <div
        class="form-panel"
        style="grid-column:1/-1;text-align:center;padding:48px;"
      >
        <h3>No matching destinations</h3>
        <p class="subtle">
          Try adjusting your search criteria.
        </p>
      </div>
    `;
  }

  return items.map((item) => renderDestinationCard(item)).join("");
}

function setupExploreEvents() {
  const input = document.getElementById("exploreSearchInput");

  if (input) {
    input.addEventListener("input", (event) => {
      appState.exploreSearch = event.target.value.trim();
      updateExploreGrid();
    });
  }

  const select = document.getElementById("categoryFilter");

  if (select) {
    select.addEventListener("change", (event) => {
      appState.exploreFilter = event.target.value;
      updateExploreGrid();
    });
  }
}

function setExploreFilter(category) {
  appState.exploreFilter = category;
  renderScreen();
}

function resetExploreFilters() {
  appState.exploreFilter = "all";
  appState.exploreSearch = "";

  renderScreen();
}

function updateExploreGrid() {
  const grid = document.getElementById("exploreCardsGrid");

  if (!grid) return;

  grid.innerHTML = renderFilteredDestinations();

  if (window.lucide) {
    lucide.createIcons();
  }
}

// =====================================================
// 8. DESTINATION CARD
// =====================================================

function renderDestinationCard(item) {
  const isFav = appState.favorites.has(item.id);

  const spot = item.spot;
  const hotel = item.hotel;

  const entranceFee =
    spot.fee === null || spot.fee === undefined
      ? "Not specified"
      : Number(spot.fee) === 0
        ? "Free entrance"
        : `₱${Number(spot.fee).toLocaleString("en-PH")}`;

  const hotelHtml = hotel
    ? `
      <div class="paired-hotel-chip">
        <span>Hotel: <strong>${escapeHtml(hotel.name)}</strong></span>
        <span style="font-weight:700;color:var(--teal);">
          ${
            Number(hotel.rate) > 0
              ? `₱${Number(hotel.rate).toLocaleString("en-PH")} / night`
              : "Rate not specified"
          }
        </span>
      </div>
    `
    : `
      <div class="paired-hotel-chip">
        <span>No associated hotel available</span>
      </div>
    `;

  return `
    <article class="dest-card">
      <div class="dest-card-media">
        ${
          spot.image
            ? `
              <img
                src="${escapeHtml(spot.image)}"
                alt="${escapeHtml(spot.name)}"
                loading="lazy"
              />
            `
            : ""
        }

        <span class="card-tag-badge">
          ${escapeHtml(formatCategory(item.category))}
        </span>

        <button
          type="button"
          class="fav-toggle-btn ${isFav ? "favorited" : ""}"
          onclick="toggleFavorite('${escapeHtml(item.id)}', this)"
          aria-label="Save to favorites"
        >
          <i data-lucide="heart"></i>
        </button>
      </div>

      <div class="dest-card-body">
        <div class="dest-location-row">
          <i data-lucide="map-pin"></i>
          <span>${escapeHtml(item.location || "Location not specified")}</span>
        </div>

        <h3 class="dest-card-title">
          ${escapeHtml(spot.name)}
        </h3>

        <p class="dest-card-desc">
          ${escapeHtml(spot.desc)}
        </p>

        <p class="small">
          <strong>Entrance Fee:</strong> ${entranceFee}
        </p>

        ${hotelHtml}

        <div class="dest-card-actions">
          <button
            type="button"
            class="btn btn-secondary"
            onclick="openDetailModal('${escapeHtml(item.id)}')"
          >
            Details
          </button>

          <button type="button" class="btn btn-secondary"
              onclick="openSpotReservationModal('${escapeHtml(item.id)}')">
              Reserve Visit
          </button>

          <button
            type="button"
            class="btn btn-primary"
            onclick="bookDestination('${escapeHtml(item.id)}')"
          >
            ${hotel ? "Book Stay" : "View Details"}
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Compatibility functions for the existing modals.js.
 *
 * The current modals.js accepts a destination index.
 * We resolve the database record here.
 */
function bookDestination(destinationId) {
  const item = destinationsData.find(
    (destination) => destination.id === String(destinationId),
  );

  if (!item) {
    showToast("Destination not found.");
    return;
  }

  if (!item.hotel) {
    showToast("No associated hotel is available for this destination.");
    return;
  }

  const index = destinationsData.indexOf(item);

  if (typeof openBookingModal === "function") {
    openBookingModal(index, "hotel_only");
  }
}

// =====================================================
// 9. TRIPS / HOTEL RESERVATIONS
// =====================================================

async function loadMyReservations() {
  if (!appState.currentUser) return [];

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
    console.error("Failed to load hotel reservations:", error);
    showToast("Unable to load your reservations.");
    return [];
  }

  return data || [];
}

async function getTripsViewHtml() {
  const container = document.getElementById("viewContainer");

  if (!container) return;

  container.innerHTML = `
    <div class="form-panel">
      <p>Loading your reservations...</p>
    </div>
  `;

  const reservations = await loadMyReservations();

  if (
    appState.activeScreen !== "trips" ||
    !document.getElementById("viewContainer")
  ) {
    return;
  }

  appState.reservations = reservations;

  container.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">My Reservations</p>
        <h2>Hotel Bookings</h2>
        <p>Manage your hotel reservations and payment details.</p>
      </div>

      <button
        class="btn btn-primary"
        onclick="navigate('explore')"
      >
        Explore Destinations
      </button>
    </div>

    ${
      reservations.length === 0
        ? `
          <div class="form-panel" style="text-align:center;padding:48px;">
            <h3>No Reservations Yet</h3>
            <p class="subtle">
              Your hotel reservations will appear here once you book.
            </p>
          </div>
        `
        : reservations
            .map(
              (booking) => `
                <div class="dest-card" style="margin-bottom:20px;">
                  <div class="dest-card-body">
                    <span class="eyebrow">
                      ${escapeHtml(booking.booking_reference || "")}
                    </span>

                    <h3>
                      ${escapeHtml(booking.hotel_name || "Hotel Reservation")}
                    </h3>

                    <p>
                      Guest:
                      <strong>${escapeHtml(booking.guest_name || "")}</strong>
                    </p>

                    <p>
                      Check-in: ${escapeHtml(booking.check_in || "")}
                      · Check-out: ${escapeHtml(booking.check_out || "")}
                    </p>

                    <p>
                      Rooms: ${booking.hotel_records?.length || 0}
                    </p>

                    <p>
                      Total:
                      ${formatCurrency(booking.total_amount)}
                    </p>

                    <p>
                      Downpayment:
                      ${formatCurrency(booking.downpayment_amount)}
                    </p>

                    <span class="tag tag--teal">
                      ${escapeHtml(booking.payment_status || "pending")}
                    </span>
                  </div>
                </div>
              `,
            )
            .join("")
    }
  `;
}

// =====================================================
// 10. QR PASSES
// =====================================================

async function getQrPassesViewHtml() {
  const container = document.getElementById("viewContainer");

  if (!container) return;

  container.innerHTML = `
    <div class="form-panel">
      <p>Loading your reservation QR pass...</p>
    </div>
  `;

  const reservations = await loadMyReservations();

  if (appState.activeScreen !== "qr") return;

  if (!reservations.length) {
    container.innerHTML = `
      <div class="section-head">
        <div>
          <h2>My QR Passes</h2>
          <p>No hotel reservation passes available yet.</p>
        </div>
      </div>

      <div class="empty-state">
        <h3>No Hotel QR Pass Yet</h3>
        <p>Make a hotel reservation to generate your QR pass.</p>

        <button
          class="btn-primary"
          onclick="navigate('explore')"
        >
          Explore Destinations
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
            <p>${escapeHtml(latest.hotel_name || "")}</p>
          </div>

          <span class="status-pill">
            ${escapeHtml((latest.payment_status || "pending").toUpperCase())}
          </span>
        </div>

        <div class="pass-qr-area">
          <img
            src="${qrUrl}"
            alt="Hotel reservation QR code"
            width="220"
            height="220"
          />

          <strong>
            ${escapeHtml(latest.booking_reference || "")}
          </strong>

          <small>
            Present this QR code to the hotel staff.
          </small>
        </div>

        <div class="pass-details-list">
          <div>
            <span>Guest Name</span>
            <strong>${escapeHtml(latest.guest_name || "")}</strong>
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
          <small>
            Keep this QR code for hotel reservation verification.
          </small>

          <button class="btn-primary" onclick="window.print()">
            Print QR Pass
          </button>
        </div>
      </div>
    </div>
  `;
}

// =====================================================
// 11. FAVORITES
// =====================================================

function getFavoritesViewHtml() {
  const favoriteItems = destinationsData.filter((item) =>
    appState.favorites.has(item.id),
  );

  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">Saved Travel Ideas</p>
        <h2>Your Favorite Destinations</h2>
        <p>Your saved tourist attractions.</p>
      </div>
    </div>

    ${
      favoriteItems.length
        ? `
          <div class="cards-grid">
            ${favoriteItems.map((item) => renderDestinationCard(item)).join("")}
          </div>
        `
        : `
          <div class="form-panel" style="text-align:center;padding:48px;">
            <h3>No saved favorites yet</h3>

            <p class="subtle">
              Click the heart icon on a destination to save it here.
            </p>

            <button
              type="button"
              class="btn btn-primary"
              onclick="navigate('explore')"
            >
              Explore Destinations
            </button>
          </div>
        `
    }
  `;
}

function toggleFavorite(id, button) {
  if (appState.favorites.has(String(id))) {
    appState.favorites.delete(String(id));

    if (button) {
      button.classList.remove("favorited");
    }

    showToast("Removed from favorites.");
  } else {
    appState.favorites.add(String(id));

    if (button) {
      button.classList.add("favorited");
    }

    showToast("Saved to favorites.");
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

// =====================================================
// 12. TRIP PLANNER
// =====================================================

function getPlannerViewHtml() {
  return `
    <div class="section-head" style="margin-bottom:18px;">
      <div>
        <p class="eyebrow">Trip Planner</p>
        <h2>Plan Your Next Trip</h2>
        <p>
          Choose a destination and create a simple travel itinerary.
        </p>
      </div>
    </div>

    <div class="planner-chat-layout">
      <div class="chat-card">
        <div class="chat-header">
          <div class="chat-bot-identity">
            <div class="bot-avatar-circle">
              <i data-lucide="bot"></i>
            </div>

            <div class="bot-title-group">
              <h3>Travel Assistant</h3>
              <span>Destination Planner</span>
            </div>
          </div>

          <button
            type="button"
            class="chat-reset-btn"
            onclick="resetChatConversation()"
          >
            Clear Chat
          </button>
        </div>

        <div class="chat-messages" id="chatMessagesFeed">
          ${renderChatMessagesHtml()}
        </div>

        <div class="chat-quick-prompts">
          ${destinationsData
            .slice(0, 5)
            .map(
              (item) => `
                <button
                  type="button"
                  class="prompt-pill"
                  onclick="sendQuickPrompt('${escapeHtml(item.spot.name)}')"
                >
                  ${escapeHtml(item.spot.name)}
                </button>
              `,
            )
            .join("")}
        </div>

        <form
          class="chat-input-bar"
          onsubmit="handleChatSubmit(event)"
        >
          <input
            type="text"
            id="chatUserInput"
            placeholder="Where would you like to go?"
            autocomplete="off"
          />

          <button
            type="submit"
            class="chat-send-btn"
            title="Send request"
          >
            <i data-lucide="send"></i>
          </button>
        </form>
      </div>

      <div
        class="live-itinerary-card"
        id="liveItineraryContainer"
      >
        ${renderLiveItineraryHtml()}
      </div>
    </div>
  `;
}

function renderChatMessagesHtml() {
  return (
    chatHistory
      .map(
        (message) => `
          <div class="chat-row ${
            message.sender === "user" ? "user-row" : "bot-row"
          }">
            <div class="chat-bubble">
              ${escapeHtml(message.text)}
              <span class="chat-time">
                ${escapeHtml(message.time)}
              </span>
            </div>
          </div>
        `,
      )
      .join("") +
    `
      <div id="chatTypingPlaceholder" class="hidden">
        <div class="chat-row bot-row">
          <div class="typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `
  );
}

function updateChatFeedDom() {
  const feed = document.getElementById("chatMessagesFeed");

  if (!feed) return;

  feed.innerHTML = renderChatMessagesHtml();
  feed.scrollTop = feed.scrollHeight;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderLiveItineraryHtml() {
  if (!activeItinerary) {
    return `
      <div class="form-panel">
        <h3>Your Itinerary</h3>
        <p class="subtle">
          Select a destination or send a message to start planning.
        </p>
      </div>
    `;
  }

  const item = destinationsData.find(
    (destination) => destination.id === activeItinerary.destinationId,
  );

  if (!item) {
    return `
      <div class="form-panel">
        <p>Destination is no longer available.</p>
      </div>
    `;
  }

  return `
    <div class="itinerary-hero-header">
      ${
        item.spot.image
          ? `<img src="${escapeHtml(item.spot.image)}" alt="${escapeHtml(item.spot.name)}" />`
          : ""
      }

      <div class="itinerary-hero-overlay">
        <span class="tag tag--teal">
          ${escapeHtml(formatCategory(item.category))}
        </span>

        <h3>${escapeHtml(item.spot.name)}</h3>

        <span class="small">
          ${escapeHtml(item.location)}
        </span>
      </div>
    </div>

    <div class="itinerary-stats-row">
      <div class="itinerary-stat-item">
        <strong>${activeItinerary.days} Days</strong>
        <span>Duration</span>
      </div>

      <div class="itinerary-stat-item">
        <strong>${escapeHtml(item.location || "N/A")}</strong>
        <span>Location</span>
      </div>
    </div>

    <div class="itinerary-timeline-feed">
      ${activeItinerary.schedule
        .map(
          (day) => `
            <div class="timeline-day-block">
              <div class="timeline-day-title">
                ${escapeHtml(day.day)}
              </div>

              <div class="timeline-item-list">
                ${day.items
                  .map(
                    (activity) => `
                      <div class="timeline-item-row">
                        ${escapeHtml(activity)}
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

    <div class="itinerary-action-box">
      <button
        type="button"
        class="btn btn-secondary"
        onclick="navigate('explore')"
      >
        View Destination
      </button>
    </div>
  `;
}

function updateLiveItineraryDom() {
  const container = document.getElementById("liveItineraryContainer");

  if (!container) return;

  container.innerHTML = renderLiveItineraryHtml();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function handleChatSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("chatUserInput");

  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  submitChatMessage(message);
  input.value = "";
}

function sendQuickPrompt(prompt) {
  submitChatMessage(prompt);
}

function submitChatMessage(userText) {
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  chatHistory.push({
    sender: "user",
    text: userText,
    time: now,
  });

  updateChatFeedDom();

  const result = generateItineraryFromPrompt(userText);

  chatHistory.push({
    sender: "bot",
    text: result.reply,
    time: now,
  });

  if (result.itinerary) {
    activeItinerary = result.itinerary;
    updateLiveItineraryDom();
  }

  updateChatFeedDom();
}

function generateItineraryFromPrompt(prompt) {
  const query = prompt.toLowerCase();

  const destination =
    destinationsData.find((item) => {
      return [item.spot.name, item.location, item.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    }) ||
    destinationsData.find((item) =>
      item.spot.name.toLowerCase().includes(query),
    );

  const matchedDestination =
    destination ||
    destinationsData.find((item) =>
      query.includes(item.spot.name.toLowerCase()),
    );

  if (!matchedDestination) {
    return {
      reply:
        "I couldn't find that destination in the current database. Try using the exact name of an available tourist attraction.",
      itinerary: null,
    };
  }

  const dayMatch = query.match(/(\d+)\s*(?:day|days|araw)/);
  const days = dayMatch ? Math.min(7, Math.max(1, Number(dayMatch[1]))) : 1;

  const schedule = [];

  for (let day = 1; day <= days; day++) {
    schedule.push({
      day: `Day ${day}`,
      items: [
        `Visit ${matchedDestination.spot.name}`,
        `Explore the surrounding area of ${matchedDestination.location}`,
      ],
    });
  }

  return {
    reply: `I found ${matchedDestination.spot.name} in the database. Your ${days}-day itinerary has been prepared.`,
    itinerary: {
      destinationId: matchedDestination.id,
      days,
      schedule,
    },
  };
}

function resetChatConversation() {
  chatHistory = [];
  activeItinerary = null;

  updateChatFeedDom();
  updateLiveItineraryDom();
}

// =====================================================
// 13. PROFILE
// =====================================================

function getProfileViewHtml() {
  const profile = appState.profile || {};
  const user = appState.currentUser || {};

  const fullName = profile.full_name || user.user_metadata?.full_name || "";

  const email = profile.email || user.email || "";

  const initials = fullName
    ? fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U";

  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">Traveler Profile</p>
        <h2>Account Settings</h2>
        <p>Your account information.</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:24px;">
      <div class="form-panel">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
          <div
            style="
              width:72px;
              height:72px;
              border-radius:50%;
              background:var(--navy);
              color:#fff;
              display:grid;
              place-items:center;
              font-size:24px;
              font-weight:700;
            "
          >
            ${escapeHtml(initials)}
          </div>

          <div>
            <h3 style="margin:0;">
              ${escapeHtml(fullName || "Traveler")}
            </h3>

            <p class="small subtle" style="margin:2px 0 0;">
              ${escapeHtml(email)}
            </p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="explore-field">
            <label>Full Name</label>
            <input
              type="text"
              value="${escapeHtml(fullName)}"
              readonly
            />
          </div>

          <div class="explore-field">
            <label>Email Address</label>
            <input
              type="email"
              value="${escapeHtml(email)}"
              readonly
            />
          </div>
        </div>

        <p class="small subtle">
          Profile editing will be connected to the database separately.
        </p>
      </div>

      <div class="form-panel">
        <h3>Account Information</h3>

        <p class="small">
          <b>User ID:</b>
          ${escapeHtml(user.id || "")}
        </p>

        <p class="small">
          <b>Account:</b> Authenticated
        </p>

        <button
          type="button"
          class="btn btn-secondary"
          style="width:100%;"
          onclick="navigate('qr')"
        >
          View Active Passes
        </button>
      </div>
    </div>
  `;
}

// =====================================================
// 14. UTILITIES
// =====================================================

function formatCurrency(amount) {
  return `₱${Number(amount || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "Not specified";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function showToast(message) {
  const toast = document.getElementById("appToast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2800);
}

function printPasses() {
  window.print();
}
