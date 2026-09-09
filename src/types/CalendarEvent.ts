export type EventCategory =
  | "course"
  | "lab"
  | "event"

export type RepeatType =
  | "none"
  | "weekly"

export type CalendarEvent = {
  id: number

  title: string
  category: EventCategory

  repeat: RepeatType
  days: string[]

  startTime: string
  endTime: string

  startDate: string
  endDate: string

  location: string
  notes: string
}