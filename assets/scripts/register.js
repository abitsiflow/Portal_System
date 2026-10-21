/**
 * Tourist Portal Subsystem · Register Script
 * Handles real-time validation, password strength checking, and onboarding feedback.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const nameInput = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const passwordInput = document.getElementById("regPassword");
  const confirmInput = document.getElementById("regConfirm");
  const termsCheckbox = document.getElementById("regTerms");

  const meterFill = document.getElementById("meterFill");
  const meterText = document.getElementById("meterText");
  const meterRule = document.getElementById("meterRule");

  // Real-time password strength evaluation
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;
      evaluatePasswordStrength(val, meterFill, meterText, meterRule);
      
      // If confirm field is populated, check match
      if (confirmInput && confirmInput.value) {
        checkPasswordMatch();
      }
    });
  }

  // Real-time confirmation matching
  if (confirmInput) {
    confirmInput.addEventListener("input", checkPasswordMatch);
  }

  // Clear errors on input
  [nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        clearFieldError(input);
      });
    }
  });

  // Handle form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearBannerMessage();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirm = confirmInput.value;
      const termsAccepted = termsCheckbox ? termsCheckbox.checked : true;

      let hasError = false;

      // 1. Validate Name
      if (!name || name.length < 2) {
        setFieldError(nameInput, "nameError", "Please enter your full name.");
        hasError = true;
      }

      // 2. Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email)) {
        setFieldError(emailInput, "emailError", "Please enter a valid email address.");
        hasError = true;
      }

      // 3. Validate Password
      if (!password || password.length < 6) {
        setFieldError(passwordInput, "passwordError", "Password must be at least 6 characters.");
        hasError = true;
      }

      // 4. Validate Passwords Match
      if (password !== confirm) {
        setFieldError(confirmInput, "passwordError", "Passwords do not match.");
        hasError = true;
      }

      // 5. Validate Terms
      if (!termsAccepted) {
        showBannerMessage("Please agree to the Terms of Service to continue.", "error");
        hasError = true;
      }

      if (hasError) return;

      // Process Registration (Simulation for prototype)
      const submitBtn = document.getElementById("submitBtn");
      const originalHtml = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="btn-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Creating account…</span>
      `;

      setTimeout(() => {
        showBannerMessage("Account created successfully! Preparing your traveler dashboard…", "success");

        // Redirect to login or index after a brief delay
        setTimeout(() => {
          window.location.href = "login.php?registered=1";
        }, 1200);
      }, 1000);
    });
  }
});

/* ─── Password Strength Calculator ─── */
function evaluatePasswordStrength(password, fillEl, textEl, ruleEl) {
  if (!fillEl || !textEl) return;

  if (!password) {
    fillEl.className = "meter-fill";
    fillEl.style.width = "0%";
    textEl.textContent = "Password strength";
    if (ruleEl) ruleEl.textContent = "Min. 6 characters";
    return;
  }

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    fillEl.className = "meter-fill weak";
    textEl.textContent = "Weak password";
    textEl.style.color = "var(--coral)";
  } else if (score <= 3) {
    fillEl.className = "meter-fill medium";
    textEl.textContent = "Medium strength";
    textEl.style.color = "#d97706";
  } else {
    fillEl.className = "meter-fill strong";
    textEl.textContent = "Strong password";
    textEl.style.color = "var(--teal)";
  }
}

/* ─── Password Match Checking ─── */
function checkPasswordMatch() {
  const password = document.getElementById("regPassword");
  const confirm = document.getElementById("regConfirm");
  const errorEl = document.getElementById("passwordError");

  if (!password || !confirm) return;

  if (confirm.value && password.value !== confirm.value) {
    confirm.closest(".input-wrapper").classList.add("has-error");
    if (errorEl) {
      errorEl.textContent = "Passwords do not match.";
      errorEl.classList.add("active");
    }
  } else {
    confirm.closest(".input-wrapper").classList.remove("has-error");
    if (errorEl && errorEl.textContent === "Passwords do not match.") {
      errorEl.textContent = "";
      errorEl.classList.remove("active");
    }
  }
}

/* ─── Field Error Utilities ─── */
function setFieldError(inputEl, errorId, message) {
  const wrapper = inputEl.closest(".input-wrapper");
  if (wrapper) wrapper.classList.add("has-error");

  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("active");
  }
}

function clearFieldError(inputEl) {
  const wrapper = inputEl.closest(".input-wrapper");
  if (wrapper) wrapper.classList.remove("has-error");

  // Clear any related active error
  const field = inputEl.closest(".field");
  if (field) {
    const errorEl = field.querySelector(".field-error");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("active");
    }
  }
}

/* ─── Banner Messages ─── */
function showBannerMessage(message, type = "error") {
  const banner = document.getElementById("registerMessage");
  if (!banner) return;

  banner.textContent = message;
  banner.className = `auth-message-banner ${type}`;
  banner.classList.remove("hidden");
}

function clearBannerMessage() {
  const banner = document.getElementById("registerMessage");
  if (banner) {
    banner.textContent = "";
    banner.classList.add("hidden");
  }
}

/* ─── Password Show/Hide Toggle ─── */
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input || !btn) return;

  const eyeOpen = btn.querySelector(".eye-open");
  const eyeClosed = btn.querySelector(".eye-closed");

  if (input.type === "password") {
    input.type = "text";
    if (eyeOpen) eyeOpen.classList.add("hidden");
    if (eyeClosed) eyeClosed.classList.remove("hidden");
  } else {
    input.type = "password";
    if (eyeOpen) eyeOpen.classList.remove("hidden");
    if (eyeClosed) eyeClosed.classList.add("hidden");
  }
}

/* ─── Prototype Terms Modal ─── */
function showTermsModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById("termsModal");
  if (modal) modal.classList.remove("hidden");
}

function closeTermsModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains("modal-close")) return;
  const modal = document.getElementById("termsModal");
  if (modal) modal.classList.add("hidden");
}

