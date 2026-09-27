import { useEffect, useState } from "react"

import Sidebar from "./components/Sidebar"

import Today from "./pages/Today"
import Tasks from "./pages/Tasks"
import Calendar from "./pages/Calendar"
import Habits from "./pages/Habits"
import AILearning from "./pages/AILearning"
import Settings from "./pages/Settings"

import type { Task } from "./types/Task"

import "./App.css"

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
  {currentPage === "today" && (
  <Today
    tasks={tasks}
    setCurrentPage={setCurrentPage}
  />
)}

  {currentPage === "tasks" && (
    <Tasks
      tasks={tasks}
      setTasks={setTasks}
    />
  )}

  {currentPage === "calendar" && (
    <Calendar />
  )}

  {currentPage === "habits" && (
    <Habits />
  )}

  {currentPage === "ai" && (
    <AILearning />
  )}

  {currentPage === "settings" && (
    <Settings />
  )}
</main>
    </div>
  )
}

export default App