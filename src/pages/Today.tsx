import type { Task } from "../types/Task"

type TodayProps = {
    tasks: Task[]
}

function Today({ tasks }: TodayProps) {
    return (
        <div className="today-page">
            <header className="today-header">
                <div>
                    <p className="today-date">Thursday, August 20</p>
                    <h1>Good evening 👋</h1>
                    <p className="today-subtitle">
                        Here's what's happening today.
                    </p>
                </div>

                <button className="new-task-button">
                    + New Task
                </button>
            </header>

            <div className="dashboard-grid">
                <section className="dashboard-card tasks-card">
                    <h2>Today's Tasks</h2>
                    {tasks.length === 0 ? (
                        <p>No tasks yet. Enjoy your day ✨</p>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id}>
                                <strong>{task.name}</strong>
                                <p>{task.course} · {task.dueDate}</p>
                            </div>
                        ))
                    )}
                </section>

                <section className="dashboard-card calendar-card">
                    <h2>Calendar</h2>
                    <p>Your schedule will appear here.</p>
                </section>

                <section className="dashboard-card habits-card">
                    <h2>Habits</h2>
                    <p>Keep your streak going 🌱</p>
                </section>

                <section className="dashboard-card ai-card">
                    <h2>AI · Daily</h2>
                    <p>A little AI every day ✨</p>
                </section>
            </div>
        </div>
    )
}

export default Today