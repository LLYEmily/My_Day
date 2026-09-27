import {
  useEffect,
  useState
} from "react"


function Settings() {

  const [
    name,
    setName
  ] = useState(() => {
    return (
      localStorage.getItem(
        "userName"
      ) || "Emily"
    )
  })


  const [
    dailyGoal,
    setDailyGoal
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        "dailyGoal"
      )

    return saved
      ? Number(saved)
      : 3
  })


  useEffect(() => {

    localStorage.setItem(
      "userName",
      name
    )

  }, [name])


  useEffect(() => {

    localStorage.setItem(
      "dailyGoal",
      String(dailyGoal)
    )

  }, [dailyGoal])


  function clearAllData() {

    const confirmed =
      window.confirm(
        "Clear all MyDay data? This cannot be undone."
      )

    if (!confirmed) {
      return
    }


    localStorage.removeItem(
      "tasks"
    )

    localStorage.removeItem(
      "calendarEvents"
    )

    localStorage.removeItem(
      "habits"
    )

    localStorage.removeItem(
      "aiLessons"
    )


    window.location.reload()
  }


  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="page-top-header">

        <div className="page-title-block">

          <h1>
            Settings
          </h1>

          <p>
            Make MyDay work for you.
          </p>

        </div>

      </div>


      {/* PROFILE */}

      <section className="settings-card">

        <h2>
          Profile
        </h2>

        <div className="settings-field">

          <label>
            Your name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Your name"
          />

          <span>
            Used in your Today greeting.
          </span>

        </div>

      </section>


      {/* DAILY PLANNING */}

      <section className="settings-card">

        <h2>
          Daily Planning
        </h2>


        <div className="settings-field">

          <label>
            Daily task goal
          </label>

          <input
            type="number"
            min="1"
            max="10"
            value={dailyGoal}
            onChange={(e) =>
              setDailyGoal(
                Math.max(
                  1,
                  Number(
                    e.target.value
                  )
                )
              )
            }
          />

          <span>
            How many important tasks
            you want to finish each day.
          </span>

        </div>

      </section>


      {/* DATA */}

      <section className="settings-card">

        <h2>
          Data
        </h2>

        <p className="settings-description">
          MyDay currently stores your
          tasks, calendar, habits and
          learning progress locally on
          this device.
        </p>


        <button
          className="clear-data-button"
          onClick={
            clearAllData
          }
        >
          Clear MyDay Data
        </button>

      </section>

    </div>
  )
}


export default Settings