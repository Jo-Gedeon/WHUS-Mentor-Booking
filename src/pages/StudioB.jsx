import React from "react";
import Calendar from "../components/Calendar";

// TODO: replace with real Studio B bookings (e.g. fetched from your API/DB)
const studioBEvents = [
    { title: "Podcast Recording", start: "2026-09-08T09:00:00", end: "2026-09-08T11:00:00" },
    { title: "Band Rehearsal", start: "2026-09-09T18:00:00", end: "2026-09-09T20:00:00" },
];

function StudioB() {
    return (
        <div>
            <h2>Studio B Schedule</h2>
            <Calendar events={studioBEvents} initialView="dayGridMonth" />
        </div>
    );
}

export default StudioB;
