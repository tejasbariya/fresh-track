# Grocery Management SPA

A modern Single Page Application (SPA) built using AngularJS 1.x, demonstrating component-based architecture, routing, and local storage data persistence.

## Features

- **Multi-page Architecture**: Uses `ngRoute` to navigate between Login, Registration, Dashboard, and Profile views.
- **Component-Based**: UI is broken down into modular, reusable components (`navbar`, `login`, `register`, `dashboard`, `profile`).
- **Services**: Business logic and data persistence (`localStorage`) are decoupled into `authService` and `groceryService`.
- **Authentication**: Mock authentication system (registration and login) maintaining session state in `localStorage`.
- **Data Isolation**: Grocery lists are saved specifically to the logged-in user.
- **Budget Tracking**: Real-time progress bar reflecting budget vs. total cost.
- **Smart Filtering**: Search through list elements quickly.

## Requirements

- A modern web browser.
- A local web server to run the files properly (due to standard CORS restrictions applied to `file://` protocols with ES modules/Ajax).

## How to Run

1. Clone or download this repository.
2. Serve the `public` directory using a local web server.
    - If you have Python installed: `cd public && python -m http.server 8000`
    - If you have Node installed (e.g. `http-server` or `live-server`): `cd public && npx http-server`
3. Open your browser and navigate to `http://localhost:8000` (or whichever port your server is running on).

## Folder Structure

## Folder Structure

```text
├── .gitignore
├── README.md
└── public/
    ├── index.html        (Main entry point)
    ├── app.css           (Global styles)
    ├── app.module.js     (Angular module init)
    ├── app.routes.js     (Routing logic)
    ├── components/
    │   ├── auth/         (Login and Register components)
    │   ├── dashboard/    (Main grocery app component)
    │   ├── navbar/       (Navigation component)
    │   └── profile/      (User profile component)
    └── services/
        ├── auth.service.js    (Handles login/sessions)
        └── grocery.service.js (Handles fetching/saving list data)