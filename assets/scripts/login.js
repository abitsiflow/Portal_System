/**
 * Login page helpers.
 * The actual sign-in (Supabase) and redirect live in Shared/login-auth.js,
 * which must be loaded AFTER this file.
 */

/* ─── Show Message ─── */
function showMessage(id, text, type = "error") {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = text;
  el.style.color = type === "success" ? "#0f766e" : "#e7684a";
  el.style.display = "block";

  // Animate in
  el.style.animation = "none";
  el.offsetHeight; // trigger reflow
  el.style.animation = "fadeIn 0.3s ease-out";
}

/* ─── Clear Message ─── */
function clearMessage(id) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = "";
    el.style.display = "none";
  }
}

/* ─── Toggle Password Visibility ─── */
function togglePassword() {
  const input = document.getElementById("loginPassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const eyeOffIcon = document.getElementById("eyeOffIcon");

  if (input.type === "password") {
    input.type = "text";
    eyeIcon.classList.add("hidden");
    eyeOffIcon.classList.remove("hidden");
  } else {
    input.type = "password";
    eyeIcon.classList.remove("hidden");
    eyeOffIcon.classList.add("hidden");
  }
}
