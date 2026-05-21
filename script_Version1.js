// ==================== STATE MANAGEMENT ====================

const appState = {
    isLoggedIn: false,
    userName: 'User',
    balance: 20218.98,
    balanceVisible: true,
    currentPage: 'loginPage'
};

// ==================== DOM ELEMENTS ====================

const loginPage = document.getElementById('loginPage');
const homePage = document.getElementById('homePage');
const cardsPage = document.getElementById('cardsPage');
const rewardsPage = document.getElementById('rewardsPage');
const profilePage = document.getElementById('profilePage');

const pinInput = document.getElementById('pinInput');
const togglePin = document.getElementById('togglePin');
const loginBtn = document.getElementById('loginBtn');

const toggleBalance = document.getElementById('toggleBalance');
const balanceAmount = document.getElementById('balanceAmount');
const availableAmount = document.getElementById('availableAmount');
const userName = document.getElementById('userName');

const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeApp();
});

function initializeApp() {
    // Focus on PIN input
    pinInput.focus();
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    // Login Events
    loginBtn.addEventListener('click', handleLogin);
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    togglePin.addEventListener('click', togglePINVisibility);
    
    // Input validation
    pinInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    });

    // Balance Events
    toggleBalance.addEventListener('click', toggleBalanceVisibility);

    // Navigation Events
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Quick Action Buttons
    document.getElementById('transferBtn').addEventListener('click', () => {
        showToast('Transfer feature coming soon!');
    });
    document.getElementById('withdrawBtn').addEventListener('click', () => {
        showToast('Withdrawal feature coming soon!');
    });
    document.getElementById('airtimeBtn').addEventListener('click', () => {
        showToast('🎉 Airtime purchase initiated!');
    });
    document.getElementById('dataBtn').addEventListener('click', () => {
        showToast('📡 Data bundle selected!');
    });

    // Menu Items
    document.getElementById('settingsMenu').addEventListener('click', () => {
        showToast('Settings page opening...');
    });
    document.getElementById('securityMenu').addEventListener('click', () => {
        showToast('🔒 Security settings');
    });
    document.getElementById('supportMenu').addEventListener('click', () => {
        showToast('💬 Opening help center...');
    });
    document.getElementById('aboutMenu').addEventListener('click', () => {
        showToast('ℹ️ OPay v1.0.0');
    });

    // Notification Button
    document.getElementById('notificationBtn').addEventListener('click', () => {
        showToast('📲 No new notifications');
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!appState.isLoggedIn) return;
        
        if (e.key === 'ArrowLeft') navigatePreviousPage();
        if (e.key === 'ArrowRight') navigateNextPage();
    });

    // Reward offers
    document.querySelectorAll('.btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('✅ Reward claimed successfully!');
        });
    });
}

// ==================== LOGIN HANDLERS ====================

function handleLogin() {
    const pin = pinInput.value.trim();

    if (!pin) {
        showToast('Please enter your PIN', 'error');
        return;
    }

    if (pin.length !== 6) {
        showToast('PIN must be 6 digits', 'error');
        return;
    }

    if (!/^\d+$/.test(pin)) {
        showToast('PIN must contain only numbers', 'error');
        return;
    }

    // Simulate login
    simulateLogin();
}

function simulateLogin() {
    appState.isLoggedIn = true;
    
    // Generate random username
    const firstNames = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    appState.userName = `${firstName} ${lastName}`;
    userName.textContent = appState.userName;

    // Transition to home
    setTimeout(() => {
        loginPage.classList.remove('active');
        homePage.classList.add('active');
        appState.currentPage = 'homePage';
        showToast(`Welcome, ${appState.userName}! 👋`);
    }, 300);
}

function togglePINVisibility() {
    const isPassword = pinInput.type === 'password';
    pinInput.type = isPassword ? 'text' : 'password';
    togglePin.textContent = isPassword ? '🙈' : '👁️';
}

// ==================== BALANCE HANDLERS ====================

function toggleBalanceVisibility() {
    appState.balanceVisible = !appState.balanceVisible;
    
    if (appState.balanceVisible) {
        balanceAmount.textContent = `₦${appState.balance.toFixed(2)}`;
        availableAmount.textContent = `₦${appState.balance.toFixed(2)}`;
        toggleBalance.textContent = '👁️';
    } else {
        balanceAmount.textContent = '••••••';
        availableAmount.textContent = '••••••';
        toggleBalance.textContent = '👁️‍🗨️';
    }
}

// ==================== NAVIGATION HANDLERS ====================

function handleNavigation(e) {
    if (!appState.isLoggedIn) return;

    const targetPage = e.currentTarget.getAttribute('data-page');
    navigateToPage(targetPage);
}

function navigateToPage(pageName) {
    if (!appState.isLoggedIn) return;

    // Remove active state from all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active', 'prev');
    });

    // Remove active state from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Set active page
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
        appState.currentPage = pageName;

        // Set active nav item
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    }
}

function navigateNextPage() {
    const pages = ['homePage', 'cardsPage', 'rewardsPage', 'profilePage'];
    const currentIndex = pages.indexOf(appState.currentPage);
    const nextIndex = (currentIndex + 1) % pages.length;
    navigateToPage(pages[nextIndex]);
}

function navigatePreviousPage() {
    const pages = ['homePage', 'cardsPage', 'rewardsPage', 'profilePage'];
    const currentIndex = pages.indexOf(appState.currentPage);
    const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
    navigateToPage(pages[prevIndex]);
}

// ==================== LOGOUT HANDLER ====================

function handleLogout() {
    if (!confirm('Are you sure you want to log out?')) {
        return;
    }

    appState.isLoggedIn = false;
    appState.currentPage = 'loginPage';

    // Reset UI
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    loginPage.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Clear PIN input
    pinInput.value = '';
    pinInput.type = 'password';
    togglePin.textContent = '👁️';
    pinInput.focus();

    showToast('Logged out successfully 👋');
}

// ==================== TOAST NOTIFICATION ====================

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'success') {
        toast.classList.add('success');
    } else if (type === 'error') {
        toast.classList.add('error');
    }

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== INTERACTION ANIMATIONS ====================

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Visual feedback already handled by CSS :active
        const rect = this.getBoundingClientRect();
        
        // Add subtle feedback
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Add transaction animation
const transactionItems = document.querySelectorAll('.transaction-item');
transactionItems.forEach((item, index) => {
    item.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s forwards`;
    item.style.opacity = '0';
});

// ==================== SWIPE NAVIGATION ====================

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (!appState.isLoggedIn) return;

    const swipeThreshold = 50;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swiped left - go to next page
            navigateNextPage();
        } else {
            // Swiped right - go to previous page
            navigatePreviousPage();
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Simulate real-time updates
function simulateRealTimeUpdates() {
    if (!appState.isLoggedIn) return;

    // Random balance fluctuation (for demo)
    const randomChange = (Math.random() - 0.5) * 100;
    appState.balance += randomChange;
    
    if (appState.balanceVisible) {
        balanceAmount.textContent = `₦${appState.balance.toFixed(2)}`;
        availableAmount.textContent = `₦${appState.balance.toFixed(2)}`;
    }
}

// Update time periodically
function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    // Could be used to update a time display if added
    return time;
}

// ==================== ACCESSIBILITY ====================

// Improve keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ==================== EASTER EGG ====================

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    showToast('🌈 You found the Easter egg! Congratulations! 🎉');
    document.body.style.animation = 'rainbow 3s ease-in-out';
}

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ==================== PERFORMANCE OPTIMIZATION ====================

// Lazy load images if needed
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== PAGE VISIBILITY ====================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // App backgrounded
        console.log('App backgrounded');
    } else {
        // App resumed
        if (appState.isLoggedIn) {
            showToast('Welcome back! 👋');
        }
    }
});

// ==================== CONSOLE WELCOME ====================

console.log('%c🚀 OPay Mobile App', 'color: #00d4aa; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to OPay! Try the Konami code: ↑↑↓↓←→←→BA', 'color: #00d4aa; font-size: 12px;');
console.log('%cDev Tip: Use arrow keys to navigate pages once logged in', 'color: #f59e0b; font-size: 12px;');