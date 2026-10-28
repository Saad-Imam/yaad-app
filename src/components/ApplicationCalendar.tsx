import { useMemo } from 'react'
import Calendar from './Calendar'
import type { TrackedApplication } from '../data'
import { parseDeadlineText, startOfDay, toneForDate, type CalendarItem } from '../lib/calendar'

const typeIcons: Record<string, string> = {
  Scholarship: 'school',
  Grant: 'payments',
  Admission: 'school',
  'Job & Internship': 'work',
  'Graduate Trainee': 'work',
  Other: 'event',
}

export default function ApplicationCalendar({ apps }: { apps: TrackedApplication[] }) {
  const today = useMemo(() => startOfDay(new Date()), [])

  const items = useMemo<CalendarItem[]>(
    () =>
      apps.map((app) => {
        const date = parseDeadlineText(app.due.text, today)
        return {
          id: app.id,
          title: app.title,
          subtitle: app.org,
          date,
          tone: date ? toneForDate(date, today) : 'undated',
          icon: typeIcons[app.type] ?? 'event',
          href: app.actions.find((action) => action.href)?.href,
        }
      }),
    [apps, today],
  )

  return <Calendar items={items} />
}
