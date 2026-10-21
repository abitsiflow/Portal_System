<?php
// Handle form submission and redirect directly to home.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header("Location: home.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login &middot; Tourist Portal Subsystem</title>
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/login.css">
</head>
<body>
    <div class="auth-screen">
        <!-- Decorative floating shapes -->
        <div class="bg-shape bg-shape--1"></div>
        <div class="bg-shape bg-shape--2"></div>
        <div class="bg-shape bg-shape--3"></div>

        <main class="auth-card" aria-live="polite">
            <!-- Brand / Logo -->
            <a href="landing-page.php" class="auth-brand" style="text-decoration: none;">
                <svg class="auth-brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                <span class="auth-brand-name">Tourist Portal</span>
            </a>

            <!-- Title -->
            <h1 class="auth-title">Welcome back, traveler</h1>

            <!-- Description -->
            <p class="auth-description">
                Sign in to explore the Tourist Portal Subsystem — your travel discovery and planning workspace.
            </p>

            <!-- Login Form -->
            <form id="loginForm" class="auth-form" action="home.php" method="POST">
                <div class="field">
                    <label for="loginEmail">Email address</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                        <input
                            id="loginEmail"
                            type="email"
                            placeholder="traveler@example.com"
                            autocomplete="email"
                            required
                        />
                    </div>
                </div>

                <div class="field">
                    <label for="loginPassword">Password</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input
                            id="loginPassword"
                            type="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                        />
                        <button type="button" class="toggle-password" onclick="togglePassword()" aria-label="Toggle password visibility">
                            <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg id="eyeOffIcon" class="hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                <line x1="2" x2="22" y1="2" y2="22"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Remember & Forgot row -->
                <div class="auth-options">
                    <label class="remember-me">
                        <input type="checkbox" id="rememberMe" />
                        <span class="checkmark"></span>
                        Remember me
                    </label>
                    <button
                        type="button"
                        class="forgot-link"
                        onclick="showMessage('loginMessage', 'Password reset instructions have been sent to your email address.', 'success')"
                    >
                        Forgot password?
                    </button>
                </div>

                <!-- Message area -->
                <p id="loginMessage" class="auth-message"></p>

                <button class="btn btn-primary" type="submit">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" x2="3" y1="12" y2="12"></line>
                    </svg>
                    Sign in
                </button>
            </form>

            <!-- Divider -->
            <div class="auth-divider">
                <span>or continue with</span>
            </div>

            <!-- Social login -->
            <div class="social-buttons">
                <button type="button" class="btn btn-social" onclick="showMessage('loginMessage', 'Connecting to Google Authentication...', 'success')">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </button>
                <button type="button" class="btn btn-social" onclick="showMessage('loginMessage', 'Connecting to Facebook Authentication...', 'success')">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </button>
            </div>

            <!-- Register link -->
            <div class="auth-footer">
                <p>Don't have an account?
                    <a href="register.php" class="auth-link">Create an account</a>
                </p>
            </div>
        </main>

        <!-- Footer text -->
        <p class="auth-copyright">
            &copy; 2026 Tourist Portal Subsystem &middot; All Rights Reserved
        </p>
    </div>

    <script src="../assets/scripts/login.js"></script>
</body>
</html>