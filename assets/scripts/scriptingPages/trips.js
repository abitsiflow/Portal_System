/**
 * My Trips page — hotel reservations + post-stay feedback.
 */

const FEEDBACK_ELIGIBLE_STATUSES = ["partial", "paid"];

const escapeHtml = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

const formatStay = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
      })
    : "—";

async function loadMyFeedback() {
  if (!window.sb) return {};
  const { data, error } = await window.sb
    .from("hotel_feedback")
    .select("booking_reference, rating, comment");
  if (error) {
    console.error("Failed to load feedback:", error);
    return {};
  }
  return Object.fromEntries((data || []).map((f) => [f.booking_reference, f]));
}

function feedbackControl(b, feedback) {
  if (feedback) {
    return `<span class="tag">Feedback sent · ${"★".repeat(feedback.rating)}</span>`;
  }
  const eligible =
    FEEDBACK_ELIGIBLE_STATUSES.includes(b.payment_status) &&
    new Date(b.check_out) < new Date();

  if (!eligible) {
    return `<button type="button" class="btn btn-secondary" disabled
              title="Available after check-out">Feedback after check-out</button>`;
  }
  return `<button type="button" class="btn btn-secondary"
            data-feedback-ref="${escapeHtml(b.booking_reference)}"
            data-feedback-hotel="${escapeHtml(b.hotel_name)}">Leave Feedback</button>`;
}

async function renderTrips() {
  const list = document.getElementById("tripsList");
  if (!list) return;

  const [reservations, feedbackMap] = await Promise.all([
    loadMyReservations(),
    loadMyFeedback(),
  ]);

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
        <span class="eyebrow">${escapeHtml(b.booking_reference)}</span>
        <h3>${escapeHtml(b.hotel_name)}</h3>
        <div class="trip-card-meta">
          <p>Guest: <strong>${escapeHtml(b.guest_name)}</strong></p>
          <p>Check-in: ${formatStay(b.check_in)}</p>
          <p>Check-out: ${formatStay(b.check_out)}</p>
          <p>Rooms: ${b.hotel_records?.length || 0}</p>
        </div>
        <div class="trip-card-meta">
          <p>Total: <strong>${formatPeso(b.total_amount)}</strong></p>
          <p>Downpayment: ${formatPeso(b.downpayment_amount)}</p>
        </div>
        <div class="trip-card-actions">
          <span class="tag tag--teal">${escapeHtml(b.payment_status)}</span>
          <a href="qr.html" class="btn btn-secondary">View QR Pass</a>
          ${feedbackControl(b, feedbackMap[b.booking_reference])}
        </div>
      </div>`,
    )
    .join("");
}

/* ─── Feedback modal ─── */
function openFeedbackModal(bookingReference, hotelName) {
  document.getElementById("feedbackModal")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="feedbackModal" class="feedback-overlay">
      <form class="feedback-dialog" id="feedbackForm" novalidate>
        <h3>How was your stay?</h3>
        <p class="feedback-sub">${escapeHtml(hotelName)} · ${escapeHtml(bookingReference)}</p>

        <div class="feedback-stars" role="radiogroup" aria-label="Rating">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) =>
                `<button type="button" class="feedback-star" data-value="${n}"
                   role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`,
            )
            .join("")}
        </div>

        <label for="feedbackComment" class="feedback-label">Comments (optional)</label>
        <textarea id="feedbackComment" maxlength="1000" rows="4"
          placeholder="Tell the hotel about your stay..."></textarea>

        <div class="feedback-actions">
          <button type="button" class="btn btn-secondary" id="feedbackCancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="feedbackSubmit">Submit Feedback</button>
        </div>
      </form>
    </div>`,
  );
  document.body.style.overflow = "hidden";

  const overlay = document.getElementById("feedbackModal");
  const form = document.getElementById("feedbackForm");
  const stars = [...overlay.querySelectorAll(".feedback-star")];
  let rating = 0;

  const paintStars = () =>
    stars.forEach((s) => {
      const on = Number(s.dataset.value) <= rating;
      s.classList.toggle("active", on);
      s.setAttribute("aria-checked", String(Number(s.dataset.value) === rating));
    });

  const close = () => {
    overlay.remove();
    document.body.style.overflow = "";
  };

  stars.forEach((s) =>
    s.addEventListener("click", () => {
      rating = Number(s.dataset.value);
      paintStars();
    }),
  );
  document.getElementById("feedbackCancel").onclick = close;
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (rating < 1) {
      showToast("Please select a star rating.");
      return;
    }

    const submitBtn = document.getElementById("feedbackSubmit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const comment = document.getElementById("feedbackComment").value.trim();
    const { error } = await window.sb.from("hotel_feedback").insert({
      booking_reference: bookingReference,
      rating,
      comment: comment || null,
    });

    if (error) {
      console.error("Feedback error:", error);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Feedback";
      showToast(
        error.code === "23505"
          ? "You've already sent feedback for this stay."
          : error.code === "42501"
            ? "Feedback isn't available for this booking yet."
            : "Could not send your feedback. Please try again.",
      );
      return;
    }

    close();
    showToast("Thank you! Your feedback has been sent to the hotel.");
    renderTrips();
  });
}

// One delegated listener survives re-renders of #tripsList.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-feedback-ref]");
  if (btn) openFeedbackModal(btn.dataset.feedbackRef, btn.dataset.feedbackHotel);
});

// Called by modals.js after a new reservation is saved.
function onReservationCreated() {
  renderTrips();
}

document.addEventListener("DOMContentLoaded", renderTrips);