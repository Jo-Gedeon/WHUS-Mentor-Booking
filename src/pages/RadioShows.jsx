import React from "react";
import Calendar from "../components/Calendar";

// TODO: replace with real radio show bookings (e.g. fetched from your API/DB)
const radioShowEvents = [
    { title: "Morning Show", start: "2026-09-07T08:00:00", end: "2026-09-07T10:00:00" },
    { title: "Afternoon Mix", start: "2026-09-07T14:00:00", end: "2026-09-07T16:00:00" },
];

function RadioShows() {
    return (
        <div>
            <h2>Radio Show Schedule</h2>
            <Calendar events={radioShowEvents} initialView="timeGridWeek" />
        </div>
    );
}

export default RadioShows;
