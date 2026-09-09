type SidebarProps = {
  currentPage: string
  setCurrentPage: (page: string) => void
}

function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2>MyDay</h2>

      <nav>
        <button
  className={currentPage === "today" ? "active" : ""}
  onClick={() => setCurrentPage("today")}
>
  Today
</button>

        <button
  className={currentPage === "tasks" ? "active" : ""}
  onClick={() => setCurrentPage("tasks")}
>
  Tasks
</button>

<button
  className={currentPage === "calendar" ? "active" : ""}
  onClick={() => setCurrentPage("calendar")}
>
  Calendar
</button>

        <button>Habits</button>
        <button>AI Learning</button>
        <button>Settings</button>
      </nav>
    </aside>
  )
}

export default Sidebar