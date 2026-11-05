/**
 * Shared modals: Booking, QR pass and Spot/Hotel details.
 * Injected into every page so any page can open them.
 */

const MODALS_HTML = `
    <div
      id="bookingModal"
      class="modal-overlay hidden"
      onclick="if (event.target === this) closeBookingModal();"
    >
      <div class="booking-modal-card" onclick="event.stopPropagation()">
        <!-- HEADER -->
        <div class="modal-header-banner">
          <div>
            <span class="eyebrow" style="color: var(--teal-light); margin: 0">
              Hotel Reservation
            </span>
            <h3 id="bookingModalTitle">Book Hotel</h3>
          </div>

          <button
            type="button"
            class="modal-close-icon"
            onclick="closeBookingModal()"
          >
            &times;
          </button>
        </div>

        <form
          class="booking-modal-body"
          onsubmit="processConfirmBooking(event)"
        >
          <!-- HOTEL INFORMATION -->
          <div
            style="
              background: var(--bg-app);
              border: 1px solid var(--line);
              border-radius: var(--radius-md);
              padding: 14px 18px;
            "
          >
            <strong
              id="modalTargetHotelName"
              style="color: var(--navy); font-size: 16px"
            >
              Hotel Name
            </strong>

            <span
              id="modalTargetDistance"
              style="color: var(--muted); font-size: 13px; display: block"
            >
              Hotel Location
            </span>
          </div>

          <!-- RESERVATION TYPE -->
          <div>
            <label
              style="
                font-weight: 700;
                font-size: 13px;
                display: block;
                margin-bottom: 8px;
                color: var(--ink);
              "
            >
              Reservation Type
            </label>

            <div class="booking-package-select">
              <div
                class="package-choice selected"
                data-package="hotel_only"
                onclick="selectBookingPackage('hotel_only')"
              >
                <strong>Hotel Stay Only</strong>

                <span> Reserve rooms and hotel accommodations. </span>
              </div>

              <div
                class="package-choice"
                data-package="spot_only"
                onclick="selectBookingPackage('spot_only')"
              >
                <strong>Attraction Pass Only</strong>

                <span> Reserve an attraction entry pass only. </span>
              </div>
            </div>
          </div>

          <!-- GUEST INFORMATION -->
          <div>
            <strong
              style="display: block; margin-bottom: 12px; color: var(--navy)"
            >
              Guest Information
            </strong>

            <div class="booking-form-grid">
              <div class="explore-field">
                <label for="bookGuestName">Full Name</label>
                <input
                  type="text"
                  id="bookGuestName"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div class="explore-field">
                <label for="bookGuestEmail">Email Address</label>
                <input
                  type="email"
                  id="bookGuestEmail"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div class="explore-field">
                <label for="bookGuestContact">Contact Number</label>
                <input
                  type="tel"
                  id="bookGuestContact"
                  placeholder="09XXXXXXXXX"
                  required
                  max="11"
                />
              </div>

              <div class="explore-field">
                <label for="bookGuestAddress">Complete Address</label>
                <input
                  type="text"
                  id="bookGuestAddress"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
            </div>
          </div>

          <!-- HOTEL ROOM SELECTION -->
          <div id="hotelRoomSelection">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
              "
            >
              <strong style="color: var(--navy)"> Room Selection </strong>

              <span style="font-size: 12px; color: var(--muted)">
                Select your room categories
              </span>
            </div>

            <!-- JavaScript will insert room selection rows here -->
            <div id="roomSelections"></div>

            <button
              type="button"
              class="btn btn-secondary"
              onclick="addRoomSelection()"
              style="margin-top: 10px"
            >
              + Add Another Room
            </button>
          </div>

          <!-- HOTEL DATES -->
          <div id="hotelDateSelection">
            <strong
              style="display: block; margin-bottom: 12px; color: var(--navy)"
            >
              Reservation Dates
            </strong>

            <div class="booking-form-grid">
              <div class="explore-field">
                <label for="bookCheckIn">Check-in Date</label>
                <input
                  type="date"
                  id="bookCheckIn"
                  onchange="updateBookingSummary()"
                  required
                />
                <small>Check-in time: 2:00 PM</small>
              </div>

              <div class="explore-field">
                <label for="bookCheckOut">Check-out Date</label>
                <input
                  type="date"
                  id="bookCheckOut"
                  onchange="updateBookingSummary()"
                  required
                />
                <small>Check-out time: 12:00 PM</small>
              </div>
            </div>
          </div>

          <!-- ATTRACTION DATE -->
          <div id="spotDateSelection" class="hidden">
            <div class="explore-field">
              <label for="bookVisitDate">Attraction Visit Date</label>
              <input type="date" id="bookVisitDate" />
            </div>

            <div class="explore-field" style="margin-top: 12px">
              <label for="bookGuestCount">Number of Visitors</label>
              <select id="bookGuestCount">
                <option value="1">1 Visitor</option>
                <option value="2">2 Visitors</option>
                <option value="3">3 Visitors</option>
                <option value="4">4 Visitors</option>
              </select>
            </div>
          </div>

          <!-- BOOKING SUMMARY -->
          <div class="booking-summary-box">
            <strong
              style="
                color: var(--navy);
                font-size: 14px;
                display: block;
                margin-bottom: 10px;
              "
            >
              Booking Summary
            </strong>

            <div class="summary-row">
              <span id="summaryPackageName">Hotel Reservation</span>
              <span id="summaryNightsGuests">0 Nights</span>
            </div>

            <div class="summary-row">
              <span>Subtotal:</span>
              <span id="summarySubtotal">₱0.00</span>
            </div>

            <div class="summary-row">
              <span>VAT (12%):</span>
              <span id="summaryVat">₱0.00</span>
            </div>

            <div class="summary-row total">
              <span>Total Amount:</span>
              <span id="summaryGrandTotal" style="color: var(--teal)">
                ₱0.00
              </span>
            </div>

            <div class="summary-row">
              <span>30% Downpayment:</span>
              <span id="summaryDownpayment">₱0.00</span>
            </div>

            <div class="summary-row">
              <span>Remaining Balance:</span>
              <span id="summaryRemaining">₱0.00</span>
            </div>

            <small
              style="display: block; margin-top: 12px; color: var(--muted)"
            >
              A 30% downpayment is required. Your reservation will remain
              pending until payment is verified.
            </small>
          </div>

          <!-- ACTIONS -->
          <div
            style="
              display: flex;
              justify-content: flex-end;
              gap: 12px;
              margin-top: 8px;
            "
          >
            <button
              type="button"
              class="btn btn-secondary"
              onclick="closeBookingModal()"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="btn btn-primary"
              id="confirmBookingBtn"
            >
              Confirm Hotel Reservation
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ─── Dual QR Code Passes Modal ─── -->
    <div
      id="qrPassModal"
      class="modal-overlay hidden"
      onclick="if (event.target === this) closeQrPassModal();"
    >
      <div
        class="booking-modal-card"
        style="max-width: 820px"
        onclick="event.stopPropagation()"
      >
        <div class="modal-header-banner">
          <div>
            <span class="eyebrow" style="color: var(--teal-light); margin: 0"
              >Booking Confirmed &middot; Contactless Entry</span
            >
            <h3>Your Digital Travel Passes</h3>
          </div>
          <button
            type="button"
            class="modal-close-icon"
            onclick="closeQrPassModal()"
          >
            &times;
          </button>
        </div>

        <div class="booking-modal-body">
          <p class="subtle" style="margin-top: -6px">
            Present these official digital passes on your phone screen or
            printed paper at the attraction entrance gate and hotel reception
            desk.
          </p>

          <!-- Dual Passes Grid -->
          <div class="passes-display-grid">
            <!-- Attraction Pass -->
            <div class="pass-ticket-card">
              <div class="pass-ticket-header attraction-theme">
                <strong>Attraction Entry Pass</strong>
                <span class="pass-status-pill">ACTIVE &middot; VERIFIED</span>
              </div>
              <div class="pass-qr-area">
                <img
                  id="passSpotQrImg"
                  class="pass-qr-img"
                  src=""
                  alt="Attraction Pass QR Code"
                />
                <span id="passSpotCode" class="pass-code-label"
                  >TP-PASS-2026-XXXX</span
                >
              </div>
              <div class="pass-details-list">
                <p>
                  <strong>Attraction:</strong>
                  <span id="passSpotName">Fort Santiago &amp; Intramuros</span>
                </p>
                <p>
                  <strong>Pass Holder:</strong>
                  <span id="passSpotHolder">Alex Traveler</span>
                </p>
                <p>
                  <strong>Visit Date:</strong>
                  <span id="passSpotDate">2026-11-15</span>
                </p>
                <p>
                  <strong>Visitors:</strong>
                  <span id="passSpotGuests">2 Guests</span>
                </p>
                <p class="small subtle" style="margin-top: 10px">
                  Scannable at security turnstiles &amp; ticket checkpoints.
                </p>
              </div>
            </div>

            <!-- Hotel Reservation Pass -->
            <div class="pass-ticket-card">
              <div class="pass-ticket-header hotel-theme">
                <strong>Hotel Check-in Pass</strong>
                <span class="pass-status-pill">CONFIRMED</span>
              </div>
              <div class="pass-qr-area">
                <img
                  id="passHotelQrImg"
                  class="pass-qr-img"
                  src=""
                  alt="Hotel Reservation QR Code"
                />
                <span id="passHotelCode" class="pass-code-label"
                  >HTL-RES-2026-YYYY</span
                >
              </div>
              <div class="pass-details-list">
                <p>
                  <strong>Hotel:</strong>
                  <span id="passHotelName">The Manila Hotel</span>
                </p>
                <p>
                  <strong>Guest Name:</strong>
                  <span id="passHotelGuest">Alex Traveler</span>
                </p>
                <p>
                  <strong>Stay Dates:</strong>
                  <span id="passHotelDates">2026-11-14 to 2026-11-17</span>
                </p>
                <p>
                  <strong>Category:</strong>
                  <span id="passHotelRoom">5-Star Luxury Room</span>
                </p>
                <p class="small subtle" style="margin-top: 10px">
                  Scannable at hotel concierge for fast keycard issuance.
                </p>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 12px;
              padding-top: 16px;
              border-top: 1px solid var(--line);
            "
          >
            <span class="small subtle"
              >Passes are saved to your account in <b>My Trips</b> and
              <b>QR Tourist Pass</b>.</span
            >
            <div style="display: flex; gap: 10px">
              <button
                type="button"
                class="btn btn-secondary"
                onclick="window.print()"
              >
                <i data-lucide="printer"></i>
                Print Passes
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onclick="closeQrPassModal()"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Spot & Hotel Details Modal ─── -->
    <div
      id="spotDetailModal"
      class="modal-overlay hidden"
      onclick="if (event.target === this) closeDetailModal();"
    >
      <div
        class="booking-modal-card"
        style="max-width: 720px"
        onclick="event.stopPropagation()"
      >
        <div style="position: relative; height: 200px; background: #0c2d48">
          <img
            id="detailSpotImg"
            src=""
            alt="Spot Media"
            style="width: 100%; height: 100%; object-fit: cover"
          />
          <button
            type="button"
            class="modal-close-icon"
            style="
              position: absolute;
              top: 12px;
              right: 14px;
              background: rgba(0, 0, 0, 0.6);
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: grid;
              place-items: center;
            "
            onclick="closeDetailModal()"
          >
            &times;
          </button>
        </div>

        <div class="booking-modal-body">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            "
          >
            <div>
              <span class="eyebrow" id="detailLocation">Location</span>
              <h2
                id="detailModalTitle"
                style="
                  font-family: &quot;Fraunces&quot;, serif;
                  font-size: 24px;
                  color: var(--navy);
                  margin: 4px 0 0;
                "
              >
                Destination Pair
              </h2>
            </div>
            <span class="tag tag--teal" id="detailDistance">Distance</span>
          </div>

          <hr
            style="border: 0; border-top: 1px solid var(--line); margin: 16px 0"
          />

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
            <div>
              <h4 style="color: var(--teal); margin-bottom: 6px">
                Tourist Attraction
              </h4>
              <strong id="detailSpotName" style="font-size: 16px"
                >Spot Name</strong
              >
              <p
                id="detailSpotDesc"
                class="small subtle"
                style="margin-top: 6px; line-height: 1.5"
              >
                Description
              </p>
              <p class="small">
                <b>Entrance Fee:</b> <span id="detailSpotFee"></span>
              </p>
              <p class="small">
                <b>Hours:</b> <span id="detailSpotHours"></span>
              </p>
            </div>

            <div>
              <h4 style="color: var(--navy); margin-bottom: 6px">
                Adjacent Accommodation
              </h4>
              <strong id="detailHotelName" style="font-size: 16px"
                >Hotel Name</strong
              >
              <p
                id="detailHotelDesc"
                class="small subtle"
                style="margin-top: 6px; line-height: 1.5"
              >
                Description
              </p>
              <p class="small">
                <b>Nightly Rate:</b>
                <span
                  id="detailHotelRate"
                  style="color: var(--teal); font-weight: 700"
                ></span>
              </p>
            </div>
          </div>

          <div
            style="
              display: flex;
              justify-content: flex-end;
              gap: 10px;
              margin-top: 20px;
              padding-top: 16px;
              border-top: 1px solid var(--line);
            "
          >
            <button
              type="button"
              class="btn btn-secondary"
              onclick="closeDetailModal()"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              id="detailModalBookBtn"
            >
              Book Vacation Pair
            </button>
          </div>
        </div>
      </div>
    </div>
`;

function initModals() {
  if (!document.getElementById("bookingModal")) {
    document.body.insertAdjacentHTML("beforeend", MODALS_HTML);
  }
  refreshIcons();
}

/* ─── Booking state ─── */
const bookingState = {
  target: null,
  packageType: "hotel_only", // 'hotel_only' | 'spot_only'
};

let roomLines = [];
let nextRoomId = 1;

/* ─── Room selection ─── */
function addRoomSelection() {
  roomLines.push({ id: nextRoomId++, roomType: "Economy Room", guests: 1 });
  renderRoomSelections();
  updateBookingSummary();
}

function removeRoomSelection(roomId) {
  if (roomLines.length === 1) {
    showToast("At least one room is required.");
    return;
  }
  roomLines = roomLines.filter((room) => room.id !== roomId);
  renderRoomSelections();
  updateBookingSummary();
}

function updateRoomType(roomId, roomType) {
  const room = roomLines.find((item) => item.id === roomId);
  const category = roomCategories.find((item) => item.name === roomType);
  if (!room || !category) return;

  room.roomType = roomType;
  room.guests = Math.min(room.guests, category.maxGuests);
  renderRoomSelections();
  updateBookingSummary();
}

function updateRoomGuestCount(roomId, guestCount) {
  const room = roomLines.find((item) => item.id === roomId);
  if (!room) return;
  room.guests = Number(guestCount);
  updateBookingSummary();
}

function renderRoomSelections() {
  const container = document.getElementById("roomSelections");
  if (!container) return;

  container.innerHTML = roomLines
    .map((room, index) => {
      const category = roomCategories.find(
        (item) => item.name === room.roomType,
      );

      return `
        <div class="form-panel" style="margin-bottom: 12px; padding: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <strong>Room ${index + 1}</strong>
            <button type="button" class="btn btn-secondary" onclick="removeRoomSelection(${room.id})" style="padding:6px 10px;">Remove</button>
          </div>

          <div class="booking-form-grid">
            <div class="explore-field">
              <label>Room Category</label>
              <select onchange="updateRoomType(${room.id}, this.value)">
                ${roomCategories
                  .map(
                    (option) => `
                      <option value="${option.name}" ${room.roomType === option.name ? "selected" : ""}>
                        ${option.name} - ₱${option.rate.toLocaleString()}/night
                      </option>`,
                  )
                  .join("")}
              </select>
            </div>

            <div class="explore-field">
              <label>Number of Guests</label>
              <select onchange="updateRoomGuestCount(${room.id}, this.value)">
                ${Array.from({ length: category.maxGuests }, (_, i) => i + 1)
                  .map(
                    (count) => `
                      <option value="${count}" ${room.guests === count ? "selected" : ""}>
                        ${count} ${count === 1 ? "Guest" : "Guests"}
                      </option>`,
                  )
                  .join("")}
              </select>
            </div>
          </div>

          <small style="color:var(--muted);">Maximum capacity: ${category.maxGuests} guests</small>
        </div>`;
    })
    .join("");
}

/* ─── Open / close booking modal ─── */
function openBookingModal(pairIndex, defaultPackage = "hotel_only") {
  const item = destinationsData[pairIndex];
  if (!item) {
    showToast("Destination not found.");
    return;
  }

  // The planner used to pass 'combined', which the modal has no UI for.
  if (defaultPackage !== "spot_only") defaultPackage = "hotel_only";

  bookingState.target = item;

  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  document.getElementById("bookingModalTitle").textContent =
    `Book Hotel · ${item.hotel.name}`;
  document.getElementById("modalTargetHotelName").textContent = item.hotel.name;
  document.getElementById("modalTargetDistance").textContent = item.distance;

  roomLines = [];
  nextRoomId = 1;
  addRoomSelection();

  // Default dates: 14 days from today, 3 nights.
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 14);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 3);

  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  document.getElementById("bookCheckIn").value = fmt(checkIn);
  document.getElementById("bookCheckOut").value = fmt(checkOut);
  document.getElementById("bookVisitDate").value = fmt(checkIn);

  selectBookingPackage(defaultPackage);

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function selectBookingPackage(type) {
  bookingState.packageType = type;

  document.querySelectorAll(".package-choice").forEach((card) => {
    card.classList.toggle(
      "selected",
      card.getAttribute("data-package") === type,
    );
  });

  const isHotel = type === "hotel_only";

  document
    .getElementById("hotelRoomSelection")
    .classList.toggle("hidden", !isHotel);
  document
    .getElementById("hotelDateSelection")
    .classList.toggle("hidden", !isHotel);
  document
    .getElementById("spotDateSelection")
    .classList.toggle("hidden", isHotel);

  document.getElementById("bookCheckIn").required = isHotel;
  document.getElementById("bookCheckOut").required = isHotel;
  document.getElementById("bookVisitDate").required = !isHotel;

  document.getElementById("confirmBookingBtn").textContent = isHotel
    ? "Confirm Hotel Reservation"
    : "Attraction Reservation";

  updateBookingSummary();
}

function updateBookingSummary() {
  const $ = (id) => document.getElementById(id);

  if (bookingState.packageType !== "hotel_only") {
    $("summaryPackageName").textContent = "Attraction Reservation";
    $("summaryNightsGuests").textContent = "Attraction Entry";
    [
      "summarySubtotal",
      "summaryVat",
      "summaryGrandTotal",
      "summaryDownpayment",
      "summaryRemaining",
    ].forEach((id) => ($(id).textContent = "Not applicable"));
    return;
  }

  const checkInValue = $("bookCheckIn").value;
  const checkOutValue = $("bookCheckOut").value;

  let nights = 0;
  if (checkInValue && checkOutValue) {
    const start = new Date(`${checkInValue}T00:00:00`);
    const end = new Date(`${checkOutValue}T00:00:00`);
    nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  $("summaryPackageName").textContent = "Hotel Room Reservation";

  const totalGuests = roomLines.reduce(
    (total, room) => total + Number(room.guests),
    0,
  );
  $("summaryNightsGuests").textContent =
    `${Math.max(0, nights)} Nights · ${roomLines.length} Rooms · ${totalGuests} Guests`;

  if (nights <= 0 || roomLines.length === 0) {
    [
      "summarySubtotal",
      "summaryVat",
      "summaryGrandTotal",
      "summaryDownpayment",
      "summaryRemaining",
    ].forEach((id) => ($(id).textContent = "₱0.00"));
    return;
  }

  const subtotal = roomLines.reduce((total, room) => {
    const category = roomCategories.find((item) => item.name === room.roomType);
    return total + category.rate * nights;
  }, 0);

  const vat = subtotal * 0.12;
  const grandTotal = subtotal + vat;
  const downpayment = grandTotal * 0.3;

  $("summarySubtotal").textContent = formatPeso(subtotal);
  $("summaryVat").textContent = formatPeso(vat);
  $("summaryGrandTotal").textContent = formatPeso(grandTotal);
  $("summaryDownpayment").textContent = formatPeso(downpayment);
  $("summaryRemaining").textContent = formatPeso(grandTotal - downpayment);
}

/* ─── Confirm booking (Supabase RPC) ─── */
async function processConfirmBooking(e) {
  e.preventDefault();

  if (bookingState.packageType !== "hotel_only") {
    showToast("Attraction-only reservations are not connected yet.");
    return;
  }

  const item = bookingState.target;
  if (!item) {
    showToast("Please select a destination first.");
    return;
  }

  if (!window.sb) {
    showToast("Supabase connection is not initialized.");
    return;
  }

  const guestName = document.getElementById("bookGuestName").value.trim();
  const guestEmail = document.getElementById("bookGuestEmail").value.trim();
  const contactNumber = document
    .getElementById("bookGuestContact")
    .value.trim();
  const address = document.getElementById("bookGuestAddress").value.trim();
  const checkInDate = document.getElementById("bookCheckIn").value;
  const checkOutDate = document.getElementById("bookCheckOut").value;

  if (!guestName || !guestEmail || !contactNumber || !address) {
    showToast("Please complete all guest information.");
    return;
  }

  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
    showToast("Check-out must be later than check-in.");
    return;
  }

  if (roomLines.length === 0) {
    showToast("Please add at least one room.");
    return;
  }

  for (const room of roomLines) {
    const category = roomCategories.find((c) => c.name === room.roomType);
    if (!category || room.guests < 1 || room.guests > category.maxGuests) {
      showToast(`Invalid guest count for ${room.roomType}.`);
      return;
    }
  }

  const rooms = roomLines.map((room) => ({
    room_type: room.roomType,
    number_of_guests: Number(room.guests),
  }));

  const confirmButton = document.getElementById("confirmBookingBtn");
  confirmButton.disabled = true;
  confirmButton.textContent = "Processing Reservation...";

  try {
    const { data, error } = await window.sb.rpc("create_online_reservation", {
      p_hotel_name: item.hotel.name,
      p_guest_name: guestName,
      p_contact_number: contactNumber,
      p_email: guestEmail,
      p_address: address,
      p_check_in: `${checkInDate}T14:00:00+08:00`,
      p_check_out: `${checkOutDate}T12:00:00+08:00`,
      p_rooms: rooms,
    });

    if (error) throw error;
    if (!data || !data.success) {
      throw new Error(data?.message || "Reservation could not be created.");
    }

    closeBookingModal();
    showToast("Reservation saved successfully!");

    showHotelReservationQR({
      bookingReference: data.booking_reference,
      hotelName: item.hotel.name,
      guestName,
      checkInDate,
      checkOutDate,
      rooms,
      paymentStatus: data.payment_status,
    });

    // Let the current page refresh its own data (Trips, QR…).
    if (typeof onReservationCreated === "function") onReservationCreated();
  } catch (error) {
    console.error("Reservation error:", error);
    showToast(
      error.message || "Something went wrong while saving your reservation.",
    );
  } finally {
    confirmButton.disabled = false;
    confirmButton.textContent = "Confirm Hotel Reservation";
  }
}

/* ─── QR pass modal ─── */
function showHotelReservationQR(booking) {
  const modal = document.getElementById("qrPassModal");
  if (!modal) return;

  const passCards = modal.querySelectorAll(".pass-ticket-card");
  if (passCards[0]) passCards[0].style.display = "none";
  if (passCards[1]) passCards[1].style.display = "";

  document.getElementById("passHotelName").textContent = booking.hotelName;
  document.getElementById("passHotelQrImg").src = qrImageUrl(
    `HOTEL-RESERVATION|REF:${booking.bookingReference}|STATUS:${booking.paymentStatus}`,
  );
  document.getElementById("passHotelCode").textContent =
    booking.bookingReference;
  document.getElementById("passHotelGuest").textContent = booking.guestName;
  document.getElementById("passHotelDates").textContent =
    `${booking.checkInDate} to ${booking.checkOutDate}`;
  document.getElementById("passHotelRoom").textContent =
    `${booking.rooms.length} room(s) · ${booking.paymentStatus}`;

  const heading = modal.querySelector(".modal-header-banner h3");
  if (heading) heading.textContent = "Your Hotel Reservation QR";

  const statusPill = passCards[1]?.querySelector(".pass-status-pill");
  if (statusPill) statusPill.textContent = "PENDING PAYMENT";

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function showGeneratedDualPass(booking) {
  if (!booking) {
    showToast("No booking found yet.");
    return;
  }

  const item = destinationsData[booking.pairIndex] || destinationsData[0];
  const modal = document.getElementById("qrPassModal");
  if (!modal) return;

  // Make sure both cards are visible (showHotelReservationQR hides the first).
  modal
    .querySelectorAll(".pass-ticket-card")
    .forEach((card) => (card.style.display = ""));

  const heading = modal.querySelector(".modal-header-banner h3");
  if (heading) heading.textContent = "Your Digital Travel Passes";

  document.getElementById("passSpotName").textContent = item.spot.name;
  document.getElementById("passSpotQrImg").src = qrImageUrl(
    `VALID-TOURIST-PASS|ID:${booking.touristPassId}|SPOT:${item.spot.name}|HOLDER:${booking.guestName}|DATE:${booking.visitDate}|GUESTS:${booking.guestCount}`,
  );
  document.getElementById("passSpotCode").textContent = booking.touristPassId;
  document.getElementById("passSpotHolder").textContent = booking.guestName;
  document.getElementById("passSpotDate").textContent = booking.visitDate;
  document.getElementById("passSpotGuests").textContent =
    `${booking.guestCount} Visitors`;

  document.getElementById("passHotelName").textContent = item.hotel.name;
  document.getElementById("passHotelQrImg").src = qrImageUrl(
    `VALID-HOTEL-RESERVATION|ID:${booking.hotelResId}|HOTEL:${item.hotel.name}|GUEST:${booking.guestName}|CHECKIN:${booking.checkInDate}|CHECKOUT:${booking.checkOutDate}`,
  );
  document.getElementById("passHotelCode").textContent = booking.hotelResId;
  document.getElementById("passHotelGuest").textContent = booking.guestName;
  document.getElementById("passHotelDates").textContent =
    `${booking.checkInDate} to ${booking.checkOutDate}`;
  document.getElementById("passHotelRoom").textContent =
    `${item.hotel.tag} (Confirmed)`;

  modal.querySelectorAll(".pass-status-pill").forEach((pill, i) => {
    pill.textContent = i === 0 ? "ACTIVE · VERIFIED" : "CONFIRMED";
  });

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeQrPassModal() {
  const modal = document.getElementById("qrPassModal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ─── Details modal ─── */
function openDetailModal(index) {
  const item = destinationsData[index];
  if (!item) return;

  const modal = document.getElementById("spotDetailModal");
  if (!modal) return;

  const set = (id, value) => (document.getElementById(id).textContent = value);

  set("detailModalTitle", `${item.spot.name} + ${item.hotel.name}`);
  set("detailSpotName", item.spot.name);
  set("detailSpotDesc", item.spot.desc);
  set(
    "detailSpotFee",
    item.spot.fee > 0 ? `₱${item.spot.fee}` : "Free Admission",
  );
  set("detailSpotHours", item.spot.hours);
  set("detailHotelName", item.hotel.name);
  set("detailHotelDesc", item.hotel.desc);
  set("detailHotelRate", `₱${item.hotel.rate.toLocaleString()} / night`);
  set("detailLocation", item.location);
  set("detailDistance", item.distance);
  document.getElementById("detailSpotImg").src = item.spot.image;

  document
    .getElementById("detailModalBookBtn")
    .setAttribute(
      "onclick",
      `closeDetailModal(); openBookingModal(${index}, 'hotel_only');`,
    );

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeDetailModal() {
  const modal = document.getElementById("spotDetailModal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ─── Supabase: load the signed-in user's reservations ─── */
async function loadMyReservations() {
  if (!window.sb) return [];

  const { data, error } = await window.sb
    .from("hotel_reservations")
    .select(`*, hotel_records (*)`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load reservations:", error);
    showToast("Unable to load your reservations.");
    return [];
  }

  return data || [];
}
