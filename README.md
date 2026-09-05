# WHUS Booking Calendar

A React app for booking WHUS resources (e.g. Radio Shows, Studio B) on a
calendar, built with [FullCalendar](https://fullcalendar.io/) and
[React Router](https://reactrouter.com/).

See [`progress.md`](./progress.md) for the running log of functionality,
changes, and goals.

## Features

- Shared, reusable `Calendar` component (`src/components/Calendar.jsx`)
  wrapping FullCalendar's day/week/month views.
- One route per schedule type, each with its own event data:
  - `/radio-shows` — Radio Shows schedule
  - `/studio-b` — Studio B schedule
- Nav bar to switch between schedules.

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page reloads automatically as you edit files in `src/`.

## Project Structure

```
src/
├── App.js              # Router + nav
├── components/
│   └── Calendar.jsx     # Reusable FullCalendar wrapper
└── pages/
    ├── RadioShows.jsx   # Radio Shows schedule + data
    └── StudioB.jsx      # Studio B schedule + data
```

## Available Scripts

- `npm start` — run the app in development mode.
- `npm test` — run the test runner in watch mode.
- `npm run build` — build a production bundle to `build/`.

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).
