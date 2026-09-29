import { DEFAULT_PRIORITY, PRIORITIES } from './types'
import type { Priority, Task } from './types'

export const STORAGE_KEY = 'hng-todo-app:tasks:v1'

function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value)
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asTimestamp(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Coerces an unknown value into a Task, dropping anything unusable.
 * Guards against malformed or hand-edited localStorage payloads.
 */
function toTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null) return null

  const raw = value as Record<string, unknown>
  const title = asString(raw.title).trim()
  if (!title) return null

  const now = Date.now()
  const completed = raw.completed === true
  const completedAt =
    raw.completedAt === null || raw.completedAt === undefined
      ? null
      : asTimestamp(raw.completedAt, now)

  return {
    id: asString(raw.id) || createId(),
    title,
    notes: asString(raw.notes),
    priority: isPriority(raw.priority) ? raw.priority : DEFAULT_PRIORITY,
    completed,
    createdAt: asTimestamp(raw.createdAt, now),
    updatedAt: asTimestamp(raw.updatedAt, now),
    completedAt: completed ? completedAt : null,
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(toTask)
      .filter((task): task is Task => task !== null)
      .map((task) => ({ ...task, id: task.id || createId() }))
  } catch (error) {
    console.warn('Could not read tasks from localStorage, starting empty.', error)
    return []
  }
}

export function saveTasks(tasks: Task[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch (error) {
    console.warn('Could not save tasks to localStorage.', error)
    return false
  }
}

export function newTaskId(): string {
  return createId()
}
