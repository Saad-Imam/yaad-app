import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import OpportunityCalendar from '../components/OpportunityCalendar'
import DeadlineList from '../components/DeadlineList'
import CyclesList from '../components/CyclesList'
import { useSaved } from '../context/SavedContext'
import { opportunities, upcomingCycles } from '../data'
import { daysUntil, parseDeadlineText, startOfDay } from '../lib/calendar'

type View = 'month' | 'list' | 'cycles'

const viewOptions = [
  { id: 'month', label: 'Month', icon: 'calendar_month' },
  { id: 'list', label: 'List', icon: 'view_list' },
  { id: 'cycles', label: 'Upcoming cycles', icon: 'autorenew' },
] as const

const viewSubtitles: Record<View, string> = {
  month: 'Every deadline from your feed, one month at a time.',
  list: "Every deadline from your feed, grouped by when it's due.",
  cycles: 'Closed programmes that reopen on a yearly rhythm.',
}

export default function OpportunitiesCalendar() {
  const [view, setView] = useState<View>('list')
  const today = useMemo(() => startOfDay(new Date()), [])
  const { isSaved } = useSaved()

  const summary = useMemo(() => {
    const upcoming = opportunities.filter((op) => {
      const date = parseDeadlineText(op.deadline, today)
      if (!date) return false
      const days = daysUntil(date, today)
      return days >= 0 && days <= 30
    })

    return {
      upcoming: upcoming.length,
      saved: upcoming.filter((op) => isSaved(op.id)).length,
    }
  }, [isSaved, today])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-space-lg">
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 font-label-sm font-semibold text-charcoal-muted transition-colors hover:bg-surface-cream-subtle hover:text-primary"
          >
            <Icon name="arrow_back" className="text-[16px]" />
            Feed
          </Link>
          <span className="font-caption text-charcoal-muted">/</span>
          <span className="font-label-sm font-semibold text-primary">Calendar</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif font-bold text-headline-lg text-primary tracking-tight">
              Opportunity Calendar
            </h1>
            <p className="font-body-sm text-charcoal-muted">{viewSubtitles[view]}</p>
          </div>

          <div className="inline-flex flex-wrap rounded-xl border border-border-subtle bg-surface-container-lowest p-1 shadow-sm">
            {viewOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setView(option.id)}
                aria-pressed={view === option.id}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-label-md font-semibold transition-colors ${
                  view === option.id
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-charcoal-secondary hover:bg-surface-cream-subtle'
                }`}
              >
                <Icon name={option.icon} className="text-[18px]" />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'cycles' ? (
        <div className="flex flex-wrap items-center justify-between gap-space-md rounded-xl border border-border-subtle bg-surface-container-lowest px-space-md py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Icon name="autorenew" className="text-[20px] text-urdu-green-deep" />
            <p className="font-body-sm text-charcoal-secondary">
              Programmes that are closed now but open around the same time each year.
            </p>
          </div>
          <span className="rounded-full border border-border-subtle bg-surface-cream-subtle px-3 py-1 font-label-sm font-semibold text-charcoal-secondary">
            {upcomingCycles.length} programmes
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-space-md rounded-xl border border-border-subtle bg-surface-container-lowest px-space-md py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Icon name="event_upcoming" className="text-[20px] text-urdu-green-deep" />
            <p className="font-body-sm text-charcoal-secondary">
              <span className="font-semibold text-primary">{summary.upcoming}</span> deadlines in
              the next 30 days.{' '}
              <span className="font-semibold text-primary">{summary.saved}</span> of them are
              saved.
            </p>
          </div>
          <span className="rounded-full border border-border-subtle bg-surface-cream-subtle px-3 py-1 font-label-sm font-semibold text-charcoal-secondary">
            {opportunities.length} opportunities
          </span>
        </div>
      )}

      {view === 'month' && <OpportunityCalendar opportunities={opportunities} />}
      {view === 'list' && <DeadlineList opportunities={opportunities} />}
      {view === 'cycles' && <CyclesList cycles={upcomingCycles} />}
    </div>
  )
}
