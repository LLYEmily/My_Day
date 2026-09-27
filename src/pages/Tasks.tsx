import { useState } from "react"

import type {
  Dispatch,
  SetStateAction
} from "react"

import type {
  Task,
  TaskType
} from "../types/Task"


type TasksProps = {
  tasks: Task[]

  setTasks:
    Dispatch<
      SetStateAction<Task[]>
    >
}


type TaskSection =
  | "Overdue"
  | "Today"
  | "Tomorrow"
  | "Upcoming"
  | "Completed"


function getLocalDateString(
  date: Date
) {
  return date.toLocaleDateString(
    "en-CA"
  )
}


function formatDueDate(
  date: string
) {
  if (!date) {
    return "No due date"
  }

  const taskDate =
    new Date(
      `${date}T12:00:00`
    )

  return taskDate
    .toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric"
      }
    )
}


function Tasks({
  tasks,
  setTasks
}: TasksProps) {

  const [
    showTaskForm,
    setShowTaskForm
  ] = useState(false)


  const [
    editingTaskId,
    setEditingTaskId
  ] = useState<number | null>(
    null
  )


  const [
    taskName,
    setTaskName
  ] = useState("")


  const [
    course,
    setCourse
  ] = useState("")


  const [
    dueDate,
    setDueDate
  ] = useState("")


  const [
    taskType,
    setTaskType
  ] =
    useState<TaskType>(
      "assignment"
    )


  function resetForm() {
    setTaskName("")
    setCourse("")
    setDueDate("")
    setTaskType("assignment")

    setEditingTaskId(null)
  }


  function openTaskForm() {
    resetForm()

    setShowTaskForm(true)
  }


  function closeTaskForm() {
    resetForm()

    setShowTaskForm(false)
  }


  function editTask(
    task: Task
  ) {
    setEditingTaskId(
      task.id
    )

    setTaskName(
      task.name
    )

    setCourse(
      task.course
    )

    setDueDate(
      task.dueDate
    )

    setTaskType(
      task.type ??
      "study"
    )

    setShowTaskForm(true)
  }


  function saveTask() {
    if (
      taskName.trim() === ""
    ) {
      return
    }


    if (
      editingTaskId !== null
    ) {

      setTasks(
        tasks.map(
          (task) =>
            task.id ===
            editingTaskId

              ? {
                  ...task,

                  name:
                    taskName,

                  course,

                  dueDate,

                  type:
                    taskType
                }

              : task
        )
      )

    } else {

      const newTask: Task = {
        id: Date.now(),

        name:
          taskName,

        course,

        dueDate,

        completed: false,

        type:
          taskType
      }


      setTasks([
        ...tasks,
        newTask
      ])
    }


    closeTaskForm()
  }


  function deleteTask(
    id: number
  ) {
    setTasks(
      tasks.filter(
        (task) =>
          task.id !== id
      )
    )

    closeTaskForm()
  }


  function toggleTask(
    id: number
  ) {
    setTasks(
      tasks.map(
        (task) =>
          task.id === id

            ? {
                ...task,

                completed:
                  !task.completed
              }

            : task
      )
    )
  }


  /* =========================
     TASK SECTIONS
  ========================= */

  const today =
    getLocalDateString(
      new Date()
    )


  const tomorrowDate =
    new Date()

  tomorrowDate.setDate(
    tomorrowDate.getDate() + 1
  )


  const tomorrow =
    getLocalDateString(
      tomorrowDate
    )


  function getTaskSection(
    task: Task
  ): TaskSection {

    if (task.completed) {
      return "Completed"
    }


    if (!task.dueDate) {
      return "Upcoming"
    }


    if (
      task.dueDate < today
    ) {
      return "Overdue"
    }


    if (
      task.dueDate === today
    ) {
      return "Today"
    }


    if (
      task.dueDate === tomorrow
    ) {
      return "Tomorrow"
    }


    return "Upcoming"
  }


  const sortedTasks =
    [...tasks].sort(
      (a, b) => {

        if (
          !a.dueDate &&
          !b.dueDate
        ) {
          return 0
        }


        if (!a.dueDate) {
          return 1
        }


        if (!b.dueDate) {
          return -1
        }


        return a.dueDate
          .localeCompare(
            b.dueDate
          )
      }
    )


  const groupedTasks =
    sortedTasks.reduce<
      Record<
        TaskSection,
        Task[]
      >
    >(
      (
        groups,
        task
      ) => {

        const section =
          getTaskSection(task)


        groups[section]
          .push(task)


        return groups
      },

      {
        Overdue: [],
        Today: [],
        Tomorrow: [],
        Upcoming: [],
        Completed: []
      }
    )


  const sectionOrder:
    TaskSection[] = [
      "Overdue",
      "Today",
      "Tomorrow",
      "Upcoming",
      "Completed"
    ]


  return (
    <div className="tasks-page">

      {/* =====================
          HEADER
      ====================== */}

      <div className="page-top-header">

        <div className="page-title-block">

          <h1>
            Tasks
          </h1>

          <p>
            Your tasks and deadlines.
          </p>

        </div>


        <button
          className="primary-page-button"
          onClick={
            openTaskForm
          }
        >
          + Add Task
        </button>

      </div>


      {/* =====================
          ADD / EDIT TASK
      ====================== */}

      {showTaskForm && (

        <section className="add-task-panel">

          <div className="task-form-heading">

            <div>

              <h2>
                {editingTaskId !== null
                  ? "Edit Task"
                  : "Add Task"}
              </h2>


              <p>
                {editingTaskId !== null
                  ? "Update your task details."
                  : "Add an assignment, test, study task or personal task."}
              </p>

            </div>


            <button
              className="task-form-close"
              onClick={
                closeTaskForm
              }
            >
              ×
            </button>

          </div>


          <div className="task-form">

            <input
              value={
                taskName
              }
              onChange={(e) =>
                setTaskName(
                  e.target.value
                )
              }
              placeholder="Task name"
            />


            <input
              value={
                course
              }
              onChange={(e) =>
                setCourse(
                  e.target.value
                )
              }
              placeholder="Course"
            />


            <input
              type="date"
              value={
                dueDate
              }
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
            />


            <select
              value={
                taskType
              }
              onChange={(e) => {

                const value =
                  e.target.value


                if (
                  value ===
                    "assignment" ||

                  value ===
                    "test" ||

                  value ===
                    "study" ||

                  value ===
                    "personal"
                ) {
                  setTaskType(
                    value
                  )
                }

              }}
            >

              <option value="assignment">
                Assignment
              </option>

              <option value="test">
                Test
              </option>

              <option value="study">
                Study
              </option>

              <option value="personal">
                Personal
              </option>

            </select>

          </div>


          <div className="task-form-actions">

            <button
              className="add-task-button"
              onClick={
                saveTask
              }
            >

              {editingTaskId !== null
                ? "Save Changes"
                : "+ Add Task"}

            </button>


            <button
              className="cancel-task-button"
              onClick={
                closeTaskForm
              }
            >
              Cancel
            </button>


            {editingTaskId !== null && (

              <button
                className="delete-task-button"
                onClick={() =>
                  deleteTask(
                    editingTaskId
                  )
                }
              >
                Delete Task
              </button>

            )}

          </div>

        </section>

      )}


      {/* =====================
          TASK LIST
      ====================== */}

      <div className="task-groups">

        {tasks.length === 0 ? (

          <p className="empty-tasks">
            No tasks yet.
          </p>

        ) : (

          sectionOrder
            .filter(
              (section) =>
                groupedTasks[
                  section
                ].length > 0
            )
            .map(
              (section) => (

                <section
                  className="task-group"
                  key={section}
                >

                  <h2
                    className={`task-date task-section-${section
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {section}
                  </h2>


                  <div className="task-list">

                    {groupedTasks[
                      section
                    ].map(
                      (task) => (

                        <div
                          className={`task-card task-${task.type ?? "study"} ${
                            task.completed
                              ? "completed"
                              : ""
                          }`}
                          key={
                            task.id
                          }
                          onClick={() =>
                            editTask(
                              task
                            )
                          }
                        >

                          <button
                            className="task-check"
                            onClick={(e) => {

                              e.stopPropagation()

                              toggleTask(
                                task.id
                              )

                            }}
                          >

                            {task.completed
                              ? "✓"
                              : ""}

                          </button>


                          <div className="task-info">

                            <strong>
                              {task.name}
                            </strong>


                            <div className="task-meta">

                              {task.course && (

                                <span>
                                  {task.course}
                                </span>

                              )}


                              {task.dueDate && (

                                <span>
                                  {formatDueDate(
                                    task.dueDate
                                  )}
                                </span>

                              )}


                              <span>
                                {task.type ??
                                  "study"}
                              </span>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </section>

              )
            )

        )}

      </div>

    </div>
  )
}


export default Tasks