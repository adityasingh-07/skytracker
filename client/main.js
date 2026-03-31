// SkyTracker — Main App Router
const API = 'https://skytracker-api.onrender.com';

// ─── State ───
let currentUser = null;
let currentView = 'overview';

// ─── Toast System ───
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="material-icons-round">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ─── API Helper ───
async function api(path, options = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (err) {
    showToast(err.message, 'error');
    throw err;
  }
}

// ─── Format Helpers ───
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function formatPrice(p) {
  return '₹' + Number(p).toLocaleString('en-IN');
}
function getLatestStatus(statuses) {
  if (!statuses || !statuses.length) return 'scheduled';
  return statuses.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0].status_type;
}

// ─── Animated Background ───
function renderBg() {
  return '<div class="animated-bg"><div class="orb"></div><div class="orb"></div><div class="orb"></div></div>';
}

// ─── Check Auth & Route ───
async function init() {
  try {
    const data = await api('/auth/me');
    currentUser = data.user;
  } catch { currentUser = null; }

  if (!currentUser) return renderLogin();
  if (!currentUser.role) return renderRoleSelect();
  renderDashboard();
}

// ═══════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════
function renderLogin() {
  document.getElementById('app').innerHTML = `
    ${renderBg()}
    <div class="login-page">
      <div class="login-card">
        <div class="logo">
          <span class="icon material-icons-round">flight</span>
          SkyTracker
        </div>
        <p class="subtitle">Track flights, manage bookings, and stay updated in real-time</p>
        <a href="${API}/auth/google" class="google-btn" id="google-signin-btn">
          <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </a>
        <div class="login-features">
          <div class="login-feature">
            <span class="material-icons-round" style="color:var(--accent-passenger)">search</span>
            <p>Search Flights</p>
          </div>
          <div class="login-feature">
            <span class="material-icons-round" style="color:var(--accent-admin)">confirmation_number</span>
            <p>Book Tickets</p>
          </div>
          <div class="login-feature">
            <span class="material-icons-round" style="color:var(--accent-crew)">flight_takeoff</span>
            <p>Live Tracking</p>
          </div>
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════
//  ROLE SELECTION PAGE
// ═══════════════════════════════
function renderRoleSelect() {
  document.getElementById('app').innerHTML = `
    ${renderBg()}
    <div class="role-select-page">
      <div class="role-select-container">
        <h1>Welcome, ${currentUser.name}!</h1>
        <p class="desc">Choose how you'd like to use SkyTracker</p>
        <div class="role-cards stagger-in">
          <div class="role-card passenger" onclick="selectRole('passenger')" id="role-passenger">
            <div class="role-icon">🧳</div>
            <h3>Passenger</h3>
            <p>Search flights, book tickets, and track your journeys</p>
            <ul>
              <li><span class="material-icons-round">check</span> Search & browse flights</li>
              <li><span class="material-icons-round">check</span> Book & manage tickets</li>
              <li><span class="material-icons-round">check</span> Real-time flight tracking</li>
            </ul>
          </div>
          <div class="role-card admin" onclick="selectRole('admin')" id="role-admin">
            <div class="role-icon">🛡️</div>
            <h3>Administrator</h3>
            <p>Full control over flights, airlines, airports, and bookings</p>
            <ul>
              <li><span class="material-icons-round">check</span> Manage all entities</li>
              <li><span class="material-icons-round">check</span> Update flight statuses</li>
              <li><span class="material-icons-round">check</span> View system analytics</li>
            </ul>
          </div>
          <div class="role-card crew" onclick="selectRole('crew')" id="role-crew">
            <div class="role-icon">✈️</div>
            <h3>Crew Member</h3>
            <p>View your schedule, flight details, and crew roster</p>
            <ul>
              <li><span class="material-icons-round">check</span> My flight schedule</li>
              <li><span class="material-icons-round">check</span> Crew roster view</li>
              <li><span class="material-icons-round">check</span> Update certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>`;
}

window.selectRole = async function (role) {
  try {
    const data = await api('/auth/select-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    currentUser = data.user;
    showToast(`Welcome as ${role}!`, 'success');
    renderDashboard();
  } catch { }
};

// ═══════════════════════════════
//  NAVBAR
// ═══════════════════════════════
function renderNavbar() {
  const accentVar = `var(--accent-${currentUser.role})`;
  return `
    <nav class="navbar">
      <a href="#" class="nav-brand" onclick="navigate('overview');return false;">
        <span class="material-icons-round">flight</span> SkyTracker
      </a>
      <div class="nav-user">
        ${currentUser.avatar ? `<img class="user-avatar" src="${currentUser.avatar}" alt="">` : ''}
        <div>
          <div class="user-name">${currentUser.name}</div>
          <div class="user-role" style="color:${accentVar}">${currentUser.role}</div>
        </div>
        <button class="btn-logout" onclick="logout()" id="logout-btn">
          <span class="material-icons-round" style="font-size:1rem;vertical-align:middle">logout</span> Logout
        </button>
      </div>
    </nav>`;
}

window.logout = async function () {
  await api('/auth/logout', { method: 'POST' });
  currentUser = null;
  renderLogin();
};

// ═══════════════════════════════
//  DASHBOARD ROUTER
// ═══════════════════════════════
function renderDashboard() {
  if (currentUser.role === 'passenger') renderPassengerDashboard();
  else if (currentUser.role === 'admin') renderAdminDashboard();
  else if (currentUser.role === 'crew') renderCrewDashboard();
}

// Global navigation — needed because inline onclick can't access module scope
window.navigate = function (view) {
  currentView = view;
  renderDashboard();
};

// ═══════════════════════════════
//  PASSENGER DASHBOARD
// ═══════════════════════════════
async function renderPassengerDashboard() {
  document.getElementById('app').innerHTML = `
    ${renderNavbar()}
    <div class="dashboard">
      <aside class="sidebar">
        <div class="sidebar-section">Navigation</div>
        <button class="sidebar-link ${currentView === 'overview' ? 'active' : ''}" onclick="navigate('overview')">
          <span class="material-icons-round">dashboard</span> Overview
        </button>
        <button class="sidebar-link ${currentView === 'search' ? 'active' : ''}" onclick="navigate('search')">
          <span class="material-icons-round">search</span> Search Flights
        </button>
        <button class="sidebar-link ${currentView === 'bookings' ? 'active' : ''}" onclick="navigate('bookings')">
          <span class="material-icons-round">confirmation_number</span> My Bookings
        </button>
      </aside>
      <main class="main-content" id="main-content">
        <div class="loading"><div class="spinner"></div></div>
      </main>
    </div>`;

  const main = document.getElementById('main-content');

  if (currentView === 'overview' || currentView === 'search') {
    const [flights, airports, airlines] = await Promise.all([
      api('/api/flights'), api('/api/airports'), api('/api/airlines')
    ]);

    main.innerHTML = `
      <div class="page-header animate-in">
        <h1>${currentView === 'overview' ? '✈️ Dashboard' : '🔍 Search Flights'}</h1>
        <p>Find and book your next flight</p>
      </div>
      <div class="search-bar animate-in">
        <select class="form-control" id="filter-from">
          <option value="">From (Any)</option>
          ${airports.map(a => `<option value="${a.airport_id}">${a.iata_code} — ${a.city}</option>`).join('')}
        </select>
        <select class="form-control" id="filter-to">
          <option value="">To (Any)</option>
          ${airports.map(a => `<option value="${a.airport_id}">${a.iata_code} — ${a.city}</option>`).join('')}
        </select>
        <input type="date" class="form-control" id="filter-date">
        <button class="btn btn-primary" onclick="filterFlights()">
          <span class="material-icons-round">search</span> Search
        </button>
      </div>
      <div class="flight-cards-grid stagger-in" id="flights-grid">
        ${flights.slice(0, 12).map(f => renderFlightCard(f)).join('')}
      </div>
      ${flights.length === 0 ? '<div class="empty-state"><span class="material-icons-round">flight</span><h3>No flights found</h3><p>Try different search criteria</p></div>' : ''}
    `;

    window.filterFlights = async function () {
      const from = document.getElementById('filter-from').value;
      const to = document.getElementById('filter-to').value;
      const date = document.getElementById('filter-date').value;
      let q = '/api/flights?';
      if (from) q += `from=${from}&`;
      if (to) q += `to=${to}&`;
      if (date) q += `date=${date}&`;
      const filtered = await api(q);
      document.getElementById('flights-grid').innerHTML = filtered.map(f => renderFlightCard(f)).join('') ||
        '<div class="empty-state"><span class="material-icons-round">flight_off</span><h3>No flights match</h3></div>';
    };
  } else if (currentView === 'bookings') {
    try {
      const bookings = await api('/api/bookings/my');
      main.innerHTML = `
        <div class="page-header animate-in">
          <h1>🎫 My Bookings</h1>
          <p>Your upcoming and past flights</p>
        </div>
        <div class="stagger-in">
          ${bookings.length === 0 ? '<div class="empty-state"><span class="material-icons-round">airplane_ticket</span><h3>No bookings yet</h3><p>Search for flights and book your first trip!</p></div>' : ''}
          ${bookings.map(b => `
            <div class="booking-card">
              <div class="booking-header">
                <div>
                  <strong>${b.Flight?.flight_number || 'N/A'}</strong>
                  <span style="color:var(--text-muted);margin-left:8px">${b.Flight?.Airline?.name || ''}</span>
                </div>
                <span class="payment-badge ${b.payment_status}">${b.payment_status}</span>
              </div>
              <div class="booking-details">
                <div class="booking-detail-item"><div class="label">Route</div>${b.Flight?.DepartureAirport?.iata_code || '?'} → ${b.Flight?.ArrivalAirport?.iata_code || '?'}</div>
                <div class="booking-detail-item"><div class="label">Date</div>${b.Flight ? formatDate(b.Flight.departure_time) : 'N/A'}</div>
                <div class="booking-detail-item"><div class="label">Seat</div>${b.seat_number || 'Any'}</div>
                <div class="booking-detail-item"><div class="label">Class</div><span style="text-transform:capitalize">${b.ticket_type}</span></div>
                <div class="booking-detail-item"><div class="label">Booked</div>${formatDate(b.booking_date)}</div>
                ${b.payment_status !== 'refunded' ? `<div class="booking-detail-item"><button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.booking_id})">Cancel</button></div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>`;
    } catch { main.innerHTML = '<div class="empty-state"><h3>Could not load bookings</h3></div>'; }
  }
}

function renderFlightCard(f) {
  const status = getLatestStatus(f.statuses);
  return `
    <div class="flight-card" onclick="openBookingModal(${f.flight_id}, '${f.flight_number}', '${f.DepartureAirport?.iata_code}', '${f.ArrivalAirport?.iata_code}', ${f.base_price})">
      <div class="flight-card-header">
        <div>
          <div class="flight-number">${f.flight_number}</div>
          <div class="airline-name">${f.Airline?.name || ''} · ${f.Aircraft?.model || ''}</div>
        </div>
        <span class="status-badge ${status}">${status.replace('_', ' ')}</span>
      </div>
      <div class="flight-route">
        <div class="flight-point">
          <div class="iata">${f.DepartureAirport?.iata_code || '?'}</div>
          <div class="city">${f.DepartureAirport?.city || ''}</div>
          <div class="time">${formatTime(f.departure_time)}</div>
        </div>
        <div class="flight-line"><span class="material-icons-round">flight</span></div>
        <div class="flight-point arrival">
          <div class="iata">${f.ArrivalAirport?.iata_code || '?'}</div>
          <div class="city">${f.ArrivalAirport?.city || ''}</div>
          <div class="time">${formatTime(f.arrival_time)}</div>
        </div>
      </div>
      <div class="flight-card-footer">
        <div class="flight-price">${formatPrice(f.base_price)} <span>/ person</span></div>
        <div style="font-size:var(--font-xs);color:var(--text-muted)">${formatDate(f.departure_time)}</div>
      </div>
    </div>`;
}

// ─── Booking Modal ───
window.openBookingModal = function (flightId, flightNum, from, to, price) {
  if (currentUser.role !== 'passenger') { showToast('Only passengers can book', 'error'); return; }
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'booking-modal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>Book Flight ${flightNum}</h2>
        <button class="modal-close" onclick="document.getElementById('booking-modal').remove()">×</button>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:var(--space-lg)">${from} → ${to} · ${formatPrice(price)}</p>
      <div class="form-group">
        <label>Seat Number</label>
        <input class="form-control" id="book-seat" placeholder="e.g. 12A">
      </div>
      <div class="form-group">
        <label>Ticket Class</label>
        <select class="form-control" id="book-class">
          <option value="economy">Economy — ${formatPrice(price)}</option>
          <option value="business">Business — ${formatPrice(price * 2.5)}</option>
          <option value="first">First Class — ${formatPrice(price * 4)}</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="document.getElementById('booking-modal').remove()">Cancel</button>
        <button class="btn btn-success" onclick="confirmBooking(${flightId})">
          <span class="material-icons-round">check</span> Confirm Booking
        </button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
};

window.confirmBooking = async function (flightId) {
  const seat = document.getElementById('book-seat').value;
  const ticket_type = document.getElementById('book-class').value;
  await api('/api/bookings', { method: 'POST', body: JSON.stringify({ flight_id: flightId, seat_number: seat, ticket_type }) });
  document.getElementById('booking-modal').remove();
  showToast('Flight booked successfully!', 'success');
  currentView = 'bookings';
  renderPassengerDashboard();
};

window.cancelBooking = async function (id) {
  if (!confirm('Cancel this booking?')) return;
  await api(`/api/bookings/${id}`, { method: 'DELETE' });
  showToast('Booking cancelled', 'success');
  renderPassengerDashboard();
};

// ═══════════════════════════════
//  ADMIN DASHBOARD
// ═══════════════════════════════
async function renderAdminDashboard() {
  document.getElementById('app').innerHTML = `
    ${renderNavbar()}
    <div class="dashboard">
      <aside class="sidebar">
        <div class="sidebar-section">Admin Panel</div>
        <button class="sidebar-link ${currentView === 'overview' ? 'active' : ''}" onclick="navigate('overview')">
          <span class="material-icons-round">dashboard</span> Overview
        </button>
        <button class="sidebar-link ${currentView === 'flights' ? 'active' : ''}" onclick="navigate('flights')">
          <span class="material-icons-round">flight</span> Flights
        </button>
        <button class="sidebar-link ${currentView === 'airlines' ? 'active' : ''}" onclick="navigate('airlines')">
          <span class="material-icons-round">airlines</span> Airlines
        </button>
        <button class="sidebar-link ${currentView === 'airports' ? 'active' : ''}" onclick="navigate('airports')">
          <span class="material-icons-round">location_on</span> Airports
        </button>
        <button class="sidebar-link ${currentView === 'aircraft' ? 'active' : ''}" onclick="navigate('aircraft')">
          <span class="material-icons-round">airplanemode_active</span> Aircraft
        </button>
        <button class="sidebar-link ${currentView === 'admin-bookings' ? 'active' : ''}" onclick="navigate('admin-bookings')">
          <span class="material-icons-round">receipt_long</span> Bookings
        </button>
      </aside>
      <main class="main-content" id="main-content">
        <div class="loading"><div class="spinner"></div></div>
      </main>
    </div>`;

  const main = document.getElementById('main-content');

  if (currentView === 'overview') {
    const stats = await api('/api/admin/stats');
    main.innerHTML = `
      <div class="page-header animate-in"><h1>📊 Admin Dashboard</h1><p>System overview and statistics</p></div>
      <div class="stats-grid stagger-in">
        ${statCard('flight', stats.totalFlights, 'Total Flights', 'blue')}
        ${statCard('confirmation_number', stats.totalBookings, 'Total Bookings', 'green')}
        ${statCard('people', stats.totalPassengers, 'Passengers', 'purple')}
        ${statCard('badge', stats.totalCrew, 'Crew Members', 'amber')}
        ${statCard('airlines', stats.totalAirlines, 'Airlines', 'blue')}
        ${statCard('location_on', stats.totalAirports, 'Airports', 'green')}
        ${statCard('airplanemode_active', stats.totalAircraft, 'Aircraft', 'purple')}
        ${statCard('paid', stats.paidBookings, 'Paid Bookings', 'amber')}
      </div>`;
  } else if (currentView === 'flights') {
    await renderAdminFlights(main);
  } else if (currentView === 'airlines') {
    await renderAdminCRUD(main, 'airlines', 'Airlines', ['name', 'country'], 'airline_id');
  } else if (currentView === 'airports') {
    await renderAdminCRUD(main, 'airports', 'Airports', ['name', 'city', 'country', 'iata_code'], 'airport_id');
  } else if (currentView === 'aircraft') {
    await renderAdminCRUD(main, 'aircraft', 'Aircraft', ['model', 'capacity', 'manufacturer'], 'aircraft_id');
  } else if (currentView === 'admin-bookings') {
    const bookings = await api('/api/bookings');
    main.innerHTML = `
      <div class="page-header animate-in"><h1>🎫 All Bookings</h1><p>${bookings.length} total bookings</p></div>
      <div class="data-table-container animate-in"><table class="data-table"><thead><tr>
        <th>ID</th><th>Passenger</th><th>Flight</th><th>Route</th><th>Seat</th><th>Class</th><th>Payment</th><th>Date</th>
      </tr></thead><tbody>
        ${bookings.map(b => `<tr>
          <td>${b.booking_id}</td>
          <td>${b.Passenger?.first_name || ''} ${b.Passenger?.last_name || ''}</td>
          <td><strong>${b.Flight?.flight_number || ''}</strong></td>
          <td>${b.Flight?.DepartureAirport?.iata_code || '?'} → ${b.Flight?.ArrivalAirport?.iata_code || '?'}</td>
          <td>${b.seat_number || '—'}</td>
          <td style="text-transform:capitalize">${b.ticket_type}</td>
          <td><span class="payment-badge ${b.payment_status}">${b.payment_status}</span></td>
          <td>${formatDate(b.booking_date)}</td>
        </tr>`).join('')}
      </tbody></table></div>`;
  }
}

function statCard(icon, value, label, color) {
  return `<div class="stat-card ${color}">
    <div class="stat-icon"><span class="material-icons-round">${icon}</span></div>
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
  </div>`;
}

async function renderAdminFlights(main) {
  const [flights, airlines, airports, aircraft] = await Promise.all([
    api('/api/flights'), api('/api/airlines'), api('/api/airports'), api('/api/aircraft')
  ]);
  main.innerHTML = `
    <div class="page-header animate-in"><h1>✈️ Manage Flights</h1></div>
    <div class="toolbar animate-in">
      <span>${flights.length} flights</span>
      <button class="btn btn-primary" onclick="openFlightModal()"><span class="material-icons-round">add</span> Add Flight</button>
    </div>
    <div class="data-table-container animate-in"><table class="data-table"><thead><tr>
      <th>Flight</th><th>Airline</th><th>Route</th><th>Departure</th><th>Arrival</th><th>Price</th><th>Status</th><th>Actions</th>
    </tr></thead><tbody>
      ${flights.map(f => {
    const st = getLatestStatus(f.statuses);
    return `<tr>
          <td><strong>${f.flight_number}</strong></td>
          <td>${f.Airline?.name || ''}</td>
          <td>${f.DepartureAirport?.iata_code || '?'} → ${f.ArrivalAirport?.iata_code || '?'}</td>
          <td>${formatDate(f.departure_time)} ${formatTime(f.departure_time)}</td>
          <td>${formatTime(f.arrival_time)}</td>
          <td>${formatPrice(f.base_price)}</td>
          <td><span class="status-badge ${st}">${st.replace('_', ' ')}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openStatusModal(${f.flight_id},'${f.flight_number}')">Status</button>
            <button class="btn btn-danger btn-sm" onclick="deleteFlight(${f.flight_id})">Del</button>
          </td>
        </tr>`;
  }).join('')}
    </tbody></table></div>`;

  // Store data for modals
  window._adminData = { airlines, airports, aircraft };
}

window.openFlightModal = function () {
  const { airlines, airports, aircraft } = window._adminData;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'flight-modal';
  overlay.innerHTML = `<div class="modal">
    <div class="modal-header"><h2>Add New Flight</h2><button class="modal-close" onclick="document.getElementById('flight-modal').remove()">×</button></div>
    <div class="form-group"><label>Flight Number</label><input class="form-control" id="f-num" placeholder="e.g. AI-505"></div>
    <div class="form-group"><label>Airline</label><select class="form-control" id="f-airline">${airlines.map(a => `<option value="${a.airline_id}">${a.name}</option>`).join('')}</select></div>
    <div class="form-group"><label>Aircraft</label><select class="form-control" id="f-aircraft">${aircraft.map(a => `<option value="${a.aircraft_id}">${a.model}</option>`).join('')}</select></div>
    <div class="form-group"><label>From</label><select class="form-control" id="f-from">${airports.map(a => `<option value="${a.airport_id}">${a.iata_code} — ${a.city}</option>`).join('')}</select></div>
    <div class="form-group"><label>To</label><select class="form-control" id="f-to">${airports.map(a => `<option value="${a.airport_id}">${a.iata_code} — ${a.city}</option>`).join('')}</select></div>
    <div class="form-group"><label>Departure</label><input type="datetime-local" class="form-control" id="f-dep"></div>
    <div class="form-group"><label>Arrival</label><input type="datetime-local" class="form-control" id="f-arr"></div>
    <div class="form-group"><label>Base Price (₹)</label><input type="number" class="form-control" id="f-price" placeholder="5000"></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="document.getElementById('flight-modal').remove()">Cancel</button>
      <button class="btn btn-success" onclick="createFlight()"><span class="material-icons-round">add</span> Create</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
};

window.createFlight = async function () {
  await api('/api/flights', {
    method: 'POST', body: JSON.stringify({
      flight_number: document.getElementById('f-num').value,
      airline_id: document.getElementById('f-airline').value,
      aircraft_id: document.getElementById('f-aircraft').value,
      departure_airport_id: document.getElementById('f-from').value,
      arrival_airport_id: document.getElementById('f-to').value,
      departure_time: document.getElementById('f-dep').value,
      arrival_time: document.getElementById('f-arr').value,
      base_price: document.getElementById('f-price').value,
    })
  });
  document.getElementById('flight-modal').remove();
  showToast('Flight created!', 'success');
  renderAdminDashboard();
};

window.deleteFlight = async function (id) {
  if (!confirm('Delete this flight?')) return;
  await api(`/api/flights/${id}`, { method: 'DELETE' });
  showToast('Flight deleted', 'success');
  renderAdminDashboard();
};

window.openStatusModal = function (flightId, num) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'status-modal';
  overlay.innerHTML = `<div class="modal">
    <div class="modal-header"><h2>Update Status — ${num}</h2><button class="modal-close" onclick="document.getElementById('status-modal').remove()">×</button></div>
    <div class="form-group"><label>Status</label><select class="form-control" id="s-type">
      <option value="scheduled">Scheduled</option><option value="boarding">Boarding</option><option value="departed">Departed</option>
      <option value="in_air">In Air</option><option value="landed">Landed</option><option value="delayed">Delayed</option><option value="cancelled">Cancelled</option>
    </select></div>
    <div class="form-group"><label>Delay Reason (optional)</label><input class="form-control" id="s-reason" placeholder="e.g. Weather conditions"></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="document.getElementById('status-modal').remove()">Cancel</button>
      <button class="btn btn-primary" onclick="updateFlightStatus(${flightId})">Update</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
};

window.updateFlightStatus = async function (flightId) {
  await api(`/api/flights/${flightId}/status`, {
    method: 'POST', body: JSON.stringify({
      status_type: document.getElementById('s-type').value,
      delay_reason: document.getElementById('s-reason').value,
    })
  });
  document.getElementById('status-modal').remove();
  showToast('Status updated!', 'success');
  renderAdminDashboard();
};

// ─── Generic CRUD for Airlines/Airports/Aircraft ───
async function renderAdminCRUD(main, entity, title, fields, idField) {
  const items = await api(`/api/${entity}`);
  main.innerHTML = `
    <div class="page-header animate-in"><h1>${title}</h1></div>
    <div class="toolbar animate-in">
      <span>${items.length} ${title.toLowerCase()}</span>
      <button class="btn btn-primary" onclick="openCrudModal('${entity}', ${JSON.stringify(fields).replace(/"/g, "'")}, '${idField}')">
        <span class="material-icons-round">add</span> Add
      </button>
    </div>
    <div class="data-table-container animate-in"><table class="data-table"><thead><tr>
      ${fields.map(f => `<th>${f.replace('_', ' ')}</th>`).join('')}<th>Actions</th>
    </tr></thead><tbody>
      ${items.map(item => `<tr>
        ${fields.map(f => `<td>${item[f] || ''}</td>`).join('')}
        <td><button class="btn btn-danger btn-sm" onclick="deleteCrudItem('${entity}',${item[idField]})">Delete</button></td>
      </tr>`).join('')}
    </tbody></table></div>`;
}

window.openCrudModal = function (entity, fields, idField) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'crud-modal';
  overlay.innerHTML = `<div class="modal">
    <div class="modal-header"><h2>Add New</h2><button class="modal-close" onclick="document.getElementById('crud-modal').remove()">×</button></div>
    ${fields.map(f => `<div class="form-group"><label>${f.replace('_', ' ')}</label><input class="form-control" id="crud-${f}" placeholder="${f}"></div>`).join('')}
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="document.getElementById('crud-modal').remove()">Cancel</button>
      <button class="btn btn-success" onclick="createCrudItem('${entity}', ${JSON.stringify(fields).replace(/"/g, "'")})">Create</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
};

window.createCrudItem = async function (entity, fields) {
  const body = {};
  fields.forEach(f => body[f] = document.getElementById(`crud-${f}`).value);
  await api(`/api/${entity}`, { method: 'POST', body: JSON.stringify(body) });
  document.getElementById('crud-modal').remove();
  showToast('Created!', 'success');
  renderAdminDashboard();
};

window.deleteCrudItem = async function (entity, id) {
  if (!confirm('Delete?')) return;
  await api(`/api/${entity}/${id}`, { method: 'DELETE' });
  showToast('Deleted', 'success');
  renderAdminDashboard();
};

// ═══════════════════════════════
//  CREW DASHBOARD
// ═══════════════════════════════
async function renderCrewDashboard() {
  document.getElementById('app').innerHTML = `
    ${renderNavbar()}
    <div class="dashboard">
      <aside class="sidebar">
        <div class="sidebar-section">Crew Panel</div>
        <button class="sidebar-link ${currentView === 'overview' ? 'active' : ''}" onclick="navigate('overview')">
          <span class="material-icons-round">dashboard</span> My Schedule
        </button>
        <button class="sidebar-link ${currentView === 'profile' ? 'active' : ''}" onclick="navigate('profile')">
          <span class="material-icons-round">person</span> My Profile
        </button>
        <button class="sidebar-link ${currentView === 'all-flights' ? 'active' : ''}" onclick="navigate('all-flights')">
          <span class="material-icons-round">flight</span> All Flights
        </button>
      </aside>
      <main class="main-content" id="main-content">
        <div class="loading"><div class="spinner"></div></div>
      </main>
    </div>`;

  const main = document.getElementById('main-content');

  if (currentView === 'overview') {
    try {
      const flights = await api('/api/crew/my-flights');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      main.innerHTML = `
        <div class="page-header animate-in"><h1>📅 My Flight Schedule</h1><p>${flights.length} assigned flights</p></div>
        <div class="stagger-in">
          ${flights.length === 0 ? '<div class="empty-state"><span class="material-icons-round">event_busy</span><h3>No flights assigned</h3><p>Contact admin to get assigned to flights</p></div>' : ''}
          ${flights.map(f => {
        const d = new Date(f.departure_time);
        return `<div class="schedule-card">
              <div class="schedule-date"><div class="day">${d.getDate()}</div><div class="month">${months[d.getMonth()]}</div></div>
              <div class="schedule-info">
                <div class="flight-num">${f.flight_number} — ${f.Airline?.name || ''}</div>
                <div class="route">${f.DepartureAirport?.iata_code || '?'} (${f.DepartureAirport?.city || ''}) → ${f.ArrivalAirport?.iata_code || '?'} (${f.ArrivalAirport?.city || ''})</div>
                <div style="font-size:var(--font-xs);color:var(--text-muted);margin-top:4px">${formatTime(f.departure_time)} — ${formatTime(f.arrival_time)} · ${f.Aircraft?.model || ''}</div>
              </div>
              <span class="status-badge ${getLatestStatus(f.statuses)}">${getLatestStatus(f.statuses).replace('_', ' ')}</span>
            </div>`;
      }).join('')}
        </div>`;
    } catch { main.innerHTML = '<div class="empty-state"><h3>Could not load schedule</h3></div>'; }
  } else if (currentView === 'profile') {
    try {
      const profile = await api('/api/crew/profile');
      main.innerHTML = `
        <div class="page-header animate-in"><h1>👤 Crew Profile</h1></div>
        <div class="animate-in" style="max-width:500px">
          <div class="form-group"><label>Name</label><input class="form-control" value="${profile?.name || ''}" disabled></div>
          <div class="form-group"><label>Role</label>
            <select class="form-control" id="crew-role">
              ${['Pilot', 'Co-Pilot', 'Flight Attendant', 'Flight Engineer'].map(r => `<option ${profile?.role === r ? 'selected' : ''}>${r}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Certification</label><input class="form-control" id="crew-cert" value="${profile?.certification || ''}" placeholder="e.g. ATPL, CPL"></div>
          <button class="btn btn-primary" onclick="updateCrewProfile()"><span class="material-icons-round">save</span> Save Changes</button>
        </div>`;
    } catch { main.innerHTML = '<div class="empty-state"><h3>Could not load profile</h3></div>'; }
  } else if (currentView === 'all-flights') {
    const flights = await api('/api/flights');
    main.innerHTML = `
      <div class="page-header animate-in"><h1>✈️ All Flights</h1><p>Browse all scheduled flights</p></div>
      <div class="flight-cards-grid stagger-in">${flights.slice(0, 12).map(f => renderFlightCard(f)).join('')}</div>`;
    // Override click — crew can't book
    window.openBookingModal = () => showToast('Crew members cannot book flights', 'info');
  }
}

window.updateCrewProfile = async function () {
  await api('/api/crew/profile', {
    method: 'PUT', body: JSON.stringify({
      role: document.getElementById('crew-role').value,
      certification: document.getElementById('crew-cert').value,
    })
  });
  showToast('Profile updated!', 'success');
};

// ─── Start ───
init();
