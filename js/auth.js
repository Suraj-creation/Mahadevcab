/* =============================================
   BS TRAVEL DELHI CABS — Google OAuth Authentication
   ============================================= */

const AUTH_CONFIG = {
    clientId: '370035796364-2f2klhpiesl0d3emg3kvdsrv484adsm.apps.googleusercontent.com',
    storageKey: 'bstravel_user'
};

const AuthManager = {

    user: null,

    // ────────────── INITIALIZE ──────────────
    init() {
        // Check for saved session
        this.restoreSession();

        // Wait for Google Identity Services to load
        if (typeof google !== 'undefined' && google.accounts) {
            this.setupGoogleSignIn();
        } else {
            // Retry when GIS loads
            window.addEventListener('load', () => {
                const checkGIS = setInterval(() => {
                    if (typeof google !== 'undefined' && google.accounts) {
                        clearInterval(checkGIS);
                        this.setupGoogleSignIn();
                    }
                }, 200);
                // Stop checking after 10 seconds
                setTimeout(() => clearInterval(checkGIS), 10000);
            });
        }

        // Bind UI events
        this.bindEvents();
    },

    // ────────────── GOOGLE SIGN-IN SETUP ──────────────
    setupGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: AUTH_CONFIG.clientId,
            callback: (response) => this.handleCredentialResponse(response),
            auto_select: false,
            cancel_on_tap_outside: true
        });

        // Attach click handler to custom button
        const signInBtn = document.getElementById('googleSignInBtn');
        if (signInBtn) {
            signInBtn.addEventListener('click', () => {
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // Fallback: use popup flow
                        this.signInWithPopup();
                    }
                });
            });
        }
    },

    // ────────────── POPUP FALLBACK ──────────────
    signInWithPopup() {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: AUTH_CONFIG.clientId,
            scope: 'openid email profile',
            callback: (tokenResponse) => {
                if (tokenResponse.access_token) {
                    this.fetchUserInfo(tokenResponse.access_token);
                }
            }
        });
        client.requestAccessToken();
    },

    // ────────────── FETCH USER INFO (popup flow) ──────────────
    async fetchUserInfo(accessToken) {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userInfo = await response.json();

            const userData = {
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                given_name: userInfo.given_name || userInfo.name.split(' ')[0]
            };

            this.onSignIn(userData);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    },

    // ────────────── HANDLE JWT CREDENTIAL (One Tap / button flow) ──────────────
    handleCredentialResponse(response) {
        try {
            const payload = this.decodeJWT(response.credential);
            const userData = {
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                given_name: payload.given_name || payload.name.split(' ')[0]
            };
            this.onSignIn(userData);
        } catch (error) {
            console.error('Failed to decode credential:', error);
        }
    },

    // ────────────── DECODE JWT ──────────────
    decodeJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    },

    // ────────────── SIGN IN SUCCESS ──────────────
    onSignIn(userData) {
        this.user = userData;
        this.saveSession(userData);
        this.updateUI(true);
        this.prefillBookingForm(userData);
        this.showWelcomeToast(userData.given_name);
    },

    // ────────────── SIGN OUT ──────────────
    signOut() {
        this.user = null;
        localStorage.removeItem(AUTH_CONFIG.storageKey);

        // Revoke Google session
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }

        this.updateUI(false);
        this.showToast('Signed out successfully', 'info');
    },

    // ────────────── SESSION PERSISTENCE ──────────────
    saveSession(userData) {
        try {
            localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify({
                ...userData,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save session:', e);
        }
    },

    restoreSession() {
        try {
            const saved = localStorage.getItem(AUTH_CONFIG.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                // Session expires after 24 hours
                const ONE_DAY = 24 * 60 * 60 * 1000;
                if (Date.now() - data.timestamp < ONE_DAY) {
                    this.user = data;
                    this.updateUI(true);
                    this.prefillBookingForm(data);
                } else {
                    localStorage.removeItem(AUTH_CONFIG.storageKey);
                }
            }
        } catch (e) {
            localStorage.removeItem(AUTH_CONFIG.storageKey);
        }
    },

    // ────────────── UPDATE UI ──────────────
    updateUI(isLoggedIn) {
        const signInBtn = document.getElementById('googleSignInBtn');
        const profileEl = document.getElementById('authProfile');
        const avatarImg = document.getElementById('authAvatar');
        const dropdownAvatar = document.getElementById('authDropdownAvatar');
        const nameEl = document.getElementById('authName');
        const emailEl = document.getElementById('authEmail');

        if (isLoggedIn && this.user) {
            // Hide sign-in, show profile
            if (signInBtn) signInBtn.style.display = 'none';
            if (profileEl) profileEl.style.display = 'flex';

            // Populate user info
            if (avatarImg) avatarImg.src = this.user.picture || '';
            if (dropdownAvatar) dropdownAvatar.src = this.user.picture || '';
            if (nameEl) nameEl.textContent = this.user.name || '';
            if (emailEl) emailEl.textContent = this.user.email || '';

            // Update hero greeting if exists
            this.updateHeroGreeting();
        } else {
            // Show sign-in, hide profile
            if (signInBtn) signInBtn.style.display = 'flex';
            if (profileEl) profileEl.style.display = 'none';
        }
    },

    // ────────────── HERO GREETING ──────────────
    updateHeroGreeting() {
        const subtitle = document.querySelector('.hero__subtitle');
        if (subtitle && this.user) {
            const greeting = this.getTimeGreeting();
            subtitle.innerHTML = `${greeting}, <strong>${this.user.given_name}</strong>! <span class="hero__dot">•</span> Ready for your next ride?`;
        }
    },

    getTimeGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    },

    // ────────────── PRE-FILL BOOKING FORM ──────────────
    prefillBookingForm(userData) {
        // Add user name field if not already present
        const bookingForm = document.getElementById('bookingForm');
        if (!bookingForm) return;

        let nameField = document.getElementById('bookingUserName');
        let emailField = document.getElementById('bookingUserEmail');

        // If name/email fields exist in the form, fill them
        if (nameField) nameField.value = userData.name || '';
        if (emailField) emailField.value = userData.email || '';
    },

    // ────────────── TOAST NOTIFICATIONS ──────────────
    showWelcomeToast(name) {
        this.showToast(`Welcome, ${name}! 👋`, 'success');
    },

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existing = document.querySelector('.auth-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `auth-toast auth-toast--${type}`;
        toast.innerHTML = `
            <div class="auth-toast__content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => toast.classList.add('auth-toast--visible'));

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('auth-toast--visible');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    },

    // ────────────── BIND UI EVENTS ──────────────
    bindEvents() {
        // Profile dropdown toggle
        const avatarBtn = document.getElementById('authAvatarBtn');
        const dropdown = document.getElementById('authDropdown');

        if (avatarBtn && dropdown) {
            avatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('auth__dropdown--open');
            });

            // Close dropdown on outside click
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
                    dropdown.classList.remove('auth__dropdown--open');
                }
            });
        }

        // Sign out button
        const signOutBtn = document.getElementById('authSignOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                dropdown?.classList.remove('auth__dropdown--open');
                this.signOut();
            });
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});
