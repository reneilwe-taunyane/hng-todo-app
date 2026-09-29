import { useId } from 'react'
import { PRIORITIES, PRIORITY_DESCRIPTIONS, PRIORITY_LABELS } from '../types'
import type { Priority } from '../types'

interface PrioritySelectProps {
  value: Priority
  onChange: (priority: Priority) => void
  legend: string
  disabled?: boolean
}

export function PrioritySelect({
  value,
  onChange,
  legend,
  disabled = false,
}: PrioritySelectProps) {
  const groupId = useId()

  return (
    <fieldset className="priority-select" disabled={disabled}>
      <legend className="priority-select__legend">{legend}</legend>
      <div className="priority-select__options">
        {PRIORITIES.map((priority) => {
          const inputId = `${groupId}-${priority}`
          return (
            <div className="priority-select__option" key={priority}>
              <input
                type="radio"
                className="priority-select__input"
                id={inputId}
                name={groupId}
                value={priority}
                checked={value === priority}
                onChange={() => onChange(priority)}
              />
              <label
                className="priority-select__label"
                htmlFor={inputId}
                data-priority={priority}
                title={PRIORITY_DESCRIPTIONS[priority]}
              >
                <span className="priority-select__dot" aria-hidden="true" />
                {PRIORITY_LABELS[priority]}
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
