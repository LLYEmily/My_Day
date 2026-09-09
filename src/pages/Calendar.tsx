import { useEffect, useState } from "react"
import type {
    CalendarEvent,
    EventCategory,
    RepeatType
} from "../types/CalendarEvent"

const weekdays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri"
]

const initialEvents: CalendarEvent[] = [
    {
        id: 1,
        title: "CPSC 213 Lecture",
        category: "course",

        repeat: "weekly",
        days: ["Mon", "Wed", "Fri"],

        startTime: "10:00",
        endTime: "10:50",

        startDate: "2026-09-08",
        endDate: "2026-12-04",

        location: "DMP 110",
        notes: ""
    },

    {
        id: 2,
        title: "CPSC 213 Lab",
        category: "lab",

        repeat: "weekly",
        days: ["Tue"],

        startTime: "14:00",
        endTime: "16:00",

        startDate: "2026-09-08",
        endDate: "2026-12-04",

        location: "ICCS",
        notes: "Bring laptop"
    }
]

function Calendar() {
    const [events, setEvents] =
        useState<CalendarEvent[]>(() => {
            const savedEvents =
                localStorage.getItem("calendarEvents")

            if (savedEvents) {
                return JSON.parse(savedEvents)
            }

            return initialEvents
        })

    useEffect(() => {
        localStorage.setItem(
            "calendarEvents",
            JSON.stringify(events)
        )
    }, [events])

    const [title, setTitle] =
        useState("")

    const [category, setCategory] =
        useState<EventCategory>("course")

    const [repeat, setRepeat] =
        useState<RepeatType>("weekly")

    const [days, setDays] =
        useState<string[]>([])

    const [startTime, setStartTime] =
        useState("")

    const [endTime, setEndTime] =
        useState("")

    const [startDate, setStartDate] =
        useState("")

    const [endDate, setEndDate] =
        useState("")

    const [location, setLocation] =
        useState("")

    const [notes, setNotes] =
        useState("")

        const [editingEventId, setEditingEventId] =
  useState<number | null>(null)

        

    const [currentWeekStart, setCurrentWeekStart] =
        useState(() => {
            const today = new Date()

            const day = today.getDay()
            const diff =
                day === 0
                    ? -6
                    : 1 - day

            const monday = new Date(today)
            monday.setDate(today.getDate() + diff)
            monday.setHours(0, 0, 0, 0)

            return monday
        })

    const weekDates = getWeekDates()

    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(currentWeekStart.getDate() + 6)


    function formatDate(date: Date) {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        })
    }

    function formatDayHeader(date: Date) {
        return {
            weekday: date.toLocaleDateString("en-US", {
                weekday: "short"
            }),
            dayNumber: date.getDate()
        }
    }

    function getWeekDates() {
        return weekdays.map((_, index) => {
            const date = new Date(currentWeekStart)
            date.setDate(currentWeekStart.getDate() + index)
            return date
        })
    }

    function goToPreviousWeek() {
        const previous = new Date(currentWeekStart)
        previous.setDate(previous.getDate() - 7)

        setCurrentWeekStart(previous)
    }

    function goToNextWeek() {
        const next = new Date(currentWeekStart)
        next.setDate(next.getDate() + 7)

        setCurrentWeekStart(next)
    }

    function toggleDay(day: string) {
        if (days.includes(day)) {
            setDays(
                days.filter((d) => d !== day)
            )
        } else {
            setDays([...days, day])
        }
    }

    function saveEvent() {
  if (title.trim() === "") {
    return
  }

  if (
    repeat === "weekly" &&
    days.length === 0
  ) {
    return
  }

  const eventDetails = {
    title,
    category,

    repeat,

    days:
      repeat === "weekly"
        ? days
        : [],

    startTime,
    endTime,

    startDate,

    endDate:
      repeat === "weekly"
        ? endDate
        : startDate,

    location,
    notes
  }

  if (editingEventId !== null) {
    setEvents(
      events.map((event) =>
        event.id === editingEventId
          ? {
              id: editingEventId,
              ...eventDetails
            }
          : event
      )
    )
  } else {
    setEvents([
      ...events,
      {
        id: Date.now(),
        ...eventDetails
      }
    ])
  }

  resetForm()
}

function resetForm() {
  setTitle("")
  setCategory("course")
  setRepeat("weekly")

  setDays([])

  setStartTime("")
  setEndTime("")

  setStartDate("")
  setEndDate("")

  setLocation("")
  setNotes("")

  setEditingEventId(null)
}
function editEvent(event: CalendarEvent) {
  setEditingEventId(event.id)

  setTitle(event.title)
  setCategory(event.category)
  setRepeat(event.repeat)

  setDays(event.days)

  setStartTime(event.startTime)
  setEndTime(event.endTime)

  setStartDate(event.startDate)
  setEndDate(event.endDate)

  setLocation(event.location)
  setNotes(event.notes)
}

function deleteEvent(id: number) {
  setEvents(
    events.filter(
      (event) => event.id !== id
    )
  )

  if (editingEventId === id) {
    resetForm()
  }
}




    return (
        <div className="calendar-page">

            <div className="calendar-header">
                <div>
                    <h1>Calendar</h1>

                    <p>
                        Your classes, labs and events.
                    </p>
                </div>
            </div>

            <div className="week-navigation">
                <button
                    type="button"
                    onClick={goToPreviousWeek}
                >
                    ‹
                </button>

                <strong>
                    {formatDate(currentWeekStart)}
                    {" - "}
                    {formatDate(weekEnd)}
                </strong>

                <button
                    type="button"
                    onClick={goToNextWeek}
                >
                    ›
                </button>
            </div>

            <section className="event-form">
                <h2>
  {editingEventId === null
    ? "Add Event"
    : "Edit Event"}
</h2>

                <div className="event-form-grid">

                    <div className="event-field">
                        <label>Event name</label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="CPSC 213 Lecture"
                        />
                    </div>

                    <div className="event-field">
                        <label>Category</label>

                        <select
                            value={category}
                            onChange={(e) => {
                                const value = e.target.value

                                if (
                                    value === "course" ||
                                    value === "lab" ||
                                    value === "event"
                                ) {
                                    setCategory(value)
                                }
                            }}
                        >
                            <option value="course">
                                Course
                            </option>

                            <option value="lab">
                                Lab
                            </option>

                            <option value="event">
                                Event
                            </option>
                        </select>
                    </div>

                    <div className="event-field">
                        <label>Repeat</label>

                        <select
                            value={repeat}
                            onChange={(e) => {
                                const value = e.target.value

                                if (
                                    value === "none" ||
                                    value === "weekly"
                                ) {
                                    setRepeat(value)
                                }
                            }}
                        >
                            <option value="none">
                                Does not repeat
                            </option>

                            <option value="weekly">
                                Weekly
                            </option>
                        </select>
                    </div>

                </div>

                {repeat === "weekly" && (
                    <div className="repeat-section">
                        <label>Repeat on</label>

                        <div className="weekday-picker">
                            {weekdays.map((day) => (
                                <button
                                    key={day}
                                    type="button"

                                    className={
                                        days.includes(day)
                                            ? "selected"
                                            : ""
                                    }

                                    onClick={() =>
                                        toggleDay(day)
                                    }
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="event-time-row">
                    <div className="event-field">
                        <label>Start time</label>

                        <input
                            type="time"

                            value={startTime}

                            onChange={(e) =>
                                setStartTime(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="event-field">
                        <label>End time</label>

                        <input
                            type="time"

                            value={endTime}

                            onChange={(e) =>
                                setEndTime(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <div className="event-date-row">

                    <div className="event-field">
                        <label>
                            {repeat === "weekly"
                                ? "Starts"
                                : "Date"}
                        </label>

                        <input
                            type="date"

                            value={startDate}

                            onChange={(e) =>
                                setStartDate(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {repeat === "weekly" && (
                        <div className="event-field">
                            <label>Repeat until</label>

                            <input
                                type="date"

                                value={endDate}

                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    )}

                </div>

                <div className="event-form-grid">

                    <div className="event-field">
                        <label>Location</label>

                        <input
                            value={location}

                            onChange={(e) =>
                                setLocation(
                                    e.target.value
                                )
                            }

                            placeholder="DMP 110"
                        />
                    </div>

                    <div className="event-field event-notes">
                        <label>Notes</label>

                        <textarea
                            value={notes}

                            onChange={(e) =>
                                setNotes(
                                    e.target.value
                                )
                            }

                            placeholder="Anything you want to remember..."
                        />
                    </div>

                </div>

                <div className="event-form-actions">
  <button
    className="add-event-button"
    type="button"
    onClick={saveEvent}
  >
    {editingEventId === null
      ? "+ Add Event"
      : "Save Changes"}
  </button>

  {editingEventId !== null && (
    <button
      className="cancel-edit-button"
      type="button"
      onClick={resetForm}
    >
      Cancel
    </button>
  )}
</div>

            </section>

            <div className="week-grid">

                {weekDates.map((date, index) => {
                    const day = weekdays[index]
                    const header = formatDayHeader(date)

                    return (
                        <div
                            className="week-column"
                            key={day}
                        >

                            <h2>
                                {header.weekday}
                                <span>{header.dayNumber}</span>
                            </h2>

                            <div className="week-events">

                                {events
                                    .filter((event) => {
                                        const eventDate =
                                            date.toISOString().split("T")[0]

                                        if (event.repeat === "none") {
                                            return event.startDate === eventDate
                                        }

                                        if (event.repeat === "weekly") {
                                            if (!event.days.includes(day)) {
                                                return false
                                            }

                                            if (
                                                event.startDate &&
                                                eventDate < event.startDate
                                            ) {
                                                return false
                                            }

                                            if (
                                                event.endDate &&
                                                eventDate > event.endDate
                                            ) {
                                                return false
                                            }

                                            return true
                                        }

                                        return false
                                    })

                                    .map((event) => (

                                        <div
                                            key={event.id}

                                            className={
                                                `calendar-event event-${event.category}`
                                            }
                                        >

                                            <strong>
                                                {event.title}
                                            </strong>

                                            <span>
                                                {event.startTime}
                                                {" - "}
                                                {event.endTime}
                                            </span>

                                            {event.location && (
                                                <span>
                                                    📍 {event.location}
                                                </span>
                                            )}

                                            {event.notes && (
                                                <span className="event-note">
                                                    {event.notes}
                                                </span>
                                            )}

                                            <div className="event-actions">
  <button
    type="button"
    onClick={() =>
      editEvent(event)
    }
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() =>
      deleteEvent(event.id)
    }
  >
    Delete
  </button>
</div>

                                        </div>

                                    ))}

                            </div>

                        </div>
                    )
                })}

            </div>

        </div>
    )
}

export default Calendar