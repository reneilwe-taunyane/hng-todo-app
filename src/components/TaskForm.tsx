import { useState } from 'react'
import type { FormEvent } from 'react'
import { DEFAULT_PRIORITY } from '../types'
import type { Priority } from '../types'
import { PrioritySelect } from './PrioritySelect'

interface TaskFormProps {
  onAdd: (input: { title: string; notes: string; priority: Priority }) => void
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Give the task a title before adding it.')
      return
    }

    onAdd({ title, notes, priority })
    setTitle('')
    setNotes('')
    setPriority(DEFAULT_PRIORITY)
    setError(null)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__heading">New task</h2>

      <div className="field">
        <label className="field__label" htmlFor="task-title">
          Task title <span className="field__required">(required)</span>
        </label>
        <input
          id="task-title"
          className="field__input"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (error) setError(null)
          }}
          placeholder="e.g. Finish the HNG task write-up"
          maxLength={120}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'task-title-error' : undefined}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="task-notes">
          Notes <span className="field__optional">(optional)</span>
        </label>
        <textarea
          id="task-notes"
          className="field__input field__input--textarea"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add context, links or a checklist for this task"
          rows={3}
          maxLength={1000}
        />
      </div>

      <div className="task-form__footer">
        <PrioritySelect
          value={priority}
          onChange={setPriority}
          legend="Priority"
        />
        <button type="submit" className="button button--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add task
        </button>
      </div>

      {error && (
        <p className="field__error" id="task-title-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
