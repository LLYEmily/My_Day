export type TaskType =
  | "assignment"
  | "test"
  | "study"
  | "personal"

export type Task = {
  id: number
  name: string
  course: string
  dueDate: string
  completed: boolean
  type: TaskType
}