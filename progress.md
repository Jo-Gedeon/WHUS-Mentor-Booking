# Progress Log

Running summary of what this app does, what's been built, and what's next.
Keep appending new dated entries under each section as work continues —
don't rewrite history, just add to it.

## Overview

WHUSBooking Calendar — a React app for scheduling/booking different rooms
or resources (e.g. Radio Shows, Studio B) using [FullCalendar](https://fullcalendar.io/).
Each schedule type gets its own route/page, all built on one shared,
reusable calendar component.

## Current Functionality

- Renders a FullCalendar instance (`month` / `week` / `day` views) via
  `@fullcalendar/react` with `daygrid`, `timegrid`, and `interaction` plugins.
- Reusable `Calendar` component (`src/components/Calendar.jsx`) accepts
  `events`, `initialView`, and `weekends` as props, so it can be reused
  for any number of schedules.
- Client-side routing (React Router) with a nav bar linking between
  schedule pages:
  - `/radio-shows` → Radio Shows schedule
  - `/studio-b` → Studio B schedule
  - `/` → redirects to `/radio-shows`
- Each schedule page (`src/pages/RadioShows.jsx`, `src/pages/StudioB.jsx`)
  owns its own event data and passes it into the shared `Calendar`.
- `src/pages/RadioShows.jsx` now fetches **real events from Google
  Calendar** via the backend (`GET /api/events`) using `useEffect`/
  `useState`, instead of a hardcoded array. `src/pages/StudioB.jsx` is
  still on a **hardcoded placeholder array** — same pattern needs to be
  copied over once its calendar ID is decided.

## Architecture Notes

```
src/
├── App.js              → BrowserRouter + Routes, nav links
├── components/
│   └── Calendar.jsx     → generic FullCalendar wrapper (props: events, initialView, weekends)
└── pages/
    ├── RadioShows.jsx   → Radio Shows data + <Calendar />
    └── StudioB.jsx      → Studio B data + <Calendar />
```

- Adding a new schedule type = new page file + one `<Route>`/`<Link>` in
  `App.js`. Consider refactoring to a data-driven route list
  (array of `{ path, label, events }`) once there are 3+ schedules.

## Changes Made

### 2026-09-05

- Fixed `plugins={dayGridPlugin, timeGridPlugin, interactionPlugin}` bug in
  `Calendar.jsx` — JSX comma operator was collapsing plugins down to just
  the last one, causing a `defs is not iterable` runtime error. Fixed by
  wrapping in an array: `plugins={[...]}`.
- Fixed a version mismatch between `@fullcalendar/react` (`^7.1.0`) and the
  other FullCalendar packages (`^6.1.21`), which caused two separate
  `@fullcalendar/core` installs and a `class constructors must be invoked
with 'new'` runtime error. Pinned `@fullcalendar/react` to `^6.1.21` to
  match; all packages now dedupe to a single `@fullcalendar/core@6.1.21`.
- Refactored `Calendar.jsx` into a generic, reusable component (props:
  `events`, `initialView`, `weekends`) instead of a single hardcoded
  calendar.
- Added React Router (`react-router-dom`) for multi-calendar routing.
- Added `src/pages/RadioShows.jsx` and `src/pages/StudioB.jsx` as the first
  two schedule pages, each with placeholder event data.
- Rewrote `App.js` to set up `BrowserRouter`/`Routes`/`Route`/`Link` nav
  between the two schedule pages, with `/` redirecting to `/radio-shows`.
- Scaffolded a **Node/Express backend** (`server/`) to proxy Google
  Calendar API calls so credentials never live in the React app (`src/`
  is client-side bundled and would expose them):
  - `server/index.js` — Express app, CORS, `/api/health`, mounts
    `/api/events`.
  - `server/routes/events.js` — `GET /api/events?calendarId=...&start=...&end=...`.
    Request handling/validation is wired up; the actual
    `calendar.events.list` call is left as a `TODO` to implement.
  - `server/googleCalendarClient.js` — stub for the service-account auth
    client; intentionally left unimplemented (being built manually).
  - `server/.env.example` — template for `PORT`, `GOOGLE_APPLICATION_CREDENTIALS`,
    `GOOGLE_CALENDAR_ID`.
  - `server/.gitignore` — blocks `.env` and any credential JSON files from
    being committed (only `package.json`/`package-lock.json` allowed
    through).
  - Added `"proxy": "http://localhost:5000"` to `whuscalendar/package.json`
    so the CRA dev server forwards `/api/*` calls to the backend without
    CORS setup.
  - **Decisions made:** GET (read)-only for now — no write/invite creation
    yet. No caching layer yet (deliberately deferred). No separate events
    database — Google Calendar remains the single source of truth.

### 2026-09-12

- **Google Calendar read integration is now working end-to-end** for
  Radio Shows: `server/index.js` (Express app, CORS, `/api/health`,
  mounts `/api/events`) → `server/routes/events.js` (`GET /api/events`
  calls `calendar.events.list` and maps results to
  `{ id, title, start, end, organizer }`) → `server/googleCalendarClient.js`
  (authenticated `googleapis` v3 client via a service-account key) →
  `src/pages/RadioShows.jsx` (`fetch("/api/events")` in `useEffect`,
  stored via `useState`, passed into `<Calendar />`).
- Restored the accidentally-deleted `public/` folder (had been removed
  in an earlier commit) and trimmed it down: kept `index.html` (with the
  `<div id="root">` React mounts into), `manifest.json`, and
  `robots.txt`; removed the CRA default icons (`favicon.ico`,
  `logo192.png`, `logo512.png`) and their references in `index.html`/
  `manifest.json` since they weren't being used.
- Fixed several small bugs blocking the integration from actually
  running:
  - `server/.env`'s `GOOGLE_APPLICATION_CREDENTIALS` pointed at
    `/apiKey.json` (filesystem root) instead of `./apiKey.json`
    (relative to `server/`), causing `ENOENT`.
  - `server/apiKey.json` initially contained an **OAuth 2.0 Client ID**
    credential (`{"web": {...}}`) instead of a **service account key**
    — swapped in a real service-account JSON key (with `private_key`/
    `client_email`) downloaded from Google Cloud Console, and shared
    the calendar with that service account's `client_email`.
  - `src/pages/RadioShows.jsx` had `res.json` (missing `()`) in the
    fetch chain, causing a `TypeError: Illegal invocation`.
  - A stray broken `import ... from ".env"` line in
    `server/googleCalendarClient.js`.
- **Decision made:** using a specific non-primary Google Calendar (found
  via Calendar Settings → "Integrate calendar" → Calendar ID) for Radio
  Shows rather than the primary account calendar, set via
  `GOOGLE_CALENDAR_ID` in `server/.env`.

## Goals / Next Steps

### Primary Goals

1. **Google Calendar API integration (read)** — pull real events from
   Google Calendar into each schedule's `Calendar` component instead of
   hardcoded placeholder arrays.
   - [x] Scaffolded backend (`server/`) with a `GET /api/events` route
         ready to receive the Google API call.
   - [x] Set up a Google Cloud project + service account credentials for
         Calendar API access.
   - [x] Share the target Google Calendar with the service account email,
         granting read access.
   - [x] Implement `server/googleCalendarClient.js` (auth) and the
         `calendar.events.list` call in `server/routes/events.js`.
   - [x] Decide on a calendar for Radio Shows — using a specific
         non-primary Google Calendar (its own Calendar ID) rather than
         the primary account calendar.
   - [ ] Decide on Studio B's calendar (own calendar vs. shared/filtered).
   - [x] Wire `src/pages/RadioShows.jsx` to fetch from `/api/events`
         instead of using a hardcoded array.
   - [ ] Wire `src/pages/StudioB.jsx` the same way once its calendar ID
         is decided.
   - [ ] Handle refresh/polling so the displayed schedule stays in sync.
   - [ ] Add caching (currently deferred) once basic reads are working.

2. **Booking flow (select a 3-hour block)** — let a user pick a 3-hour
   slot on the calendar.
   - [ ] Use FullCalendar's `interaction` plugin (`select` / `dateClick`)
         to let users drag-select or click a start time.
   - [ ] Prevent selecting a slot that overlaps an existing event
         (conflict check against the fetched Google Calendar events).

3. **Booking form → Google Calendar invite (write)** — collect the
   requester's info and create the event on Google Calendar.
   - [ ] Build a form (name, email, purpose/notes, etc.) that appears after
         a 3-hour slot is selected.
   - [ ] On submit, call Google Calendar API (`events.insert`) to create the
         event for the selected time range, with the user added as an
         attendee so they receive an invite.
   - [ ] Show confirmation/error state back to the user after the invite is
         sent.
   - [ ] Decide where the write call happens — directly from the client
         (needs care with API keys/OAuth tokens) vs. a small backend
         endpoint that holds credentials and talks to Google on the app's
         behalf (safer, likely the right call).
