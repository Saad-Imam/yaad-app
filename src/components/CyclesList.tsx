import { useMemo, useState } from 'react'
import { Icon } from './Icon'
import type { CycleProgramme } from '../data'

const categoryIcons: Record<CycleProgramme['category'], string> = {
  scholarships: 'school',
  admissions: 'school',
  jobs: 'work',
  grants: 'payments',
}

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

interface CycleGroup {
  key: string
  label: string
  items: CycleProgramme[]
}

export default function CyclesList({ cycles }: { cycles: CycleProgramme[] }) {
  const [reminders, setReminders] = useState<Record<string, boolean>>({})

  const groups = useMemo<CycleGroup[]>(() => {
    const sorted = [...cycles].sort(
      (a, b) =>
        a.opensYear - b.opensYear ||
        a.opensMonth - b.opensMonth ||
        a.title.localeCompare(b.title),
    )

    const buckets = new Map<string, { date: Date; items: CycleProgramme[] }>()

    for (const cycle of sorted) {
      const key = `${cycle.opensYear}-${cycle.opensMonth}`
      const bucket = buckets.get(key)
      if (bucket) {
        bucket.items.push(cycle)
      } else {
        buckets.set(key, {
          date: new Date(cycle.opensYear, cycle.opensMonth, 1),
          items: [cycle],
        })
      }
    }

    return [...buckets.entries()].map(([key, bucket]) => ({
      key,
      label: monthFormat.format(bucket.date),
      items: bucket.items,
    }))
  }, [cycles])

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-charcoal-muted/40 bg-surface-cream-subtle/40 px-space-md py-space-sm">
        <Icon name="history_toggle_off" className="mt-0.5 text-[18px] text-charcoal-muted" />
        <p className="font-body-sm text-charcoal-secondary">
          Predicted from past cycles. These dates are estimates until the organisation announces
          them. We confirm each one against the official source before it appears as open.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-sm">
        {groups.map((group, index) => (
          <div
            key={group.key}
            className={index > 0 ? 'border-t border-border-subtle' : undefined}
          >
            <div className="flex items-baseline gap-2 px-space-lg pb-space-xs pt-space-lg">
              <h2 className="font-serif text-headline-sm font-semibold text-primary">
                {group.label}
              </h2>
              <span className="font-caption font-semibold text-charcoal-muted">
                {String(group.items.length).padStart(2, '0')}
              </span>
            </div>

            <ul className="px-space-md pb-space-sm">
              {group.items.map((cycle) => {
                const reminderSet = Boolean(reminders[cycle.id])

                return (
                  <li key={cycle.id}>
                    <div className="flex flex-col gap-space-sm rounded-lg px-space-sm py-space-sm transition-colors hover:bg-surface-cream-subtle/60 sm:flex-row sm:items-center sm:gap-space-md">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-urdu-green-light text-urdu-green-deep">
                        <Icon
                          name={categoryIcons[cycle.category] ?? 'event'}
                          className="text-[20px]"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex min-w-0 items-center gap-1.5 font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
                          <span>{cycle.type}</span>
                          <span className="text-charcoal-muted/50">·</span>
                          <span className="truncate normal-case tracking-normal">
                            {cycle.org}
                          </span>
                        </div>

                        <a
                          href={cycle.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-serif font-semibold text-title-card text-primary transition-colors hover:text-urdu-green-deep"
                        >
                          {cycle.title}
                        </a>

                        <p className="font-body-sm text-charcoal-secondary">
                          <span className="font-semibold text-primary">
                            Usually opens in {cycle.usuallyOpens}.
                          </span>{' '}
                          {cycle.window}
                        </p>

                        <div className="flex flex-wrap items-center gap-1 pt-0.5 font-caption text-charcoal-muted">
                          <Icon name="history" className="text-[13px]" />
                          <span>
                            Last cycle: {cycle.lastCycle} · {cycle.consistency}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setReminders((current) => ({
                            ...current,
                            [cycle.id]: !current[cycle.id],
                          }))
                        }
                        aria-pressed={reminderSet}
                        className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 font-label-sm font-semibold transition-colors ${
                          reminderSet
                            ? 'border-urdu-green-deep/30 bg-urdu-green-light text-urdu-green-deep'
                            : 'border-charcoal-primary/30 text-charcoal-primary hover:bg-surface-cream-subtle'
                        }`}
                      >
                        <Icon
                          name={reminderSet ? 'notifications_active' : 'notifications_none'}
                          filled={reminderSet}
                          className="text-[16px]"
                        />
                        {reminderSet ? 'Reminder set' : 'Remind me when it opens'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
