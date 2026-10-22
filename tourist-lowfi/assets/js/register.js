document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const nameInput = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const passwordInput = document.getElementById("regPassword");
  const confirmInput = document.getElementById("regConfirm");
  const termsCheckbox = document.getElementById("regTerms");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  const message = document.getElementById("registerMessage");
  const meterFill = document.getElementById("meterFill");
  const meterText = document.getElementById("meterText");
  const submitBtn = document.getElementById("submitBtn");

  const termsModal = document.getElementById("termsModal");

  function showMessage(text) {
    message.textContent = text;
    message.classList.remove("hidden");
  }

  function clearMessage() {
    message.textContent = "";
    message.classList.add("hidden");
  }

  function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
  }

  function checkPasswordMatch() {
    if (confirmInput.value && passwordInput.value !== confirmInput.value) {
      passwordError.textContent = "Passwords do not match.";
      return false;
    }

    if (passwordError.textContent === "Passwords do not match.") {
      passwordError.textContent = "";
    }

    return true;
  }

  function evaluatePassword(password) {
    if (!password) {
      meterFill.style.width = "0%";
      meterText.textContent = "Min. 6 characters";
      return;
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      meterFill.style.width = "33%";
      meterText.textContent = "Weak";
    } else if (score <= 3) {
      meterFill.style.width = "66%";
      meterText.textContent = "Medium";
    } else {
      meterFill.style.width = "100%";
      meterText.textContent = "Strong";
    }
  }

  passwordInput.addEventListener("input", () => {
    evaluatePassword(passwordInput.value);
    checkPasswordMatch();
  });

  confirmInput.addEventListener("input", checkPasswordMatch);

  [nameInput, emailInput].forEach((input) => {
    input.addEventListener("input", () => {
      clearMessage();

      if (input === nameInput) {
        nameError.textContent = "";
      }

      if (input === emailInput) {
        emailError.textContent = "";
      }
    });
  });

  document.getElementById("termsLink").addEventListener("click", (e) => {
    e.preventDefault();
    termsModal.classList.remove("hidden");
  });

  function closeTerms() {
    termsModal.classList.add("hidden");
  }

  document.getElementById("closeTerms").addEventListener("click", closeTerms);
  document.getElementById("acceptTerms").addEventListener("click", closeTerms);

  termsModal.addEventListener("click", (e) => {
    if (e.target === termsModal) {
      closeTerms();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTerms();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    clearErrors();
    clearMessage();

    let hasError = false;

    if (nameInput.value.trim().length < 2) {
      nameError.textContent = "Please enter your full name.";
      hasError = true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      hasError = true;
    }

    if (passwordInput.value.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters.";
      hasError = true;
    } else if (passwordInput.value !== confirmInput.value) {
      passwordError.textContent = "Passwords do not match.";
      hasError = true;
    }

    if (!termsCheckbox.checked) {
      showMessage("Please agree to the Terms of Service.");
      hasError = true;
    }

    if (hasError) return;

    // Low-fidelity prototype only. No account is actually created.
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    showMessage(
      "Prototype validation successful. No account has been created.",
    );

    submitBtn.disabled = false;
    submitBtn.textContent = "Create account";
  });
});
