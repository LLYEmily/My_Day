import {
  useEffect,
  useState
} from "react"

import type {
  Habit,
  HabitType
} from "../types/Habit"


function getTodayString() {
  return new Date()
    .toLocaleDateString("en-CA")
}


function getYesterdayString() {
  const yesterday =
    new Date()

  yesterday.setDate(
    yesterday.getDate() - 1
  )

  return yesterday
    .toLocaleDateString("en-CA")
}


function getNextStreak(
  habit: Habit
) {
  const today =
    getTodayString()

  const yesterday =
    getYesterdayString()


  if (
    habit.lastCompletedDate ===
    today
  ) {
    return habit.streak
  }


  if (
    habit.lastCompletedDate ===
    yesterday
  ) {
    return habit.streak + 1
  }


  return 1
}


function Habits() {

  const [
    habits,
    setHabits
  ] =
    useState<Habit[]>(() => {

      const savedHabits =
        localStorage.getItem(
          "habits"
        )


      if (!savedHabits) {
        return []
      }


      const today =
        getTodayString()


      const parsedHabits:
        Habit[] =
          JSON.parse(
            savedHabits
          )


      return parsedHabits.map(
        (habit) => {

          if (
            habit.lastUpdatedDate !==
            today
          ) {
            return {
              ...habit,

              valueToday: 0,

              lastUpdatedDate:
                today
            }
          }


          return habit
        }
      )
    })


  const [
    showHabitForm,
    setShowHabitForm
  ] = useState(false)


  const [
    editingHabitId,
    setEditingHabitId
  ] =
    useState<number | null>(
      null
    )


  const [
    name,
    setName
  ] = useState("")


  const [
    type,
    setType
  ] =
    useState<HabitType>(
      "complete"
    )


  const [
    target,
    setTarget
  ] = useState(1)


  const [
    unit,
    setUnit
  ] = useState("")


  useEffect(() => {

    localStorage.setItem(
      "habits",
      JSON.stringify(habits)
    )

  }, [habits])


  function resetForm() {

    setName("")
    setType("complete")
    setTarget(1)
    setUnit("")

    setEditingHabitId(null)
  }


  function openAddHabit() {

    resetForm()

    setShowHabitForm(true)
  }


  function closeHabitForm() {

    resetForm()

    setShowHabitForm(false)
  }


  function editHabit(
    habit: Habit
  ) {

    setEditingHabitId(
      habit.id
    )

    setName(
      habit.name
    )

    setType(
      habit.type
    )

    setTarget(
      habit.target
    )

    setUnit(
      habit.unit === "done"
        ? ""
        : habit.unit
    )

    setShowHabitForm(true)
  }


  function saveHabit() {

    if (
      name.trim() === ""
    ) {
      return
    }


    const finalTarget =
      type === "complete"
        ? 1
        : Math.max(
            1,
            target
          )


    const finalUnit =
      type === "complete"
        ? "done"

        : unit.trim() !== ""
          ? unit

          : type === "duration"
            ? "min"
            : "times"


    if (
      editingHabitId !== null
    ) {

      setHabits(
        habits.map(
          (habit) =>
            habit.id ===
            editingHabitId

              ? {
                  ...habit,

                  name,

                  type,

                  target:
                    finalTarget,

                  unit:
                    finalUnit
                }

              : habit
        )
      )

    } else {

      const today =
        getTodayString()


      const newHabit:
        Habit = {

          id: Date.now(),

          name,

          type,

          target:
            finalTarget,

          unit:
            finalUnit,

          valueToday: 0,

          lastUpdatedDate:
            today,

          streak: 0,

          lastCompletedDate:
            ""
        }


      setHabits([
        ...habits,
        newHabit
      ])
    }


    closeHabitForm()
  }


  function deleteHabit(
    id: number
  ) {

    setHabits(
      habits.filter(
        (habit) =>
          habit.id !== id
      )
    )


    closeHabitForm()
  }


  function toggleHabit(
    id: number
  ) {

    const today =
      getTodayString()


    setHabits(
      habits.map(
        (habit) => {

          if (
            habit.id !== id
          ) {
            return habit
          }


          /*
            Complete habit:
            first click completes it.

            We don't undo streak yet,
            because that needs history.
          */

          if (
            habit.valueToday >= 1
          ) {
            return habit
          }


          return {
            ...habit,

            valueToday: 1,

            lastUpdatedDate:
              today,

            streak:
              getNextStreak(
                habit
              ),

            lastCompletedDate:
              today
          }
        }
      )
    )
  }


  function changeHabitValue(
    id: number,
    amount: number
  ) {

    const today =
      getTodayString()


    setHabits(
      habits.map(
        (habit) => {

          if (
            habit.id !== id
          ) {
            return habit
          }


          const newValue =
            Math.max(
              0,

              habit.valueToday +
                amount
            )


          const justCompleted =
            habit.valueToday <
              habit.target &&

            newValue >=
              habit.target


          if (
            justCompleted
          ) {
            return {
              ...habit,

              valueToday:
                newValue,

              lastUpdatedDate:
                today,

              streak:
                getNextStreak(
                  habit
                ),

              lastCompletedDate:
                today
            }
          }


          return {
            ...habit,

            valueToday:
              newValue,

            lastUpdatedDate:
              today
          }
        }
      )
    )
  }


  return (
    <div className="habits-page">

      {/* HEADER */}

      <div className="page-top-header">

        <div className="page-title-block">

          <h1>
            Habits
          </h1>

          <p>
            Small progress,
            every day.
          </p>

        </div>


        <button
          className="primary-page-button"
          onClick={
            openAddHabit
          }
        >
          + Add Habit
        </button>

      </div>


      {/* ADD / EDIT HABIT */}

      {showHabitForm && (

        <section className="habit-form">

          <div className="habit-form-heading">

            <div>

              <h2>
                {editingHabitId !== null
                  ? "Edit Habit"
                  : "Add Habit"}
              </h2>

              <p>
                {editingHabitId !== null
                  ? "Update your habit."
                  : "Create something you want to keep doing."}
              </p>

            </div>


            <button
              className="habit-form-close"
              onClick={
                closeHabitForm
              }
            >
              ×
            </button>

          </div>


          <div className="habit-form-grid">

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Habit name"
            />


            <select
              value={type}
              onChange={(e) => {

                const value =
                  e.target.value


                if (
                  value ===
                    "complete" ||

                  value ===
                    "count" ||

                  value ===
                    "duration"
                ) {
                  setType(value)
                }

              }}
            >

              <option value="complete">
                Complete
              </option>

              <option value="count">
                Count
              </option>

              <option value="duration">
                Duration
              </option>

            </select>


            {type !==
              "complete" && (

              <>

                <input
                  type="number"
                  min="1"
                  value={target}
                  onChange={(e) =>
                    setTarget(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  placeholder="Target"
                />


                <input
                  value={unit}
                  onChange={(e) =>
                    setUnit(
                      e.target.value
                    )
                  }
                  placeholder={
                    type ===
                    "duration"
                      ? "min"
                      : "cups / pages / times"
                  }
                />

              </>

            )}

          </div>


          <div className="habit-form-actions">

            <button
              className="add-habit-button"
              onClick={
                saveHabit
              }
            >

              {editingHabitId !== null
                ? "Save Changes"
                : "+ Add Habit"}

            </button>


            <button
              className="cancel-habit-button"
              onClick={
                closeHabitForm
              }
            >
              Cancel
            </button>


            {editingHabitId !== null && (

              <button
                className="delete-habit-button"
                onClick={() =>
                  deleteHabit(
                    editingHabitId
                  )
                }
              >
                Delete Habit
              </button>

            )}

          </div>

        </section>

      )}


      {/* HABIT LIST */}

      <div className="habit-list">

        {habits.length === 0 ? (

          <p className="empty-habits">
            No habits yet.
          </p>

        ) : (

          habits.map(
            (habit) => {

              const progress =
                habit.target > 0
                  ? Math.min(
                      100,

                      (
                        habit.valueToday /
                        habit.target
                      ) * 100
                    )
                  : 0


              const completed =
                habit.valueToday >=
                habit.target


              return (

                <div
                  className={
                    completed
                      ? "habit-card completed"
                      : "habit-card"
                  }
                  key={
                    habit.id
                  }
                  onClick={() =>
                    editHabit(
                      habit
                    )
                  }
                >

                  <div className="habit-main">

                    <div className="habit-info">

                      <h3>
                        {habit.name}
                      </h3>


                      <p>

                        {habit.type ===
                        "complete"

                          ? completed
                            ? "Completed today"
                            : "Not completed yet"

                          : `${habit.valueToday} / ${habit.target} ${habit.unit}`}

                      </p>


                      {habit.streak >
                        0 && (

                        <span className="habit-streak">
                          🔥 {habit.streak} day
                          {habit.streak === 1
                            ? ""
                            : "s"}
                        </span>

                      )}

                    </div>


                    <div className="habit-controls">

                      {habit.type ===
                      "complete" ? (

                        <button
                          className={
                            completed
                              ? "habit-check completed"
                              : "habit-check"
                          }
                          onClick={(e) => {

                            e.stopPropagation()

                            toggleHabit(
                              habit.id
                            )

                          }}
                        >

                          {completed
                            ? "✓"
                            : "○"}

                        </button>

                      ) : (

                        <>

                          <button
                            onClick={(e) => {

                              e.stopPropagation()

                              changeHabitValue(
                                habit.id,
                                -1
                              )

                            }}
                          >
                            −
                          </button>


                          <button
                            onClick={(e) => {

                              e.stopPropagation()

                              changeHabitValue(
                                habit.id,
                                1
                              )

                            }}
                          >
                            +
                          </button>

                        </>

                      )}

                    </div>

                  </div>


                  {habit.type !==
                    "complete" && (

                    <div className="habit-progress">

                      <div
                        className="habit-progress-fill"
                        style={{
                          width:
                            `${progress}%`
                        }}
                      />

                    </div>

                  )}

                </div>

              )
            }
          )

        )}

      </div>

    </div>
  )
}


export default Habits