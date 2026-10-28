import { useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DayCellContentArg, EventContentArg, EventInput } from '@fullcalendar/core'
import { Icon } from './Icon'
import {
  dateKey,
  sameDay,
  startOfDay,
  toneClasses,
  toneSwatchClasses,
  type CalendarItem,
  type CalendarTone,
} from '../lib/calendar'

const legendLabels: Record<CalendarTone, string> = {
  urgent: '7 days or less',
  soon: 'Within 30 days',
  later: 'Later',
  saved: 'Saved',
  undated: 'No deadline',
}

const defaultLegend: CalendarTone[] = ['urgent', 'soon', 'later', 'undated']

interface CalendarProps {
  items: CalendarItem[]
  legend?: CalendarTone[]
}

export default function Calendar({ items, legend = defaultLegend }: CalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [selected, setSelected] = useState(today)
  const [title, setTitle] = useState(() =>
    new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today),
  )
  const calendarRef = useRef<FullCalendar>(null)

  const scheduled = useMemo(
    () => items.filter((item): item is CalendarItem & { date: Date } => item.date !== null),
    [items],
  )

  const undated = useMemo(() => items.filter((item) => item.date === null), [items])

  const events = useMemo<EventInput[]>(
    () =>
      scheduled.map((item) => ({
        id: item.id,
        title: item.title,
        start: dateKey(item.date),
        allDay: true,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: 'inherit',
        extendedProps: {
          tone: item.tone,
          icon: item.icon,
          subtitle: item.subtitle,
          href: item.href,
        },
      })),
    [scheduled],
  )

  const goToToday = () => {
    calendarRef.current?.getApi().today()
    setSelected(today)
  }

  const renderDayCell = (arg: DayCellContentArg) => (
    <div className="flex w-full items-center justify-between gap-1">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full font-label-sm ${
          arg.isToday
            ? 'bg-urdu-green-deep font-semibold text-on-primary'
            : arg.isOther
              ? 'text-charcoal-muted/60'
              : 'text-charcoal-primary'
        }`}
      >
        {arg.dayNumberText}
      </span>
      {arg.isToday && (
        <span className="font-caption font-semibold text-urdu-green-deep">Today</span>
      )}
    </div>
  )

  const renderEventContent = (arg: EventContentArg) => {
    const tone = (arg.event.extendedProps.tone as CalendarTone) ?? 'later'
    const icon = (arg.event.extendedProps.icon as string) ?? 'event'
    const subtitle = arg.event.extendedProps.subtitle as string | undefined

    return (
      <div
        title={`${arg.event.title}${subtitle ? ` — ${subtitle}` : ''}`}
        className={`flex w-full min-w-0 items-center gap-1 overflow-hidden rounded border px-space-xs py-0.5 font-caption font-medium ${toneClasses[tone]}`}
      >
        <Icon name={icon} className="shrink-0 text-[12px]" />
        <span className="min-w-0 truncate">{arg.event.title}</span>
      </div>
    )
  }

  return (
    <div className="app-calendar app-calendar--full overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-sm">
      <div className="flex flex-col gap-space-sm px-space-md py-space-md lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => calendarRef.current?.getApi().prev()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal-secondary transition-colors hover:bg-surface-cream-subtle"
            aria-label="Previous month"
          >
            <Icon name="arrow_back" className="text-[18px]" />
          </button>
          <button
            onClick={goToToday}
            title="Jump to today"
            className="min-w-[8.5rem] text-center font-serif text-headline-sm font-semibold text-primary"
          >
            {title}
          </button>
          <button
            onClick={() => calendarRef.current?.getApi().next()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal-secondary transition-colors hover:bg-surface-cream-subtle"
            aria-label="Next month"
          >
            <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-space-sm gap-y-1.5">
          {legend.map((tone) => (
            <span key={tone} className="flex items-center gap-1.5">
              <span className={`h-3 w-3 shrink-0 rounded-sm border ${toneSwatchClasses[tone]}`} />
              <span className="font-caption font-medium text-charcoal-secondary">
                {legendLabels[tone]}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          firstDay={1}
          fixedWeekCount={false}
          height="auto"
          dayMaxEvents={2}
          eventDisplay="block"
          events={events}
          dateClick={(arg) => setSelected(startOfDay(arg.date))}
          datesSet={(arg) => setTitle(arg.view.title)}
          dayCellClassNames={(arg) => {
            const classes = ['app-cal-day']
            if (arg.isOther) classes.push('app-cal-other')
            if (arg.isToday) classes.push('app-cal-today')
            if (sameDay(arg.date, selected)) classes.push('app-cal-selected')
            return classes
          }}
          dayCellContent={renderDayCell}
          eventContent={renderEventContent}
          eventClick={(arg) => {
            const href = arg.event.extendedProps.href as string | undefined
            if (href) window.open(href, '_blank', 'noopener,noreferrer')
          }}
          moreLinkContent={(arg) => `+${arg.num} more`}
        />
      </div>

      {undated.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle px-space-md py-space-sm">
          <span className="font-caption font-bold uppercase tracking-wider text-charcoal-muted">
            No deadline
          </span>
          {undated.map((item) => {
            const content = (
              <>
                <Icon name={item.icon} className="text-[12px]" />
                <span className="max-w-[12rem] truncate">{item.title}</span>
              </>
            )
            const label = `${item.title}${item.subtitle ? ` — ${item.subtitle}` : ''}`

            return item.href ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className={`flex items-center gap-1 rounded border px-2 py-0.5 font-caption font-medium ${toneClasses[item.tone]}`}
              >
                {content}
              </a>
            ) : (
              <span
                key={item.id}
                title={label}
                className={`flex items-center gap-1 rounded border px-2 py-0.5 font-caption font-medium ${toneClasses[item.tone]}`}
              >
                {content}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
