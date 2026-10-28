import { parseDate } from 'chrono-node'

const DAY_MS = 24 * 60 * 60 * 1000

export type CalendarTone = 'urgent' | 'soon' | 'later' | 'saved' | 'undated'

export interface CalendarItem {
  id: string
  title: string
  subtitle?: string
  date: Date | null
  tone: CalendarTone
  icon: string
  href?: string
}

export const toneClasses: Record<CalendarTone, string> = {
  urgent: 'border-urgent-red/50 bg-urgent-red-bg text-charcoal-primary',
  soon: 'border-urdu-green-deep/40 bg-urdu-green-light text-charcoal-primary',
  later: 'border-secondary/40 bg-saffron-light text-charcoal-primary',
  saved: 'border-charcoal-primary/70 bg-surface-container-lowest text-charcoal-primary',
  undated: 'border-dashed border-charcoal-muted/50 bg-surface-cream-subtle text-charcoal-secondary',
}

export const toneSwatchClasses: Record<CalendarTone, string> = {
  urgent: 'border-urgent-red/60 bg-urgent-red-bg',
  soon: 'border-urdu-green-deep/50 bg-urdu-green-light',
  later: 'border-secondary/50 bg-saffron-light',
  saved: 'border-charcoal-primary/60 bg-surface-container-lowest',
  undated: 'border-dashed border-charcoal-muted/60 bg-surface-cream-subtle',
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function parseDeadlineText(text: string, today: Date): Date | null {
  const parsed = parseDate(text, today, { forwardDate: true })
  return parsed ? startOfDay(parsed) : null
}

export function toneForDate(date: Date, today: Date): CalendarTone {
  const days = Math.ceil((startOfDay(date).getTime() - startOfDay(today).getTime()) / DAY_MS)
  if (days <= 7) return 'urgent'
  if (days <= 30) return 'soon'
  return 'later'
}

export function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function daysUntil(date: Date, today: Date) {
  return Math.round((startOfDay(date).getTime() - startOfDay(today).getTime()) / DAY_MS)
}
