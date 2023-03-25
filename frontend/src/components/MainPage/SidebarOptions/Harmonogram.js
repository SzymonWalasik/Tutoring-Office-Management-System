import Sidebar from "../Sidebar";
import "./Harmonogram.css";
import TopNavbar from "../../TopNavbar/TopNavbar";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const locales = {
    "pl": require("date-fns/locale/pl"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const events = [
    {
        title: "Meeting",
        allDay: true,
        start: new Date(2021, 6, 0),
        end: new Date(2021, 6, 0),
        teacher: "aaa"
    }
];

function Harmonogram() {
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", teacher: "" });
    const [allEvents, setAllEvents] = useState(events);

    function handleAddEvent() {
        setAllEvents([...allEvents, newEvent]);
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
                <section className="calendar-container">
                    <h1 className="calendar-header">Harmonogram</h1>
                    <div className="calendar-subcontainer">
                        <div className="inputs-form">
                            <input className="calendar-inputs" type="text" placeholder="Dodaj tytuł" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                            <DatePicker className="calendar-inputs" placeholderText="Data rozpoczęcia" selected={newEvent.start} onChange={(start) => setNewEvent({ ...newEvent, start })} showTimeSelect />
                            <DatePicker className="calendar-inputs" placeholderText="Data zakończenia" selected={newEvent.end} onChange={(end) => setNewEvent({ ...newEvent, end })} showTimeSelect />
                            <input className="calendar-inputs" type="text" placeholder="Nauczyciel prowadzący" value={newEvent.teacher} onChange={(t) => setNewEvent({ ...newEvent, teacher: t.target.value })} />
                            <button className="calendar-button" onClick={handleAddEvent}>Dodaj wydarzenie</button>
                        </div>
                        <div className="calendar-subcontainer-2">
                            <div className="calendar-subcontainer-3">
                                <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px", width: "auto" }} />
                            </div>
                        </div>
                    </div>
                </section>
            </Sidebar>
        </div>
    )
}

export default Harmonogram;