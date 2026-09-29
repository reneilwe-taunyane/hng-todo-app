export const PRIORITIES = ['low', 'medium', 'high'] as const

export type Priority = (typeof PRIORITIES)[number]

export interface Task {
  id: string
  title: string
  notes: string
  priority: Priority
  completed: boolean
  createdAt: number
  updatedAt: number
  completedAt: number | null
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const PRIORITY_DESCRIPTIONS: Record<Priority, string> = {
  low: 'Can be done when there is time',
  medium: 'Should be done soon',
  high: 'Needs attention first',
}

/** Lower weight sorts first. Used when sorting a list by priority. */
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export type Filter = 'all' | 'active' | 'completed'

export const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export const DEFAULT_PRIORITY: Priority = 'medium'
