/**
 * Explore page — search, category filter and destination grid.
 */

const exploreState = { filter: "all", search: "" };

function getFilteredDestinations() {
  const query = exploreState.search.toLowerCase();

  return destinationsData.filter((item) => {
    const matchesCategory = exploreState.filter === "all" || item.category === exploreState.filter;
    const matchesQuery =
      !query ||
      item.spot.name.toLowerCase().includes(query) ||
      item.hotel.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });
}

function renderExploreGrid() {
  const grid = document.getElementById("exploreCardsGrid");
  if (!grid) return;

  const items = getFilteredDestinations();

  grid.innerHTML = items.length
    ? items.map((item) => renderDestinationCard(item, destinationsData.indexOf(item))).join("")
    : `<div class="form-panel" style="grid-column:1/-1; text-align:center; padding:48px;">
         <h3>No matching destinations</h3>
         <p class="subtle">Try adjusting your search criteria.</p>
       </div>`;

  // Keep controls in sync with state.
  document.getElementById("categoryFilter").value = exploreState.filter;
  document.getElementById("exploreSearchInput").value = exploreState.search;
  document.querySelectorAll("#explorePills .type-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.filter === exploreState.filter);
  });

  refreshIcons();
}

// Called by shell.js when the topbar search is typed into on this page.
function onTopbarSearch(value) {
  exploreState.search = value.trim();
  renderExploreGrid();
}

document.addEventListener("DOMContentLoaded", () => {
  // Support ?q=boracay coming from the topbar search on other pages.
  const params = new URLSearchParams(window.location.search);
  exploreState.search = (params.get("q") || "").trim();

  document.getElementById("exploreSearchInput").addEventListener("input", (e) => {
    exploreState.search = e.target.value.trim();
    renderExploreGrid();
  });

  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    exploreState.filter = e.target.value;
    renderExploreGrid();
  });

  document.getElementById("explorePills").addEventListener("click", (e) => {
    const pill = e.target.closest(".type-pill");
    if (!pill) return;
    exploreState.filter = pill.dataset.filter;
    renderExploreGrid();
  });

  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    exploreState.filter = "all";
    exploreState.search = "";
    renderExploreGrid();
  });

  renderExploreGrid();
});
