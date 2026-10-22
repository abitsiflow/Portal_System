    </div><!-- .content-shell -->

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-bottom-nav">
        <a href="dashboard.php" class="mobile-nav-btn <?= ($activePage ?? '') === 'home' ? 'active' : '' ?>">
            <span>⌂</span><span>Home</span>
        </a>
        <a href="explore.php" class="mobile-nav-btn <?= ($activePage ?? '') === 'explore' ? 'active' : '' ?>">
            <span>🗺</span><span>Explore</span>
        </a>
        <a href="my-trips.php" class="mobile-nav-btn <?= ($activePage ?? '') === 'trips' ? 'active' : '' ?>">
            <span>💼</span><span>Trips</span>
        </a>
        <a href="tourist-pass.php" class="mobile-nav-btn <?= ($activePage ?? '') === 'qr' ? 'active' : '' ?>">
            <span>▣</span><span>Passes</span>
        </a>
        <a href="profile.php" class="mobile-nav-btn <?= ($activePage ?? '') === 'profile' ? 'active' : '' ?>">
            <span>◉</span><span>Profile</span>
        </a>
    </nav>
</div><!-- .app-shell -->

<!-- Toast -->
<div id="appToast" class="toast-notice hidden"></div>

<?php if (isset($pageJS)): ?>
<script src="<?= $pageJS ?>"></script>
<?php endif; ?>

<script>
function showToast(msg) {
    const t = document.getElementById('appToast');
    if (t) { t.textContent = msg; t.classList.remove('hidden'); setTimeout(() => t.classList.add('hidden'), 2800); }
}
</script>
</body>
</html>
