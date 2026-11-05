/**
 * Tourist Portal Subsystem · Login via Supabase Auth
 * Load AFTER your existing login.js. It runs first on submit (capture phase)
 * and blocks any old redirect logic, so your login.js can stay as is.
 *
 * login.html lives in /public, the dashboard pages live in /pages.
 */

const HOME_PAGE = "../pages/home.html";

function loginMessage(text, type) {
  if (typeof showMessage === "function") {
    showMessage("loginMessage", text, type);
  } else {
    const el = document.getElementById("loginMessage");
    if (el) el.textContent = text;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Already signed in? Skip the login page.
  const { data } = await window.sb.auth.getSession();
  if (data.session) {
    window.location.replace(HOME_PAGE);
    return;
  }

  // Arrived from the register page
  if (new URLSearchParams(window.location.search).get("registered") === "1") {
    loginMessage(
      "Account created! Confirm your email if asked, then sign in.",
      "success",
    );
  }

  // Replace the "Forgot password?" demo message with a real reset email
  const forgotBtn = document.querySelector(".forgot-link");
  if (forgotBtn) {
    forgotBtn.removeAttribute("onclick");
    forgotBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value.trim();
      if (!email) {
        loginMessage(
          "Enter your email address first, then click Forgot password.",
          "error",
        );
        return;
      }
      const { error } = await window.sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href.split("?")[0],
      });
      if (error) loginMessage(error.message, "error");
      else
        loginMessage(
          "Password reset instructions have been sent to your email address.",
          "success",
        );
    });
  }
});

// Capture phase so this runs before any other submit handler
document.addEventListener(
  "submit",
  async (e) => {
    if (e.target.id !== "loginForm") return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const btn = e.target.querySelector('button[type="submit"]');

    if (btn) btn.disabled = true;

    const { error } = await window.sb.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg =
        error.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : error.message;
      loginMessage(msg, "error");
      if (btn) btn.disabled = false;
      return;
    }

    window.location.href = HOME_PAGE;
  },
  true,
);
