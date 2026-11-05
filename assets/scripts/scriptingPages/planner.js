/**
 * Trip Planner page — chatbot + live itinerary panel.
 * Depends on Shared/data.js, Shared/shell.js, Shared/modals.js.
 */

/* ─── Chatbot Trip Planner State & Logic ─── */
let chatHistory = [
  {
    sender: "bot",
    text: "Mabuhay Alex! 🌴 I am your AI Itinerary Planner. Where would you like to travel in the Philippines? Tell me your destination, number of days, or budget (e.g. <em>'Plan a 3-day beach trip to Boracay'</em>, <em>'2 days in Baguio'</em>, or <em>'Historical tour in Manila'</em>) and I will generate your day-by-day schedule with paired stays and instant QR booking!",
    time: "Just now",
  },
];

let activeItinerary = {
  pairIndex: 1, // Boracay
  days: 3,
  budget: 40500,
  title: "Boracay Island Coastal Escape",
  schedule: [
    {
      day: "Day 1: Arrival & Sunset Sailing",
      items: [
        {
          time: "02:00 PM",
          text: "Speedboat transfer & VIP Check-in at Discovery Shores Boracay",
        },
        {
          time: "04:30 PM",
          text: "Beachfront walk & photo op at Willy's Rock grotto",
        },
        {
          time: "05:30 PM",
          text: "Paraw sunset sailing across White Beach Station 1",
        },
        {
          time: "07:30 PM",
          text: "Seafood dinner buffet by the beach with acoustic music",
        },
      ],
    },
    {
      day: "Day 2: Marine Sanctuary & Watersports",
      items: [
        { time: "08:00 AM", text: "Buffet breakfast at Terra Wellness Cafe" },
        {
          time: "09:30 AM",
          text: "Crystal kayaking & paddleboarding around Station 1",
        },
        {
          time: "01:30 PM",
          text: "Island hopping & snorkeling at Coral Garden",
        },
        {
          time: "06:00 PM",
          text: "Sunset cocktails at the Discovery Shores 360° infinity pool",
        },
      ],
    },
    {
      day: "Day 3: Souvenirs & Relaxed Departure",
      items: [
        {
          time: "09:00 AM",
          text: "Morning shoreline stroll & D'Mall souvenir shopping",
        },
        {
          time: "11:30 AM",
          text: "Hotel check-out & private speedboat transfer back to Caticlan",
        },
      ],
    },
  ],
};

/* ─── Render Chat Messages Feed ─── */
function renderChatMessagesHtml() {
  return (
    chatHistory
      .map(
        (msg) => `
    <div class="chat-row ${msg.sender === "user" ? "user-row" : "bot-row"}">
      <div class="chat-bubble">
        ${msg.text}
        <span class="chat-time">${msg.time}</span>
      </div>
    </div>
  `,
      )
      .join("") +
    `<div id="chatTypingPlaceholder" class="hidden">
    <div class="chat-row bot-row">
      <div class="typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  </div>`
  );
}

function updateChatFeedDom() {
  const feed = document.getElementById("chatMessagesFeed");
  if (feed) {
    feed.innerHTML = renderChatMessagesHtml();
    feed.scrollTop = feed.scrollHeight;
    if (window.lucide) lucide.createIcons();
  }
}

/* ─── Render Live Itinerary Panel ─── */
function renderLiveItineraryHtml() {
  const item =
    destinationsData[activeItinerary.pairIndex] || destinationsData[1];

  return `
    <!-- Destination Header Media -->
    <div class="itinerary-hero-header">
      <img src="${item.spot.image}" alt="${item.spot.name}" />
      <div class="itinerary-hero-overlay">
        <span class="tag tag--teal" style="width:fit-content; margin-bottom:4px;">${item.category.toUpperCase()} DESTINATION</span>
        <h3>${item.spot.name}</h3>
        <span class="small" style="color:#d4fbf4;">Paired Stay: <b>${item.hotel.name}</b> (${item.distance})</span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="itinerary-stats-row">
      <div class="itinerary-stat-item">
        <strong>${activeItinerary.days} Days</strong>
        <span>Duration</span>
      </div>
      <div class="itinerary-stat-item">
        <strong>${item.location}</strong>
        <span>Location</span>
      </div>
      <div class="itinerary-stat-item">
        <strong style="color:var(--teal);">₱${activeItinerary.budget.toLocaleString()}</strong>
        <span>Estimated Total</span>
      </div>
    </div>

    <!-- Timeline Schedule -->
    <div class="itinerary-timeline-feed">
      ${activeItinerary.schedule
        .map(
          (dayBlock) => `
        <div class="timeline-day-block">
          <div class="timeline-day-title">${dayBlock.day}</div>
          <div class="timeline-item-list">
            ${dayBlock.items
              .map(
                (it) => `
              <div class="timeline-item-row">
                <b>${it.time}</b> &middot; ${it.text}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `,
        )
        .join("")}
    </div>

    <!-- Action Buttons -->
    <div class="itinerary-action-box">
      <button type="button" class="btn btn-primary" onclick="openBookingModal(${activeItinerary.pairIndex}, 'hotel_only')">
        <i data-lucide="ticket"></i>
        Book This Itinerary &amp; Generate QR Passes
      </button>
      <button type="button" class="btn btn-secondary" onclick="saveItineraryToTrips()">
        <i data-lucide="bookmark"></i>
        Save Itinerary to My Trips
      </button>
    </div>
  `;
}

function updateLiveItineraryDom() {
  const container = document.getElementById("liveItineraryContainer");
  if (container) {
    container.innerHTML = renderLiveItineraryHtml();
    if (window.lucide) lucide.createIcons();
  }
}

/* ─── Chatbot Event Handlers ─── */
function handleChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("chatUserInput");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  submitChatMessage(text);
  input.value = "";
}

function sendQuickPrompt(promptText) {
  submitChatMessage(promptText);
}

function submitChatMessage(userText) {
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Add user bubble
  chatHistory.push({
    sender: "user",
    text: userText,
    time: now,
  });
  updateChatFeedDom();

  // Show typing indicator
  const typingIndicator = document.getElementById("chatTypingPlaceholder");
  if (typingIndicator) {
    typingIndicator.classList.remove("hidden");
    const feed = document.getElementById("chatMessagesFeed");
    if (feed) feed.scrollTop = feed.scrollHeight;
  }

  // AI Response Simulation with Smart Intent Parsing
  setTimeout(() => {
    const aiResult = generateAiItineraryFromPrompt(userText);

    // Hide typing indicator
    if (typingIndicator) typingIndicator.classList.add("hidden");

    // Add bot response
    chatHistory.push({
      sender: "bot",
      text: aiResult.reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Update active itinerary
    if (aiResult.itinerary) {
      activeItinerary = aiResult.itinerary;
      updateLiveItineraryDom();
      showToast(
        `Itinerary generated for ${destinationsData[activeItinerary.pairIndex].spot.name}!`,
      );
    }

    updateChatFeedDom();
  }, 750);
}

function resetChatConversation() {
  chatHistory = [
    {
      sender: "bot",
      text: "Mabuhay! Chat restarted. Tell me your dream Philippine destination and how many days you'd like to spend, and I'll generate your plan!",
      time: "Just now",
    },
  ];
  updateChatFeedDom();
}

function saveItineraryToTrips() {
  const item = destinationsData[activeItinerary.pairIndex];
  showToast(
    `Itinerary saved: ${item.spot.name} (${activeItinerary.days} Days)`,
  );
}

/* ─── AI Itinerary Parsing Engine ─── */
function generateAiItineraryFromPrompt(prompt) {
  const lower = prompt.toLowerCase();

  // 1. Destination Matching
  let targetIndex = 1; // Default: Boracay
  if (
    lower.includes("boracay") ||
    lower.includes("willy") ||
    lower.includes("white beach")
  ) {
    targetIndex = 1;
  } else if (
    lower.includes("el nido") ||
    lower.includes("palawan") ||
    lower.includes("lagoon") ||
    lower.includes("bacuit")
  ) {
    targetIndex = 4;
  } else if (
    lower.includes("baguio") ||
    lower.includes("benguet") ||
    lower.includes("mines view") ||
    lower.includes("pine")
  ) {
    targetIndex = 3;
  } else if (
    lower.includes("manila") ||
    lower.includes("intramuros") ||
    lower.includes("fort santiago") ||
    lower.includes("rizal")
  ) {
    targetIndex = 0;
  } else if (
    lower.includes("cebu") ||
    lower.includes("santo nino") ||
    lower.includes("magellan") ||
    lower.includes("basilica")
  ) {
    targetIndex = 2;
  } else if (
    lower.includes("tagaytay") ||
    lower.includes("taal") ||
    lower.includes("volcano lake") ||
    lower.includes("sky ranch")
  ) {
    targetIndex = 5;
  } else if (
    lower.includes("bohol") ||
    lower.includes("panglao") ||
    lower.includes("alona") ||
    lower.includes("balicasag")
  ) {
    targetIndex = 6;
  } else if (
    lower.includes("vigan") ||
    lower.includes("crisologo") ||
    lower.includes("ilocos") ||
    lower.includes("kalesa")
  ) {
    targetIndex = 7;
  } else if (
    lower.includes("siargao") ||
    lower.includes("cloud 9") ||
    lower.includes("surf") ||
    lower.includes("general luna")
  ) {
    targetIndex = 8;
  } else if (
    lower.includes("mayon") ||
    lower.includes("albay") ||
    lower.includes("cagsawa") ||
    lower.includes("legazpi") ||
    lower.includes("bicol")
  ) {
    targetIndex = 9;
  }

  // 2. Days Extraction
  let days = 3;
  const dayMatch = lower.match(/(\d+)\s*(?:day|days|araw)/);
  if (dayMatch && dayMatch[1]) {
    days = Math.min(5, Math.max(1, parseInt(dayMatch[1])));
  } else if (lower.includes("weekend")) {
    days = 2;
  } else if (
    lower.includes("1 day") ||
    lower.includes("isang araw") ||
    lower.includes("day tour")
  ) {
    days = 1;
  }

  const destination = destinationsData[targetIndex];
  const hotelRate = destination.hotel.rate;
  const spotFee = destination.spot.fee;
  const estimatedBudget =
    hotelRate * Math.max(1, days - 1) + spotFee * 2 + days * 1200;

  // 3. Build Schedule dynamically based on destination & days
  const generatedSchedule = [];

  // Day 1: Arrival & Core Spot
  generatedSchedule.push({
    day: `Day 1: Arrival & Exploring ${destination.spot.name}`,
    items: [
      {
        time: "01:30 PM",
        text: `Check-in and room orientation at <strong>${destination.hotel.name}</strong> (${destination.hotel.tag})`,
      },
      {
        time: "03:30 PM",
        text: `Visit <strong>${destination.spot.name}</strong> (${destination.distance} from hotel)`,
      },
      {
        time: "05:30 PM",
        text: `Scenic photography and sunset viewpoint walk`,
      },
      {
        time: "07:30 PM",
        text: `Welcome dinner featuring local culinary specialties`,
      },
    ],
  });

  if (days >= 2) {
    generatedSchedule.push({
      day: `Day 2: Cultural Highlights & Signature Activities`,
      items: [
        {
          time: "08:00 AM",
          text: `Buffet breakfast at ${destination.hotel.name}`,
        },
        {
          time: "09:30 AM",
          text: `Signature guided activity: ${destination.spot.desc.split(".")[0]}`,
        },
        {
          time: "01:30 PM",
          text: `Leisure afternoon rest, pool recovery, or local cafe hopping`,
        },
        {
          time: "06:30 PM",
          text: `Evening heritage walk or sunset cocktails at the hotel lounge`,
        },
      ],
    });
  }

  if (days >= 3) {
    generatedSchedule.push({
      day: `Day 3: Scenic Excursions & Souvenir Market`,
      items: [
        {
          time: "08:30 AM",
          text: `Morning mountain/beach walk around the local community`,
        },
        {
          time: "10:30 AM",
          text: `Handcrafted artisan souvenir shopping & delicacy tasting`,
        },
        {
          time: "02:00 PM",
          text: `Spa treatment or recreational sports at ${destination.hotel.name}`,
        },
        { time: "07:00 PM", text: `Farewell dinner banquet` },
      ],
    });
  }

  if (days >= 4) {
    generatedSchedule.push({
      day: `Day 4: Deep Nature Discovery & Island Adventures`,
      items: [
        {
          time: "08:00 AM",
          text: `Early morning boat/eco-trail excursion to nearby marine/forest reserves`,
        },
        { time: "12:30 PM", text: `Picnic lunch by the scenic viewpoint` },
        { time: "04:30 PM", text: `Sunset leisure time at the hotel pool bar` },
      ],
    });
  }

  if (days >= 5) {
    generatedSchedule.push({
      day: `Day 5: Relaxed Breakfast & Departure`,
      items: [
        { time: "09:00 AM", text: `Farewell breakfast & packaging keepsakes` },
        {
          time: "11:30 AM",
          text: `Check-out at ${destination.hotel.name} with airport/terminal transfer`,
        },
      ],
    });
  }

  const botReply = `
    Done! ✨ I have generated your customized <strong>${days}-Day Itinerary</strong> for <strong>${destination.spot.name}</strong> paired with <strong>${destination.hotel.name}</strong> (${destination.distance}).<br><br>
    📍 <strong>Location:</strong> ${destination.location}<br>
    💰 <strong>Estimated Budget:</strong> ~₱${estimatedBudget.toLocaleString()}<br><br>
    Check out the <strong>Live Itinerary Panel</strong> on your right. You can click <strong>'Book This Itinerary'</strong> to reserve your stay and instantly generate your <strong>Dual QR Passes</strong>!
  `;

  return {
    reply: botReply,
    itinerary: {
      pairIndex: targetIndex,
      days: days,
      budget: estimatedBudget,
      title: `${destination.spot.name} Vacation`,
      schedule: generatedSchedule,
    },
  };
}


/* ─── Page init ─── */
document.addEventListener("DOMContentLoaded", () => {
  updateChatFeedDom();
  updateLiveItineraryDom();

  const bookBtn = document.getElementById("bookActiveBtn");
  if (bookBtn) {
    bookBtn.addEventListener("click", () => openBookingModal(activeItinerary.pairIndex, "hotel_only"));
  }
});
