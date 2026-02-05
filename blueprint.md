# Office Desk Booking System Blueprint

## Project Overview
This project will create a simple, interactive web-based office desk booking system. Users can view 20 available desks, book a desk for the day after, see which desks are booked, and manage their own existing bookings (edit or cancel). All data will be stored locally using `localStorage`.

## Implemented Features
- **Office Desk Booking System:** Users can book, view, edit, and cancel desk bookings for the day after the current date. All data is stored locally.
- **Dark/Light Mode Toggle:** Allows users to switch between dark and light themes, with preference saved in local storage.

## Plan for Current Change: Integrate Firebase Firestore for Booking Storage

### Objective
To replace local storage with Firebase Firestore for persistent and scalable storage of booking information, enabling multi-user and real-time capabilities.

### Detailed Outline of Changes

#### 1. `index.html` Modifications
- **Add Firebase SDK Scripts:** Include the necessary Firebase SDKs (App and Firestore) via CDN links in the `<head>` or before the closing `</body>` tag.

#### 2. `main.js` Modifications
- **Firebase Initialization:** Add Firebase configuration and initialize the app and Firestore instance.
- **Data Migration (Conceptual):** Explain the process of migrating from local storage to Firestore (though for a new setup, this might just involve removing old `localStorage` logic).
- **Firestore Operations:**
    - **`saveBooking(seatId, bookingData)`:** Function to add or update a booking in Firestore.
    - **`deleteBooking(seatId)`:** Function to remove a booking from Firestore.
    - **`listenForBookings()`:** Set up a real-time listener to Firestore to update `currentBookings` and re-render the UI whenever booking data changes in the database.
- **Update Existing Functions:** Modify `loadBookings`, `saveBookings` (now `saveBooking`), `handleBookSeat`, `handleCancelBooking` to use Firestore functions instead of `localStorage`.
- **Remove `localStorage` Booking Logic:** Remove all `localStorage` related code for booking data (keep theme preference).
- **Error Handling:** Add basic error handling for Firestore operations.

#### 3. `style.css` Modifications
- No direct changes are expected in `style.css` for database integration, but ensuring UI updates correctly with real-time data will be important.

### Steps
1.  Update `blueprint.md` with the plan for Firebase Firestore integration. (**COMPLETED**)
2.  Modify `index.html` to include Firebase SDK scripts.
3.  Modify `main.js` to initialize Firebase and implement Firestore operations for booking data.
4.  Remove `localStorage` related booking logic from `main.js`.
5.  Verify real-time booking updates and persistence with Firebase Firestore.
