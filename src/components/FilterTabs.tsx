import { FILTERS } from '../types'
import type { Filter } from '../types'

interface FilterTabsProps {
  value: Filter
  onChange: (filter: Filter) => void
  counts: Record<Filter, number>
}

export function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {FILTERS.map((filter) => {
        const isActive = value === filter.value
        return (
          <button
            key={filter.value}
            type="button"
            className="filters__tab"
            onClick={() => onChange(filter.value)}
            aria-pressed={isActive}
          >
            {filter.label}
            <span className="filters__count">{counts[filter.value]}</span>
          </button>
        )
      })}
    </div>
  )
}
