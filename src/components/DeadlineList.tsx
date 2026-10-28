import { useMemo, useState } from 'react'
import { Icon } from './Icon'
import { useSaved } from '../context/SavedContext'
import type { Opportunity } from '../data'
import {
  dateKey,
  daysUntil,
  parseDeadlineText,
  startOfDay,
  toneForDate,
  type CalendarTone,
} from '../lib/calendar'

const categoryIcons: Record<Opportunity['category'], string> = {
  scholarships: 'school',
  admissions: 'school',
  jobs: 'work',
  grants: 'payments',
}

const legendItems: { tone: CalendarTone; label: string }[] = [
  { tone: 'urgent', label: '7 days or less' },
  { tone: 'soon', label: 'Within 30 days' },
  { tone: 'later', label: 'Later' },
  { tone: 'saved', label: 'Saved' },
  { tone: 'undated', label: 'No deadline' },
]

const toneSwatchClasses: Record<CalendarTone, string> = {
  urgent: 'border-urgent-red/60 bg-urgent-red-bg',
  soon: 'border-urdu-green-deep/50 bg-urdu-green-light',
  later: 'border-secondary/50 bg-saffron-light',
  saved: 'border-charcoal-primary/60 bg-surface-container-lowest',
  undated: 'border-dashed border-charcoal-muted/60 bg-surface-cream-subtle',
}

const toneDateClasses: Record<CalendarTone, string> = {
  urgent: 'bg-urgent-red-bg text-urgent-red',
  soon: 'bg-urdu-green-light text-urdu-green-deep',
  later: 'bg-saffron-light text-secondary',
  saved: 'bg-surface-cream-subtle text-charcoal-primary',
  undated: 'bg-surface-cream-subtle text-charcoal-muted',
}

const toneChipClasses: Record<CalendarTone, string> = {
  urgent: 'bg-urgent-red-bg text-urgent-red',
  soon: 'bg-urdu-green-light text-urdu-green-deep',
  later: 'bg-surface-cream-subtle text-charcoal-secondary',
  saved: 'bg-surface-cream-subtle text-charcoal-secondary',
  undated: 'bg-surface-cream-subtle text-charcoal-muted',
}

const weekdayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const monthShortFormat = new Intl.DateTimeFormat('en-US', { month: 'short' })
const monthLongFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

interface ListItem {
  op: Opportunity
  date: Date | null
  days: number | null
}

interface ListSection {
  key: string
  label: string
  items: ListItem[]
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

function deadlineLabel(days: number | null) {
  if (days === null) return 'Rolling'
  if (days < 0) return 'Closed'
  if (days === 0) return 'Closes today'
  if (days === 1) return 'Closes tomorrow'
  return `${days} days left`
}

function googleCalendarUrl(item: ListItem) {
  if (!item.date) return null
  const start = dateKey(item.date).replace(/-/g, '')
  const end = dateKey(addDays(item.date, 1)).replace(/-/g, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Deadline: ${item.op.title}`,
    dates: `${start}/${end}`,
    details: item.op.description,
    location: item.op.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function DeadlineList({ opportunities }: { opportunities: Opportunity[] }) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const { isSaved, toggleSaved } = useSaved()
  const [savedOnly, setSavedOnly] = useState(false)

  const items = useMemo<ListItem[]>(
    () =>
      opportunities
        .map((op) => {
          const date = parseDeadlineText(op.deadline, today)
          return { op, date, days: date ? daysUntil(date, today) : null }
        })
        .filter((item) => !savedOnly || isSaved(item.op.id))
        .sort((a, b) => {
          if (!a.date && !b.date) return a.op.title.localeCompare(b.op.title)
          if (!a.date) return 1
          if (!b.date) return -1
          return a.date.getTime() - b.date.getTime()
        }),
    [opportunities, today, savedOnly, isSaved],
  )

  const sections = useMemo<ListSection[]>(() => {
    const daysIntoWeek = (today.getDay() + 6) % 7
    const endOfWeek = addDays(today, 6 - daysIntoWeek)

    const week: ListItem[] = []
    const within30: ListItem[] = []
    const undated: ListItem[] = []
    const months = new Map<string, { date: Date; items: ListItem[] }>()

    for (const item of items) {
      if (!item.date) {
        undated.push(item)
        continue
      }

      if (item.date.getTime() <= endOfWeek.getTime()) {
        week.push(item)
      } else if (item.date.getTime() <= addDays(today, 30).getTime()) {
        within30.push(item)
      } else {
        const key = `${item.date.getFullYear()}-${item.date.getMonth()}`
        const bucket = months.get(key)
        if (bucket) {
          bucket.items.push(item)
        } else {
          months.set(key, { date: item.date, items: [item] })
        }
      }
    }

    const result: ListSection[] = []
    if (week.length) result.push({ key: 'week', label: 'This week', items: week })
    if (within30.length) {
      result.push({ key: 'within-30', label: 'Within 30 days', items: within30 })
    }

    for (const [key, bucket] of [...months.entries()].sort(
      ([, a], [, b]) => a.date.getTime() - b.date.getTime(),
    )) {
      result.push({ key, label: monthLongFormat.format(bucket.date), items: bucket.items })
    }

    if (undated.length) {
      result.push({ key: 'undated', label: 'No deadline', items: undated })
    }

    return result
  }, [items, today])

  return (
    <section className="overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-space-md px-space-lg py-space-md">
        <h2 className="font-serif font-semibold text-headline-sm text-primary">
          All upcoming deadlines
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {legendItems.map((entry) => (
            <span key={entry.tone} className="flex items-center gap-1.5">
              <span className={`h-3 w-3 rounded-sm border ${toneSwatchClasses[entry.tone]}`} />
              <span className="font-caption font-medium text-charcoal-secondary">
                {entry.label}
              </span>
            </span>
          ))}
          <button
            onClick={() => setSavedOnly((value) => !value)}
            aria-pressed={savedOnly}
            className={`ml-1 rounded-lg border px-3 py-1.5 font-label-sm font-semibold transition-colors ${
              savedOnly
                ? 'border-charcoal-primary bg-charcoal-primary text-on-primary'
                : 'border-border-subtle text-charcoal-secondary hover:bg-surface-cream-subtle'
            }`}
          >
            {savedOnly ? 'Saved only' : 'All deadlines'}
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 border-t border-border-subtle px-space-lg py-space-xl text-center">
          <Icon name="event_busy" className="text-[40px] text-charcoal-muted" />
          <p className="font-serif font-semibold text-headline-sm text-primary">
            No upcoming deadlines
          </p>
          <p className="font-body-sm text-charcoal-muted">
            Try turning off the saved-only filter.
          </p>
        </div>
      ) : (
        sections.map((section) => (
          <div key={section.key} className="border-t border-border-subtle first:border-t-0">
            <div className="flex items-baseline gap-2 px-space-lg pb-space-xs pt-space-lg">
              <h3 className="font-serif text-headline-sm font-semibold text-primary">
                {section.label}
              </h3>
              <span className="font-label-sm font-medium text-charcoal-muted">
                {section.items.length}
              </span>
            </div>
            <ul className="px-space-md pb-space-sm">
              {section.items.map((item) => {
                const tone: CalendarTone = item.date
                  ? toneForDate(item.date, today)
                  : 'undated'
                const saved = isSaved(item.op.id)
                const calendarUrl = googleCalendarUrl(item)

                return (
                  <li key={item.op.id}>
                    <div className="flex flex-col gap-space-sm rounded-lg px-space-sm py-space-sm transition-colors hover:bg-surface-cream-subtle/60 sm:flex-row sm:items-center sm:gap-space-md">
                      <div
                        className={`flex w-11 shrink-0 flex-col items-center rounded-md py-1 ${toneDateClasses[tone]}`}
                      >
                        <span className="font-caption text-[9px] font-bold uppercase tracking-wide">
                          {item.date ? weekdayFormat.format(item.date) : '—'}
                        </span>
                        <span className="font-label-md font-bold leading-tight">
                          {item.date ? item.date.getDate() : '—'}
                        </span>
                        <span className="font-caption text-[9px] font-semibold uppercase tracking-wide">
                          {item.date ? monthShortFormat.format(item.date) : ''}
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex min-w-0 items-center gap-1.5 font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
                          <Icon
                            name={categoryIcons[item.op.category] ?? 'event'}
                            className="text-[13px]"
                          />
                          <span>{item.op.type}</span>
                          <span className="text-charcoal-muted/50">·</span>
                          <span className="truncate normal-case tracking-normal">
                            {item.op.org}
                          </span>
                        </div>
                        <a
                          href={item.op.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-serif font-semibold text-title-card text-primary transition-colors hover:text-urdu-green-deep"
                        >
                          {item.op.title}
                        </a>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                        <span
                          className={`whitespace-nowrap rounded-md px-2 py-1 font-label-sm font-semibold ${toneChipClasses[tone]}`}
                        >
                          {deadlineLabel(item.days)}
                        </span>

                        <button
                          onClick={() => toggleSaved(item.op.id)}
                          aria-pressed={saved}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-label-sm font-semibold transition-colors ${
                            saved
                              ? 'border-urdu-green-deep/30 bg-urdu-green-light text-urdu-green-deep'
                              : 'border-border-subtle bg-surface-container-lowest text-charcoal-secondary hover:bg-surface-cream-subtle'
                          }`}
                        >
                          <Icon
                            name={saved ? 'bookmark' : 'bookmark_border'}
                            filled={saved}
                            className="text-[16px]"
                          />
                          {saved ? 'Saved' : 'Save'}
                        </button>

                        {calendarUrl ? (
                          <a
                            href={calendarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Add to Google Calendar"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-charcoal-muted transition-colors hover:bg-surface-cream-subtle hover:text-primary"
                          >
                            <Icon name="calendar_add_on" className="text-[18px]" />
                          </a>
                        ) : (
                          <span className="h-8 w-8" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}
