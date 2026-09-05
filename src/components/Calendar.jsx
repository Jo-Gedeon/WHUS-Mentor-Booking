import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

// Generic, reusable calendar. Pass in whatever events/config belong to a
// particular schedule (Radio Shows, Studio B, etc.) from the page that
// renders it.
function Calendar({
    events = [],
    initialView = "dayGridMonth",
    weekends = true,
}) {
    return (
        <div>
            <Fullcalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={initialView}
                headerToolbar={{
                    start: "today prev next",
                    center: "title",
                    end: "timeGridDay,timeGridWeek,dayGridMonth"
                }}
                weekends={weekends}
                events={events}
            />
        </div>
    )
}

export default Calendar
