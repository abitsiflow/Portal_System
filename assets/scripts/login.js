/* ─── Login Form Handler ─── */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  // Check URL query parameters for registration status
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("registered") === "1") {
    showMessage(
      "loginMessage",
      "Account registered successfully! You can now log in.",
      "success"
    );
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      // Clear previous messages
      clearMessage("loginMessage");

      // Basic validation
      if (!email) {
        showMessage("loginMessage", "Please enter your email address.", "error");
        return;
      }

      if (!email.includes("@")) {
        showMessage(
          "loginMessage",
          "Enter a valid email address to continue.",
          "error"
        );
        return;
      }

      if (!password) {
        showMessage("loginMessage", "Please enter your password.", "error");
        return;
      }

      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg class="btn-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          Signing in…
        `;
        submitBtn.disabled = true;
      }

      showMessage(
        "loginMessage",
        "Login successful! Opening your traveler portal…",
        "success"
      );

      // Immediately navigate to home.php
      setTimeout(() => {
        window.location.href = "/public/home.html";
      }, 250);
    });
  }
});

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

