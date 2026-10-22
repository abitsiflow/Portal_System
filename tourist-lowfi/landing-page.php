
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tourist Portal | Low-Fidelity Landing Page</title>

    <link rel="stylesheet" href="assets/css/lowfi.css">
    <link rel="stylesheet" href="assets/css/landing-plain.css">

    <script src="assets/js/landing-lowfi.js" defer></script>
</head>
<body>

<header class="landing-navbar">
    <div class="nav-container">
        <a class="nav-brand" href="landing-page.php">
            <span class="nav-brand-icon" aria-hidden="true">X</span>
            <span>Tourist Portal</span>
            <span class="nav-brand-tag">TRAVEL</span>
        </a>

        <nav class="nav-links" aria-label="Main navigation">
            <a class="nav-link" href="#featuredPairs">Nearby Stays &amp; Spots</a>
            <a class="nav-link" href="#whyProximity">Why Stay Close</a>
            <a class="nav-link" href="hotels.php">Hotels</a>
            <a class="nav-link" href="attractions.php">Attractions</a>
        </nav>

        <div class="nav-auth-actions">
            <a class="btn btn-secondary" href="login.php">Sign in</a>
            <a class="btn btn-primary" href="register.php">Create account</a>
        </div>
    </div>
</header>

<main>
    <!-- HERO -->
    <section class="hero-section">
        <div class="hero-bg-graphic" aria-hidden="true"></div>
        <div class="hero-glow hero-glow-1" aria-hidden="true"></div>
        <div class="hero-glow hero-glow-2" aria-hidden="true"></div>

        <div class="hero-content">
            <span class="hero-eyebrow">
                OFFICIAL TRAVEL DISCOVERY · VERIFIED STAYS &amp; DESTINATIONS
            </span>

            <h1 class="hero-title">
                Stay steps away from the places
                <span>you come to see.</span>
            </h1>

            <p class="hero-subtitle">
                Explore 10 curated pairs of Philippine destinations and nearby
                hotels. Spend less time travelling and more time experiencing
                your destination.
            </p>

            <div class="hero-cta-group">
                <a class="btn btn-primary" href="#featuredPairs">
                    Explore 10 Stays &amp; Spots
                </a>
                <a class="btn btn-secondary" href="register.php">
                    Create Traveler Profile
                </a>
            </div>
        </div>
    </section>

    <!-- SEARCH AND FILTERS -->
    <section class="search-widget-wrapper" aria-label="Search destinations">
        <div class="search-widget">
            <div class="search-bar-row">
                <div class="search-input-group">
                    <span class="search-icon" aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        id="landingSearchInput"
                        placeholder="Search a tourist spot, destination, or hotel..."
                        autocomplete="off"
                    >
                </div>

                <button type="button" class="btn btn-primary" id="findStaysButton">
                    Find Stays
                </button>
            </div>

            <div class="category-filter-bar" aria-label="Filter by category">
                <button type="button" class="filter-pill active" data-filter="all">
                    All Pairs (10)
                </button>
                <button type="button" class="filter-pill" data-filter="heritage">
                    Heritage &amp; History
                </button>
                <button type="button" class="filter-pill" data-filter="beaches">
                    Beaches &amp; Islands
                </button>
                <button type="button" class="filter-pill" data-filter="mountains">
                    Mountain &amp; Escapes
                </button>
                <button type="button" class="filter-pill" data-filter="urban">
                    Urban &amp; Culture
                </button>
                <button type="button" class="filter-pill" data-filter="nature">
                    Nature &amp; Volcanoes
                </button>
            </div>
        </div>
    </section>

    <!-- STATISTICS -->
    <section class="stats-strip" aria-label="Tourist portal highlights">
        <article class="stat-box">
            <div class="stat-icon-wrap" aria-hidden="true">X</div>
            <div class="stat-info">
                <strong>10 Iconic Pairs</strong>
                <span>Tourist spots and nearby stays</span>
            </div>
        </article>

        <article class="stat-box">
            <div class="stat-icon-wrap" aria-hidden="true">X</div>
            <div class="stat-info">
                <strong>Nearby Stays</strong>
                <span>Compare proximity to attractions</span>
            </div>
        </article>

        <article class="stat-box">
            <div class="stat-icon-wrap" aria-hidden="true">X</div>
            <div class="stat-info">
                <strong>Travel Discovery</strong>
                <span>Explore destinations in the Philippines</span>
            </div>
        </article>

        <article class="stat-box">
            <div class="stat-icon-wrap" aria-hidden="true">X</div>
            <div class="stat-info">
                <strong>Digital Tourist Pass</strong>
                <span>Traveler profile and QR pass</span>
            </div>
        </article>
    </section>

    <!-- TOURIST SPOTS AND HOTELS -->
    <section class="main-section" id="featuredPairs">
        <div class="section-header">
            <div>
                <span class="hero-eyebrow">CURATED PROXIMITY RECOMMENDATIONS</span>
                <h2 class="section-title">10 Real Tourist Spots &amp; Nearby Hotels</h2>
                <p class="section-sub">
                    Explore tourist destinations paired with nearby accommodation options.
                </p>
            </div>

            <span class="results-count-badge" id="resultsCounter" aria-live="polite">
                Showing 10 of 10 pairs
            </span>
        </div>

        <div class="pairs-grid" id="pairsGrid">
            <!-- Cards are rendered by landing-lowfi.js -->
        </div>

        <div class="empty-state hidden" id="noResultsState" role="status">
            <div class="empty-state-x" aria-hidden="true">X</div>
            <h3>No matching destinations found</h3>
            <p>Try another search term or choose a different category.</p>
            <button type="button" class="btn btn-secondary" id="clearFiltersButton">
                Clear filters
            </button>
        </div>
    </section>

    <!-- WHY STAY CLOSE -->
    <section class="value-section" id="whyProximity">
        <div class="value-header">
            <span class="hero-eyebrow">SMART TRAVELER ARCHITECTURE</span>
            <h2>Why book accommodations next to attractions?</h2>
            <p class="section-sub">
                Spend less time in transit and more time exploring your destination.
            </p>
        </div>

        <div class="value-grid">
            <article class="value-card">
                <div class="value-icon-box" aria-hidden="true">X</div>
                <h3>Beat Peak Crowd Windows</h3>
                <p>
                    Plan visits to heritage sites and popular attractions around
                    your preferred travel schedule.
                </p>
            </article>

            <article class="value-card">
                <div class="value-icon-box" aria-hidden="true">X</div>
                <h3>Save on Local Commute</h3>
                <p>
                    Compare accommodation locations and find options closer to
                    the places you want to visit.
                </p>
            </article>

            <article class="value-card">
                <div class="value-icon-box" aria-hidden="true">X</div>
                <h3>Effortless Midday Rest</h3>
                <p>
                    Choose a nearby stay where you can take a break between
                    sightseeing activities.
                </p>
            </article>
        </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="cta-banner-section">
        <div class="cta-banner">
            <div class="cta-content">
                <h2>Ready to travel closer to what matters?</h2>
                <p>
                    Create a traveler profile to explore destinations and
                    accommodation options in the Tourist Portal.
                </p>
            </div>

            <div class="cta-buttons">
                <a href="register.php" class="btn btn-cta-light">
                    Create account
                </a>
                <a href="login.php" class="btn btn-cta-outline">
                    Sign in
                </a>
            </div>
        </div>
    </section>
</main>

<!-- DESTINATION DETAILS MODAL -->
<div
    class="landing-modal-overlay hidden"
    id="landingDetailModal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
>
    <div class="landing-modal-card">
        <div class="landing-modal-header">
            <button
                type="button"
                class="landing-modal-close"
                data-close-details
                aria-label="Close details"
            >&times;</button>
            <div class="modal-image-placeholder" aria-hidden="true">X</div>
        </div>

        <div class="landing-modal-body">
            <span class="hero-eyebrow">DESTINATION DETAILS</span>
            <h2 id="modalTitle">Destination and hotel</h2>

            <div class="modal-detail-grid">
                <section class="modal-detail-block">
                    <h3>Tourist spot</h3>
                    <p id="modalSpotName"></p>
                    <p id="modalSpotDesc"></p>
                </section>

                <section class="modal-detail-block">
                    <h3>Nearby hotel</h3>
                    <p id="modalHotelName"></p>
                    <p id="modalHotelDesc"></p>
                </section>
            </div>

            <p><strong>Location:</strong> <span id="modalLocation"></span></p>
            <p><strong>Listed proximity:</strong> <span id="modalDistance"></span></p>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" data-close-details>
                    Close
                </button>
                <button
                    type="button"
                    class="btn btn-primary"
                    id="modalPlanButton"
                >
                    Plan a trip
                </button>
            </div>
        </div>
    </div>
</div>

<!-- GUEST AUTH PROMPT -->
<div
    class="landing-modal-overlay hidden"
    id="authPromptModal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="authPromptHeading"
>
    <div class="landing-modal-card auth-prompt-card">
        <div class="landing-modal-body">
            <button
                type="button"
                class="landing-modal-close auth-modal-close"
                data-close-auth
                aria-label="Close sign-in prompt"
            >&times;</button>

            <div class="modal-image-placeholder auth-placeholder" aria-hidden="true">X</div>
            <h2 id="authPromptHeading">Traveler account required</h2>
            <p id="authPromptText">
                Sign in or create an account to continue.
            </p>

            <div class="modal-actions">
                <a href="login.php" class="btn btn-secondary">Sign in</a>
                <a href="register.php" class="btn btn-primary">Create account</a>
            </div>
        </div>
    </div>
</div>

<!-- FOOTER -->
<footer class="landing-footer">
    <div class="footer-container">
        <div class="footer-top">
            <div class="footer-brand">
                <a class="nav-brand footer-brand-link" href="landing-page.php">
                    <span class="nav-brand-icon" aria-hidden="true">X</span>
                    <span>Tourist Portal</span>
                </a>
                <p>
                    Discover Philippine destinations and explore accommodation
                    options for your next trip.
                </p>
            </div>

            <div class="footer-col">
                <h4>Discover</h4>
                <ul>
                    <li><a href="#featuredPairs">Nearby Stays &amp; Spots</a></li>
                    <li><a href="hotels.php">Hotels</a></li>
                    <li><a href="attractions.php">Attractions</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Traveler</h4>
                <ul>
                    <li><a href="register.php">Create account</a></li>
                    <li><a href="login.php">Sign in</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Explore</h4>
                <ul>
                    <li><a href="#whyProximity">Why Stay Close</a></li>
                    <li><a href="#featuredPairs">Featured pairs</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <span>&copy; 2026 Tourist Portal Subsystem</span>
            <span>Low-fidelity prototype</span>
        </div>
    </div>
</footer>

</body>
</html>
