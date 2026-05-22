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
    const transferBtn = document.getElementById('transferBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const airtimeBtn = document.getElementById('airtimeBtn');
    const dataBtn = document.getElementById('dataBtn');

    if (transferBtn) {
        transferBtn.addEventListener('click', () => {
            openTransferModal();
        });
    }
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', () => {
            showToast('💸 Withdrawal feature coming soon!');
        });
    }
    if (airtimeBtn) {
        airtimeBtn.addEventListener('click', () => {
            showToast('🎉 Airtime purchase initiated!');
        });
    }
    if (dataBtn) {
        dataBtn.addEventListener('click', () => {
            showToast('📡 Data bundle selected!');
        });
    }

    // Menu Items
    const settingsMenu = document.getElementById('settingsMenu');
    const securityMenu = document.getElementById('securityMenu');
    const supportMenu = document.getElementById('supportMenu');
    const aboutMenu = document.getElementById('aboutMenu');

    if (settingsMenu) settingsMenu.addEventListener('click', () => showToast('⚙️ Settings page opening...'));
    if (securityMenu) securityMenu.addEventListener('click', () => showToast('🔒 Security settings'));
    if (supportMenu) supportMenu.addEventListener('click', () => showToast('💬 Opening help center...'));
    if (aboutMenu) aboutMenu.addEventListener('click', () => showToast('ℹ️ OPay v1.0.0'));

    // Notification Button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showToast('📲 No new notifications');
        });
    }

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

// ==================== TRANSFER MODAL ====================

function openTransferModal() {
    const modal = document.createElement('div');
    modal.id = 'transferModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 350px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        ">
            <h2 style="margin-bottom: 20px; font-size: 20px;">Transfer Money</h2>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Recipient Account</label>
                <input type="text" id="recipientAccount" placeholder="Enter account number" style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-size: 14px;
                ">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Recipient Name</label>
                <input type="text" id="recipientName" placeholder="Enter recipient name" style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-size: 14px;
                ">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Amount (₦)</label>
                <input type="number" id="transferAmount" placeholder="0.00" style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-size: 14px;
                ">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Narration (Optional)</label>
                <textarea id="transferNote" placeholder="What is this transfer for?" style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-size: 14px;
                    resize: vertical;
                    font-family: inherit;
                "></textarea>
            </div>

            <div style="display: flex; gap: 10px;">
                <button onclick="closeTransferModal()" style="
                    flex: 1;
                    padding: 12px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                ">Cancel</button>
                <button onclick="processTransfer()" style="
                    flex: 1;
                    padding: 12px;
                    background: linear-gradient(135deg, #00d4aa 0%, #0099cc 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                ">Transfer</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTransferModal();
        }
    });
}

function closeTransferModal() {
    const modal = document.getElementById('transferModal');
    if (modal) {
        modal.remove();
    }
}

function processTransfer() {
    const recipientAccount = document.getElementById('recipientAccount').value.trim();
    const recipientName = document.getElementById('recipientName').value.trim();
    const transferAmount = parseFloat(document.getElementById('transferAmount').value);
    const transferNote = document.getElementById('transferNote').value.trim();

    // Validation
    if (!recipientAccount) {
        showToast('❌ Please enter recipient account', 'error');
        return;
    }
    if (!recipientName) {
        showToast('❌ Please enter recipient name', 'error');
        return;
    }
    if (!transferAmount || transferAmount <= 0) {
        showToast('❌ Please enter a valid amount', 'error');
        return;
    }
    if (transferAmount > appState.balance) {
        showToast('❌ Insufficient balance', 'error');
        return;
    }

    // Process transfer
    appState.balance -= transferAmount;
    if (appState.balanceVisible) {
        balanceAmount.textContent = `₦${appState.balance.toFixed(2)}`;
    }

    // Show success
    closeTransferModal();
    showToast(`✅ Transfer of ₦${transferAmount.toFixed(2)} to ${recipientName} successful!`, 'success');

    // Add transaction
    addTransactionHistory(`Transfer to ${recipientName}`, `-₦${transferAmount.toFixed(2)}`);
}

function addTransactionHistory(description, amount) {
    const transactionsSection = document.querySelector('.section');
    if (!transactionsSection) return;

    const newTransaction = document.createElement('div');
    newTransaction.className = 'transaction-item';
    newTransaction.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 14px;
        animation: slideInUp 0.3s ease-out;
    `;
    newTransaction.innerHTML = `
        <span>${description}</span>
        <span class="amount" style="font-weight: 600; color: #ff6b6b;">${amount}</span>
    `;

    const firstTransaction = transactionsSection.querySelector('.transaction-item');
    if (firstTransaction) {
        firstTransaction.parentNode.insertBefore(newTransaction, firstTransaction);
    }
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
        toggleBalance.textContent = '👁️';
    } else {
        balanceAmount.textContent = '••••••';
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
            navigateNextPage();
        } else {
            navigatePreviousPage();
        }
    }
}

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
}

// ==================== CONSOLE WELCOME ====================

console.log('%c🚀 OPay Mobile App', 'color: #00d4aa; font-size: 20px; font-weight: bold;');
console.log('%cTransfer feature is now working!', 'color: #00d4aa; font-size: 12px;');
console.log('%cTry: Arrow keys to navigate, Swipe on mobile', 'color: #f59e0b; font-size: 12px;');
