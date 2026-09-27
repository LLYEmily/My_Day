import type { Task } from "../types/Task"
import type { CalendarEvent } from "../types/CalendarEvent"
import type { Habit } from "../types/Habit"

type TodayProps = {
  tasks: Task[]
  setCurrentPage: (page: string) => void
}

type AILesson = {
  id: number
  title: string
  description: string
  completed: boolean
}

function getLocalDateString(date = new Date()) {
  return date.toLocaleDateString("en-CA")
}

function Today({
  tasks,
  setCurrentPage
}: TodayProps) {
  const now = new Date()
  const todayString = getLocalDateString(now)

  const hour = now.getHours()

  let greeting = "Good evening"

  if (hour < 12) {
    greeting = "Good morning"
  } else if (hour < 18) {
    greeting = "Good afternoon"
  }

  const formattedDate = now.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric"
    }
  )

  // -------------------------
  // TASKS
  // -------------------------

  const todayTasks = tasks.filter(
    (task) =>
      task.dueDate === todayString &&
      !task.completed
  )

  // -------------------------
  // CALENDAR
  // -------------------------

  const savedEvents =
    localStorage.getItem("calendarEvents")

  const events: CalendarEvent[] =
    savedEvents
      ? JSON.parse(savedEvents)
      : []

  const weekdayMap = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ]

  const todayWeekday =
    weekdayMap[now.getDay()]

  const todayEvents = events
    .filter((event) => {
      if (event.repeat === "none") {
        return event.startDate === todayString
      }

      if (event.repeat === "weekly") {
        if (
          !event.days.includes(todayWeekday)
        ) {
          return false
        }

        if (
          event.startDate &&
          todayString < event.startDate
        ) {
          return false
        }

        if (
          event.endDate &&
          todayString > event.endDate
        ) {
          return false
        }

        return true
      }

      return false
    })
    .sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    )

  // -------------------------
  // HABITS
  // -------------------------

  const savedHabits =
    localStorage.getItem("habits")

  const habits: Habit[] =
    savedHabits
      ? JSON.parse(savedHabits)
      : []

  const completedHabits =
    habits.filter(
      (habit) =>
        habit.valueToday >= habit.target
    ).length

  // -------------------------
  // AI LEARNING
  // -------------------------

  const savedLessons =
    localStorage.getItem("aiLessons")

  const aiLessons: AILesson[] =
    savedLessons
      ? JSON.parse(savedLessons)
      : []

  const nextLesson =
    aiLessons.find(
      (lesson) => !lesson.completed
    )

  const completedLessons =
    aiLessons.filter(
      (lesson) => lesson.completed
    ).length

  return (
    <div className="today-page">
      <div className="today-header">
        <div>
          <p className="today-date">
            {formattedDate}
          </p>

          <h1>
            {greeting}, Emily 👋
          </h1>

          <p className="today-subtitle">
            Here's what your day looks like.
          </p>
        </div>

        <button
          className="new-task-button"
          onClick={() =>
            setCurrentPage("tasks")
          }
        >
          + New Task
        </button>
      </div>

      <div className="dashboard-grid">

        {/* TASKS */}

        <section className="dashboard-card tasks-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-label">
                TODAY'S TASKS
              </span>

              <h2>
                {todayTasks.length}
              </h2>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                setCurrentPage("tasks")
              }
            >
              View all
            </button>
          </div>

          <div className="today-item-list">
            {todayTasks.length === 0 ? (
              <p className="dashboard-empty">
                Nothing due today 🎉
              </p>
            ) : (
              todayTasks
                .slice(0, 5)
                .map((task) => (
                  <div
                    className="today-task-item"
                    key={task.id}
                  >
                    <span className="today-dot" />

                    <div>
                      <strong>
                        {task.name}
                      </strong>

                      <span>
                        {task.course ||
                          task.type}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* CALENDAR */}

        <section className="dashboard-card calendar-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-label">
                CALENDAR
              </span>

              <h2>
                {todayEvents.length}
              </h2>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                setCurrentPage("calendar")
              }
            >
              Open
            </button>
          </div>

          <div className="today-item-list">
            {todayEvents.length === 0 ? (
              <p className="dashboard-empty">
                No events today.
              </p>
            ) : (
              todayEvents
                .slice(0, 4)
                .map((event) => (
                  <div
                    className="today-event-item"
                    key={event.id}
                  >
                    <div className="today-event-time">
                      {event.startTime}
                    </div>

                    <div>
                      <strong>
                        {event.title}
                      </strong>

                      {event.location && (
                        <span>
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* HABITS */}

        <section className="dashboard-card habits-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-label">
                HABITS
              </span>

              <h2>
                {completedHabits} / {habits.length}
              </h2>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                setCurrentPage("habits")
              }
            >
              Check in
            </button>
          </div>

          {habits.length === 0 ? (
            <p className="dashboard-empty">
              Add your first habit.
            </p>
          ) : (
            <>
              <div className="today-progress">
                <div
                  className="today-progress-fill"
                  style={{
                    width: `${
                      habits.length > 0
                        ? (completedHabits /
                            habits.length) *
                          100
                        : 0
                    }%`
                  }}
                />
              </div>

              <p className="dashboard-small-text">
                {completedHabits ===
                habits.length
                  ? "All done for today ✨"
                  : `${
                      habits.length -
                      completedHabits
                    } left today`}
              </p>
            </>
          )}
        </section>

        {/* AI */}

        <section className="dashboard-card ai-card">
          <div className="dashboard-card-header">
            <div>
              <span className="dashboard-label">
                AI DAILY
              </span>

              <h2>
                {completedLessons} /{" "}
                {aiLessons.length}
              </h2>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                setCurrentPage("ai")
              }
            >
              Learn
            </button>
          </div>

          {nextLesson ? (
            <div className="today-ai-content">
              <span>
                Up next
              </span>

              <strong>
                {nextLesson.title}
              </strong>

              <p>
                {nextLesson.description}
              </p>
            </div>
          ) : aiLessons.length > 0 ? (
            <p className="dashboard-empty">
              Roadmap completed 🎉
            </p>
          ) : (
            <p className="dashboard-empty">
              Start your AI roadmap.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default Today