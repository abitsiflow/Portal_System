/* =========================================================
   HOTELS PAGE SCRIPT
   Supabase data source:
   - public.hotels
   Booking Integration:
   - openBookingModal (Shared/modals.js) -> create_online_reservation RPC
========================================================= */

document.addEventListener("DOMContentLoaded", initializeHotels);

let hotelsList = [];

async function initializeHotels() {
  const grid = document.getElementById("hotelsCardsGrid");
  const searchInput = document.getElementById("hotelSearchInput");
  const starFilter = document.getElementById("starFilter");
  const clearBtn = document.getElementById("clearHotelFiltersBtn");
  const ratingPills = document.getElementById("hotelRatingPills");

  if (!grid) return;

  // Check URL query parameters (e.g. ?search=boracay or ?star=5)
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get("search") || urlParams.get("q") || "";
  const initialStar = urlParams.get("star") || "all";

  if (searchInput && initialSearch) {
    searchInput.value = initialSearch;
  }
  if (starFilter && initialStar !== "all") {
    starFilter.value = initialStar;
    updateActiveStarPill(initialStar);
  }

  showHotelsMessage("Loading verified hotels and resorts...", "loading");

  await fetchHotels();

  if (searchInput) {
    searchInput.addEventListener("input", renderHotelsList);
  }

  if (starFilter) {
    starFilter.addEventListener("change", () => {
      updateActiveStarPill(starFilter.value);
      renderHotelsList();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearHotelFilters);
  }

  if (ratingPills) {
    ratingPills.addEventListener("click", (e) => {
      const pill = e.target.closest(".type-pill");
      if (!pill) return;
      const rating = pill.dataset.rating || "all";
      if (starFilter) starFilter.value = rating;
      updateActiveStarPill(rating);
      renderHotelsList();
    });
  }

  renderHotelsList();
}

/* =========================================================
   FETCH HOTELS FROM SUPABASE
========================================================= */

async function fetchHotels() {
  if (window.sb) {
    try {
      const { data, error } = await window.sb
        .from("hotels")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        hotelsList = data;
        return;
      }
      if (error) {
        console.warn("Supabase hotels fetch error, falling back to local dataset:", error);
      }
    } catch (err) {
      console.warn("Exception during Supabase fetch:", err);
    }
  }

  // Graceful fallback to destinationsData hotels
  if (typeof destinationsData !== "undefined" && Array.isArray(destinationsData)) {
    hotelsList = destinationsData.map((d, index) => ({
      id: d.id ? `hotel-${d.id}` : `hotel-${index}`,
      name: d.hotel.name,
      description: d.hotel.desc,
      location: d.location,
      city: d.location.split(",")[0]?.trim() || d.location,
      province: d.location.split(",")[1]?.trim() || "",
      image_url: d.hotel.image,
      star_rating: d.hotel.tag.includes("5-Star") ? 5 : 4,
      price_min: d.hotel.rate,
      price_max: Math.round(d.hotel.rate * 1.5),
      nearest_spot: d.spot.name,
      amenities: d.hotel.amenities || ["Wi-Fi", "Air Conditioning", "Breakfast Available"],
      pairIndex: index,
    }));
  }
}

/* =========================================================
   RENDER HOTELS CARDS
========================================================= */

function renderHotelsList() {
  const grid = document.getElementById("hotelsCardsGrid");
  const searchInput = document.getElementById("hotelSearchInput");
  const starFilter = document.getElementById("starFilter");

  if (!grid) return;

  const searchTerm = (searchInput?.value || "").trim().toLowerCase();
  const selectedStar = starFilter?.value || "all";

  const filteredHotels = hotelsList.filter((hotel) => {
    // Star filter
    const matchesStar =
      selectedStar === "all" ||
      (hotel.star_rating !== null && String(hotel.star_rating) === String(selectedStar));

    // Search filter across name, location, nearest spot, amenities, description
    const amenitiesText = Array.isArray(hotel.amenities)
      ? hotel.amenities.join(" ")
      : typeof hotel.amenities === "string"
        ? hotel.amenities
        : "";

    const searchableText = [
      hotel.name,
      hotel.description,
      hotel.location,
      hotel.city,
      hotel.province,
      hotel.nearest_spot,
      amenitiesText,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

    return matchesStar && matchesSearch;
  });

  if (!filteredHotels.length) {
    grid.innerHTML = `
      <div class="hotel-empty-state">
        <h3>No matching hotels or resorts</h3>
        <p style="margin-top: 6px;">Try adjusting your search criteria or star rating filter.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredHotels
    .map((hotel, index) => renderHotelCard(hotel, index))
    .join("");

  attachHotelImageFallbacks();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* =========================================================
   HOTEL CARD TEMPLATE
========================================================= */

function renderHotelCard(hotel, listIndex) {
  const image = safeHotelImageUrl(hotel.image_url);
  const location = [hotel.city, hotel.province].filter(Boolean).join(", ") || hotel.location || "Philippines";

  const ratingMarkup = hotel.star_rating
    ? `<div class="hotel-rating-badge"><i data-lucide="star"></i> ${hotel.star_rating} Stars</div>`
    : `<div class="hotel-rating-badge rating-empty">Verified Stay</div>`;

  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : typeof hotel.amenities === "string"
      ? hotel.amenities.split(",").map((s) => s.trim())
      : [];

  const amenitiesMarkup = amenities.slice(0, 3).map((a) => `<span class="amenity-chip">${escapeHotelHtml(a)}</span>`).join("");

  const priceText = formatHotelPriceRange(hotel);
  const isFavorite = typeof favoritesStore !== "undefined" && favoritesStore.has(String(hotel.id));

  // Determine pair index or object reference for booking modal
  const bookingArg = hotel.pairIndex !== undefined ? hotel.pairIndex : `hotel-${hotel.id}`;

  return `
    <article class="hotel-card" id="hotel-card-${hotel.id}">
      <div class="hotel-card-media">
        ${
          image
            ? `<img src="${escapeHotelHtml(image)}" alt="${escapeHotelHtml(hotel.name)}" loading="lazy">`
            : `<div class="explore-image-fallback">No image available</div>`
        }
        ${ratingMarkup}
        <button type="button" class="fav-toggle-btn ${isFavorite ? "favorited" : ""}" onclick="toggleFavorite('${escapeHotelHtml(String(hotel.id))}', this)" aria-label="Save to favorites">
          <i data-lucide="heart"></i>
        </button>
      </div>

      <div class="hotel-card-body">
        <h3>${escapeHotelHtml(hotel.name)}</h3>

        <p class="hotel-card-location">
          <i data-lucide="map-pin"></i>
          ${escapeHotelHtml(location)}
          ${hotel.nearest_spot ? `&middot; Near ${escapeHotelHtml(hotel.nearest_spot)}` : ""}
        </p>

        <p class="hotel-card-desc">
          ${escapeHotelHtml(hotel.description || "Verified accommodation providing premier hospitality and comfortable lodging.")}
        </p>

        ${amenitiesMarkup ? `<div class="hotel-amenities-list">${amenitiesMarkup}</div>` : ""}

        <div class="hotel-pricing-row">
          <div>
            <span class="price-label">Estimated Rate</span>
            <span class="price-value">${escapeHotelHtml(priceText)}</span>
          </div>
          <span style="font-size: 11px; color: var(--muted);">Direct Booking Available</span>
        </div>

        <div class="hotel-card-actions">
          <button type="button" class="btn btn-secondary" onclick="viewHotelDetails('${hotel.id}')">
            View Details
          </button>
          <button type="button" class="btn btn-primary" onclick="triggerHotelBooking('${hotel.id}')">
            <i data-lucide="calendar"></i> Book Now
          </button>
        </div>
      </div>
    </article>
  `;
}

/* =========================================================
   BOOKING & DETAILS MODAL ACTIONS
========================================================= */

function triggerHotelBooking(hotelId) {
  const hotel = hotelsList.find((h) => String(h.id) === String(hotelId));
  if (!hotel) {
    showToast("Hotel not found.");
    return;
  }

  // If this hotel maps directly to a destinationData pairIndex, use it
  if (hotel.pairIndex !== undefined) {
    openBookingModal(hotel.pairIndex, "hotel_only");
    return;
  }

  // Otherwise, pass the raw hotel object to our enhanced openBookingModal
  openBookingModal(hotel, "hotel_only");
}

function viewHotelDetails(hotelId) {
  const hotel = hotelsList.find((h) => String(h.id) === String(hotelId));
  if (!hotel) return;

  const modal = document.getElementById("hotelDetailModal");
  if (!modal) return;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("hotelDetailTitle", hotel.name);
  set("hotelDetailName", hotel.name);

  const locEl = document.querySelector("#hotelDetailLocation span");
  if (locEl) {
    locEl.textContent = [hotel.city, hotel.province].filter(Boolean).join(", ") || hotel.location || "Philippines";
  }

  set("hotelDetailDesc", hotel.description || "Verified accommodation providing comfortable lodging and quality amenities.");
  set("hotelDetailPrice", formatHotelPriceRange(hotel));
  set("hotelDetailNearest", hotel.nearest_spot || "Accessible location");

  const ratingEl = document.getElementById("hotelDetailRating");
  if (ratingEl) {
    ratingEl.innerHTML = hotel.star_rating
      ? `<i data-lucide="star"></i> ${hotel.star_rating} Stars`
      : "Verified Stay";
  }

  const imgEl = document.getElementById("hotelDetailImage");
  if (imgEl) {
    imgEl.src = safeHotelImageUrl(hotel.image_url) || "";
    imgEl.style.display = hotel.image_url ? "block" : "none";
  }

  const amenitiesEl = document.getElementById("hotelDetailAmenities");
  if (amenitiesEl) {
    const amenities = Array.isArray(hotel.amenities)
      ? hotel.amenities
      : typeof hotel.amenities === "string"
        ? hotel.amenities.split(",").map((s) => s.trim())
        : ["Wi-Fi", "Air Conditioning", "24/7 Front Desk"];

    amenitiesEl.innerHTML = amenities
      .map((a) => `<span class="amenity-chip">${escapeHotelHtml(a)}</span>`)
      .join("");
  }

  const bookBtn = document.getElementById("hotelDetailBookBtn");
  if (bookBtn) {
    bookBtn.onclick = () => {
      closeHotelDetailModal();
      triggerHotelBooking(hotelId);
    };
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeHotelDetailModal() {
  const modal = document.getElementById("hotelDetailModal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* =========================================================
   FILTERS HELPERS
========================================================= */

function updateActiveStarPill(star) {
  document.querySelectorAll("#hotelRatingPills .type-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.rating === String(star));
  });
}

function clearHotelFilters() {
  const searchInput = document.getElementById("hotelSearchInput");
  const starFilter = document.getElementById("starFilter");

  if (searchInput) searchInput.value = "";
  if (starFilter) starFilter.value = "all";

  updateActiveStarPill("all");
  renderHotelsList();
}

/* =========================================================
   UI & FORMATTING HELPERS
========================================================= */

function formatHotelPriceRange(hotel) {
  const min = hotel.price_min;
  const max = hotel.price_max;

  if (min === null || min === undefined || isNaN(Number(min))) {
    return "Rate upon inquiry";
  }

  const minFormatted = `₱${Number(min).toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

  if (max !== null && max !== undefined && !isNaN(Number(max)) && Number(max) > Number(min)) {
    const maxFormatted = `₱${Number(max).toLocaleString("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
    return `${minFormatted} – ${maxFormatted} / night`;
  }

  return `${minFormatted} / night`;
}

function showHotelsMessage(message, type = "empty") {
  const grid = document.getElementById("hotelsCardsGrid");
  if (!grid) return;

  grid.innerHTML = `
    <div class="hotel-empty-state">
      <p>${escapeHotelHtml(message)}</p>
    </div>
  `;
}

function attachHotelImageFallbacks() {
  document.querySelectorAll("#hotelsCardsGrid img").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const fallback = document.createElement("div");
        fallback.className = "explore-image-fallback";
        fallback.textContent = "Image unavailable";
        image.replaceWith(fallback);
      },
      { once: true },
    );
  });
}

function safeHotelImageUrl(url) {
  if (typeof url !== "string" || !url.trim()) return "";
  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return "";
    }
    return parsedUrl.href;
  } catch {
    return "";
  }
}

function escapeHotelHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

