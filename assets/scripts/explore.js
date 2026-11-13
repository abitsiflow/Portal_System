/* =========================================================
   EXPLORE PAGE
   Supabase data source:
   - public.tourist_spots
   - public.hotels
========================================================= */

document.addEventListener("DOMContentLoaded", initializeExplore);

let exploreSpots = [];
let exploreHotels = [];

const exploreCategoryLabels = {
  heritage: "Heritage & History",
  beaches: "Beaches & Islands",
  mountain: "Mountain Escapes",
  urban: "Urban & Culture",
  nature: "Nature & Wonders",
};

async function initializeExplore() {
  const grid = document.getElementById("exploreCardsGrid");
  const searchInput = document.getElementById("exploreSearchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const clearButton = document.getElementById("clearFiltersBtn");
  const pillsContainer = document.getElementById("explorePills");

  if (!grid) return;

  if (!window.sb) {
    showExploreMessage(
      "Supabase connection is not initialized. Please check supabase-client.js.",
      "error",
    );
    return;
  }

  showExploreMessage("Loading destinations and hotels...", "loading");

  await fetchExploreData();

  if (searchInput) {
    searchInput.addEventListener("input", renderExploreCards);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      updateActivePill(categoryFilter.value);
      renderExploreCards();
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", clearExploreFilters);
  }

  if (pillsContainer) {
    pillsContainer.addEventListener("click", (event) => {
      const pill = event.target.closest(".type-pill");
      if (!pill) return;

      const selectedCategory = pill.dataset.filter || "all";

      if (categoryFilter) {
        categoryFilter.value = selectedCategory;
      }

      updateActivePill(selectedCategory);
      renderExploreCards();
    });
  }

  updatePillCounts();
  renderExploreCards();
}

/* =========================================================
   FETCH DATA
========================================================= */

async function fetchExploreData() {
  const [spotsResult, hotelsResult] = await Promise.all([
    window.sb
      .from("tourist_spots")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true }),

    window.sb
      .from("hotels")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true }),
  ]);

  if (spotsResult.error || hotelsResult.error) {
    console.error("Explore data loading error:", {
      spotsError: spotsResult.error,
      hotelsError: hotelsResult.error,
    });

    showExploreMessage(
      "Unable to load destinations and hotels. Please check your Supabase table permissions and connection.",
      "error",
    );

    return;
  }

  exploreSpots = spotsResult.data || [];
  exploreHotels = hotelsResult.data || [];

  console.log("Explore tourist spots:", exploreSpots);
  console.log("Explore hotels:", exploreHotels);
}

/* =========================================================
   RENDER CARDS
========================================================= */

function renderExploreCards() {
  const grid = document.getElementById("exploreCardsGrid");
  const searchInput = document.getElementById("exploreSearchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (!grid) return;

  const searchTerm = (searchInput?.value || "").trim().toLowerCase();
  const selectedCategory = categoryFilter?.value || "all";

  const filteredSpots = exploreSpots.filter((spot) => {
    const relatedHotels = getHotelsForSpot(spot);

    const matchesCategory =
      selectedCategory === "all" || spot.category === selectedCategory;

    const searchableText = [
      spot.name,
      spot.description,
      spot.location,
      spot.city,
      spot.province,
      spot.category,
      ...relatedHotels.map((hotel) =>
        [
          hotel.name,
          hotel.description,
          hotel.location,
          hotel.city,
          hotel.province,
        ].join(" "),
      ),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const linkedHotelIds = new Set();

  exploreSpots.forEach((spot) => {
    getHotelsForSpot(spot).forEach((hotel) => {
      linkedHotelIds.add(String(hotel.id));
    });
  });

  // Hotels without a linked tourist spot are displayed separately.
  const standaloneHotels = exploreHotels.filter((hotel) => {
    return (
      !linkedHotelIds.has(String(hotel.id)) &&
      selectedCategory === "all" &&
      matchesHotelSearch(hotel, searchTerm)
    );
  });

  if (!exploreSpots.length && !exploreHotels.length) {
    showExploreMessage(
      "No destinations or hotels found. Please add records to your Supabase tables first.",
      "empty",
    );
    return;
  }

  const cards = [
    ...filteredSpots.map((spot) => renderSpotCard(spot)),
    ...standaloneHotels.map((hotel) => renderStandaloneHotelCard(hotel)),
  ];

  if (!cards.length) {
    showExploreMessage(
      "No matching destinations or hotels found. Try another search or category.",
      "empty",
    );
    return;
  }

  grid.innerHTML = cards.join("");

  attachImageFallbacks();
}

/* =========================================================
   TOURIST SPOT CARD
========================================================= */

function renderSpotCard(spot) {
  const relatedHotels = getHotelsForSpot(spot);

  const category =
    exploreCategoryLabels[spot.category] || spot.category || "Destination";

  const image = safeImageUrl(spot.image_url);
  const location = [spot.city, spot.province].filter(Boolean).join(", ");

  const entranceFee =
    spot.entrance_fee === null || spot.entrance_fee === undefined
      ? "Not specified"
      : Number(spot.entrance_fee) === 0
        ? "Free entrance"
        : formatExplorePeso(spot.entrance_fee);

  const hotelMarkup = relatedHotels.length
    ? relatedHotels.map(renderHotelItem).join("")
    : `<p class="explore-no-hotel">No linked hotel available yet.</p>`;

  return `
    <article class="explore-record-card">
      <div class="explore-card-image">
        ${
          image
            ? `<img src="${escapeExploreHtml(image)}" alt="${escapeExploreHtml(spot.name)}" loading="lazy">`
            : `<div class="explore-image-fallback">No image available</div>`
        }
        <span class="explore-category">${escapeExploreHtml(category)}</span>
      </div>

      <div class="explore-card-content">
        <div class="explore-card-heading">
          <h3>${escapeExploreHtml(spot.name)}</h3>
          <p class="explore-location">
            <i data-lucide="map-pin"></i>
            ${escapeExploreHtml(location || spot.location || "Location not specified")}
          </p>
        </div>

        <p class="explore-description">
          ${escapeExploreHtml(spot.description || "No description available.")}
        </p>

        <div class="explore-spot-details">
          <div>
            <span>Entrance Fee</span>
            <strong>${escapeExploreHtml(entranceFee)}</strong>
          </div>
          <div>
            <span>Opening Hours</span>
            <strong>${escapeExploreHtml(spot.opening_hours || "Not specified")}</strong>
          </div>
        </div>

        <div class="explore-card-actions" style="margin: 14px 0;">
          <button
            type="button"
            class="btn btn-primary"
            style="width: 100%"
            onclick="openSpotReservationModal(${Number(spot.id)})"
          >
            Reserve Visit
          </button>
        </div>

        <div class="explore-hotels-section">
          <h4>
            <i data-lucide="hotel"></i>
            Nearby Hotels (${relatedHotels.length})
          </h4>
          ${hotelMarkup}
        </div>
      </div>
    </article>
  `;
}

/* =========================================================
   HOTEL ITEM INSIDE TOURIST SPOT CARD
========================================================= */

function renderHotelItem(hotel) {
  const image = safeImageUrl(hotel.image_url);

  return `
    <div class="explore-hotel-item">
      ${
        image
          ? `<img src="${escapeExploreHtml(image)}" alt="${escapeExploreHtml(hotel.name)}" loading="lazy">`
          : `<div class="explore-hotel-image-fallback">No image</div>`
      }

      <div class="explore-hotel-info">
        <h5>${escapeExploreHtml(hotel.name)}</h5>
        <p>${escapeExploreHtml(hotel.location || hotel.city || hotel.province || "Location not specified")}</p>
        <strong>${escapeExploreHtml(formatHotelPrice(hotel))}</strong>
      </div>
    </div>
  `;
}

/* =========================================================
   STANDALONE HOTEL CARD
========================================================= */

function renderStandaloneHotelCard(hotel) {
  const image = safeImageUrl(hotel.image_url);
  const location = [hotel.city, hotel.province].filter(Boolean).join(", ");

  return `
    <article class="explore-record-card explore-hotel-only">
      <div class="explore-card-image">
        ${
          image
            ? `<img src="${escapeExploreHtml(image)}" alt="${escapeExploreHtml(hotel.name)}" loading="lazy">`
            : `<div class="explore-image-fallback">No image available</div>`
        }
        <span class="explore-category">Hotel</span>
      </div>

      <div class="explore-card-content">
        <h3>${escapeExploreHtml(hotel.name)}</h3>

        <p class="explore-location">
          <i data-lucide="map-pin"></i>
          ${escapeExploreHtml(location || hotel.location || "Location not specified")}
        </p>

        <p class="explore-description">
          ${escapeExploreHtml(hotel.description || "No description available.")}
        </p>

        <div class="explore-spot-details">
          <div>
            <span>Price Range</span>
            <strong>${escapeExploreHtml(formatHotelPrice(hotel))}</strong>
          </div>
          <div>
            <span>Star Rating</span>
            <strong>${escapeExploreHtml(hotel.star_rating ? `${hotel.star_rating} Stars` : "Not specified")}</strong>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* =========================================================
   RELATIONSHIP HELPERS
========================================================= */

function getHotelsForSpot(spot) {
  return exploreHotels.filter((hotel) => {
    if (hotel.nearest_spot_id !== null && hotel.nearest_spot_id !== undefined) {
      return String(hotel.nearest_spot_id) === String(spot.id);
    }

    // Compatibility fallback for older records using nearest_spot text.
    return (
      hotel.nearest_spot &&
      spot.name &&
      hotel.nearest_spot.trim().toLowerCase() === spot.name.trim().toLowerCase()
    );
  });
}

function matchesHotelSearch(hotel, searchTerm) {
  if (!searchTerm) return true;

  const searchableText = [
    hotel.name,
    hotel.description,
    hotel.location,
    hotel.city,
    hotel.province,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(searchTerm);
}

/* =========================================================
   FILTERS AND CATEGORY COUNTS
========================================================= */

function updateActivePill(category) {
  document.querySelectorAll(".type-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.filter === category);
  });
}

function updatePillCounts() {
  const allPill = document.querySelector('.type-pill[data-filter="all"]');

  if (allPill) {
    allPill.textContent = `All (${exploreSpots.length})`;
  }

  document.querySelectorAll(".type-pill[data-filter]").forEach((pill) => {
    const category = pill.dataset.filter;

    if (category === "all") return;

    const count = exploreSpots.filter(
      (spot) => spot.category === category,
    ).length;

    const originalLabel =
      pill.dataset.label || pill.textContent.replace(/\s\(\d+\)$/, "").trim();

    pill.dataset.label = originalLabel;
    pill.textContent = `${originalLabel} (${count})`;
  });
}

function clearExploreFilters() {
  const searchInput = document.getElementById("exploreSearchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";

  updateActivePill("all");
  renderExploreCards();
}

/* =========================================================
   UI HELPERS
========================================================= */

function showExploreMessage(message, type = "empty") {
  const grid = document.getElementById("exploreCardsGrid");
  if (!grid) return;

  grid.innerHTML = `
    <div class="explore-message explore-message-${type}">
      <p>${escapeExploreHtml(message)}</p>
    </div>
  `;
}

function attachImageFallbacks() {
  document.querySelectorAll("#exploreCardsGrid img").forEach((image) => {
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

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function safeImageUrl(url) {
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

function formatExplorePeso(amount) {
  return `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatHotelPrice(hotel) {
  const min = hotel.price_min;
  const max = hotel.price_max;

  if (min === null || min === undefined || max === null || max === undefined) {
    return "Price not specified";
  }

  if (Number(min) === Number(max)) {
    return `${formatExplorePeso(min)} / night`;
  }

  return `${formatExplorePeso(min)} – ${formatExplorePeso(max)} / night`;
}

function escapeExploreHtml(value) {
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
