import { useCallback, useEffect, useRef, useState } from 'react'
import { STORAGE_KEY, loadTasks, newTaskId, saveTasks } from '../storage'
import type { Priority, Task } from '../types'

export interface NewTaskInput {
  title: string
  notes: string
  priority: Priority
}

export interface TaskChanges {
  title?: string
  notes?: string
  priority?: Priority
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const isFirstRender = useRef(true)

  // Persist on every change, skipping the initial mount read-back.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveTasks(tasks)
  }, [tasks])

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === STORAGE_KEY) {
        setTasks(loadTasks())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addTask = useCallback(({ title, notes, priority }: NewTaskInput) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return null

    const now = Date.now()
    const task: Task = {
      id: newTaskId(),
      title: trimmedTitle,
      notes: notes.trim(),
      priority,
      completed: false,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    }

    setTasks((current) => [task, ...current])
    return task
  }, [])

  const updateTask = useCallback((id: string, changes: TaskChanges) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task

        const title = changes.title === undefined ? task.title : changes.title.trim()
        if (!title) return task

        return {
          ...task,
          ...changes,
          title,
          notes: changes.notes === undefined ? task.notes : changes.notes.trim(),
          updatedAt: Date.now(),
        }
      }),
    )
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task
        const completed = !task.completed
        return {
          ...task,
          completed,
          completedAt: completed ? Date.now() : null,
          updatedAt: Date.now(),
        }
      }),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTasks((current) => current.filter((task) => !task.completed))
  }, [])

  return {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  }
}
