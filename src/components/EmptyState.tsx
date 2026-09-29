interface EmptyStateProps {
  title: string
  description: string
  icon?: 'list' | 'check' | 'filter'
}

const ICONS: Record<NonNullable<EmptyStateProps['icon']>, string> = {
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  check: 'M9 12.5l2.5 2.5 5-5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5z',
}

export function EmptyState({ title, description, icon = 'list' }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONS[icon]} />
        </svg>
      </span>
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__description">{description}</p>
    </div>
  )
}
