

const express = require("express");
//calls our readable object so we can get events
const { calendar } = require("../googleCalendarClient");

const router = express.Router();

router.get("/", async (req, res) => {
  const { calendarId, start, end } = req.query;

  // Fall back to the calendar configured in .env if none was passed in
  // the query string.
  const targetCalendarId = calendarId || process.env.GOOGLE_CALENDAR_ID;

  // --- Not implemented yet: the actual Google Calendar read ---
  //
  try {
    const response = await calendar.events.list({
      calendarId: targetCalendarId,
      timeMin: start, 
      timeMax: end,
      singleEvents: true, // expand recurring events into individual instances
      orderBy: "startTime",
    });
  
    // Google's raw event objects have a lot of fields we don't need.
    // Map them down into a plain array shaped like what FullCalendar
    // (src/components/Calendar.jsx) expects.
    const events = (response.data.items || []).map((event) => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      organizer: event.organizer,
    }));
  
    res.json(events);
  } catch (err) {
    console.error("Failed to fetch calendar events:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }

});

module.exports = router;
