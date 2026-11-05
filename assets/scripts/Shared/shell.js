/**
 * App shell shared by every page: sidebar, topbar, mobile nav, toast,
 * favorites toggling and the destination card renderer.
 *
 * Each page sets <body data-page="home|explore|planner|trips|favorites|qr|profile">
 * and contains only:
 *   <div class="app-shell"><div class="content-shell"><main class="main-content">…</main></div></div>
 */

const NAV_ITEMS = [
  {
    page: "home",
    href: "home.html",
    icon: "home",
    label: "Home",
    mobile: "Home",
  },
  {
    page: "explore",
    href: "explore.html",
    icon: "map",
    label: "Explore",
    mobile: "Explore",
  },
  {
    page: "planner",
    href: "planner.html",
    icon: "calendar-days",
    label: "Trip Planner",
  },
  {
    page: "trips",
    href: "trips.html",
    icon: "briefcase",
    label: "My Trips",
    mobile: "Trips",
  },
  {
    page: "favorites",
    href: "favorites.html",
    icon: "heart",
    label: "Favorites",
    badge: true,
  },
  {
    page: "qr",
    href: "qr.html",
    icon: "qr-code",
    label: "QR Tourist Pass",
    mobile: "Passes",
  },
  {
    page: "profile",
    href: "profile.html",
    icon: "user",
    label: "Profile",
    mobile: "Profile",
  },
];

function buildSidebarHtml(activePage) {
  const items = NAV_ITEMS.map(
    (item) => `
      <a href="${item.href}" class="nav-item-btn ${item.page === activePage ? "active" : ""}" data-screen="${item.page}">
        <i data-lucide="${item.icon}"></i>
        <span>${item.label}</span>
        ${item.badge ? `<span class="nav-item-badge" id="favCountBadge">${favoritesStore.size}</span>` : ""}
      </a>`,
  ).join("");

  return `
    <aside class="sidebar">
      <a href="home.html" class="brand-section">
        <div class="brand-icon-wrap"><i data-lucide="compass"></i></div>
        <div>
          <div class="brand-title">Tourist Portal</div>
          <div class="brand-subtitle">Travel discovery &amp; planning</div>
        </div>
      </a>

      <nav class="sidebar-nav" aria-label="Primary Portal Navigation">${items}</nav>

      <div class="sidebar-footer">
        <div class="sidebar-pass-chip">
          <strong>Digital ID: TP-PH-2026-8842</strong>
          <span>Verified Traveler Status &middot; Ready for gate scan</span>
        </div>
        <a href="../public/landing-page.html" class="logout-btn" id="signOutBtn">
          <i data-lucide="log-out"></i>
          <span>Sign Out</span>
        </a>
      </div>
    </aside>`;
}

function buildTopbarHtml() {
  return `
    <header class="topbar">
      <div class="topbar-left">
        <span class="topbar-kicker">Tourist Portal Subsystem</span>
        <h2 class="topbar-title">Traveler Workspace</h2>
      </div>

      <div class="topbar-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
        </svg>
        <input type="text" id="topbarSearchInput" placeholder="Search destinations, spots, or hotels..." />
      </div>

      <div class="topbar-right">
        <a href="qr.html" class="icon-btn" title="Active Passes"><i data-lucide="qr-code"></i></a>
        <button type="button" class="icon-btn" onclick="showToast('You have 2 upcoming trip alerts.')" title="Notifications">
          <i data-lucide="bell"></i>
          <span class="notif-dot"></span>
        </button>
        <a href="profile.html" class="user-profile-pill" title="View profile">
          <div class="avatar-initials" data-user="initials">…</div>
          <div>
            <div class="user-meta-name" data-user="name">Loading…</div>
            <div class="user-meta-role">Verified Traveler</div>
          </div>
        </a>
      </div>
    </header>`;
}

function buildMobileNavHtml(activePage) {
  const items = NAV_ITEMS.filter((item) => item.mobile)
    .map(
      (item) => `
      <a href="${item.href}" class="mobile-nav-btn ${item.page === activePage ? "active" : ""}" data-screen="${item.page}">
        <i data-lucide="${item.icon}"></i>
        <span>${item.mobile}</span>
      </a>`,
    )
    .join("");

  return `<nav class="mobile-bottom-nav">${items}</nav>`;
}

function initShell() {
  const activePage = document.body.dataset.page || "home";
  const shell = document.querySelector(".app-shell");
  const content = document.querySelector(".content-shell");
  if (!shell || !content) return;

  shell.insertAdjacentHTML("afterbegin", buildSidebarHtml(activePage));
  content.insertAdjacentHTML("afterbegin", buildTopbarHtml());
  shell.insertAdjacentHTML("beforeend", buildMobileNavHtml(activePage));

  if (!document.getElementById("appToast")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="appToast" class="toast-notice hidden"></div>',
    );
  }

  // Topbar search jumps to Explore with the query.
  const search = document.getElementById("topbarSearchInput");
  if (search) {
    if (activePage === "explore") {
      search.addEventListener("input", (e) => {
        if (typeof onTopbarSearch === "function")
          onTopbarSearch(e.target.value);
      });
    } else {
      search.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          window.location.href = `explore.html?q=${encodeURIComponent(search.value.trim())}`;
        }
      });
    }
  }

  const signOut = document.getElementById("signOutBtn");
  if (signOut && window.sb) {
    signOut.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await window.sb.auth.signOut();
      } catch (err) {
        console.error("Sign out failed:", err);
      }
      window.location.href = signOut.getAttribute("href");
    });
  }

  refreshIcons();
}

/* ─── Signed-in user ─── */
const LOGIN_PAGE = "../public/login.html";
window.currentUser = null;

function buildUserFromSession(user) {
  const meta = user.user_metadata || {};
  const fullName =
    meta.full_name ||
    meta.name ||
    [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
    (user.email ? user.email.split("@")[0] : "Traveler");

  const parts = fullName.trim().split(/\s+/);
  const initials = (
    parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();

  return {
    id: user.id,
    email: user.email || "",
    phone: meta.phone || user.phone || "",
    travelPreference: meta.travel_preference || "",
    name: fullName,
    firstName: meta.first_name || parts[0],
    initials,
  };
}

function applyUserToUi() {
  const u = window.currentUser;
  if (!u) return;

  document.querySelectorAll("[data-user]").forEach((el) => {
    el.textContent = u[el.dataset.user] ?? "";
  });
  document.querySelectorAll("[data-user-value]").forEach((el) => {
    el.value = u[el.dataset.userValue] ?? "";
  });
}

// Redirects to login when nobody is signed in (this is what Supabase's 401 was about).
async function initUser() {
  if (!window.sb) return null;

  const { data } = await window.sb.auth.getSession();
  if (!data.session) {
    window.location.replace(LOGIN_PAGE);
    return null;
  }

  window.currentUser = buildUserFromSession(data.session.user);
  applyUserToUi();
  document.dispatchEvent(
    new CustomEvent("userready", { detail: window.currentUser }),
  );
  return window.currentUser;
}

/* ─── Utilities ─── */
function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

function showToast(msg) {
  const toast = document.getElementById("appToast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.add("hidden"), 2800);
}

function updateFavoritesCount() {
  const badge = document.getElementById("favCountBadge");
  if (badge) badge.textContent = favoritesStore.size;
}

function toggleFavorite(id, btn) {
  if (favoritesStore.has(id)) {
    favoritesStore.delete(id);
    if (btn) btn.classList.remove("favorited");
    showToast("Removed from favorites");
  } else {
    favoritesStore.add(id);
    if (btn) btn.classList.add("favorited");
    showToast("Saved to favorites!");
  }
  saveFavorites();
  updateFavoritesCount();

  // Pages can react (e.g. Favorites re-renders its list).
  if (typeof onFavoritesChanged === "function") onFavoritesChanged();
}

/* ─── Destination card (used by Home, Explore, Favorites) ─── */
function renderDestinationCard(item, index) {
  const isFav = favoritesStore.has(item.id);

  return `
    <article class="dest-card">
      <div class="dest-card-media">
        <img src="${item.spot.image}" alt="${item.spot.name}" loading="lazy" />
        <span class="card-tag-badge">${item.category.toUpperCase()}</span>
        <button type="button" class="fav-toggle-btn ${isFav ? "favorited" : ""}" onclick="toggleFavorite('${item.id}', this)" aria-label="Save to favorites">
          <i data-lucide="heart"></i>
        </button>
      </div>

      <div class="dest-card-body">
        <div class="dest-location-row">
          <i data-lucide="map-pin"></i>
          <span>${item.location}</span>
        </div>

        <h3 class="dest-card-title">${item.spot.name}</h3>
        <p class="dest-card-desc">${item.spot.desc}</p>

        <div class="paired-hotel-chip">
          <span>Hotel: <strong>${item.hotel.name}</strong></span>
          <span style="font-weight:700; color:var(--teal);">&#8369;${item.hotel.rate.toLocaleString()} / night</span>
        </div>

        <div class="dest-card-actions">
          <button type="button" class="btn btn-secondary" onclick="openDetailModal(${index})">Details</button>
          <button type="button" class="btn btn-primary" onclick="openBookingModal(${index}, 'hotel_only')">Book Stay &amp; Pass</button>
        </div>
      </div>
    </article>`;
}

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  if (typeof initModals === "function") initModals();
  initUser();
});
