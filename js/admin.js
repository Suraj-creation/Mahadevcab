/* ============================================
   ADMIN PORTAL - JavaScript
   ============================================ */

// Configuration
const GOOGLE_CLIENT_ID = ''; // Will be set from server or manually
const API_BASE = '/api';

// State
let currentAdmin = null;
let packages = [];
let editingPackageId = null;
let deletePackageId = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginError = document.getElementById('loginError');
const loginErrorText = document.getElementById('loginErrorText');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check for stored admin session
    const storedAdmin = localStorage.getItem('adminSession');
    if (storedAdmin) {
        try {
            currentAdmin = JSON.parse(storedAdmin);
            verifyAdminAccess(currentAdmin);
        } catch (e) {
            localStorage.removeItem('adminSession');
            initGoogleSignIn();
        }
    } else {
        initGoogleSignIn();
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize Google Sign-In
function initGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID || '370035796364-2f2klhpiesel0d3emg3kvdsrv484adsm.apps.googleusercontent.com',
        callback: handleGoogleSignIn
    });
    
    google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { 
            theme: 'outline', 
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 280
        }
    );
}

// Handle Google Sign-In Response
async function handleGoogleSignIn(response) {
    try {
        // Decode JWT token
        const payload = parseJwt(response.credential);
        
        const adminData = {
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
        
        // Verify with server
        await verifyAdminAccess(adminData);
        
    } catch (error) {
        showLoginError(error.message || 'Sign-in failed. Please try again.');
    }
}

// Verify admin access with server
async function verifyAdminAccess(adminData) {
    try {
        const response = await fetch(`${API_BASE}/admin/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminData)
        });
        
        const result = await response.json();
        
        if (result.success && result.isAdmin) {
            currentAdmin = result.admin;
            localStorage.setItem('adminSession', JSON.stringify(currentAdmin));
            showDashboard();
        } else {
            localStorage.removeItem('adminSession');
            showLoginError(result.error || 'Access denied. You are not authorized as an admin.');
            initGoogleSignIn();
        }
    } catch (error) {
        localStorage.removeItem('adminSession');
        showLoginError('Unable to verify admin access. Please try again.');
        initGoogleSignIn();
    }
}

// Parse JWT Token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Show Login Error
function showLoginError(message) {
    loginError.style.display = 'flex';
    loginErrorText.textContent = message;
}

// Show Dashboard
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'flex';
    
    // Update admin info
    document.getElementById('adminAvatar').src = currentAdmin.picture || 'https://via.placeholder.com/40';
    document.getElementById('adminName').textContent = currentAdmin.name || 'Admin';
    document.getElementById('adminEmail').textContent = currentAdmin.email;
    
    // Load packages
    loadPackages();
}

// Logout
function logout() {
    localStorage.removeItem('adminSession');
    currentAdmin = null;
    google.accounts.id.disableAutoSelect();
    window.location.reload();
}

// Setup Event Listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
    // Add package button
    document.getElementById('addPackageBtn').addEventListener('click', () => openPackageModal());
    
    // Modal close buttons
    document.getElementById('modalClose').addEventListener('click', closePackageModal);
    document.getElementById('modalOverlay').addEventListener('click', closePackageModal);
    document.getElementById('cancelBtn').addEventListener('click', closePackageModal);
    
    // Delete modal
    document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteModalOverlay').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Package form submit
    document.getElementById('packageForm').addEventListener('submit', handlePackageSubmit);
    
    // Add itinerary button
    document.getElementById('addItineraryBtn').addEventListener('click', addItineraryItem);
    
    // Generate image name
    document.getElementById('generateImageName').addEventListener('click', generateImageName);
    
    // Image name preview
    document.getElementById('imageName').addEventListener('input', updateImagePreview);
    
    // Status filter
    document.getElementById('statusFilter').addEventListener('change', filterPackages);
}

// ============================================
// PACKAGES CRUD
// ============================================

// Load Packages
async function loadPackages() {
    const packagesList = document.getElementById('packagesList');
    packagesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><span>Loading packages...</span></div>';
    
    try {
        const response = await fetch(`${API_BASE}/packages/all`);
        const result = await response.json();
        
        if (result.success) {
            packages = result.packages;
            updateStats();
            renderPackages();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        packagesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error loading packages</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadPackages()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Update Stats
function updateStats() {
    const total = packages.length;
    const active = packages.filter(p => p.isActive).length;
    const inactive = total - active;
    
    document.getElementById('totalPackages').textContent = total;
    document.getElementById('activePackages').textContent = active;
    document.getElementById('inactivePackages').textContent = inactive;
}

// Render Packages
function renderPackages(filteredPackages = null) {
    const packagesList = document.getElementById('packagesList');
    const displayPackages = filteredPackages || packages;
    
    if (displayPackages.length === 0) {
        packagesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No packages found</h3>
                <p>Click "Add New Package" to create your first tour package.</p>
            </div>
        `;
        return;
    }
    
    packagesList.innerHTML = displayPackages.map(pkg => `
        <div class="package-card ${pkg.isActive ? '' : 'inactive'}">
            <img src="assets/images/${pkg.imageName}" alt="${pkg.imageAlt || pkg.title}" class="package-image" 
                 onerror="this.src='https://via.placeholder.com/80x60?text=No+Image'">
            
            <div class="package-info">
                <div class="package-title">
                    ${pkg.title}
                    ${pkg.badge ? `<span class="package-badge ${pkg.badgeType}">${pkg.badge}</span>` : ''}
                </div>
                <div class="package-subtitle">${pkg.subtitle}</div>
                <div class="package-meta">
                    ${pkg.monuments ? `<span><i class="fas fa-landmark"></i> ${pkg.monuments} Monuments</span>` : ''}
                    ${pkg.duration ? `<span><i class="fas fa-clock"></i> ${pkg.duration}</span>` : ''}
                    ${pkg.itinerary?.length ? `<span><i class="fas fa-route"></i> ${pkg.itinerary.length} Stops</span>` : ''}
                </div>
            </div>
            
            <div class="package-price">
                ${pkg.priceOriginal !== pkg.priceDiscounted ? 
                    `<span class="price-original">₹${pkg.priceOriginal.toLocaleString()}</span>` : ''}
                <span class="price-discounted">₹${pkg.priceDiscounted.toLocaleString()}</span>
            </div>
            
            <div class="package-status">
                <span class="status-badge ${pkg.isActive ? 'active' : 'inactive'}">
                    ${pkg.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            
            <div class="package-actions">
                <button class="action-btn edit" title="Edit" onclick="editPackage('${pkg._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn toggle" title="${pkg.isActive ? 'Deactivate' : 'Activate'}" onclick="togglePackage('${pkg._id}')">
                    <i class="fas fa-${pkg.isActive ? 'eye-slash' : 'eye'}"></i>
                </button>
                <button class="action-btn delete" title="Delete" onclick="deletePackage('${pkg._id}', '${pkg.title.replace(/'/g, "\\'")}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Packages
function filterPackages() {
    const filter = document.getElementById('statusFilter').value;
    
    let filtered;
    if (filter === 'active') {
        filtered = packages.filter(p => p.isActive);
    } else if (filter === 'inactive') {
        filtered = packages.filter(p => !p.isActive);
    } else {
        filtered = packages;
    }
    
    renderPackages(filtered);
}

// ============================================
// PACKAGE MODAL
// ============================================

// Open Package Modal
function openPackageModal(packageData = null) {
    const modal = document.getElementById('packageModal');
    const form = document.getElementById('packageForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtnText = document.getElementById('submitBtnText');
    
    // Reset form
    form.reset();
    document.getElementById('itineraryContainer').innerHTML = '';
    document.getElementById('packageId').value = '';
    editingPackageId = null;
    
    if (packageData) {
        // Edit mode
        modalTitle.textContent = 'Edit Package';
        submitBtnText.textContent = 'Update Package';
        editingPackageId = packageData._id;
        
        // Fill form
        document.getElementById('packageId').value = packageData._id;
        document.getElementById('title').value = packageData.title || '';
        document.getElementById('subtitle').value = packageData.subtitle || '';
        document.getElementById('description').value = packageData.description || '';
        document.getElementById('monuments').value = packageData.monuments || '';
        document.getElementById('duration').value = packageData.duration || '';
        document.getElementById('moreSpots').value = packageData.moreSpots || '';
        document.getElementById('fuelIncluded').checked = packageData.fuelIncluded !== false;
        document.getElementById('parkingIncluded').checked = packageData.parkingIncluded !== false;
        document.getElementById('tollsIncluded').checked = packageData.tollsIncluded !== false;
        document.getElementById('priceOriginal').value = packageData.priceOriginal || '';
        document.getElementById('priceDiscounted').value = packageData.priceDiscounted || '';
        document.getElementById('discount').value = packageData.discount || '';
        document.getElementById('imageName').value = packageData.imageName || '';
        document.getElementById('imageAlt').value = packageData.imageAlt || '';
        document.getElementById('badge').value = packageData.badge || '';
        document.getElementById('badgeType').value = packageData.badgeType || '';
        document.getElementById('displayOrder').value = packageData.displayOrder || 0;
        document.getElementById('carType').value = packageData.carType || 'all';
        document.getElementById('isActive').checked = packageData.isActive !== false;
        
        // Fill itinerary
        if (packageData.itinerary && packageData.itinerary.length > 0) {
            packageData.itinerary.forEach(item => {
                addItineraryItem(item.place, item.duration);
            });
        }
        
        updateImagePreview();
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Package';
        submitBtnText.textContent = 'Save Package';
        
        // Add default itinerary items
        addItineraryItem();
    }
    
    modal.classList.add('active');
}

// Close Package Modal
function closePackageModal() {
    document.getElementById('packageModal').classList.remove('active');
    editingPackageId = null;
}

// Add Itinerary Item
function addItineraryItem(place = '', duration = '') {
    const container = document.getElementById('itineraryContainer');
    const index = container.children.length;
    
    const itemHtml = `
        <div class="itinerary-item" data-index="${index}">
            <div class="form-group">
                <label>Place Name</label>
                <input type="text" name="itinerary_place_${index}" value="${place}" placeholder="e.g., India Gate">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" name="itinerary_duration_${index}" value="${duration}" placeholder="e.g., 30 min">
            </div>
            <button type="button" class="remove-itinerary" onclick="removeItineraryItem(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', itemHtml);
}

// Remove Itinerary Item
function removeItineraryItem(button) {
    button.closest('.itinerary-item').remove();
}

// Generate Image Name
function generateImageName() {
    const title = document.getElementById('title').value;
    if (!title) {
        showToast('Please enter a package title first', 'error');
        return;
    }
    
    const imageName = 'package-' + title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) + '.jpg';
    
    document.getElementById('imageName').value = imageName;
    updateImagePreview();
}

// Update Image Preview
function updateImagePreview() {
    const imageName = document.getElementById('imageName').value;
    const preview = document.getElementById('imagePreview');
    const pathPreview = document.getElementById('imagePathPreview');
    
    if (imageName) {
        pathPreview.textContent = `assets/images/${imageName}`;
        
        // Try to load the image
        const img = new Image();
        img.onload = function() {
            preview.innerHTML = `<img src="assets/images/${imageName}" alt="Preview">`;
        };
        img.onerror = function() {
            preview.innerHTML = `
                <i class="fas fa-image"></i>
                <span>Image not found</span>
                <small>Place file at: assets/images/${imageName}</small>
            `;
        };
        img.src = `assets/images/${imageName}`;
    } else {
        preview.innerHTML = `
            <i class="fas fa-image"></i>
            <span>Image Preview</span>
            <small>assets/images/[filename]</small>
        `;
    }
}

// Handle Package Form Submit
async function handlePackageSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const packageData = {
        title: document.getElementById('title').value,
        subtitle: document.getElementById('subtitle').value,
        description: document.getElementById('description').value,
        monuments: parseInt(document.getElementById('monuments').value) || 0,
        duration: document.getElementById('duration').value,
        moreSpots: parseInt(document.getElementById('moreSpots').value) || 0,
        fuelIncluded: document.getElementById('fuelIncluded').checked,
        parkingIncluded: document.getElementById('parkingIncluded').checked,
        tollsIncluded: document.getElementById('tollsIncluded').checked,
        priceOriginal: parseInt(document.getElementById('priceOriginal').value) || 0,
        priceDiscounted: parseInt(document.getElementById('priceDiscounted').value) || 0,
        discount: document.getElementById('discount').value,
        imageName: document.getElementById('imageName').value,
        imageAlt: document.getElementById('imageAlt').value,
        badge: document.getElementById('badge').value,
        badgeType: document.getElementById('badgeType').value,
        displayOrder: parseInt(document.getElementById('displayOrder').value) || 0,
        carType: document.getElementById('carType').value,
        isActive: document.getElementById('isActive').checked,
        itinerary: []
    };
    
    // Collect itinerary items
    const itineraryItems = document.querySelectorAll('.itinerary-item');
    itineraryItems.forEach((item, index) => {
        const place = item.querySelector(`input[name="itinerary_place_${item.dataset.index}"]`)?.value;
        const duration = item.querySelector(`input[name="itinerary_duration_${item.dataset.index}"]`)?.value;
        
        if (place && duration) {
            packageData.itinerary.push({ place, duration });
        }
    });
    
    try {
        const url = editingPackageId 
            ? `${API_BASE}/packages/${editingPackageId}` 
            : `${API_BASE}/packages`;
        
        const method = editingPackageId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(packageData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(editingPackageId ? 'Package updated successfully!' : 'Package created successfully!');
            closePackageModal();
            loadPackages();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        showToast(error.message || 'Failed to save package', 'error');
    }
}

// Edit Package
function editPackage(id) {
    const pkg = packages.find(p => p._id === id);
    if (pkg) {
        openPackageModal(pkg);
    }
}

// Toggle Package Status
async function togglePackage(id) {
    try {
        const response = await fetch(`${API_BASE}/packages/${id}`, {
            method: 'PATCH'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(`Package ${result.package.isActive ? 'activated' : 'deactivated'} successfully!`);
            loadPackages();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        showToast(error.message || 'Failed to toggle package status', 'error');
    }
}

// Delete Package
function deletePackage(id, title) {
    deletePackageId = id;
    document.getElementById('deletePackageName').textContent = title;
    document.getElementById('deleteModal').classList.add('active');
}

// Close Delete Modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletePackageId = null;
}

// Confirm Delete
async function confirmDelete() {
    if (!deletePackageId) return;
    
    try {
        const response = await fetch(`${API_BASE}/packages/${deletePackageId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Package deleted successfully!');
            closeDeleteModal();
            loadPackages();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete package', 'error');
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    toast.className = 'toast ' + type;
    toastIcon.className = 'toast-icon fas ' + (type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle');
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
