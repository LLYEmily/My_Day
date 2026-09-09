import { useState } from "react"
import type { Task, TaskType } from "../types/Task"

type TasksProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

function Tasks({ tasks, setTasks }: TasksProps) {
  const [taskName, setTaskName] = useState("")
  const [course, setCourse] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [taskType, setTaskType] = useState<TaskType>("assignment")

  function toggleTask(id: number) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed
        }
      }

      return task
    })

    setTasks(updatedTasks)
  }

  function addTask() {
    if (taskName.trim() === "") return

    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      course: course,
      dueDate: dueDate,
      completed: false,
      type: taskType
    }

    setTasks([...tasks, newTask])

    setTaskName("")
    setCourse("")
    setDueDate("")
    setTaskType("assignment")
  }

  function formatTaskDate(date: string) {
  if (date === "No due date") return "NO DUE DATE"

  const today = new Date()
  const taskDate = new Date(date + "T00:00:00")

  const todayString = today.toISOString().split("T")[0]

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowString = tomorrow.toISOString().split("T")[0]

  if (date === todayString) {
    return "TODAY"
  }

  if (date === tomorrowString) {
    return "TOMORROW"
  }

  return taskDate
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    })
    .toUpperCase()
}

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1

    return a.dueDate.localeCompare(b.dueDate)
  })

  const groupedTasks = sortedTasks.reduce<Record<string, Task[]>>(
    (groups, task) => {
      const date = task.dueDate || "No due date"

      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(task)

      return groups
    },
    {}
  )

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Keep track of assignments, tests and everyday things.</p>
        </div>
      </div>

      <section className="add-task-panel">
        <h2>Add Task</h2>

        <div className="task-form">
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task name"
          />

          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Course or category"
          />

          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskType)}
          >
            <option value="assignment">Assignment</option>
            <option value="test">Test</option>
            <option value="study">Study</option>
            <option value="personal">Personal</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button className="add-task-button" onClick={addTask}>
            + Add Task
          </button>
        </div>
      </section>

      <div className="task-groups">
        {Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <section className="task-group" key={date}>
            <h2 className="task-date">
  {formatTaskDate(date)}
</h2>

            <div className="task-list">
              {dateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card task-${task.type ?? "study"}`}
                >
                  <button
                    className="task-check"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? "✓" : "○"}
                  </button>

                  <div className="task-info">
                    <h3 className={task.completed ? "completed" : ""}>
                      {task.name}
                    </h3>

                    <div className="task-meta">
                      {task.course && <span>{task.course}</span>}

                      <span className="task-type">
                        {task.type ?? "study"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {tasks.length === 0 && (
          <div className="empty-tasks">
            <p>No tasks yet ✨</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tasks