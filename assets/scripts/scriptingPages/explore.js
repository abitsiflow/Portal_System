/* =========================================================
   EXPLORE PAGE SCRIPT (TOURIST SPOTS ONLY)
   Supabase data source:
   - public.tourist_spots
========================================================= */

document.addEventListener("DOMContentLoaded", initializeExplore);

let exploreSpots = [];

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

  // Check URL query parameters (e.g. ?q=boracay)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";
  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  showExploreMessage("Loading tourist attractions...", "loading");

  await fetchExploreSpots();

  if (searchInput) {
    searchInput.addEventListener("input", renderExploreSpots);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      updateActivePill(categoryFilter.value);
      renderExploreSpots();
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
      renderExploreSpots();
    });
  }

  updatePillCounts();
  renderExploreSpots();
}

/* =========================================================
   FETCH DATA FROM SUPABASE
========================================================= */

async function fetchExploreSpots() {
  if (window.sb) {
    try {
      const { data, error } = await window.sb
        .from("tourist_spots")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        exploreSpots = data;
        return;
      }
      if (error) {
        console.warn("Supabase tourist_spots fetch error, falling back to local dataset:", error);
      }
    } catch (err) {
      console.warn("Exception during Supabase fetch:", err);
    }
  }

  // Graceful fallback to destinationsData spots if Supabase is offline or empty
  if (typeof destinationsData !== "undefined" && Array.isArray(destinationsData)) {
    exploreSpots = destinationsData.map((d, index) => ({
      id: d.id || `spot-${index}`,
      name: d.spot.name,
      description: d.spot.desc,
      category: d.category,
      location: d.location,
      city: d.location.split(",")[0]?.trim() || d.location,
      province: d.location.split(",")[1]?.trim() || "",
      image_url: d.spot.image,
      entrance_fee: d.spot.fee,
      opening_hours: d.spot.hours,
      tag: d.spot.tag,
      pairIndex: index,
    }));
  }
}

/* =========================================================
   RENDER TOURIST SPOT CARDS
========================================================= */

function renderExploreSpots() {
  const grid = document.getElementById("exploreCardsGrid");
  const searchInput = document.getElementById("exploreSearchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (!grid) return;

  const searchTerm = (searchInput?.value || "").trim().toLowerCase();
  const selectedCategory = categoryFilter?.value || "all";

  const filteredSpots = exploreSpots.filter((spot) => {
    const matchesCategory =
      selectedCategory === "all" ||
      spot.category?.toLowerCase() === selectedCategory.toLowerCase();

    const searchableText = [
      spot.name,
      spot.description,
      spot.location,
      spot.city,
      spot.province,
      spot.category,
      spot.tag,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  if (!filteredSpots.length) {
    grid.innerHTML = `
      <div class="explore-message">
        <h3>No matching tourist attractions</h3>
        <p style="margin-top: 6px; color: var(--muted);">Try adjusting your search criteria or category filter.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredSpots.map((spot) => renderSpotCard(spot)).join("");

  attachImageFallbacks();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* =========================================================
   TOURIST SPOT CARD TEMPLATE
========================================================= */

function renderSpotCard(spot) {
  const category =
    exploreCategoryLabels[spot.category] || spot.category || "Attraction";

  const image = safeImageUrl(spot.image_url);
  const location = [spot.city, spot.province].filter(Boolean).join(", ") || spot.location || "Philippines";

  const entranceFee =
    spot.entrance_fee === null || spot.entrance_fee === undefined
      ? "Free Admission"
      : Number(spot.entrance_fee) === 0
        ? "Free Admission"
        : formatExplorePeso(spot.entrance_fee);

  const isFavorite = typeof favoritesStore !== "undefined" && favoritesStore.has(String(spot.id));

  return `
    <article class="explore-record-card">
      <div class="explore-card-image">
        ${
          image
            ? `<img src="${escapeExploreHtml(image)}" alt="${escapeExploreHtml(spot.name)}" loading="lazy">`
            : `<div class="explore-image-fallback">No image available</div>`
        }
        <span class="explore-category">${escapeExploreHtml(category)}</span>
        <button type="button" class="fav-toggle-btn ${isFavorite ? "favorited" : ""}" onclick="toggleFavorite('${escapeExploreHtml(String(spot.id))}', this)" aria-label="Save to favorites">
          <i data-lucide="heart"></i>
        </button>
      </div>

      <div class="explore-card-content">
        <div class="explore-card-heading">
          <h3>${escapeExploreHtml(spot.name)}</h3>
          <p class="explore-location">
            <i data-lucide="map-pin"></i>
            ${escapeExploreHtml(location)}
          </p>
        </div>

        <p class="explore-description">
          ${escapeExploreHtml(spot.description || "Explore this iconic Philippine travel destination.")}
        </p>

        <div class="explore-spot-details">
          <div>
            <span>Entrance Fee</span>
            <strong>${escapeExploreHtml(entranceFee)}</strong>
          </div>
          <div>
            <span>Opening Hours</span>
            <strong>${escapeExploreHtml(spot.opening_hours || "Open Daily")}</strong>
          </div>
        </div>

        <div class="explore-card-actions">
          <a href="hotels.html?search=${encodeURIComponent(spot.city || spot.name)}" class="btn btn-secondary" style="flex:1; justify-content:center; text-decoration:none;">
            <i data-lucide="hotel"></i>
            Find Stays Nearby
          </a>
        </div>
      </div>
    </article>
  `;
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
      (spot) => spot.category?.toLowerCase() === category.toLowerCase(),
    ).length;

    const originalLabel =
      exploreCategoryLabels[category] || pill.textContent.replace(/\s\(\d+\)$/, "").trim();

    pill.textContent = `${originalLabel} (${count})`;
  });
}

function clearExploreFilters() {
  const searchInput = document.getElementById("exploreSearchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";

  updateActivePill("all");
  renderExploreSpots();
}

// Hook called by shell.js topbar search
function onTopbarSearch(value) {
  const searchInput = document.getElementById("exploreSearchInput");
  if (searchInput) {
    searchInput.value = value;
  }
  renderExploreSpots();
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
