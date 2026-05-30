// Admin Dashboard Logic

window.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn() || !isAdmin()) {
    window.location.href = '/login.html';
    return;
  }

  await loadAdminDashboard();
  await loadAdminSettings();
  setupMobileMenuAdmin();
});

function setupMobileMenuAdmin() {
  const sidebar = document.querySelector('.admin-sidebar');
  // Mobile menu toggle can be added here if needed
}

async function loadAdminDashboard() {
  try {
    const response = await apiCall('/admin/statistics');
    if (response && response.success) {
      displayStatistics(response.statistics);
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

async function loadAdminSettings() {
  try {
    const response = await apiCall('/admin/settings');
    if (response && response.success) {
      displaySettings(response.settings);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

function displayStatistics(stats) {
  document.getElementById('totalUsers').textContent = stats.totalUsers;
  document.getElementById('totalPanels').textContent = stats.totalPanels;
  document.getElementById('successPayments').textContent = stats.successfulPayments;
  document.getElementById('totalRevenue').textContent = formatCurrency(stats.totalRevenue);
  document.getElementById('totalResellers').textContent = stats.totalResellers;
  document.getElementById('activeResellers').textContent = stats.activeResellers;
}

function displaySettings(settings) {
  document.getElementById('panelUrl').value = settings.pterodactyl_url || '';
  document.getElementById('apiKey').value = settings.pterodactyl_api_key || '';
  document.getElementById('locationId').value = settings.location_id || 1;
  document.getElementById('nodeId').value = settings.node_id || 1;
  document.getElementById('eggId').value = settings.egg_id || 15;
  document.getElementById('discountPercentage').value = settings.discount_percentage || 0;
  document.getElementById('discountRupiah').value = settings.discount_rupiah || 0;
  document.getElementById('infoMessage').value = settings.info_message || '';
}

function switchAdminMenu(menu) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active class from nav links
  document.querySelectorAll('.admin-sidebar .nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected section
  const section = document.getElementById(`admin-${menu}`);
  if (section) {
    section.classList.add('active');
  }

  // Add active to nav link
  const navLink = document.querySelector(`.nav-link[onclick*="'${menu}'"]`);
  if (navLink) {
    navLink.classList.add('active');
  }

  // Load data if needed
  if (menu === 'users') loadAdminUsers();
  if (menu === 'panels') loadAdminPanels();
  if (menu === 'payments') loadAdminPayments();
  if (menu === 'resellers') loadAdminResellers();
}

async function loadAdminUsers() {
  try {
    const response = await apiCall('/admin/users');
    if (response && response.success) {
      const tbody = document.getElementById('usersList');
      tbody.innerHTML = '';

      response.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.phone || '-'}</td>
          <td>${user.isReseller ? '<span class="badge active">Reseller</span>' : '<span class="badge">User</span>'}</td>
          <td>${formatDate(user.createdAt)}</td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function loadAdminPanels() {
  try {
    const response = await apiCall('/admin/panels');
    if (response && response.success) {
      const tbody = document.getElementById('panelsList');
      tbody.innerHTML = '';

      response.panels.forEach(panel => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${panel.serverName}</td>
          <td>${panel.username}</td>
          <td>${panel.ram} GB</td>
          <td>${panel.serverId}</td>
          <td><span class="badge success">Active</span></td>
          <td>${formatDate(panel.createdAt)}</td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error loading panels:', error);
  }
}

async function loadAdminPayments() {
  try {
    const response = await apiCall('/admin/payments');
    if (response && response.success) {
      const tbody = document.getElementById('paymentsList');
      tbody.innerHTML = '';

      response.payments.forEach(payment => {
        const row = document.createElement('tr');
        const statusBadge = payment.status === 'success' ? '<span class="badge success">Success</span>' : '<span class="badge pending">Pending</span>';
        row.innerHTML = `
          <td>${payment.reference}</td>
          <td>${payment.userId}</td>
          <td>${formatCurrency(payment.amount)}</td>
          <td>${payment.type}</td>
          <td>${statusBadge}</td>
          <td>${formatDate(payment.createdAt)}</td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error loading payments:', error);
  }
}

async function loadAdminResellers() {
  try {
    const response = await apiCall('/admin/resellers');
    if (response && response.success) {
      const tbody = document.getElementById('resellersList');
      tbody.innerHTML = '';

      response.resellers.forEach(reseller => {
        const row = document.createElement('tr');
        let status = 'Active';
        let statusBadge = 'active';
        let expiry = '-';

        if (reseller.plan === 'monthly' && reseller.expiry) {
          expiry = formatDate(reseller.expiry);
          if (new Date(reseller.expiry) < new Date()) {
            status = 'Expired';
            statusBadge = 'expired';
          }
        } else if (reseller.plan === 'permanent') {
          expiry = 'Selamanya';
        }

        row.innerHTML = `
          <td>${reseller.username}</td>
          <td>${reseller.plan === 'monthly' ? '1 Bulan' : 'Permanen'}</td>
          <td><span class="badge ${statusBadge}">${status}</span></td>
          <td>${expiry}</td>
          <td><button class="btn-delete" onclick="deleteReseller('${reseller.username}')">Hapus</button></td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error loading resellers:', error);
  }
}

async function updatePterodactylSettings(event) {
  event.preventDefault();

  const data = {
    pterodactyl_url: document.getElementById('panelUrl').value,
    pterodactyl_api_key: document.getElementById('apiKey').value,
    location_id: parseInt(document.getElementById('locationId').value),
    node_id: parseInt(document.getElementById('nodeId').value),
    egg_id: parseInt(document.getElementById('eggId').value)
  };

  try {
    const response = await apiCall('/admin/settings', 'PUT', data);
    if (response && response.success) {
      showToast('Pterodactyl settings updated', 'success');
    } else {
      showToast('Failed to update settings', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('An error occurred', 'error');
  }
}

async function updateDiscountSettings(event) {
  event.preventDefault();

  const data = {
    discount_percentage: parseInt(document.getElementById('discountPercentage').value) || 0,
    discount_rupiah: parseInt(document.getElementById('discountRupiah').value) || 0
  };

  try {
    const response = await apiCall('/admin/settings', 'PUT', data);
    if (response && response.success) {
      showToast('Discount settings updated', 'success');
    } else {
      showToast('Failed to update discount', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('An error occurred', 'error');
  }
}

async function updateInfoMessage(event) {
  event.preventDefault();

  const data = {
    info_message: document.getElementById('infoMessage').value
  };

  try {
    const response = await apiCall('/admin/settings', 'PUT', data);
    if (response && response.success) {
      showToast('Info message updated', 'success');
    } else {
      showToast('Failed to update info message', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('An error occurred', 'error');
  }
}

async function resetDiscount() {
  if (confirm('Apakah Anda yakin ingin reset diskon ke harga normal?')) {
    try {
      const response = await apiCall('/admin/reset-discount', 'POST');
      if (response && response.success) {
        showToast('Discount reset successfully', 'success');
        document.getElementById('discountPercentage').value = 0;
        document.getElementById('discountRupiah').value = 0;
      } else {
        showToast('Failed to reset discount', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('An error occurred', 'error');
    }
  }
}

function openCreateResellerModal() {
  openModal('createResellerModal');
}

function closeCreateResellerModal() {
  closeModal('createResellerModal');
  document.querySelector('#createResellerModal form').reset();
}

async function createReseller(event) {
  event.preventDefault();

  const username = document.getElementById('resellerUsername').value;
  const password = document.getElementById('resellerPassword').value;
  const plan = document.getElementById('resellerPlan').value;
  const userId = document.getElementById('resellerUserId').value;

  if (!username || !password || !plan) {
    showToast('Semua field harus diisi', 'error');
    return;
  }

  try {
    const data = { username, password, plan };
    if (userId) data.userId = userId;

    const response = await apiCall('/admin/resellers', 'POST', data);
    if (response && response.success) {
      showToast('Reseller account created successfully', 'success');
      closeCreateResellerModal();
      await loadAdminResellers();
    } else {
      showToast(response.message || 'Failed to create reseller', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('An error occurred', 'error');
  }
}

async function deleteReseller(username) {
  if (confirm(`Apakah Anda yakin ingin menghapus reseller ${username}?`)) {
    try {
      const response = await apiCall(`/admin/resellers/${username}`, 'DELETE');
      if (response && response.success) {
        showToast('Reseller deleted successfully', 'success');
        await loadAdminResellers();
      } else {
        showToast('Failed to delete reseller', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('An error occurred', 'error');
    }
  }
}

function handleAdminLogout() {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    logout();
  }
}
