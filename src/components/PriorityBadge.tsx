import { PRIORITY_LABELS } from '../types'
import type { Priority } from '../types'

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className="badge" data-priority={priority}>
      <span className="badge__dot" aria-hidden="true" />
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
