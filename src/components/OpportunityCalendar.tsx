import { useMemo } from 'react'
import Calendar from './Calendar'
import { useSaved } from '../context/SavedContext'
import type { Opportunity } from '../data'
import { parseDeadlineText, startOfDay, toneForDate, type CalendarItem } from '../lib/calendar'

const categoryIcons: Record<Opportunity['category'], string> = {
  scholarships: 'school',
  admissions: 'school',
  jobs: 'work',
  grants: 'payments',
}

export default function OpportunityCalendar({ opportunities }: { opportunities: Opportunity[] }) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const { isSaved } = useSaved()

  const items = useMemo<CalendarItem[]>(
    () =>
      opportunities.map((op) => {
        const date = parseDeadlineText(op.deadline, today)
        return {
          id: op.id,
          title: op.title,
          subtitle: op.org,
          date,
          tone: isSaved(op.id) ? 'saved' : date ? toneForDate(date, today) : 'undated',
          icon: categoryIcons[op.category] ?? 'event',
          href: op.applyUrl,
        }
      }),
    [opportunities, today, isSaved],
  )

  return <Calendar items={items} legend={['urgent', 'soon', 'later', 'saved', 'undated']} />
}
