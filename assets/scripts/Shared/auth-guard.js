/**
 * Tourist Portal Subsystem · Auth guard for home.html
 * - Redirects guests to login.html
 * - Fills in the user's name, initials and Digital ID
 * - Makes "Sign Out" really sign out
 */
(async () => {
  const { data } = await window.sb.auth.getSession();
  const session = data.session;

  if (!session) {
    window.location.replace("login.html");
    return;
  }

  const user = session.user;
  let fullName = (user.user_metadata && user.user_metadata.full_name) || user.email;
  let digitalId = null;

  // Pull the profile row (created automatically by the SQL trigger)
  const { data: profile } = await window.sb
    .from("profiles")
    .select("full_name, digital_id")
    .eq("id", user.id)
    .single();

  if (profile) {
    fullName = profile.full_name || fullName;
    digitalId = profile.digital_id;
  }

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  document.addEventListener("DOMContentLoaded", fill);
  if (document.readyState !== "loading") fill();

  function fill() {
    const nameEl = document.querySelector(".user-meta-name");
    const avatarEl = document.querySelector(".avatar-initials");
    const idEl = document.querySelector(".sidebar-pass-chip strong");
    if (nameEl) nameEl.textContent = fullName;
    if (avatarEl) avatarEl.textContent = initials;
    if (idEl && digitalId) idEl.textContent = "Digital ID: " + digitalId;
  }

  // Real sign out
  document.addEventListener("click", async (e) => {
    const link = e.target.closest(".logout-btn");
    if (!link) return;
    e.preventDefault();
    await window.sb.auth.signOut();
    window.location.href = "landing-page.html";
  });

  // If the session ends in another tab, kick back to login
  window.sb.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") window.location.replace("login.html");
  });
})();