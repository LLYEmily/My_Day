export type HabitType =
  | "complete"
  | "count"
  | "duration"

export type Habit = {
  id: number
  name: string
  type: HabitType
  target: number
  unit: string

  valueToday: number
  lastUpdatedDate: string

  streak: number
  lastCompletedDate: string
}