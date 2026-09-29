interface StatsBarProps {
  total: number
  active: number
  completed: number
}

export function StatsBar({ total, active, completed }: StatsBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <section className="stats" aria-label="Task summary">
      <div className="stats__grid">
        <div className="stats__item">
          <span className="stats__value">{total}</span>
          <span className="stats__label">Total</span>
        </div>
        <div className="stats__item">
          <span className="stats__value stats__value--active">{active}</span>
          <span className="stats__label">Active</span>
        </div>
        <div className="stats__item">
          <span className="stats__value stats__value--done">{completed}</span>
          <span className="stats__label">Completed</span>
        </div>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall completion"
      >
        <div className="progress__fill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="stats__caption">
        {total === 0
          ? 'No tasks yet'
          : `${percentage}% of your tasks completed`}
      </p>
    </section>
  )
}
