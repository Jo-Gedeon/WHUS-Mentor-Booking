// Express app entry point for the WHUS Booking Calendar backend.
//
// Run with `npm start` / `npm run dev` from this server/ folder.
// See server/.env.example for the environment variables this expects.

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const eventsRouter = require("./routes/events");

const app = express();

app.use(cors());

// Simple liveness check.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// All Google Calendar read logic lives in routes/events.js — mounted here.
app.use("/api/events", eventsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
