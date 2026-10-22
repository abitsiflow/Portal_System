document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("loginPassword");
  const togglePassword = document.getElementById("togglePassword");
  const loginMessage = document.getElementById("loginMessage");
  const forgotPassword = document.getElementById("forgotPassword");

  // Display a prototype message
  function showMessage(text) {
    loginMessage.textContent = text;
    loginMessage.classList.add("visible");
  }

  // Clear the previous message
  function clearMessage() {
    loginMessage.textContent = "";
    loginMessage.classList.remove("visible");
  }

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";

    togglePassword.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password",
    );
  });

  // Forgot password placeholder
  forgotPassword.addEventListener("click", () => {
    showMessage(
      "Password reset is not connected in this low-fidelity prototype.",
    );
  });

  // Google and Facebook placeholders
  document.querySelectorAll("[data-provider]").forEach((button) => {
    button.addEventListener("click", () => {
      const provider = button.dataset.provider;

      showMessage(`${provider} sign-in is not connected in this prototype.`);
    });
  });

  // Prototype form submission
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const email = document.getElementById("loginEmail").value.trim();
    const password = passwordInput.value;

    if (!email) {
      showMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      showMessage("Please enter your password.");
      return;
    }

    showMessage("Prototype only: authentication is not connected. Redirecting...");
    setTimeout(() => { window.location.href = 'home-lowfid.php'; }, 500);
  });
});
