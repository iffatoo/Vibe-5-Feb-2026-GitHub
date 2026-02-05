const SEAT_COUNT = 20;
const STORAGE_KEY_PREFIX = 'deskBookings_'; // Prefix for localStorage keys
const THEME_STORAGE_KEY = 'themePreference';

// DOM Elements
const tomorrowDateEl = document.getElementById('tomorrowDate');
const seatGridEl = document.getElementById('seatGrid');
const userNameInput = document.getElementById('userName');
const selectedSeatDisplay = document.getElementById('selectedSeatDisplay');
const selectedSeatInput = document.getElementById('selectedSeat');
const bookSeatBtn = document.getElementById('bookSeatBtn');
const myBookingsDateEl = document.getElementById('myBookingsDate');
const myBookingsListEl = document.getElementById('myBookingsList');
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// State Variables
let tomorrowDate = '';
let currentBookings = {}; // { seatNumber: { userName: '...', bookingId: '...' } }
let currentUserName = '';
let selectedSeat = null; // The seat currently selected by the user for booking

// --- Utility Functions ---

function getFormattedDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function getTomorrowDateKey() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrowDate = getFormattedDate(tomorrow); // Set global formatted date
  return tomorrow.toISOString().slice(0, 10); // YYYY-MM-DD
}

function loadBookings() {
  const dateKey = getTomorrowDateKey();
  const storedBookings = localStorage.getItem(STORAGE_KEY_PREFIX + dateKey);
  currentBookings = storedBookings ? JSON.parse(storedBookings) : {};
}

function saveBookings() {
  const dateKey = getTomorrowDateKey();
  localStorage.setItem(STORAGE_KEY_PREFIX + dateKey, JSON.stringify(currentBookings));
}

function generateSeatId(index) {
  return `D${index + 1}`; // Desk 1, Desk 2, etc.
}

function getUserName() {
  let name = localStorage.getItem('currentUserName');
  while (!name || name.trim() === '') {
    name = prompt("Please enter your name to use the booking system:");
    if (name && name.trim() !== '') {
      localStorage.setItem('currentUserName', name.trim());
    }
  }
  currentUserName = name.trim();
  userNameInput.value = currentUserName; // Pre-fill name field
}

// --- Theme Functions ---
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light'; // Default to light
    setTheme(savedTheme);
}

// --- Render Functions ---

function renderSeats() {
  seatGridEl.innerHTML = ''; // Clear existing seats
  for (let i = 0; i < SEAT_COUNT; i++) {
    const seatId = generateSeatId(i);
    const seatEl = document.createElement('div');
    seatEl.classList.add('seat');
    seatEl.textContent = seatId;
    seatEl.dataset.seatId = seatId;

    const booking = currentBookings[seatId];
    if (booking) {
      seatEl.classList.add('booked');
      seatEl.title = `Booked by: ${booking.userName}`;
      if (booking.userName === currentUserName) {
        seatEl.classList.add('booked-by-me');
      }
    } else {
      seatEl.classList.add('available');
    }

    // Highlight selected seat for booking form
    if (selectedSeat === seatId) {
      seatEl.classList.add('selected');
    }

    seatEl.addEventListener('click', () => handleSeatClick(seatId));
    seatGridEl.appendChild(seatEl);
  }
  updateBookButtonState();
}

function renderMyBookings() {
  myBookingsListEl.innerHTML = '';
  const myBookings = Object.values(currentBookings).filter(booking => booking.userName === currentUserName);

  if (myBookings.length === 0) {
    myBookingsListEl.innerHTML = '<p>No bookings found for you.</p>';
    return;
  }

  const ul = document.createElement('ul');
  myBookings.forEach(booking => {
    const li = document.createElement('li');
    li.innerHTML = `Desk ${booking.seatNumber} 
                    <button class="edit-button" data-seat-id="${booking.seatNumber}">Edit</button>
                    <button class="cancel-button" data-seat-id="${booking.seatNumber}">Cancel</button>`;
    ul.appendChild(li);
  });
  myBookingsListEl.appendChild(ul);

  // Attach event listeners to new buttons
  myBookingsListEl.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', (event) => handleEditBooking(event.target.dataset.seatId));
  });
  myBookingsListEl.querySelectorAll('.cancel-button').forEach(button => {
    button.addEventListener('click', (event) => handleCancelBooking(event.target.dataset.seatId));
  });
}

function updateBookButtonState() {
  bookSeatBtn.disabled = !(selectedSeat && userNameInput.value.trim() !== '');
}

// --- Event Handlers ---

function handleSeatClick(seatId) {
  const booking = currentBookings[seatId];
  if (booking && booking.userName !== currentUserName) {
    alert(`Desk ${seatId} is already booked by ${booking.userName}.`);
    return;
  }

  // Deselect if already selected
  if (selectedSeat === seatId) {
    selectedSeat = null;
  } else {
    selectedSeat = seatId;
  }

  selectedSeatDisplay.value = selectedSeat || '';
  selectedSeatInput.value = selectedSeat || '';

  renderSeats(); // Re-render to update highlighting
}

function handleBookSeat() {
  const user = userNameInput.value.trim();
  if (!user) {
    alert("Please enter your name.");
    return;
  }
  if (!selectedSeat) {
    alert("Please select a seat to book.");
    return;
  }

  // Check if already booked by someone else
  if (currentBookings[selectedSeat] && currentBookings[selectedSeat].userName !== user) {
    alert(`Desk ${selectedSeat} is already booked by ${currentBookings[selectedSeat].userName}. Please choose another.`);
    return;
  }

  // If the user already has a booking, and tries to book a new one, this becomes an edit
  // For simplicity, we'll allow one booking per user for this system
  const existingBooking = Object.values(currentBookings).find(b => b.userName === user);
  if (existingBooking && existingBooking.seatNumber !== selectedSeat) {
    // If user has an existing booking and selects a different seat, it's an edit
    const confirmEdit = confirm(`You already have Desk ${existingBooking.seatNumber} booked. Do you want to change your booking to Desk ${selectedSeat}?`);
    if (confirmEdit) {
      delete currentBookings[existingBooking.seatNumber]; // Cancel old booking
    } else {
      selectedSeat = null;
      selectedSeatDisplay.value = '';
      selectedSeatInput.value = '';
      renderSeats();
      return;
    }
  } else if (existingBooking && existingBooking.seatNumber === selectedSeat) {
    alert(`You already have Desk ${selectedSeat} booked.`);
    selectedSeat = null;
    selectedSeatDisplay.value = '';
    selectedSeatInput.value = '';
    renderSeats();
    return;
  }


  currentBookings[selectedSeat] = {
    seatNumber: selectedSeat,
    userName: user,
    bookingId: `${getTomorrowDateKey()}-${selectedSeat}-${Date.now()}` // Simple unique ID
  };
  saveBookings();
  selectedSeat = null; // Clear selection
  selectedSeatDisplay.value = '';
  selectedSeatInput.value = '';
  renderAll(); // Re-render everything
  alert(`Desk ${selectedSeat} successfully booked for ${user}!`);
}

function handleEditBooking(seatToEdit) {
    // Treat edit as selecting the seat the user already has, and then allow re-booking
    // Or, for simplicity here, we'll prompt to cancel and re-book
    const confirmEdit = confirm(`To change your booking for Desk ${seatToEdit}, please cancel it first and then book a new seat.`);
    if (confirmEdit) {
        handleCancelBooking(seatToEdit);
    }
}


function handleCancelBooking(seatToCancel) {
  const booking = currentBookings[seatToCancel];
  if (booking && booking.userName === currentUserName) {
    const confirmCancel = confirm(`Are you sure you want to cancel your booking for Desk ${seatToCancel}?`);
    if (confirmCancel) {
      delete currentBookings[seatToCancel];
      saveBookings();
      renderAll();
      alert(`Booking for Desk ${seatToCancel} cancelled.`);
    }
  } else {
    alert("You can only cancel your own bookings.");
  }
}

// --- Initialization ---

function init() {
  getUserName(); // Prompt for user name on load
  tomorrowDateEl.textContent = tomorrowDate;
  myBookingsDateEl.textContent = tomorrowDate; // Set date for "My Bookings"
  loadBookings();
  loadTheme(); // Load theme preference
  renderAll();

  // Event Listeners
  bookSeatBtn.addEventListener('click', handleBookSeat);
  userNameInput.addEventListener('input', updateBookButtonState);
  themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
}

function renderAll() {
  renderSeats();
  renderMyBookings();
  updateBookButtonState();
}

init();
