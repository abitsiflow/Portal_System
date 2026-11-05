/**
 * My Trips page — hotel reservations from Supabase.
 */

async function renderTrips() {
  const list = document.getElementById("tripsList");
  if (!list) return;

  const reservations = await loadMyReservations();

  if (reservations.length === 0) {
    list.innerHTML = `
      <div class="empty-panel">
        <h3>No Reservations Yet</h3>
        <p>Your hotel reservations will appear here.</p>
        <a href="explore.html" class="btn btn-primary">Explore Hotels</a>
      </div>`;
    return;
  }

  list.innerHTML = reservations
    .map(
      (b) => `
      <div class="trip-card">
        <span class="eyebrow">${b.booking_reference}</span>
        <h3>${b.hotel_name}</h3>
        <div class="trip-card-meta">
          <p>Guest: <strong>${b.guest_name}</strong></p>
          <p>Check-in: ${b.check_in}</p>
          <p>Check-out: ${b.check_out}</p>
          <p>Rooms: ${b.hotel_records?.length || 0}</p>
        </div>
        <div class="trip-card-meta">
          <p>Total: <strong>${formatPeso(b.total_amount)}</strong></p>
          <p>Downpayment: ${formatPeso(b.downpayment_amount)}</p>
        </div>
        <div class="trip-card-actions">
          <span class="tag tag--teal">${b.payment_status}</span>
          <a href="qr.html" class="btn btn-secondary">View QR Pass</a>
        </div>
      </div>`,
    )
    .join("");
}

// Called by modals.js after a new reservation is saved.
function onReservationCreated() {
  renderTrips();
}

document.addEventListener("DOMContentLoaded", renderTrips);
