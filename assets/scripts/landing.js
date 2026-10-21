/**
 * Tourist Portal Subsystem · Landing Page Script
 * Powers guest discovery, real-time search, category filtering, and modal detail inspection.
 */

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("landingSearchInput");
  const filterPills = document.querySelectorAll(".filter-pill");
  const pairCards = document.querySelectorAll(".pair-card");
  const resultsCounter = document.getElementById("resultsCounter");
  const totalCount = pairCards.length;

  let activeCategory = "all";
  let searchQuery = "";

  // Filter pairs function
  function filterPairs() {
    let visibleCount = 0;

    pairCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category") || "";
      const cardText = (card.getAttribute("data-searchable") || "").toLowerCase();

      const matchesCategory =
        activeCategory === "all" || cardCategory.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !searchQuery || cardText.includes(searchQuery.toLowerCase());

      if (matchesCategory && matchesSearch) {
        card.style.display = "grid";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (resultsCounter) {
      resultsCounter.textContent = `Showing ${visibleCount} of ${totalCount} pairs`;
    }

    // Show empty state if nothing matches
    const emptyState = document.getElementById("noResultsState");
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove("hidden");
      } else {
        emptyState.classList.add("hidden");
      }
    }
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      filterPairs();
    });
  }

  // Category pills handler
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.getAttribute("data-filter") || "all";
      filterPairs();
    });
  });
});

/* ─── Interactive Detail Modal ─── */
function openPairModal(pairIndex) {
  if (typeof pairedData === "undefined" || !pairedData[pairIndex]) return;

  const data = pairedData[pairIndex];
  const modal = document.getElementById("landingDetailModal");
  if (!modal) return;

  const titleEl = document.getElementById("modalTitle");
  const spotNameEl = document.getElementById("modalSpotName");
  const hotelNameEl = document.getElementById("modalHotelName");
  const locationEl = document.getElementById("modalLocation");
  const distanceEl = document.getElementById("modalDistance");
  const spotDescEl = document.getElementById("modalSpotDesc");
  const hotelDescEl = document.getElementById("modalHotelDesc");
  const spotImgEl = document.getElementById("modalSpotImg");
  const hotelImgEl = document.getElementById("modalHotelImg");
  const hotelPriceEl = document.getElementById("modalHotelPrice");
  const spotHoursEl = document.getElementById("modalSpotHours");

  if (titleEl) titleEl.textContent = `${data.spot.name} + ${data.hotel.name}`;
  if (spotNameEl) spotNameEl.textContent = data.spot.name;
  if (hotelNameEl) hotelNameEl.textContent = data.hotel.name;
  if (locationEl) locationEl.textContent = data.location;
  if (distanceEl) distanceEl.textContent = data.distance;
  if (spotDescEl) spotDescEl.textContent = data.spot.description;
  if (hotelDescEl) hotelDescEl.textContent = data.hotel.description;
  if (spotImgEl) spotImgEl.src = data.spot.image;
  if (hotelImgEl) hotelImgEl.src = data.hotel.image;
  if (hotelPriceEl) hotelPriceEl.textContent = data.hotel.price;
  if (spotHoursEl) spotHoursEl.textContent = data.spot.hours;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePairModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains("landing-modal-close")) return;
  const modal = document.getElementById("landingDetailModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

/* ─── Quick Toast / Auth Prompt for Guests ─── */
function promptLoginForAction(actionName) {
  const modal = document.getElementById("authPromptModal");
  if (modal) {
    const textEl = document.getElementById("authPromptText");
    if (textEl && actionName) {
      textEl.textContent = `Sign in or register an account to ${actionName}.`;
    }
    modal.classList.remove("hidden");
  }
}

function closeAuthPromptModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains("modal-close")) return;
  const modal = document.getElementById("authPromptModal");
  if (modal) modal.classList.add("hidden");
}

