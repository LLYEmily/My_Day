import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import "./App.css"
import Today from "./pages/Today"
import Tasks from "./pages/Tasks"
import type { Task } from "./types/Task"
import Calendar from "./pages/Calendar"

function App() {
  const [currentPage, setCurrentPage] = useState("today")
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks")

    if (savedTasks) {
      return JSON.parse(savedTasks)
    }

    return []
  })
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main-content">
        {currentPage === "today" && <Today tasks={tasks} />}
        {currentPage === "tasks" && (
          <Tasks
            tasks={tasks}
            setTasks={setTasks}
          />
        )}
        {currentPage === "calendar" && <Calendar />}
      </main>
    </div>
  )
}

export default App