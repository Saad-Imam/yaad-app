import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import Badge from '../components/Badge'
import { kanbanColumns, trackedApplications, upcomingDeadlines } from '../data'

const primaryTabs = [
  { id: 'all', label: 'All Applications' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'grants', label: 'Grants' },
  { id: 'trainee', label: 'Graduate Trainee' },
]

const filterChips = [
  { id: 'urgent', label: 'Urgent (< 7 Days)', icon: null },
  { id: 'karachi', label: 'Karachi Only', icon: 'location_on' },
]

type TrackedApp = (typeof trackedApplications)[number]

function KanbanCard({ app }: { app: TrackedApp }) {
  return (
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md flex flex-col gap-space-md border border-transparent hover:border-primary-container/60">
      <div className="flex items-start justify-between gap-2">
        <Badge label={app.type} />
        <Badge label={app.due.text} tone={app.due.urgent ? 'urgent' : 'default'} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-serif font-semibold text-title-card text-primary leading-snug">
          {app.title}
        </h3>
        <p className="font-body-sm text-charcoal-muted">{app.org}</p>
      </div>

      {app.progress && (
        <div className="p-space-sm rounded-lg bg-surface-cream-subtle flex flex-col gap-2">
          <div className="flex items-center justify-between font-label-sm font-medium">
            <span className="text-[#1b1b1d]">{app.progress.label}</span>
            <span className="text-primary font-bold">{app.progress.value}</span>
          </div>
          <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
            <div className="bg-urdu-green-deep h-full rounded-full w-1/2" />
          </div>
          <div className="flex items-center gap-1.5 text-urgent-red font-caption font-semibold">
            <Icon name="error" className="text-[14px]" />
            <span>{app.progress.warning}</span>
          </div>
        </div>
      )}

      {app.note && <p className="font-caption text-charcoal-secondary leading-normal">{app.note}</p>}

      <div className="pt-2 flex items-center justify-between">
        {app.actions.map((a) => (
          <button
            key={a.label}
            className={`px-2.5 py-1.5 rounded-lg font-label-sm font-medium transition-colors flex items-center gap-1 ${
              a.primary
                ? 'bg-primary-container hover:bg-urdu-green-deep text-on-primary'
                : 'bg-surface-cream-subtle hover:bg-surface-muted text-[#1b1b1d]'
            }`}
          >
            <Icon name={a.icon} className="text-[16px]" />
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ApplicationsTracker() {
  const [activeTab, setActiveTab] = useState('all')
  const [view, setView] = useState<'board' | 'table'>('board')
  const [activeChips, setActiveChips] = useState<string[]>([])

  const visibleApps = useMemo(() => {
    return trackedApplications.filter((app) => {
      if (activeChips.includes('urgent') && !app.due.urgent) return false
      if (activeChips.includes('karachi') && !app.org.toLowerCase().includes('karachi')) return false
      if (activeTab === 'scholarships' && app.type !== 'Scholarship') return false
      if (activeTab === 'grants' && app.type !== 'Grant') return false
      if (activeTab === 'trainee' && app.type !== 'Graduate Trainee') return false
      return true
    })
  }, [activeTab, activeChips])

  const toggleChip = (id: string) =>
    setActiveChips((chips) => (chips.includes(id) ? chips.filter((c) => c !== id) : [...chips, id]))

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Page header & actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
        <h1 className="font-serif font-semibold text-headline-lg text-primary tracking-tight">
          My Applications
        </h1>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-cream-subtle text-[#1b1b1d] font-label-md transition-colors shadow-sm">
            <Icon name="file_download" className="text-[18px]" />
            Export Tracker (CSV)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container hover:bg-urdu-green-deep text-on-primary font-label-md shadow-sm transition-colors">
            <Icon name="add" className="text-[18px]" />
            Add Custom Application
          </button>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
              Total Tracked
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-cream-subtle flex items-center justify-center text-primary">
              <Icon name="folder_managed" className="text-[18px]" />
            </div>
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <div className="font-serif font-semibold text-headline-md text-primary">
              {trackedApplications.length}
            </div>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
              In Review / Active
            </span>
            <div className="w-8 h-8 rounded-lg bg-urdu-green-light flex items-center justify-center text-urdu-green-deep">
              <Icon name="sync" className="text-[18px]" />
            </div>
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <div className="font-serif font-semibold text-headline-md text-primary">1</div>
            <span className="font-label-sm text-[#1b1b1d] font-medium">in review</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption font-semibold uppercase tracking-wider text-urgent-red">
              Action Required
            </span>
            <div className="w-8 h-8 rounded-lg bg-urgent-red-bg flex items-center justify-center text-urgent-red">
              <Icon name="priority_high" className="text-[18px]" />
            </div>
          </div>
          <div className="mt-space-md flex items-baseline justify-between">
            <div className="font-serif font-semibold text-headline-md text-urgent-red">1</div>
            <span className="font-label-sm text-urgent-red font-semibold">&lt; 5 Days Left</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-space-lg">
        {/* Center kanban stream */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-space-md min-w-0">
          {/* Tabs strip */}
          <div className="p-1 rounded-xl bg-surface-muted flex flex-wrap items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-1 overflow-x-auto">
              {primaryTabs.map((t) => {
                const active = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-label-md font-medium transition-all ${
                      active
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-charcoal-muted hover:text-[#1b1b1d]'
                    }`}
                  >
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-1 bg-surface-cream-subtle p-0.5 rounded-lg">
              {(
                [
                  { id: 'board', icon: 'view_kanban', label: 'Board' },
                  { id: 'table', icon: 'table_rows', label: 'Table' },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`px-2.5 py-1 rounded font-label-sm flex items-center gap-1.5 transition-all ${
                    view === v.id
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-charcoal-muted hover:text-[#1b1b1d] font-medium'
                  }`}
                >
                  <Icon name={v.icon} className="text-[16px]" />
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-caption uppercase tracking-wider font-bold text-charcoal-muted mr-1">
                Filter:
              </span>
              {filterChips.map((f) => {
                const active = activeChips.includes(f.id)
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleChip(f.id)}
                    className={`px-3 py-1 rounded-full font-label-sm font-medium transition-all flex items-center gap-1.5 shadow-sm ${
                      active
                        ? 'bg-surface-container-lowest text-primary'
                        : 'bg-surface-cream-subtle hover:bg-surface-container-lowest text-[#1b1b1d]'
                    }`}
                  >
                    {f.icon ? (
                      <Icon name={f.icon} className="text-[14px] text-primary-container" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-urgent-red" />
                    )}
                    {f.label}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-caption uppercase tracking-wider font-bold text-charcoal-muted">
                Sort:
              </span>
              <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-[#1b1b1d] font-label-sm font-medium flex items-center gap-2 shadow-sm cursor-pointer">
                <span>Nearest Deadline</span>
                <Icon name="expand_more" className="text-[14px]" />
              </div>
            </div>
          </div>

          {/* Board or table view */}
          {view === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-space-md items-start">
              {kanbanColumns.map((col) => {
                const apps = visibleApps.filter((a) => a.column === col.id)
                return (
                  <div
                    key={col.id}
                    className="flex flex-col gap-space-sm p-space-sm rounded-xl bg-surface-cream-subtle/70"
                  >
                    <div className="flex items-center justify-between px-1 py-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                        <h2 className="font-serif font-semibold text-[15px] text-primary">{col.label}</h2>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-[#1b1b1d] font-label-sm font-semibold shadow-sm">
                        {apps.length}
                      </span>
                    </div>
                    {apps.map((app) => (
                      <KanbanCard key={app.id} app={app} />
                    ))}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-cream-subtle">
                  <tr className="font-caption uppercase tracking-wider text-charcoal-muted">
                    <th className="px-4 py-3 font-bold">Application</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold hidden md:table-cell">Deadline</th>
                    <th className="px-4 py-3 font-bold hidden lg:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleApps.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-border-subtle hover:bg-surface-cream-subtle/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-serif font-semibold text-label-md text-primary">
                          {row.title}
                        </span>
                        <span className="block font-caption text-charcoal-muted">{row.org}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border-subtle bg-surface-cream-subtle font-caption font-semibold text-charcoal-secondary">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              kanbanColumns.find((c) => c.id === row.column)?.dot
                            }`}
                          />
                          {kanbanColumns.find((c) => c.id === row.column)?.label}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 font-label-sm hidden md:table-cell ${
                          row.due.urgent ? 'text-urgent-red font-semibold' : 'text-[#1b1b1d]'
                        }`}
                      >
                        {row.due.text}
                      </td>
                      <td className="px-4 py-3 font-caption text-charcoal-muted hidden lg:table-cell max-w-[220px]">
                        {row.note ?? ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right contextual sidebar: upcoming deadlines only */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-space-lg">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="event_upcoming" className="text-[20px] text-primary" />
                <h3 className="font-serif font-semibold text-[16px] text-primary">Upcoming Deadlines</h3>
              </div>
              <span className="font-caption text-urgent-red font-bold">CRITICAL</span>
            </div>
            <div className="flex flex-col gap-3">
              {upcomingDeadlines.map((d) => (
                <div key={d.title} className="flex gap-3 items-start">
                  <div
                    className={`px-2 py-1.5 rounded-lg flex flex-col items-center flex-shrink-0 min-w-[48px] ${
                      d.urgent ? 'bg-urgent-red-bg text-urgent-red' : 'bg-surface-cream-subtle text-[#1b1b1d]'
                    }`}
                  >
                    <span className="font-caption text-[10px] font-bold uppercase">{d.month}</span>
                    <span className="font-serif text-[16px] font-bold leading-none">{d.day}</span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-label-sm text-primary font-semibold">{d.title}</h4>
                    <p className="font-caption text-charcoal-muted">{d.place}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-surface-cream-subtle flex items-center justify-between mt-1">
              <div className="flex items-center gap-1.5 text-charcoal-muted font-caption">
                <Icon name="schedule" className="text-[14px]" />
                <span>Karachi Academic Time (PKT, GMT+5)</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-urdu-green-deep" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
