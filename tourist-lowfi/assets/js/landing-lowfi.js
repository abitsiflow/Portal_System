/* =====================================================
   Tourist Portal — Low-Fidelity Landing Page
   Independent script; does not use dashboard lowfi.js.
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const pairs = [
    {
      spot: "Fort Santiago & Intramuros",
      hotel: "The Manila Hotel",
      location: "City of Manila",
      distance: "1.1 km (4 mins drive / 12 mins walk)",
      category: "heritage",
      categoryLabel: "Heritage & History",
      spotDescription: "Explore the historic walled city and Fort Santiago.",
      hotelDescription: "Accommodation option in the Manila area.",
      price: "View hotel details",
    },
    {
      spot: "White Beach (Station 1) & Willy's Rock",
      hotel: "Discovery Shores Boracay",
      location: "Boracay Island, Aklan",
      distance: "Direct beachfront",
      category: "beaches",
      categoryLabel: "Beaches & Islands",
      spotDescription:
        "Visit the famous white-sand beach and nearby rock formation.",
      hotelDescription: "Accommodation option on Boracay Island.",
      price: "View hotel details",
    },
    {
      spot: "Basilica del Santo Niño & Magellan's Cross",
      hotel: "Radisson Blu Hotel Cebu",
      location: "Cebu City, Central Visayas",
      distance: "2.4 km (7 mins drive)",
      category: "heritage",
      categoryLabel: "Heritage & History",
      spotDescription: "Discover historic religious landmarks in Cebu City.",
      hotelDescription: "Accommodation option in Cebu City.",
      price: "View hotel details",
    },
    {
      spot: "Mines View Park & The Mansion",
      hotel: "Grand Sierra Pines Baguio",
      location: "Baguio City",
      distance: "1.2 km (4 mins drive)",
      category: "mountains",
      categoryLabel: "Mountain & Escapes",
      spotDescription:
        "Enjoy scenic views and explore well-known Baguio landmarks.",
      hotelDescription: "Accommodation option in Baguio City.",
      price: "View hotel details",
    },
    {
      spot: "Big Lagoon & Bacuit Bay",
      hotel: "El Nido Resorts Miniloc Island",
      location: "El Nido, Palawan",
      distance: "1.5 km (8 mins boat ride)",
      category: "nature",
      categoryLabel: "Nature & Escapes",
      spotDescription: "Explore the lagoons and coastal scenery of El Nido.",
      hotelDescription: "Accommodation option in the El Nido area.",
      price: "View hotel details",
    },
    {
      spot: "Taal Volcano Ridge & Sky Ranch",
      hotel: "Taal Vista Hotel Tagaytay",
      location: "Tagaytay City",
      distance: "0.3 km (3 mins walk)",
      category: "nature",
      categoryLabel: "Nature & Volcanoes",
      spotDescription: "Visit popular Tagaytay attractions and viewpoints.",
      hotelDescription: "Accommodation option in Tagaytay.",
      price: "View hotel details",
    },
    {
      spot: "Alona Beach & Coral Sanctuary",
      hotel: "Henann Resort Alona Beach",
      location: "Panglao Island, Bohol",
      distance: "Direct beachfront",
      category: "beaches",
      categoryLabel: "Beaches & Islands",
      spotDescription:
        "Discover beach scenery and marine attractions in Panglao.",
      hotelDescription: "Accommodation option near Alona Beach.",
      price: "View hotel details",
    },
    {
      spot: "Calle Crisologo & Heritage Village",
      hotel: "Hotel Luna Vigan",
      location: "Vigan City, Ilocos Sur",
      distance: "0.15 km (2 mins walk)",
      category: "heritage",
      categoryLabel: "Heritage & History",
      spotDescription: "Walk through the historic streets of Vigan.",
      hotelDescription: "Accommodation option in Vigan's heritage area.",
      price: "View hotel details",
    },
    {
      spot: "Cloud 9 Surfing Area",
      hotel: "Siargao Bleu Resort & Spa",
      location: "General Luna, Siargao",
      distance: "1.0 km (5 mins drive)",
      category: "beaches",
      categoryLabel: "Beaches & Islands",
      spotDescription: "Explore Siargao's popular surfing destination.",
      hotelDescription: "Accommodation option in Siargao.",
      price: "View hotel details",
    },
    {
      spot: "Mayon Volcano & Cagsawa Ruins",
      hotel: "The Marison Hotel",
      location: "Legazpi City, Albay",
      distance: "4.0 km (10 mins drive)",
      category: "nature",
      categoryLabel: "Nature & Volcanoes",
      spotDescription: "See the iconic volcano landscape and historic ruins.",
      hotelDescription: "Accommodation option in Legazpi City.",
      price: "View hotel details",
    },
  ];

  const grid = document.getElementById("pairsGrid");
  const searchInput = document.getElementById("landingSearchInput");
  const filterPills = document.querySelectorAll(".filter-pill");
  const resultsCounter = document.getElementById("resultsCounter");
  const emptyState = document.getElementById("noResultsState");
  const clearFiltersButton = document.getElementById("clearFiltersButton");
  const findStaysButton = document.getElementById("findStaysButton");

  const detailsModal = document.getElementById("landingDetailModal");
  const authModal = document.getElementById("authPromptModal");
  const modalPlanButton = document.getElementById("modalPlanButton");

  if (!grid) {
    return;
  }

  let activeCategory = "all";
  let searchQuery = "";
  let selectedPair = null;

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
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

  function createPairCard(pair, index) {
    const searchableText = [
      pair.spot,
      pair.hotel,
      pair.location,
      pair.categoryLabel,
    ].join(" ");

    return `
            <article
                class="pair-card"
                data-index="${index}"
                data-category="${escapeHTML(pair.category)}"
                data-searchable="${escapeHTML(searchableText)}"
            >
                <div class="proximity-banner">
                    <div class="proximity-left">
                        <span class="proximity-icon" aria-hidden="true">X</span>
                        <span>Tourist Spot + Nearby Hotel</span>
                    </div>
                    <span class="proximity-tag">Pair ${index + 1}</span>
                </div>

                <section class="pair-column spot-side">
                    <div class="item-image-wrap">
                        <span class="item-type-badge">X Tourist Spot</span>
                    </div>

                    <div class="item-category-tag">
                        ${escapeHTML(pair.categoryLabel)}
                    </div>

                    <h3 class="item-title">
                        ${escapeHTML(pair.spot)}
                    </h3>

                    <div class="item-location">
                        <span aria-hidden="true">X</span>
                        <span>${escapeHTML(pair.location)}</span>
                    </div>

                    <p class="item-desc">
                        ${escapeHTML(pair.spotDescription)}
                    </p>

                    <div class="item-specs">
                        <span class="spec-pill">X Destination</span>
                        <span class="spec-pill">X Explore</span>
                    </div>
                </section>

                <section class="pair-column hotel-side">
                    <div class="item-image-wrap">
                        <span class="item-type-badge hotel-badge">X Hotel</span>
                    </div>

                    <div class="item-category-tag">Accommodation</div>

                    <h3 class="item-title">
                        ${escapeHTML(pair.hotel)}
                    </h3>

                    <div class="item-location">
                        <span aria-hidden="true">X</span>
                        <span>${escapeHTML(pair.location)}</span>
                    </div>

                    <p class="item-desc">
                        ${escapeHTML(pair.hotelDescription)}
                    </p>

                    <div class="item-specs">
                        <span class="spec-pill">X Hotel details</span>
                        <span class="spec-pill">X Location</span>
                    </div>
                </section>

                <div class="pair-footer-bar">
                    <div class="pair-footer-left">
                        <strong>Proximity:</strong>
                        <span>${escapeHTML(pair.distance)}</span>
                    </div>

                    <div class="pair-action-btns">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-action="details"
                            data-index="${index}"
                        >
                            View details
                        </button>

                        <button
                            type="button"
                            class="btn btn-primary"
                            data-action="plan"
                            data-index="${index}"
                        >
                            Plan trip
                        </button>
                    </div>
                </div>
            </article>
        `;
  }

  function renderPairs() {
    grid.innerHTML = pairs.map(createPairCard).join("");
    filterPairs();
  }

  function filterPairs() {
    const normalizedQuery = searchQuery.toLowerCase();
    let visibleCount = 0;

    grid.querySelectorAll(".pair-card").forEach((card) => {
      const category = card.dataset.category || "";
      const searchableText = card.dataset.searchable || "";

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch = searchableText
        .toLowerCase()
        .includes(normalizedQuery);

      const visible = matchesCategory && matchesSearch;

      card.classList.toggle("hidden", !visible);

      if (visible) {
        visibleCount++;
      }
    });

    if (resultsCounter) {
      resultsCounter.textContent = `Showing ${visibleCount} of ${pairs.length} pairs`;
    }

    if (emptyState) {
      emptyState.classList.toggle("hidden", visibleCount !== 0);
    }
  }

  function setCategory(category, clickedPill) {
    activeCategory = category;

    filterPills.forEach((pill) => {
      const active = pill === clickedPill;
      pill.classList.toggle("active", active);
      pill.setAttribute("aria-pressed", String(active));
    });

    filterPairs();
  }

  function openDetails(index) {
    const pair = pairs[index];

    if (!pair || !detailsModal) {
      return;
    }

    selectedPair = pair;

    document.getElementById("modalTitle").textContent =
      `${pair.spot} + ${pair.hotel}`;

    document.getElementById("modalSpotName").textContent = pair.spot;

    document.getElementById("modalHotelName").textContent = pair.hotel;

    document.getElementById("modalLocation").textContent = pair.location;

    document.getElementById("modalDistance").textContent = pair.distance;

    document.getElementById("modalSpotDesc").textContent = pair.spotDescription;

    document.getElementById("modalHotelDesc").textContent =
      pair.hotelDescription;

    detailsModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeDetails() {
    detailsModal?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function openAuthPrompt(action) {
    const message = document.getElementById("authPromptText");

    if (message) {
      message.textContent = `Sign in or create an account to ${action}.`;
    }

    authModal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeAuthPrompt() {
    authModal?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function clearFilters() {
    searchQuery = "";

    if (searchInput) {
      searchInput.value = "";
    }

    const allPill = document.querySelector('.filter-pill[data-filter="all"]');

    setCategory("all", allPill);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value.trim();
      filterPairs();
    });
  }

  filterPills.forEach((pill) => {
    pill.setAttribute(
      "aria-pressed",
      String(pill.classList.contains("active")),
    );

    pill.addEventListener("click", () => {
      setCategory(pill.dataset.filter || "all", pill);
    });
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const index = Number(button.dataset.index);

    if (button.dataset.action === "details") {
      openDetails(index);
    }

    if (button.dataset.action === "plan") {
      openAuthPrompt("plan a trip");
    }
  });

  findStaysButton?.addEventListener("click", () => {
    document.getElementById("featuredPairs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    filterPairs();
  });

  clearFiltersButton?.addEventListener("click", clearFilters);

  document.querySelectorAll("[data-close-details]").forEach((button) => {
    button.addEventListener("click", closeDetails);
  });

  document.querySelectorAll("[data-close-auth]").forEach((button) => {
    button.addEventListener("click", closeAuthPrompt);
  });

  detailsModal?.addEventListener("click", (event) => {
    if (event.target === detailsModal) {
      closeDetails();
    }
  });

  authModal?.addEventListener("click", (event) => {
    if (event.target === authModal) {
      closeAuthPrompt();
    }
  });

  modalPlanButton?.addEventListener("click", () => {
    if (selectedPair) {
      closeDetails();
      openAuthPrompt("plan a trip");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDetails();
      closeAuthPrompt();
    }
  });

  renderPairs();
});
