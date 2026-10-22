
<?php
/*
 * Tourist Portal Subsystem
 * Login Low-Fidelity Prototype
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login Low-Fidelity | Tourist Portal</title>

    <link rel="stylesheet" href="/tourist-lowfi/assets/css/login-lowfid.css">
</head>
<body>

    <main class="auth-screen">


        <section class="auth-card">

            <!-- Brand -->
            <a href="landing-page.php" class="auth-brand">
                <span class="brand-mark">◎</span>
                <span class="auth-brand-name">Tourist Portal</span>
            </a>

            <!-- Heading -->
            <h1 class="auth-title">
                Welcome back, traveler
            </h1>

            <p class="auth-description">
                Sign in to explore the Tourist Portal Subsystem —
                your travel discovery and planning workspace.
            </p>

            <!-- Login Form -->
            <form id="loginForm" class="auth-form" method="POST" action="home-lowfid.php">

                <div class="field">
                    <label for="loginEmail">Email address</label>

                    <div class="input-wrapper">
                        <input
                            id="loginEmail"
                            name="email"
                            type="email"
                            placeholder="traveler@example.com"
                            autocomplete="email"
                            required
                        >

                        <span class="input-symbol"></span>
                    </div>
                </div>

                <div class="field">
                    <label for="loginPassword">Password</label>

                    <div class="input-wrapper">
                        <input
                            id="loginPassword"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                        >

                        <button
                            type="button"
                            class="toggle-password"
                            id="togglePassword"
                            aria-label="Show password"
                        >
                            Show
                        </button>
                    </div>
                </div>

                <!-- Remember and Forgot Password -->
                <div class="auth-options">

                    <label class="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="remember"
                        >
                        <span>Remember me</span>
                    </label>

                    <button
                        type="button"
                        class="text-button"
                        id="forgotPassword"
                    >
                        Forgot password?
                    </button>

                </div>

                <!-- Message -->
                <p
                    class="auth-message"
                    id="loginMessage"
                    role="status"
                    aria-live="polite"
                ></p>

                <!-- Sign In -->
                <button
                    class="btn btn-primary"
                    type="submit"
                >
                    → Sign in
                </button>

            </form>

            <!-- Social Login -->
            <div class="auth-divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <div class="social-buttons">

                <button
                    type="button"
                    class="btn btn-social"
                    data-provider="Google"
                >
                    G &nbsp; Google
                </button>

                <button
                    type="button"
                    class="btn btn-social"
                    data-provider="Facebook"
                >
                    f &nbsp; Facebook
                </button>

            </div>

            <!-- Register Link -->
            <div class="auth-footer">
                <p>Don't have an account?</p>

                <a href="register.php" class="auth-link">
                    Create an account
                </a>
            </div>

        </section>

        <!-- Footer -->
        <p class="auth-copyright">
            © 2026 Tourist Portal Subsystem · All Rights Reserved
        </p>

    </main>

    <script src="login-lowfid.js"></script>
</body>
</html>
