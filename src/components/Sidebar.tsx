type SidebarProps = {
  currentPage: string
  setCurrentPage: (page: string) => void
}

function Sidebar({
  currentPage,
  setCurrentPage
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2 className="logo">
        MyDay
      </h2>

      <nav>
        <button
          className={
            currentPage === "today"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("today")
          }
        >
          Today
        </button>

        <button
          className={
            currentPage === "tasks"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("tasks")
          }
        >
          Tasks
        </button>

        <button
          className={
            currentPage === "calendar"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("calendar")
          }
        >
          Calendar
        </button>

        <button
          className={
            currentPage === "habits"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("habits")
          }
        >
          Habits
        </button>

        <button
          className={
            currentPage === "ai"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("ai")
          }
        >
          AI Learning
        </button>

        <button
          className={
            currentPage === "settings"
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentPage("settings")
          }
        >
          Settings
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar