import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Priority, Task } from '../types'
import { PrioritySelect } from './PrioritySelect'

interface EditTaskFormProps {
  task: Task
  onSave: (changes: { title: string; notes: string; priority: Priority }) => void
  onCancel: () => void
}

export function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [notes, setNotes] = useState(task.notes)
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    titleRef.current?.select()
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('A task needs a title.')
      titleRef.current?.focus()
      return
    }

    onSave({ title, notes, priority })
  }

  return (
    <form className="edit-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor={`edit-title-${task.id}`}>
          Task title
        </label>
        <input
          id={`edit-title-${task.id}`}
          ref={titleRef}
          className="field__input"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (error) setError(null)
          }}
          maxLength={120}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `edit-title-error-${task.id}` : undefined}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`edit-notes-${task.id}`}>
          Notes
        </label>
        <textarea
          id={`edit-notes-${task.id}`}
          className="field__input field__input--textarea"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add or update notes for this task"
          rows={3}
          maxLength={1000}
        />
      </div>

      {error && (
        <p className="field__error" id={`edit-title-error-${task.id}`} role="alert">
          {error}
        </p>
      )}

      <div className="edit-form__footer">
        <PrioritySelect value={priority} onChange={setPriority} legend="Priority" />
        <div className="edit-form__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="button button--primary">
            Save changes
          </button>
        </div>
      </div>
    </form>
  )
}
