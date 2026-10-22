<!-- Sidebar Navigation -->
<aside class="sidebar">
    <div class="brand-section">
        <h1>Tourist Portal</h1>
        <div class="brand-subtitle">Low-Fidelity Wireframe</div>
    </div>

    <nav class="sidebar-nav">
        <a href="dashboard.php" class="nav-item-btn <?= ($activePage ?? '') === 'home' ? 'active' : '' ?>">
            <span class="nav-icon">⌂</span> Home
        </a>
        <a href="explore.php" class="nav-item-btn <?= ($activePage ?? '') === 'explore' ? 'active' : '' ?>">
            <span class="nav-icon">🗺</span> Explore
        </a>
        <a href="trip-planner.php" class="nav-item-btn <?= ($activePage ?? '') === 'planner' ? 'active' : '' ?>">
            <span class="nav-icon">📅</span> Trip Planner
        </a>
        <a href="my-trips.php" class="nav-item-btn <?= ($activePage ?? '') === 'trips' ? 'active' : '' ?>">
            <span class="nav-icon">💼</span> My Trips
        </a>
        <a href="explore.php?view=favorites" class="nav-item-btn <?= ($activePage ?? '') === 'favorites' ? 'active' : '' ?>">
            <span class="nav-icon">♥</span> Favorites
        </a>
        <a href="tourist-pass.php" class="nav-item-btn <?= ($activePage ?? '') === 'qr' ? 'active' : '' ?>">
            <span class="nav-icon">▣</span> QR Tourist Pass
        </a>
        <a href="profile.php" class="nav-item-btn <?= ($activePage ?? '') === 'profile' ? 'active' : '' ?>">
            <span class="nav-icon">◉</span> Profile
        </a>
    </nav>

    <div class="sidebar-footer">
        <div class="digital-id-chip">Digital ID: TP-PH-2026-8842</div>
        <a href="landing-page.php" class="logout-btn">
            <span>↪</span> Sign Out
        </a>
    </div>
</aside>
