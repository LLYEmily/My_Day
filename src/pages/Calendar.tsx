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


function getLocalDateString(date: Date) {
  return date.toLocaleDateString("en-CA")
}


function getMonday(date: Date) {
  const newDate = new Date(date)

  const day = newDate.getDay()

  const difference =
    day === 0
      ? -6
      : 1 - day

  newDate.setDate(
    newDate.getDate() + difference
  )

  newDate.setHours(0, 0, 0, 0)

  return newDate
}


function Calendar() {
  const [events, setEvents] =
    useState<CalendarEvent[]>(() => {
      const saved =
        localStorage.getItem("calendarEvents")

      if (saved) {
        return JSON.parse(saved)
      }

      return initialEvents
    })


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


  const [
    editingEventId,
    setEditingEventId
  ] = useState<number | null>(null)


  const [
    showEventForm,
    setShowEventForm
  ] = useState(false)


  const [
    currentWeekStart,
    setCurrentWeekStart
  ] = useState(() =>
    getMonday(new Date())
  )


  useEffect(() => {
    localStorage.setItem(
      "calendarEvents",
      JSON.stringify(events)
    )
  }, [events])


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


  function openAddEvent() {
    resetForm()
    setShowEventForm(true)
  }


  function closeEventForm() {
    resetForm()
    setShowEventForm(false)
  }


  function toggleDay(day: string) {
    if (days.includes(day)) {
      setDays(
        days.filter(
          (selectedDay) =>
            selectedDay !== day
        )
      )
    } else {
      setDays([
        ...days,
        day
      ])
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
      const newEvent: CalendarEvent = {
        id: Date.now(),
        ...eventDetails
      }

      setEvents([
        ...events,
        newEvent
      ])
    }


    resetForm()
    setShowEventForm(false)
  }


  function editEvent(
    event: CalendarEvent
  ) {
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

    setShowEventForm(true)
  }


  function deleteEvent(id: number) {
    setEvents(
      events.filter(
        (event) =>
          event.id !== id
      )
    )

    if (editingEventId === id) {
      closeEventForm()
    }
  }


  function getWeekDates() {
    return weekdays.map(
      (_, index) => {
        const date =
          new Date(currentWeekStart)

        date.setDate(
          currentWeekStart.getDate() +
            index
        )

        return date
      }
    )
  }


  const weekDates =
    getWeekDates()


  function previousWeek() {
    const previous =
      new Date(currentWeekStart)

    previous.setDate(
      previous.getDate() - 7
    )

    setCurrentWeekStart(previous)
  }


  function nextWeek() {
    const next =
      new Date(currentWeekStart)

    next.setDate(
      next.getDate() + 7
    )

    setCurrentWeekStart(next)
  }


  function goToToday() {
    setCurrentWeekStart(
      getMonday(new Date())
    )
  }


  function formatWeekRange() {
    const first =
      weekDates[0]

    const last =
      weekDates[
        weekDates.length - 1
      ]

    const firstMonth =
      first.toLocaleDateString(
        "en-US",
        {
          month: "short"
        }
      )

    const lastMonth =
      last.toLocaleDateString(
        "en-US",
        {
          month: "short"
        }
      )

    if (
      firstMonth === lastMonth
    ) {
      return `${firstMonth} ${first.getDate()} – ${last.getDate()}, ${last.getFullYear()}`
    }

    return `${firstMonth} ${first.getDate()} – ${lastMonth} ${last.getDate()}, ${last.getFullYear()}`
  }


  return (
    <div className="calendar-page">

      {/* HEADER */}

      <div className="calendar-header">
        <div className="calendar-title">
          <h1>
            Calendar
          </h1>

          <p>
            Your classes, labs and events.
          </p>
        </div>

        <button
          className="new-event-button"
          onClick={openAddEvent}
        >
          + Add Event
        </button>
      </div>


      {/* ADD / EDIT FORM */}

      {showEventForm && (
        <section className="event-form">

          <div className="event-form-heading">
            <div>
              <h2>
                {editingEventId !== null
                  ? "Edit Event"
                  : "Add Event"}
              </h2>

              <p>
                Add a class, lab or
                personal event.
              </p>
            </div>

            <button
              className="event-form-close"
              onClick={closeEventForm}
            >
              ×
            </button>
          </div>


          <div className="event-form-grid">

            <div className="event-field event-title-field">
              <label>
                Event name
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="CPSC 213 Lecture"
              />
            </div>


            <div className="event-field">
              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  const value =
                    e.target.value

                  if (
                    value ===
                      "course" ||
                    value ===
                      "lab" ||
                    value ===
                      "event"
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
              <label>
                Repeat
              </label>

              <select
                value={repeat}
                onChange={(e) => {
                  const value =
                    e.target.value

                  if (
                    value === "none" ||
                    value === "weekly"
                  ) {
                    setRepeat(value)
                  }
                }}
              >
                <option value="weekly">
                  Weekly
                </option>

                <option value="none">
                  Does not repeat
                </option>
              </select>
            </div>

          </div>


          {repeat === "weekly" && (
            <div className="repeat-section">

              <label>
                Repeat on
              </label>

              <div className="weekday-picker">
                {weekdays.map(
                  (day) => (
                    <button
                      key={day}
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
                  )
                )}
              </div>
            </div>
          )}


          <div className="event-form-grid event-form-four">

            <div className="event-field">
              <label>
                Start time
              </label>

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
              <label>
                End time
              </label>

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
                <label>
                  Repeat until
                </label>

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


          <div className="event-form-grid event-form-two">

            <div className="event-field">
              <label>
                Location
              </label>

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


            <div className="event-field">
              <label>
                Notes
              </label>

              <input
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                placeholder="Optional notes"
              />
            </div>

          </div>


          <div className="event-form-actions">

  <button
    className="add-event-button"
    onClick={saveEvent}
  >
    {editingEventId !== null
      ? "Save Changes"
      : "+ Add Event"}
  </button>


  <button
    className="cancel-edit-button"
    onClick={closeEventForm}
  >
    Cancel
  </button>


  {editingEventId !== null && (
    <button
      className="delete-event-button"
      onClick={() =>
        deleteEvent(editingEventId)
      }
    >
      Delete Event
    </button>
  )}

</div>

        </section>
      )}


      {/* WEEK CONTROLS */}

      <div className="calendar-toolbar">

        <div className="week-navigation">

          <button
            onClick={previousWeek}
          >
            ‹
          </button>

          <button
            className="today-button"
            onClick={goToToday}
          >
            Today
          </button>

          <button
            onClick={nextWeek}
          >
            ›
          </button>

        </div>


        <h2 className="week-range">
          {formatWeekRange()}
        </h2>

      </div>


      {/* WEEK CALENDAR */}

      <div className="week-grid">

        {weekDates.map(
          (date, index) => {

            const day =
              weekdays[index]

            const eventDate =
              getLocalDateString(date)

            const dayEvents =
              events
                .filter(
                  (event) => {

                    if (
                      event.repeat ===
                      "none"
                    ) {
                      return (
                        event.startDate ===
                        eventDate
                      )
                    }


                    if (
                      event.repeat ===
                      "weekly"
                    ) {
                      if (
                        !event.days.includes(
                          day
                        )
                      ) {
                        return false
                      }


                      if (
                        event.startDate &&
                        eventDate <
                          event.startDate
                      ) {
                        return false
                      }


                      if (
                        event.endDate &&
                        eventDate >
                          event.endDate
                      ) {
                        return false
                      }


                      return true
                    }


                    return false
                  }
                )
                .sort(
                  (a, b) =>
                    a.startTime.localeCompare(
                      b.startTime
                    )
                )


            const today =
              getLocalDateString(
                new Date()
              )

            const isToday =
              eventDate === today


            return (
              <div
                className={
                  isToday
                    ? "week-column today-column"
                    : "week-column"
                }
                key={eventDate}
              >

                <div className="week-day-header">

                  <span>
                    {day}
                  </span>

                  <strong>
                    {date.getDate()}
                  </strong>

                </div>


                <div className="week-events">

                  {dayEvents.map(
                    (event) => (
                      <div
  key={event.id}
  className={`calendar-event event-${event.category}`}
  onClick={() => editEvent(event)}
>

                        <div className="event-time">
                          {event.startTime}

                          {event.endTime &&
                            ` – ${event.endTime}`}
                        </div>


                        <strong className="event-title">
                          {event.title}
                        </strong>


                        {event.location && (
                          <span className="event-location">
                            📍 {event.location}
                          </span>
                        )}


                        {event.notes && (
                          <span className="event-notes">
                            {event.notes}
                          </span>
                        )}


                        

                      </div>
                    )
                  )}

                </div>

              </div>
            )
          }
        )}

      </div>

    </div>
  )
}


export default Calendar