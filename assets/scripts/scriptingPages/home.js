/**
 * Home page — upcoming trip banner + featured destinations.
 */

function renderUpcomingTrip() {
  const panel = document.getElementById("upcomingTrip");
  if (!panel) return;

  const bookings = getBookings();
  const latest = bookings[0];
  const item = destinationsData[latest ? latest.pairIndex : 1];

  panel.innerHTML = `
    <div class="active-trip-left">
      <div class="active-trip-icon"><i data-lucide="calendar-check"></i></div>
      <div class="active-trip-info">
        <strong>Upcoming: ${item.spot.name} + ${item.hotel.name}</strong>
        <p>${latest ? latest.checkInDate : "14 Nov 2026"} &middot; ${item.location} &middot; Dual QR Passes Issued</p>
      </div>
    </div>
    <div style="display:flex; gap:10px;">
      <button type="button" class="btn btn-primary" id="viewPassesBtn">View QR Passes</button>
      <a href="trips.html" class="btn btn-secondary">Manage Trip</a>
    </div>`;

  document.getElementById("viewPassesBtn").addEventListener("click", () => showGeneratedDualPass(latest));

  const count = document.getElementById("homeBookingCount");
  if (count) count.textContent = `${bookings.length} confirmed trip reservations with digital passes.`;
}

function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  grid.innerHTML = destinationsData
    .slice(0, 6)
    .map((item, idx) => renderDestinationCard(item, idx))
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderUpcomingTrip();
  renderFeatured();
  refreshIcons();
});
