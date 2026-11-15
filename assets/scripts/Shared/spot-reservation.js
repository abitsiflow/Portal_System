/**
 * spot-reservation.js
 * Tourist-attraction reservation modal (Explore / Favorites / Home cards).
 *
 * Steps inside ONE modal:
 *   1) Form    -> visit date, number of visitors, primary guest (logged-in user),
 *                 summary: subtotal, VAT 12%, total, 15% downpayment, remaining balance
 *   2) Payment -> pay the 15% downpayment (QR is NOT available yet)
 *   3) QR pass -> shown only after the downpayment is paid
 *
 * Needs: window.sb (Supabase client), destinationsData (dashboard script),
 *        and the SQL RPCs in tourist-spot-reservation.sql.
 * Load AFTER modals.js:
 *   <script src="../assets/scripts/Shared/spot-reservation.js"></script>
 *
 * Public functions:
 *   openSpotReservationModal(destinationId)   -> start a new reservation
 *   openSpotPaymentByReference(bookingRef)    -> resume a pending reservation (pay now)
 *   closeSpotReservationModal()
 */
(function () {
  const VAT_RATE = 0.12;
  const DOWNPAYMENT_RATE = 0.15;
  const PAYMENT_METHODS = [
    "GCash",
    "Maya",
    "Credit/Debit Card",
    "Bank Transfer",
  ];

  const state = {
    spotId: null,
    spotName: "",
    location: "",
    fee: 0,
    guestName: "",
    guestEmail: "",
    reservation: null, // last row returned by the RPCs
  };

  /* ---------- tiny helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const toast = (msg) =>
    typeof showToast === "function" ? showToast(msg) : alert(msg);
  const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  function peso(amount) {
    return (
      "\u20B1" +
      Number(amount || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function longDate(value) {
    if (!value) return "Not specified";
    const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function qrUrl(payload) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`;
  }

  /* ---------- modal markup (same classes as the hotel modal) ---------- */
  const SPOT_MODAL_HTML = `
  <div id="spotReserveModal" class="modal-overlay hidden"
       onclick="if (event.target === this) closeSpotReservationModal();">
    <div class="booking-modal-card" onclick="event.stopPropagation()">

      <div class="modal-header-banner">
        <div>
          <span class="eyebrow" id="spotModalEyebrow" style="color: var(--teal-light); margin: 0">Attraction Reservation</span>
          <h3 id="spotModalTitle">Reserve Visit</h3>
        </div>
        <button type="button" class="modal-close-icon" onclick="closeSpotReservationModal()">&times;</button>
      </div>

      <!-- STEP 1: RESERVATION FORM -->
      <form id="spotStepForm" class="booking-modal-body" onsubmit="submitSpotReservation(event)">
        <div style="background: var(--bg-app); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 14px 18px;">
          <strong id="spotInfoName" style="color: var(--navy); font-size: 16px">Attraction</strong>
          <span id="spotInfoMeta" style="color: var(--muted); font-size: 13px; display: block"></span>
        </div>

        <div>
          <strong style="display: block; margin-bottom: 12px; color: var(--navy)">Primary Guest</strong>
          <div class="booking-form-grid">
            <div class="explore-field">
              <label for="spotGuestName">Full Name</label>
              <input type="text" id="spotGuestName" readonly />
            </div>
            <div class="explore-field">
              <label for="spotGuestEmail">Email Address</label>
              <input type="email" id="spotGuestEmail" readonly />
            </div>
          </div>
          <small style="color: var(--muted)">This reservation is booked under your logged-in account.</small>
        </div>

        <div>
          <strong style="display: block; margin-bottom: 12px; color: var(--navy)">Visit Details</strong>
          <div class="booking-form-grid">
            <div class="explore-field">
              <label for="spotVisitDate">Visit Date</label>
              <input type="date" id="spotVisitDate" required />
            </div>
            <div class="explore-field">
              <label for="spotVisitors">Number of Visitors</label>
              <input type="number" id="spotVisitors" min="1" max="50" value="1" required
                     oninput="updateSpotSummary()" />
            </div>
          </div>
        </div>

        <div class="booking-summary-box">
          <strong style="color: var(--navy); font-size: 14px; display: block; margin-bottom: 10px">Booking Summary</strong>

          <div class="summary-row">
            <span>Attraction Reservation</span>
            <span id="spotSumVisitors">1 Visitor</span>
          </div>
          <div class="summary-row"><span>Subtotal:</span><span id="spotSumSubtotal">\u20B10.00</span></div>
          <div class="summary-row"><span>VAT (12%):</span><span id="spotSumVat">\u20B10.00</span></div>
          <div class="summary-row total">
            <span>Total Amount:</span>
            <span id="spotSumTotal" style="color: var(--teal)">\u20B10.00</span>
          </div>
          <div class="summary-row"><span>15% Downpayment:</span><span id="spotSumDown">\u20B10.00</span></div>
          <div class="summary-row"><span>Remaining Balance:</span><span id="spotSumRemaining">\u20B10.00</span></div>

          <small id="spotSumNote" style="display: block; margin-top: 12px; color: var(--muted)">
            A 15% downpayment is required. Your QR pass will be issued only after the downpayment is paid.
          </small>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px">
          <button type="button" class="btn btn-secondary" onclick="closeSpotReservationModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="spotConfirmBtn">Reserve &amp; Proceed to Payment</button>
        </div>
      </form>

      <!-- STEP 2: DOWNPAYMENT -->
      <form id="spotStepPay" class="booking-modal-body hidden" onsubmit="submitSpotPayment(event)">
        <div style="background: var(--bg-app); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 14px 18px;">
          <strong id="spotPayName" style="color: var(--navy); font-size: 16px">Attraction</strong>
          <span style="color: var(--muted); font-size: 13px; display: block">
            Reference: <b id="spotPayRef">TS-XXXX</b>
          </span>
          <span style="color: var(--muted); font-size: 13px; display: block">
            Visit date: <b id="spotPayDate"></b> &middot; <b id="spotPayVisitors"></b>
          </span>
        </div>

        <div class="booking-summary-box">
          <div class="summary-row"><span>Total Amount:</span><span id="spotPayTotal">\u20B10.00</span></div>
          <div class="summary-row total">
            <span>Downpayment Due (15%):</span>
            <span id="spotPayDown" style="color: var(--teal)">\u20B10.00</span>
          </div>
          <div class="summary-row"><span>Balance on Visit:</span><span id="spotPayRemaining">\u20B10.00</span></div>
        </div>

        <div class="booking-form-grid">
          <div class="explore-field">
            <label for="spotPayMethod">Payment Method</label>
            <select id="spotPayMethod" required>
              ${PAYMENT_METHODS.map((m) => `<option value="${m}">${m}</option>`).join("")}
            </select>
          </div>
          <div class="explore-field">
            <label for="spotPayReference">Payment Reference No.</label>
            <input type="text" id="spotPayReference" placeholder="Enter your payment reference" minlength="6" required />
          </div>
        </div>

        <small style="color: var(--muted)">
          Your reservation is saved as <b>pending</b>. Pay the downpayment to receive your QR pass.
        </small>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px">
          <button type="button" class="btn btn-secondary" onclick="closeSpotReservationModal()">Pay Later</button>
          <button type="submit" class="btn btn-primary" id="spotPayBtn">Pay Downpayment</button>
        </div>
      </form>

      <!-- STEP 3: QR PASS (only after downpayment is paid) -->
      <div id="spotStepQr" class="booking-modal-body hidden">
        <div class="pass-ticket-card" style="max-width: 420px; margin: 0 auto;">
          <div class="pass-ticket-header attraction-theme">
            <strong>Attraction Entry Pass</strong>
            <span class="pass-status-pill">DOWNPAYMENT PAID</span>
          </div>
          <div class="pass-qr-area">
            <img id="spotQrImg" class="pass-qr-img" src="" alt="Attraction reservation QR code" width="220" height="220" />
            <span id="spotQrCode" class="pass-code-label">TS-XXXX</span>
          </div>
          <div class="pass-details-list">
            <p><strong>Attraction:</strong> <span id="spotQrName"></span></p>
            <p><strong>Primary Guest:</strong> <span id="spotQrGuest"></span></p>
            <p><strong>Visit Date:</strong> <span id="spotQrDate"></span></p>
            <p><strong>Visitors:</strong> <span id="spotQrVisitors"></span></p>
            <p><strong>Total Amount:</strong> <span id="spotQrTotal"></span></p>
            <p><strong>Downpayment Paid:</strong> <span id="spotQrDown"></span></p>
            <p><strong>Balance on Visit:</strong> <span id="spotQrRemaining"></span></p>
            <p class="small subtle" style="margin-top: 10px">
              Present this QR code at the attraction entrance and pay the remaining balance there.
            </p>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px; padding-top: 16px; border-top: 1px solid var(--line)">
          <button type="button" class="btn btn-secondary" onclick="window.print()">Print Pass</button>
          <button type="button" class="btn btn-primary" onclick="closeSpotReservationModal()">Done</button>
        </div>
      </div>

    </div>
  </div>`;

  function ensureModal() {
    if (!$("spotReserveModal")) {
      document.body.insertAdjacentHTML("beforeend", SPOT_MODAL_HTML);
    }
  }

  function openModal() {
    $("spotReserveModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function showStep(step) {
    ["Form", "Pay", "Qr"].forEach((s) =>
      $("spotStep" + s).classList.toggle("hidden", s !== step),
    );

    const titles = {
      Form: [
        "Attraction Reservation",
        `Reserve Visit \u00B7 ${state.spotName}`,
      ],
      Pay: ["Step 2 \u00B7 Downpayment", "Pay Your Downpayment"],
      Qr: ["Reservation Confirmed", "Your Attraction QR Pass"],
    };
    $("spotModalEyebrow").textContent = titles[step][0];
    $("spotModalTitle").textContent = titles[step][1];
  }

  /* ---------- primary guest = logged-in account ---------- */
  async function getPrimaryGuest() {
    let name = "";
    let email = "";

    if (typeof appState !== "undefined" && appState && appState.currentUser) {
      const user = appState.currentUser;
      name =
        (appState.profile && appState.profile.full_name) ||
        (user.user_metadata && user.user_metadata.full_name) ||
        "";
      email = (appState.profile && appState.profile.email) || user.email || "";
    } else if (window.sb) {
      const { data } = await window.sb.auth.getUser();
      const user = data && data.user;
      if (user) {
        email = user.email || "";
        name = (user.user_metadata && user.user_metadata.full_name) || "";
        const { data: profile } = await window.sb
          .from("profiles")
          .select("full_name,email")
          .eq("id", user.id)
          .maybeSingle();
        if (profile) {
          name = profile.full_name || name;
          email = profile.email || email;
        }
      }
    }
    return { name: name || email || "Traveler", email };
  }

  /* ---------- open: new reservation ---------- */
  // spotId = tourist_spots.id (works on any page; the spot is fetched from Supabase)
  async function openSpotReservationModal(spotId) {
    if (!window.sb) {
      toast("Supabase connection is not initialized.");
      return;
    }

    const { data: spot, error } = await window.sb
      .from("tourist_spots")
      .select("id,name,location,city,province,entrance_fee")
      .eq("id", spotId)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !spot) {
      console.error("Spot lookup failed:", error);
      toast("Attraction not found.");
      return;
    }

    ensureModal();

    state.spotId = spot.id;
    state.spotName = spot.name;
    state.location =
      [spot.city, spot.province].filter(Boolean).join(", ") ||
      spot.location ||
      "";
    state.fee = Number(spot.entrance_fee) || 0;
    state.reservation = null;

    $("spotInfoName").textContent = state.spotName;
    $("spotInfoMeta").textContent =
      `${state.location || "Philippines"} \u00B7 Entrance: ${state.fee > 0 ? peso(state.fee) + " / visitor" : "Free"}`;

    const guest = await getPrimaryGuest();
    state.guestName = guest.name;
    state.guestEmail = guest.email;
    $("spotGuestName").value = guest.name;
    $("spotGuestEmail").value = guest.email;

    const today = new Date();
    const defaultDate = new Date();
    defaultDate.setDate(today.getDate() + 7);
    $("spotVisitDate").min = ymd(today);
    $("spotVisitDate").value = ymd(defaultDate);
    $("spotVisitors").value = 1;

    updateSpotSummary();
    showStep("Form");
    openModal();
  }

  /* ---------- computation (same as hotel modal, but 15% downpayment) ---------- */
  function updateSpotSummary() {
    const visitors = Math.max(0, parseInt($("spotVisitors").value, 10) || 0);

    const subtotal = round2(state.fee * visitors);
    const vat = round2(subtotal * VAT_RATE);
    const total = round2(subtotal + vat);
    const down = round2(total * DOWNPAYMENT_RATE);
    const remaining = round2(total - down);

    $("spotSumVisitors").textContent =
      `${visitors} Visitor${visitors === 1 ? "" : "s"} \u00D7 ${peso(state.fee)}`;
    $("spotSumSubtotal").textContent = peso(subtotal);
    $("spotSumVat").textContent = peso(vat);
    $("spotSumTotal").textContent = peso(total);
    $("spotSumDown").textContent = peso(down);
    $("spotSumRemaining").textContent = peso(remaining);

    const isFree = total === 0;
    $("spotConfirmBtn").textContent = isFree
      ? "Confirm Free Reservation"
      : "Reserve & Proceed to Payment";
    $("spotSumNote").textContent = isFree
      ? "This attraction has free entrance. No downpayment is needed; your QR pass is issued right away."
      : "A 15% downpayment is required. Your QR pass will be issued only after the downpayment is paid.";
  }

  /* ---------- step 1 submit: create the reservation (status = pending) ---------- */
  async function submitSpotReservation(event) {
    event.preventDefault();

    if (!window.sb) {
      toast("Supabase connection is not initialized.");
      return;
    }

    const visitDate = $("spotVisitDate").value;
    const visitors = parseInt($("spotVisitors").value, 10);

    if (!visitDate || visitDate < ymd(new Date())) {
      toast("Please choose a valid visit date.");
      return;
    }
    if (!Number.isInteger(visitors) || visitors < 1 || visitors > 50) {
      toast("Number of visitors must be between 1 and 50.");
      return;
    }

    const button = $("spotConfirmBtn");
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Saving Reservation...";

    try {
      const { data, error } = await window.sb.rpc(
        "create_tourist_spot_reservation",
        {
          p_tourist_spot_id: state.spotId,
          p_visit_date: visitDate,
          p_visitors: visitors,
        },
      );

      if (error) throw error;
      if (!data || !data.success) {
        throw new Error(
          (data && data.message) || "Reservation could not be created.",
        );
      }

      state.reservation = data;
      notifyChanged();

      if (data.reservation_qr_code) {
        showQrStep(); // free entrance: nothing to pay
      } else {
        showPaymentStep();
      }
    } catch (error) {
      console.error("Spot reservation error:", error);
      toast(
        error.message || "Something went wrong while saving your reservation.",
      );
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }

  /* ---------- step 2: downpayment ---------- */
  function visitorsOf(row) {
    return (
      Number(row.regular_visitors || 0) +
      Number(row.student_visitors || 0) +
      Number(row.pwd_visitors || 0)
    );
  }

  function showPaymentStep() {
    const r = state.reservation;

    $("spotPayName").textContent = state.spotName;
    $("spotPayRef").textContent = r.booking_reference;
    $("spotPayDate").textContent = longDate(r.visit_date);
    const n = visitorsOf(r);
    $("spotPayVisitors").textContent = `${n} Visitor${n === 1 ? "" : "s"}`;
    $("spotPayTotal").textContent = peso(r.total_amount);
    $("spotPayDown").textContent = peso(r.downpayment_amount);
    $("spotPayRemaining").textContent = peso(r.remaining_balance);
    $("spotPayReference").value = "";
    $("spotPayMethod").selectedIndex = 0;

    showStep("Pay");
  }

  async function submitSpotPayment(event) {
    event.preventDefault();

    if (!state.reservation) return;

    const method = $("spotPayMethod").value;
    const reference = $("spotPayReference").value.trim();

    if (reference.length < 6) {
      toast("Enter a valid payment reference number.");
      return;
    }

    const button = $("spotPayBtn");
    button.disabled = true;
    button.textContent = "Processing Payment...";

    try {
      const { data, error } = await window.sb.rpc(
        "pay_tourist_spot_downpayment",
        {
          p_booking_reference: state.reservation.booking_reference,
          p_payment_method: method,
          p_payment_reference: reference,
        },
      );

      if (error) throw error;
      if (!data || !data.success) {
        throw new Error(
          (data && data.message) || "Payment could not be processed.",
        );
      }

      state.reservation = data;
      notifyChanged();
      toast("Downpayment received. Your QR pass is ready!");
      showQrStep();
    } catch (error) {
      console.error("Spot payment error:", error);
      toast(
        error.message || "Something went wrong while processing your payment.",
      );
    } finally {
      button.disabled = false;
      button.textContent = "Pay Downpayment";
    }
  }

  /* ---------- step 3: QR (only if the downpayment is paid) ---------- */
  function showQrStep() {
    const r = state.reservation;

    if (!r || !r.reservation_qr_code) {
      // Safety net: never show a QR without a paid downpayment
      showPaymentStep();
      return;
    }

    $("spotQrImg").src = qrUrl(r.reservation_qr_code);
    $("spotQrCode").textContent = r.booking_reference;
    $("spotQrName").textContent = state.spotName;
    $("spotQrGuest").textContent = r.visitor_name || state.guestName;
    $("spotQrDate").textContent = longDate(r.visit_date);
    const n = visitorsOf(r);
    $("spotQrVisitors").textContent = `${n} Visitor${n === 1 ? "" : "s"}`;
    $("spotQrTotal").textContent = peso(r.total_amount);
    $("spotQrDown").textContent = peso(r.downpayment_amount);
    $("spotQrRemaining").textContent = peso(r.remaining_balance);

    showStep("Qr");
  }

  /* ---------- resume a pending reservation (e.g. from Trips / QR screens) ---------- */
  async function openSpotPaymentByReference(bookingReference) {
    if (!window.sb) {
      toast("Supabase connection is not initialized.");
      return;
    }

    const { data: row, error } = await window.sb
      .from("tourist_spot_reservations")
      .select("*")
      .eq("booking_reference", bookingReference)
      .maybeSingle();

    if (error || !row) {
      toast("Reservation not found.");
      return;
    }

    const { data: spot } = await window.sb
      .from("tourist_spots")
      .select("name,location")
      .eq("id", row.tourist_spot_id)
      .maybeSingle();

    ensureModal();
    state.spotId = row.tourist_spot_id;
    state.spotName = (spot && spot.name) || "Tourist Attraction";
    state.location = (spot && spot.location) || "";
    state.guestName = row.visitor_name;
    state.reservation = row;

    if (row.reservation_qr_code && row.payment_status !== "pending") {
      showQrStep();
    } else {
      showPaymentStep();
    }
    openModal();
  }

  function closeSpotReservationModal() {
    const modal = $("spotReserveModal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function notifyChanged() {
    if (typeof onReservationCreated === "function") onReservationCreated();
  }

  /* ---------- expose for inline onclick/onsubmit handlers ---------- */
  window.openSpotReservationModal = openSpotReservationModal;
  window.openSpotPaymentByReference = openSpotPaymentByReference;
  window.closeSpotReservationModal = closeSpotReservationModal;
  window.updateSpotSummary = updateSpotSummary;
  window.submitSpotReservation = submitSpotReservation;
  window.submitSpotPayment = submitSpotPayment;
})();
