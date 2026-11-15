/**
 * Trip Planner page — AI chatbot + live itinerary panel.
 * Depends on:
 * Shared/supabase-client.js
 * Shared/data.js
 * Shared/shell.js
 * Shared/modals.js
 */

/* ─── Chatbot State ─── */

let chatHistory = [
  {
    sender: "bot",
    text: "Mabuhay! 🌴 I am your Philippine AI Itinerary Planner. Tell me where you want to travel, how many days you have, and your estimated budget. Let's plan your trip!",
    time: "Just now",
  },
];

let activeItinerary = null;
let isChatRequestPending = false;

/* ─── Helpers ─── */

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Render Chat Messages ─── */

function renderChatMessagesHtml() {
  const messages = chatHistory
    .map(
      (msg) => `
        <div class="chat-row ${msg.sender === "user" ? "user-row" : "bot-row"}">
          <div class="chat-bubble">
            ${escapeHtml(msg.text).replace(/\n/g, "<br>")}
            <span class="chat-time">${escapeHtml(msg.time)}</span>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    ${messages}

    <div id="chatTypingPlaceholder" class="hidden">
      <div class="chat-row bot-row">
        <div class="typing-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    </div>
  `;
}

function updateChatFeedDom() {
  const feed = document.getElementById("chatMessagesFeed");

  if (!feed) return;

  feed.innerHTML = renderChatMessagesHtml();
  feed.scrollTop = feed.scrollHeight;

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ─── Render Live Itinerary ─── */

function renderLiveItineraryHtml() {
  if (!activeItinerary) {
    return `
      <div class="itinerary-empty-state">
        <h3>Your itinerary will appear here</h3>
        <p>
          Tell the AI where you want to go, your travel duration,
          and your budget to generate a personalized itinerary.
        </p>
      </div>
    `;
  }

  const hotel = activeItinerary.hotel;
  const schedule = Array.isArray(activeItinerary.schedule)
    ? activeItinerary.schedule
    : [];

  const budget = Number(activeItinerary.estimated_budget ?? 0);

  return `
    <div class="itinerary-hero-header">
      <div class="itinerary-hero-overlay">
        <span class="tag tag--teal"
          style="width:fit-content; margin-bottom:4px;">
          PHILIPPINE DESTINATION
        </span>

        <h3>${escapeHtml(activeItinerary.destination)}</h3>

        <span class="small" style="color:#d4fbf4;">
          ${escapeHtml(activeItinerary.title)}
        </span>

        ${
          hotel
            ? `<p class="small" style="color:#d4fbf4;">
                Recommended Hotel: <b>${escapeHtml(hotel.name)}</b>
              </p>`
            : ""
        }
      </div>
    </div>

    <div class="itinerary-stats-row">
      <div class="itinerary-stat-item">
        <strong>${escapeHtml(activeItinerary.days)} Days</strong>
        <span>Duration</span>
      </div>

      <div class="itinerary-stat-item">
        <strong>${escapeHtml(activeItinerary.destination)}</strong>
        <span>Destination</span>
      </div>

      <div class="itinerary-stat-item">
        <strong style="color:var(--teal);">
          ₱${budget.toLocaleString("en-PH")}
        </strong>
        <span>Estimated Total</span>
      </div>
    </div>

    <div class="itinerary-timeline-feed">
      ${
        schedule.length
          ? schedule
              .map(
                (dayBlock) => `
                  <div class="timeline-day-block">
                    <div class="timeline-day-title">
                      Day ${escapeHtml(dayBlock.day)}:
                      ${escapeHtml(dayBlock.title)}
                    </div>

                    <div class="timeline-item-list">
                      ${(dayBlock.items ?? [])
                        .map(
                          (item) => `
                            <div class="timeline-item-row">
                              <b>${escapeHtml(item.time ?? "Time not specified")}</b>
                              &middot;
                              ${escapeHtml(item.name ?? item.description)}
                              ${
                                item.description
                                  ? `<p>${escapeHtml(item.description)}</p>`
                                  : ""
                              }
                            </div>
                          `,
                        )
                        .join("")}
                    </div>
                  </div>
                `,
              )
              .join("")
          : "<p>No schedule details are available.</p>"
      }
    </div>

    <div class="itinerary-action-box">
      <p class="small">
        This is an AI-generated travel estimate. Hotel booking
        and itinerary saving will be connected separately.
      </p>
    </div>
  `;
}

function updateLiveItineraryDom() {
  const container = document.getElementById("liveItineraryContainer");

  if (!container) return;

  container.innerHTML = renderLiveItineraryHtml();

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ─── Chatbot Event Handlers ─── */

function handleChatSubmit(e) {
  if (e) e.preventDefault();

  const input = document.getElementById("chatUserInput");

  if (!input || isChatRequestPending) return;

  const text = input.value.trim();

  if (!text) return;

  input.value = "";
  submitChatMessage(text);
}

function sendQuickPrompt(promptText) {
  if (isChatRequestPending) return;

  submitChatMessage(promptText);
}

/* ─── Actual Supabase AI Request ─── */

async function submitChatMessage(userText) {
  if (isChatRequestPending) return;

  isChatRequestPending = true;

  chatHistory.push({
    sender: "user",
    text: userText,
    time: getCurrentTime(),
  });

  updateChatFeedDom();

  const typingIndicator = document.getElementById("chatTypingPlaceholder");

  if (typingIndicator) {
    typingIndicator.classList.remove("hidden");
  }

  const feed = document.getElementById("chatMessagesFeed");

  if (feed) {
    feed.scrollTop = feed.scrollHeight;
  }

  try {
    // 1. Check authentication.
    const { data: sessionData, error: sessionError } =
      await window.sb.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      throw new Error("Please log in to use the AI Itinerary Planner.");
    }

    // 2. Get previous conversation messages.
    const previousHistory = chatHistory
      .slice(0, -1)
      .slice(-10)
      .map((message) => ({
        sender: message.sender,
        text: message.text,
      }));

    // 3. Call Supabase Edge Function.
    const { data, error } = await window.sb.functions.invoke(
      "generate-itinerary",
      {
        body: {
          prompt: userText,
          history: previousHistory,
          currentItinerary: activeItinerary,
        },
      },
    );

    // 4. Read actual Edge Function error details.
    if (error) {
      console.error("Supabase function error:", error);

      let errorDetails = "";

      try {
        if (error.context instanceof Response) {
          errorDetails = await error.context.clone().text();
        } else if (error.context) {
          errorDetails = JSON.stringify(error.context);
        }
      } catch (readError) {
        console.error("Could not read function error response:", readError);
      }

      console.error(
        "Function response details:",
        errorDetails || "No response details available.",
      );

      throw new Error(
        errorDetails ||
          "The AI service returned an error. Check the browser console and Supabase logs.",
      );
    }

    // 5. Validate response.
    if (!data || !data.success) {
      console.error("Invalid AI response:", data);

      throw new Error(data?.error || "The AI could not process your request.");
    }

    // 6. Add AI response to chat.
    chatHistory.push({
      sender: "bot",
      text: data.reply || "Your request has been processed.",
      time: getCurrentTime(),
    });

    // 7. Update itinerary only if a new itinerary is returned.
    if (data.is_travel_related && data.itinerary) {
      activeItinerary = data.itinerary;

      updateLiveItineraryDom();

      showToast(`Itinerary generated for ${activeItinerary.destination}!`);
    }
  } catch (error) {
    console.error("Trip Planner error:", error);

    chatHistory.push({
      sender: "bot",
      text: error.message || "Something went wrong. Please try again.",
      time: getCurrentTime(),
    });
  } finally {
    isChatRequestPending = false;

    updateChatFeedDom();
  }
}

/* ─── Reset Conversation ─── */

function resetChatConversation() {
  if (isChatRequestPending) return;

  chatHistory = [
    {
      sender: "bot",
      text: "Mabuhay! 🌴 Let's plan a new Philippine adventure. Where would you like to go?",
      time: "Just now",
    },
  ];

  activeItinerary = null;

  updateChatFeedDom();
  updateLiveItineraryDom();
}

/* ─── Page Initialization ─── */

document.addEventListener("DOMContentLoaded", () => {
  updateChatFeedDom();
  updateLiveItineraryDom();
});
