const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
})

const fullFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

/** Returns a short human friendly timestamp such as "Today, 9:41 AM" or "3 days ago". */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now()
  const elapsed = now - timestamp

  if (elapsed < 0 || elapsed > 7 * DAY) {
    return fullFormatter.format(timestamp)
  }

  if (elapsed < MINUTE) return 'Just now'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`
  if (startOfDay(timestamp) === startOfDay(now)) {
    return `Today, ${timeFormatter.format(timestamp)}`
  }
  if (startOfDay(timestamp) === startOfDay(now) - DAY) {
    return `Yesterday, ${timeFormatter.format(timestamp)}`
  }
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d ago`

  return dateFormatter.format(timestamp)
}
