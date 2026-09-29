import { useEffect, useState } from 'react'
import type { Priority, Task } from '../types'
import { formatTimestamp } from '../utils/formatTimestamp'
import { EditTaskForm } from './EditTaskForm'
import { PriorityBadge } from './PriorityBadge'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onUpdate: (id: string, changes: { title: string; notes: string; priority: Priority }) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  useEffect(() => {
    if (!isConfirmingDelete) return
    const timer = window.setTimeout(() => setIsConfirmingDelete(false), 4000)
    return () => window.clearTimeout(timer)
  }, [isConfirmingDelete])

  const startEditing = () => {
    setIsConfirmingDelete(false)
    setShowNotes(false)
    setIsEditing(true)
  }

  const handleDelete = () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }
    onDelete(task.id)
  }

  if (isEditing) {
    return (
      <li className="task" data-priority={task.priority}>
        <EditTaskForm
          task={task}
          onSave={(changes) => {
            onUpdate(task.id, changes)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className="task" data-priority={task.priority} data-completed={task.completed}>
      <div className="task__main">
        <input
          type="checkbox"
          className="task__checkbox"
          id={`task-${task.id}`}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <label className="task__checkbox-label" htmlFor={`task-${task.id}`}>
          <span className="sr-only">
            Mark "{task.title}" as {task.completed ? 'active' : 'completed'}
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </label>

        <div className="task__body">
          <div className="task__title-row">
            <span className="task__title">{task.title}</span>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.notes && (
            <div className="task__notes">
              {showNotes ? (
                <p className="task__notes-text">{task.notes}</p>
              ) : (
                <p className="task__notes-preview">{task.notes}</p>
              )}
              <button
                type="button"
                className="task__notes-toggle"
                onClick={() => setShowNotes((value) => !value)}
                aria-expanded={showNotes}
              >
                {showNotes ? 'Hide notes' : 'Show notes'}
              </button>
            </div>
          )}

          <p className="task__meta">
            {task.completed && task.completedAt
              ? `Completed ${formatTimestamp(task.completedAt)}`
              : `Created ${formatTimestamp(task.createdAt)}`}
          </p>
        </div>

        <div className="task__actions">
          <button
            type="button"
            className="button button--icon"
            onClick={startEditing}
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>

          <button
            type="button"
            className={`button button--icon${isConfirmingDelete ? ' button--danger' : ''}`}
            onClick={handleDelete}
            aria-label={
              isConfirmingDelete
                ? `Confirm deleting task "${task.title}"`
                : `Delete task "${task.title}"`
            }
            title={isConfirmingDelete ? 'Click again to confirm' : 'Delete task'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
            </svg>
          </button>

          {isConfirmingDelete && (
            <span className="task__confirm" role="status">
              Delete?
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
