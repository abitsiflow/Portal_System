/**
 * Favorites page — destinations bookmarked with the heart button.
 */

function renderFavorites() {
  const container = document.getElementById("favoritesContent");
  if (!container) return;

  const favItems = destinationsData.filter((x) => favoritesStore.has(x.id));

  container.innerHTML = favItems.length
    ? `<div class="cards-grid">
         ${favItems.map((item) => renderDestinationCard(item, destinationsData.indexOf(item))).join("")}
       </div>`
    : `<div class="empty-panel">
         <h3>No saved favorites yet</h3>
         <p>Click the heart icon on any destination card to bookmark it here.</p>
         <a href="explore.html" class="btn btn-primary">Explore Destinations</a>
       </div>`;

  refreshIcons();
}

// Called by shell.js after a heart is toggled.
function onFavoritesChanged() {
  renderFavorites();
}

document.addEventListener("DOMContentLoaded", renderFavorites);
