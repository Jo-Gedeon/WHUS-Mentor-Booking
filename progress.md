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
- Events are currently **hardcoded placeholder arrays** in each page file
  (not yet connected to a real data source/API/DB).

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

## Goals / Next Steps

### Primary Goals

1. **Google Calendar API integration (read)** — pull real events from
   Google Calendar into each schedule's `Calendar` component instead of
   hardcoded placeholder arrays.
   - [ ] Set up a Google Cloud project + OAuth/service account credentials
         for Calendar API access.
   - [ ] Decide on one Google Calendar per schedule (e.g. a "Radio Shows"
         calendar, a "Studio B" calendar) vs. one shared calendar filtered
         by tag/category.
   - [ ] Fetch events (`events.list`) and map them into FullCalendar's
         `events` prop format.
   - [ ] Handle refresh/polling so the displayed schedule stays in sync.

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
