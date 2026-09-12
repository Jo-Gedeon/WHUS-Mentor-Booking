import React, {useState,useEffect} from "react";
import Calendar from "../components/Calendar";


function RadioShows() {
    const [events, setEvents] = useState([]);

    useEffect(()=> {
        fetch("/api/events")
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => console.error("failed to load events:",err))
    }, [])

    return (
        <div>
            <h2>Radio Show Schedule</h2>
            <Calendar events={events} initialView="timeGridWeek" />
        </div>
    );
}

export default RadioShows;
