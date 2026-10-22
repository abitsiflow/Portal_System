
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account - Tourist Portal</title>

    <link rel="stylesheet" href="assets/css/lowfi.css">
    <link rel="stylesheet" href="assets/css/register.css">
</head>
<body>

<div class="register-screen">

    <div class="register-container">

        <aside class="register-sidebar">

            <a href="landing-page.php" class="auth-brand">
                <span class="brand-mark">TP</span>
                <span>Tourist Portal</span>
            </a>

            <div class="register-side-content">
                <p class="eyebrow">PHILIPPINE TOURIST PORTAL</p>

                <h2>Begin your next journey with clarity.</h2>

                <p>
                    Join our verified tourist portal to build custom
                    itineraries, discover iconic destinations, and
                    access your verified digital tourist pass.
                </p>

                <div class="feature-list">

                    <div class="feature-item">
                        <span class="feature-icon">01</span>
                        <div>
                            <b>Smart Recommendations</b>
                            <span>
                                Curated suggestions based on your
                                personal pace and budget.
                            </span>
                        </div>
                    </div>

                    <div class="feature-item">
                        <span class="feature-icon">02</span>
                        <div>
                            <b>Interactive Trip Planner</b>
                            <span>
                                Day-by-day scheduling for attractions,
                                dining, and scenic stops.
                            </span>
                        </div>
                    </div>

                    <div class="feature-item">
                        <span class="feature-icon">03</span>
                        <div>
                            <b>Digital Tourist Pass</b>
                            <span>
                                Access your digital identification
                                for attractions and partner stays.
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="sidebar-footnote">
                Verified Traveler Portal · Secured · Official Directory
            </div>

        </aside>

        <main class="register-main">

            <header class="form-header">
                <p class="eyebrow">TOURIST REGISTRATION</p>

                <h1>Create your account</h1>

                <p class="muted">
                    Fill in your traveler profile to get started
                    with the portal.
                </p>
            </header>

            <div id="registerMessage" class="message hidden"
                 role="alert"></div>

            <form id="registerForm" class="auth-form" novalidate>

                <div class="field">
                    <label for="regName">Full name</label>
                    <input
                        type="text"
                        id="regName"
                        name="name"
                        placeholder="Alex Traveler"
                        autocomplete="name"
                        required
                    >
                    <small class="field-error" id="nameError"></small>
                </div>

                <div class="field">
                    <label for="regEmail">Email address</label>
                    <input
                        type="email"
                        id="regEmail"
                        name="email"
                        placeholder="alex@example.com"
                        autocomplete="email"
                        required
                    >
                    <small class="field-error" id="emailError"></small>
                </div>

                <div class="field">
                    <label for="regTravelStyle">
                        Primary travel preference
                    </label>

                    <select id="regTravelStyle" name="travel_style">
                        <option value="balanced">
                            Balanced Pace (Culture &amp; Coast)
                        </option>
                        <option value="relaxed">
                            Relaxed Leisure (Beaches &amp; Waterfront)
                        </option>
                        <option value="active">
                            Active Exploration (Nature &amp; Walking Trails)
                        </option>
                        <option value="cultural">
                            Heritage &amp; Architecture (Historic Quarters)
                        </option>
                    </select>
                </div>

                <div class="two">
                    <div class="field">
                        <label for="regPassword">Password</label>
                        <input
                            type="password"
                            id="regPassword"
                            name="password"
                            placeholder="Create password"
                            autocomplete="new-password"
                            required
                        >
                    </div>

                    <div class="field">
                        <label for="regConfirm">Confirm password</label>
                        <input
                            type="password"
                            id="regConfirm"
                            name="confirm_password"
                            placeholder="Repeat password"
                            autocomplete="new-password"
                            required
                        >
                    </div>
                </div>

                <small class="field-error" id="passwordError"></small>

                <div class="password-meter">
                    <span>Password strength</span>
                    <span id="meterText">Min. 6 characters</span>
                </div>

                <div class="meter-bar">
                    <div id="meterFill" class="meter-fill"></div>
                </div>

                <label class="terms">
                    <input type="checkbox" id="regTerms" required>
                    <span>
                        I agree to the
                        <a href="#" id="termsLink">Terms of Service</a>
                        and Privacy Policy.
                    </span>
                </label>

                <div class="form-actions">
                    <button type="submit" id="submitBtn" class="btn primary full">
                        Create account
                    </button>
                </div>

                <div class="auth-footer">
                    Already have an account?
                    <a href="login.php">Sign in here</a>
                </div>

            </form>

        </main>

    </div>

    <footer class="copyright">
        &copy; 2026 Tourist Portal Subsystem · All Rights Reserved
    </footer>

</div>

<div id="termsModal" class="modal-overlay hidden">
    <div class="modal-card" role="dialog" aria-modal="true"
         aria-labelledby="termsTitle">

        <div class="modal-header">
            <h2 id="termsTitle">Terms of Service &amp; Privacy Policy</h2>
            <button type="button" id="closeTerms" aria-label="Close">
                X
            </button>
        </div>

        <div class="modal-body">
            <p>
                Welcome to the Tourist Portal Subsystem.
                By registering an account, you agree to the following:
            </p>

            <ul>
                <li>Keep your account credentials confidential.</li>
                <li>Destination information should be checked before travel.</li>
                <li>Partner services follow their respective policies.</li>
            </ul>
        </div>

        <div class="modal-footer">
            <button type="button" id="acceptTerms" class="btn">
                Close
            </button>
        </div>

    </div>
</div>

<script src="assets/scripts/register.js"></script>

</body>
</html>
''''''''''''