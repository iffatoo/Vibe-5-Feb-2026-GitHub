# Office Desk Booking System Blueprint

## Project Overview
This project will create a simple, interactive web-based office desk booking system. Users can view 20 available desks, book a desk for the day after, see which desks are booked, and manage their own existing bookings (edit or cancel). All data will be stored locally using `localStorage`.

## Implemented Features
- **Office Desk Booking System:** Users can book, view, edit, and cancel desk bookings for the day after the current date. All data is stored locally.
- **Dark/Light Mode Toggle:** Allows users to switch between dark and light themes, with preference saved in local storage.

## Plan for Current Change: Implement Dark/Light Mode Toggle

### Objective
To provide users with the option to switch between a dark and light theme, enhancing usability and personal preference. The selected theme will persist across sessions.

### Detailed Outline of Changes

#### 1. `index.html` Modifications
- **Add Toggle UI:** Introduce a button or checkbox, preferably in the header, that will serve as the dark/light mode toggle.

#### 2. `style.css` Modifications
- **Define CSS Variables:** Establish CSS variables for colors to manage themes effectively.
- **Light Theme (Default):** Define default color variables for the light theme.
- **Dark Theme:** Create a `.dark-mode` class (e.g., on the `body` or `html` element) that overrides the CSS variables for a dark theme.

#### 3. `main.js` Modifications
- **DOM Access:** Get references to the toggle button and the `body`/`html` element.
- **Toggle Logic:**
    - Add an event listener to the toggle button to switch the theme.
    - When the toggle is activated, add/remove the `.dark-mode` class from the `body`/`html` element.
- **Local Storage Integration:**
    - Save the current theme preference (`'dark'` or `'light'`) to `localStorage`.
    - On page load, check `localStorage` for a saved theme preference and apply it.

### Steps
1.  Update `blueprint.md` with the plan for dark/light mode. (**COMPLETED**)
2.  Modify `index.html` to add the dark/light mode toggle switch.
3.  Modify `style.css` to define theme variables and dark mode styles.
4.  Modify `main.js` to implement the dark/light mode toggle logic and local storage persistence.
5.  Verify the dark/light mode functionality in the browser preview.
