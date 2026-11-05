/**
 * Profile page — saves name, phone and travel preference
 * to the signed-in user's Supabase metadata.
 */

const PHONE_PATTERN = /^\d{11}$/;

function applyPreference() {
  const select = document.getElementById("profilePreference");
  const pref = window.currentUser?.travelPreference;
  if (select && pref) select.value = pref;
}

async function saveProfile() {
  const name = document.getElementById("profileName").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();
  const preference = document.getElementById("profilePreference").value;

  if (!name) {
    showToast("Please enter your full name.");
    return;
  }

  // Phone is optional, but if filled it must be exactly 11 digits.
  if (phone && !PHONE_PATTERN.test(phone)) {
    showToast("Phone number must be exactly 11 digits.");
    document.getElementById("profilePhone").focus();
    return;
  }

  const btn = document.getElementById("saveProfileBtn");
  btn.disabled = true;
  btn.textContent = "Saving…";

  try {
    const { data, error } = await window.sb.auth.updateUser({
      data: { full_name: name, phone, travel_preference: preference },
    });
    if (error) throw error;

    window.currentUser = buildUserFromSession(data.user);
    applyUserToUi();
    applyPreference();
    showToast("Profile saved successfully.");
  } catch (err) {
    console.error("Profile save error:", err);
    showToast(err.message || "Could not save your profile.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Changes";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const phone = document.getElementById("profilePhone");

  // Digits only, max 11, even when pasting.
  phone.addEventListener("input", () => {
    phone.value = phone.value.replace(/\D/g, "").slice(0, 11);
  });

  document
    .getElementById("saveProfileBtn")
    .addEventListener("click", saveProfile);

  document.addEventListener("userready", applyPreference);
  if (window.currentUser) applyPreference();

  refreshIcons();
});
