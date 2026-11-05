/**
 * QR Tourist Pass page — latest hotel reservation pass.
 */

async function renderQrPass() {
  const container = document.getElementById("qrContent");
  if (!container) return;

  const reservations = await loadMyReservations();

  if (!reservations.length) {
    container.innerHTML = `
      <div class="empty-panel">
        <h3>No Hotel QR Pass Yet</h3>
        <p>Make a hotel reservation to generate your QR pass.</p>
        <a href="explore.html" class="btn btn-primary">Explore Hotels</a>
      </div>`;
    return;
  }

  const latest = reservations[0];
  const qrUrl = qrImageUrl(`HOTEL-RESERVATION|REF:${latest.booking_reference}|STATUS:${latest.payment_status}`);
  const roomCount = latest.hotel_records?.length || 0;

  const row = (label, value) => `
    <div class="pass-detail-row"><span>${label}</span><strong>${value}</strong></div>`;

  container.innerHTML = `
    <div class="qr-page-grid">
      <div class="pass-ticket-card">
        <div class="pass-ticket-header hotel-theme">
          <div>
            <strong>Hotel Reservation Pass</strong>
            <p style="margin:2px 0 0; font-size:12px;">${latest.hotel_name}</p>
          </div>
          <span class="pass-status-pill">${(latest.payment_status || "pending").toUpperCase()}</span>
        </div>

        <div class="pass-qr-area">
          <img class="pass-qr-img" src="${qrUrl}" alt="Hotel reservation QR code" width="220" height="220" />
          <span class="pass-code-label">${latest.booking_reference}</span>
          <small>Present this QR code to the hotel staff.</small>
        </div>

        <div class="pass-details-list">
          ${row("Guest Name", latest.guest_name)}
          ${row("Check-in", formatLongDate(latest.check_in))}
          ${row("Check-out", formatLongDate(latest.check_out))}
          ${row("Number of Rooms", roomCount)}
          ${row("Total Amount", formatPeso(latest.total_amount))}
          ${row("Downpayment", formatPeso(latest.downpayment_amount))}
        </div>

        <div class="pass-ticket-footer">
          <small>Keep this QR code for hotel reservation verification.</small>
          <button type="button" class="btn btn-primary" onclick="window.print()">Print QR Pass</button>
        </div>
      </div>
    </div>`;
}

// Called by modals.js after a new reservation is saved.
function onReservationCreated() {
  renderQrPass();
}

document.addEventListener("DOMContentLoaded", renderQrPass);
