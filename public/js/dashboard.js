// Dashboard Page Logic

let currentUser = null;
let selectedRam = null;
let currentPaymentReference = null;

window.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn() || isAdmin()) {
    window.location.href = '/login.html';
    return;
  }

  await loadUserProfile();
  await loadUserPanels();
  renderRamOptions();
  setupEventListeners();
  setupMobileMenu();
});

function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.sidebar');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // Close sidebar when clicking on nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  });
}

async function loadUserProfile() {
  try {
    const response = await apiCall('/user/profile');
    if (response && response.success) {
      currentUser = response.user;
      document.getElementById('userGreeting').textContent = `Halo, ${currentUser.username}!`;
      document.querySelector('.user-avatar').textContent = currentUser.username.charAt(0).toUpperCase();

      // Show info message if any
      if (response.infoMessage) {
        const infoBanner = document.getElementById('infoMessage');
        const infoText = document.getElementById('infoText');
        infoText.textContent = response.infoMessage;
        infoBanner.style.display = 'flex';
      }

      // Fill profile form
      document.getElementById('profileUsername').value = currentUser.username;
      document.getElementById('profileEmail').value = currentUser.email;
      document.getElementById('profilePhone').value = currentUser.phone || '';

      // Show reseller section if user is reseller
      if (currentUser.isReseller) {
        displayResellerStatus();
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

async function loadUserPanels() {
  try {
    const response = await apiCall('/user/panels');
    if (response && response.success) {
      displayPanels(response.panels);
      updateDashboardStats(response.panels);
    }
  } catch (error) {
    console.error('Error loading panels:', error);
  }
}

function displayPanels(panels) {
  const panelsList = document.getElementById('panelsList');
  panelsList.innerHTML = '';

  if (panels.length === 0) {
    panelsList.innerHTML = '<p class="text-center" style="padding: 40px 20px; grid-column: 1/-1;">Belum ada server. Buat panel baru untuk memulai!</p>';
    return;
  }

  panels.forEach(panel => {
    const card = document.createElement('div');
    card.className = 'panel-card';
    card.innerHTML = `
      <div class="panel-header">
        <span class="panel-name">${panel.serverName}</span>
        <span class="panel-status">Active</span>
      </div>
      <div class="panel-info">
        <label>Username:</label>
        <span>${panel.username}</span>
      </div>
      <div class="panel-info">
        <label>RAM:</label>
        <span>${panel.ram} GB</span>
      </div>
      <div class="panel-info">
        <label>Server ID:</label>
        <span>${panel.serverId}</span>
      </div>
      <div class="panel-info">
        <label>UUID:</label>
        <span>${panel.uuid}</span>
      </div>
      <div class="panel-info">
        <label>Dibuat:</label>
        <span>${formatDate(panel.createdAt)}</span>
      </div>
    `;
    panelsList.appendChild(card);
  });
}

function updateDashboardStats(panels) {
  const panelCount = panels.length;
  const ramTotal = panels.reduce((sum, p) => sum + p.ram, 0);

  document.getElementById('panelCount').textContent = panelCount;
  document.getElementById('ramTotal').textContent = `${ramTotal} GB`;
}

function renderRamOptions() {
  const ramOptions = [
    { value: 1, label: '1 GB', price: 2000 },
    { value: 2, label: '2 GB', price: 4000 },
    { value: 3, label: '3 GB', price: 6000 },
    { value: 4, label: '4 GB', price: 8000 },
    { value: 5, label: '5 GB', price: 10000 },
    { value: 6, label: '6 GB', price: 12000 },
    { value: 7, label: '7 GB', price: 14000 },
    { value: 8, label: '8 GB', price: 16000 },
    { value: 9, label: '9 GB', price: 18000 },
    { value: 10, label: '10 GB', price: 20000 }
  ];

  const container = document.getElementById('ramOptions');
  container.innerHTML = '';

  ramOptions.forEach(option => {
    const btn = document.createElement('div');
    btn.className = 'ram-option';
    btn.innerHTML = `
      <h4>${option.label}</h4>
      <div class="price">${formatCurrency(option.price)}</div>
      <button class="btn btn-primary" onclick="selectRam(${option.value}, '${option.label}')">Pilih</button>
    `;
    container.appendChild(btn);
  });
}

function selectRam(value, label) {
  selectedRam = { value, label };
  showPaymentModal();
}

function showPaymentModal() {
  const paymentDetails = document.getElementById('paymentDetails');
  const ramPrice = selectedRam.value * 2000;

  paymentDetails.innerHTML = `
    <div class="form-group">
      <label>Spesifikasi RAM:</label>
      <input type="text" value="${selectedRam.label}" disabled>
    </div>
    <div class="form-group">
      <label>Harga:</label>
      <input type="text" value="${formatCurrency(ramPrice)}" disabled>
    </div>
    <div class="form-group">
      <label>Username Panel:</label>
      <input type="text" id="panelUsername" placeholder="Username untuk panel Anda" required>
    </div>
  `;

  openModal('paymentModal');
}

function closeModal() {
  document.getElementById('paymentModal').classList.remove('active');
}

async function confirmPayment() {
  const username = document.getElementById('panelUsername').value.trim();

  if (!username) {
    showToast('Username tidak boleh kosong', 'error');
    return;
  }

  if (username.length < 3 || username.length > 20) {
    showToast('Username harus 3-20 karakter', 'error');
    return;
  }

  try {
    // Create payment
    const paymentResponse = await apiCall('/payment/create', 'POST', {
      ram: selectedRam.value,
      type: 'panel'
    });

    if (paymentResponse && paymentResponse.success) {
      currentPaymentReference = paymentResponse.reference;
      closeModal();
      
      // Redirect to payment gateway
      showToast('Redirecting to payment gateway...', 'success');
      setTimeout(() => {
        window.location.href = paymentResponse.paymentUrl;
      }, 1000);
    } else {
      showToast('Gagal membuat pembayaran', 'error');
    }
  } catch (error) {
    console.error('Payment error:', error);
    showToast('Terjadi kesalahan', 'error');
  }
}

function displayResellerStatus() {
  const statusDiv = document.getElementById('resellerStatus');
  const expiry = currentUser.resellerExpiry;

  let statusHtml = '';

  if (currentUser.isReseller) {
    const expiryDate = new Date(expiry);
    const now = new Date();
    const isExpired = expiryDate < now;

    if (isExpired || !expiry) {
      statusHtml = '<p style="color: #dc3545;">Status Reseller Anda Berakhir</p>';
    } else {
      statusHtml = `<p style="color: #28a745;">Anda adalah Reseller!</p>
                    <p>Berlaku sampai: ${formatDate(expiry)}</p>`;
    }
  }

  statusDiv.innerHTML = statusHtml + `
    <h2>Upgrade ke Reseller</h2>
    <p>Dapatkan akses untuk membuat panel tanpa batas</p>
    <div class="reseller-plans">
      <div class="plan-card" onclick="buyResellerPlan('monthly')">
        <h4>1 Bulan</h4>
        <div class="plan-price">Rp 15.000</div>
        <p class="plan-duration">Akses selama 1 bulan</p>
        <button class="btn btn-primary">Beli Sekarang</button>
      </div>
      <div class="plan-card" onclick="buyResellerPlan('permanent')">
        <h4>Permanen</h4>
        <div class="plan-price">Rp 3.000</div>
        <p class="plan-duration">Akses seumur hidup</p>
        <button class="btn btn-primary">Beli Sekarang</button>
      </div>
    </div>
  `;
}

async function buyResellerPlan(plan) {
  try {
    const paymentResponse = await apiCall('/payment/create', 'POST', {
      plan,
      type: 'reseller'
    });

    if (paymentResponse && paymentResponse.success) {
      currentPaymentReference = paymentResponse.reference;
      showToast('Redirecting to payment gateway...', 'success');
      setTimeout(() => {
        window.location.href = paymentResponse.paymentUrl;
      }, 1000);
    } else {
      showToast('Gagal membuat pembayaran', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Terjadi kesalahan', 'error');
  }
}

async function updateProfile(event) {
  event.preventDefault();
  const phone = document.getElementById('profilePhone').value;

  try {
    const response = await apiCall('/user/profile', 'PUT', { phone });
    if (response && response.success) {
      showToast('Profil berhasil diperbarui', 'success');
      currentUser.phone = phone;
    } else {
      showToast('Gagal update profil', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Terjadi kesalahan', 'error');
  }
}

function switchMenu(menu) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected section
  const section = document.getElementById(`${menu}-content`);
  if (section) {
    section.classList.add('active');
  }

  // Add active class to clicked nav link
  event.target.closest('.nav-link').classList.add('active');
}

function handleLogout() {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    logout();
  }
}

function setupEventListeners() {
  // Profile form
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', updateProfile);
  }
}
