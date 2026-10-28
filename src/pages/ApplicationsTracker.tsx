import { lazy, Suspense, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Icon } from '../components/Icon'
import Badge from '../components/Badge'

const ApplicationCalendar = lazy(() => import('../components/ApplicationCalendar'))
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
type KanbanColumnDef = (typeof kanbanColumns)[number]

const CUSTOM_APPS_KEY = 'yaad.custom-applications'

function readCustomApps(): TrackedApp[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CUSTOM_APPS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is TrackedApp => {
      if (!item || typeof item !== 'object') return false
      const app = item as Record<string, unknown>
      return (
        typeof app.id === 'string' &&
        typeof app.title === 'string' &&
        typeof app.org === 'string' &&
        typeof app.column === 'string' &&
        typeof app.due === 'object' &&
        Array.isArray(app.actions)
      )
    })
  } catch {
    return []
  }
}

const applicationTypes = [
  'Scholarship',
  'Grant',
  'Admission',
  'Job & Internship',
  'Graduate Trainee',
  'Other',
]

interface AddFormState {
  title: string
  org: string
  type: string
  column: string
  deadline: string
  url: string
  note: string
  requirements: { label: string; done: boolean }[]
}

const emptyForm: AddFormState = {
  title: '',
  org: '',
  type: 'Scholarship',
  column: 'preparing',
  deadline: '',
  url: '',
  note: '',
  requirements: [{ label: '', done: false }],
}

const inputClass =
  'w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2 font-body-sm text-charcoal-primary outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/40 placeholder:text-charcoal-muted'

function AddApplicationModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (app: TrackedApp) => void
}) {
  const [form, setForm] = useState<AddFormState>(emptyForm)
  const canSubmit = form.title.trim() !== '' && form.org.trim() !== ''

  const update = (
    key: 'title' | 'org' | 'type' | 'column' | 'deadline' | 'url' | 'note',
    value: string,
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const addRequirement = () =>
    setForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, { label: '', done: false }],
    }))

  const updateRequirement = (index: number, patch: { label?: string; done?: boolean }) =>
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }))

  const removeRequirement = (index: number) =>
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    const url = form.url.trim()
    const actions = url
      ? [
          { icon: 'open_in_new', label: 'Open Link', primary: true, href: url },
          { icon: 'edit_note', label: 'Notes', primary: false },
        ]
      : [{ icon: 'edit_note', label: 'Notes', primary: false }]

    const requirements = form.requirements
      .map((item) => ({ ...item, label: item.label.trim() }))
      .filter((item) => item.label !== '')
      .map((item, index) => ({
        ...item,
        id: `req-${Date.now()}-${index}`,
      }))

    onAdd({
      id: `custom-${Date.now()}`,
      column: form.column,
      type: form.type,
      due: { text: form.deadline.trim() || 'No deadline', urgent: false },
      title: form.title.trim(),
      org: form.org.trim(),
      note: form.note.trim() || undefined,
      requirements: requirements.length > 0 ? requirements : undefined,
      actions,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/30 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-surface-container-lowest shadow-card border border-border-subtle"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-space-lg py-4">
          <h2 className="font-serif font-semibold text-headline-sm text-primary">
            Add Application
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal-muted hover:bg-surface-cream-subtle"
            aria-label="Close"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-space-md px-space-lg py-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="e.g. HEC Need-Based Scholarship"
              className={inputClass}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
              Organization *
            </label>
            <input
              value={form.org}
              onChange={(event) => update('org', event.target.value)}
              placeholder="e.g. Higher Education Commission"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1.5">
              <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
                Type
              </label>
              <select
                value={form.type}
                onChange={(event) => update('type', event.target.value)}
                className={inputClass}
              >
                {applicationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
                Stage
              </label>
              <select
                value={form.column}
                onChange={(event) => update('column', event.target.value)}
                className={inputClass}
              >
                {kanbanColumns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
              Deadline
            </label>
            <input
              value={form.deadline}
              onChange={(event) => update('deadline', event.target.value)}
              placeholder="e.g. Nov 15 or Rolling basis"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
              Link
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(event) => update('url', event.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
                Required Things
              </label>
              <button
                type="button"
                onClick={addRequirement}
                className="flex items-center gap-1 font-label-sm font-semibold text-primary hover:text-urdu-green-deep transition-colors"
              >
                <Icon name="add" className="text-[16px]" />
                Add item
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {form.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={requirement.done}
                    onClick={() => updateRequirement(index, { done: !requirement.done })}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      requirement.done
                        ? 'border-urdu-green-deep bg-urdu-green-deep text-on-primary'
                        : 'border-border-subtle bg-surface-container-lowest text-transparent'
                    }`}
                    title={requirement.done ? 'Mark as not ready' : 'Mark as ready'}
                  >
                    <Icon name="check" className="text-[13px]" />
                  </button>
                  <input
                    value={requirement.label}
                    onChange={(event) =>
                      updateRequirement(index, { label: event.target.value })
                    }
                    placeholder="e.g. Income certificate"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    disabled={form.requirements.length === 1}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-charcoal-muted hover:bg-urgent-red-bg hover:text-urgent-red transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal-muted"
                    aria-label="Remove requirement"
                  >
                    <Icon name="delete" className="text-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <p className="font-caption text-charcoal-muted">
              Check items off as you collect them.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
              Notes
            </label>
            <textarea
              value={form.note}
              onChange={(event) => update('note', event.target.value)}
              placeholder="Anything to remember"
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-label-md text-charcoal-secondary hover:bg-surface-cream-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-5 py-2 rounded-lg bg-primary-container hover:bg-urdu-green-deep text-on-primary font-label-md font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const responsiveColumnClass: Record<string, string> = {
  'due.text': 'hidden md:table-cell',
  requirements: 'hidden lg:table-cell',
  note: 'hidden lg:table-cell',
}

const daysFromText = (text: string) => {
  const match = text.match(/\d+/)
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER
}

const tableColumns: ColumnDef<TrackedApp>[] = [
  {
    accessorKey: 'title',
    header: 'Application',
    cell: ({ row }) => (
      <>
        <span className="font-serif font-semibold text-label-md text-primary">{row.original.title}</span>
        <span className="block font-caption text-charcoal-muted">{row.original.org}</span>
      </>
    ),
  },
  {
    accessorKey: 'column',
    header: 'Status',
    cell: ({ row }) => {
      const col = kanbanColumns.find((c) => c.id === row.original.column)
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border-subtle bg-surface-cream-subtle font-caption font-semibold text-charcoal-secondary">
          <span className={`h-1.5 w-1.5 rounded-full ${col?.dot}`} />
          {col?.label}
        </span>
      )
    },
  },
  {
    accessorKey: 'requirements',
    header: 'Required',
    enableSorting: false,
    cell: ({ row }) => {
      const requirements = row.original.requirements ?? []
      if (requirements.length === 0) {
        return <span className="font-caption text-charcoal-muted">—</span>
      }
      const done = requirements.filter((item) => item.done).length
      const complete = done === requirements.length
      return (
        <span
          className={`font-label-sm ${
            complete ? 'text-urdu-green-deep font-semibold' : 'text-charcoal-secondary'
          }`}
        >
          {done}/{requirements.length} ready
        </span>
      )
    },
  },
  {
    accessorKey: 'due.text',
    header: 'Deadline',
    sortingFn: (a, b) => daysFromText(a.original.due.text) - daysFromText(b.original.due.text),
    cell: ({ row }) => (
      <span
        className={
          row.original.due.urgent ? 'text-urgent-red font-semibold' : 'text-charcoal-primary'
        }
      >
        {row.original.due.text}
      </span>
    ),
  },
  {
    accessorKey: 'note',
    header: 'Notes',
    cell: ({ row }) => (
      <span className="font-caption text-charcoal-muted line-clamp-2 max-w-[220px] block">
        {row.original.note ?? ''}
      </span>
    ),
  },
]

function ProgressBox({
  label,
  value,
  percent,
  message,
  complete = false,
}: {
  label: string
  value: string
  percent: number
  message: string
  complete?: boolean
}) {
  return (
    <div className="p-2.5 rounded-lg bg-surface-cream-subtle flex flex-col gap-2 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-label-sm font-medium">
        <span className="text-charcoal-primary">{label}</span>
        <span className="text-primary font-bold whitespace-nowrap">{value}</span>
      </div>
      <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-urdu-green-deep h-full rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className={`flex items-start gap-1.5 font-caption font-semibold min-w-0 ${
          complete ? 'text-urdu-green-deep' : 'text-urgent-red'
        }`}
      >
        <Icon name={complete ? 'check_circle' : 'error'} className="text-[14px] shrink-0" />
        <span className="min-w-0">{message}</span>
      </div>
    </div>
  )
}

function KanbanCard({ app }: { app: TrackedApp }) {
  const requirements = app.requirements ?? []
  const doneCount = requirements.filter((item) => item.done).length
  const pending = requirements.filter((item) => !item.done).map((item) => item.label)
  const percent = requirements.length > 0 ? Math.round((doneCount / requirements.length) * 100) : 0
  const allDone = requirements.length > 0 && doneCount === requirements.length

  return (
    <div className="w-full min-w-0 p-3 rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md flex flex-col gap-3 border border-transparent hover:border-primary-container/60 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge label={app.type} className="min-w-0" />
        <Badge
          label={app.due.text}
          tone={app.due.urgent ? 'urgent' : 'default'}
          className="whitespace-nowrap"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-serif font-semibold text-title-card text-primary leading-snug break-words">
          {app.title}
        </h3>
        <p className="font-body-sm text-charcoal-muted break-words">{app.org}</p>
      </div>

      {requirements.length > 0 ? (
        <ProgressBox
          label="Required Things"
          value={`${doneCount} of ${requirements.length} ready`}
          percent={percent}
          message={allDone ? 'All requirements ready' : `Needs: ${pending.join(', ')}`}
          complete={allDone}
        />
      ) : app.progress ? (
        <ProgressBox
          label={app.progress.label}
          value={app.progress.value}
          percent={50}
          message={app.progress.warning}
        />
      ) : null}

      {app.note && (
        <p className="font-caption text-charcoal-secondary leading-normal break-words">{app.note}</p>
      )}

      <div className="pt-1 mt-auto flex flex-wrap items-center gap-1.5">
        {app.actions.map((a) => {
          const actionClass = `px-2 py-1.5 rounded-lg font-label-sm font-medium transition-colors flex items-center justify-center gap-1 whitespace-nowrap ${
            a.primary
              ? 'bg-primary-container hover:bg-urdu-green-deep text-on-primary'
              : 'bg-surface-cream-subtle hover:bg-surface-muted text-charcoal-primary'
          }`
          const content = (
            <>
              <Icon name={a.icon} className="text-[16px] shrink-0" />
              <span>{a.label}</span>
            </>
          )
          return a.href ? (
            <a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClass}
            >
              {content}
            </a>
          ) : (
            <button key={a.label} className={actionClass}>
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SortableKanbanCard({ app }: { app: TrackedApp }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: app.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 20 : undefined,
      }}
      className="touch-none cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <KanbanCard app={app} />
    </div>
  )
}

function KanbanColumn({ column, apps }: { column: KanbanColumnDef; apps: TrackedApp[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-space-sm p-space-sm rounded-xl bg-surface-cream-subtle/70 min-w-0 min-h-[180px] transition-colors ${
        isOver ? 'ring-2 ring-primary-container/60 bg-surface-cream-subtle' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-1 py-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${column.dot}`} />
          <h2 className="font-serif font-semibold text-[15px] text-primary truncate">
            {column.label}
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-charcoal-primary font-label-sm font-semibold shadow-sm shrink-0">
          {apps.length}
        </span>
      </div>
      <SortableContext items={apps.map((a) => a.id)} strategy={verticalListSortingStrategy}>
        {apps.map((app) => (
          <SortableKanbanCard key={app.id} app={app} />
        ))}
      </SortableContext>
      {apps.length === 0 && (
        <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-border-subtle font-caption text-charcoal-muted py-6">
          Drop here
        </div>
      )}
    </div>
  )
}

export default function ApplicationsTracker() {
  const [activeTab, setActiveTab] = useState('all')
  const [view, setView] = useState<'board' | 'table' | 'calendar'>('board')
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [apps, setApps] = useState<TrackedApp[]>(() => [
    ...trackedApplications.map((app) => ({ ...app })),
    ...readCustomApps(),
  ])
  const [sorting, setSorting] = useState<SortingState>([])
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    try {
      const custom = apps.filter((app) => app.id.startsWith('custom-'))
      window.localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(custom))
    } catch {
      // Storage can be unavailable; added applications still work for this session.
    }
  }, [apps])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const visibleApps = useMemo(() => {
    return apps.filter((app) => {
      if (activeChips.includes('urgent') && !app.due.urgent) return false
      if (activeChips.includes('karachi') && !app.org.toLowerCase().includes('karachi')) return false
      if (activeTab === 'scholarships' && app.type !== 'Scholarship') return false
      if (activeTab === 'grants' && app.type !== 'Grant') return false
      if (activeTab === 'trainee' && app.type !== 'Graduate Trainee') return false
      return true
    })
  }, [apps, activeTab, activeChips])

  const table = useReactTable({
    data: visibleApps,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const toggleChip = (id: string) =>
    setActiveChips((chips) => (chips.includes(id) ? chips.filter((c) => c !== id) : [...chips, id]))

  const handleAddApplication = (app: TrackedApp) => {
    setApps((prev) => [app, ...prev])
    setActiveTab('all')
    setActiveChips([])
    setView('board')
    setAddOpen(false)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    if (activeId === overId) return

    setApps((prev) => {
      const activeApp = prev.find((a) => a.id === activeId)
      if (!activeApp) return prev

      const overApp = prev.find((a) => a.id === overId)
      const overColumn = overApp ? overApp.column : overId
      if (!kanbanColumns.some((c) => c.id === overColumn)) return prev

      if (activeApp.column === overColumn) {
        const columnApps = prev.filter((a) => a.column === overColumn)
        const oldIndex = columnApps.findIndex((a) => a.id === activeId)
        const newIndex = overApp
          ? columnApps.findIndex((a) => a.id === overId)
          : columnApps.length - 1
        if (oldIndex < 0 || newIndex < 0) return prev

        const reordered = arrayMove(columnApps, oldIndex, newIndex)
        let cursor = 0
        return prev.map((a) => (a.column === overColumn ? reordered[cursor++] : a))
      }

      return prev.map((a) => (a.id === activeId ? { ...a, column: overColumn } : a))
    })
  }

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Page header & actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
        <h1 className="font-serif font-semibold text-headline-lg text-primary tracking-tight">
          My Applications
        </h1>
        <div className="flex flex-wrap items-center gap-space-sm self-start md:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-cream-subtle text-charcoal-primary font-label-md transition-colors shadow-sm whitespace-nowrap">
            <Icon name="file_download" className="text-[18px]" />
            Export Tracker (CSV)
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container hover:bg-urdu-green-deep text-on-primary font-label-md shadow-sm transition-colors whitespace-nowrap"
          >
            <Icon name="add" className="text-[18px]" />
            Add Custom Application
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-space-lg">
        {/* Kanban / table */}
        <div className="flex flex-col gap-space-md min-w-0">
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
                        : 'text-charcoal-muted hover:text-charcoal-primary'
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
                  { id: 'calendar', icon: 'calendar_month', label: 'Calendar' },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`px-2.5 py-1 rounded font-label-sm flex items-center gap-1.5 transition-all ${
                    view === v.id
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-charcoal-muted hover:text-charcoal-primary font-medium'
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
                        : 'bg-surface-cream-subtle hover:bg-surface-container-lowest text-charcoal-primary'
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
              <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-charcoal-primary font-label-sm font-medium flex items-center gap-2 shadow-sm cursor-pointer">
                <span>Nearest Deadline</span>
                <Icon name="expand_more" className="text-[14px]" />
              </div>
            </div>
          </div>

          {/* Board or table view */}
          {view === 'board' ? (
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md items-start">
                {kanbanColumns.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    apps={visibleApps.filter((a) => a.column === col.id)}
                  />
                ))}
              </div>
            </DndContext>
          ) : view === 'table' ? (
            <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-cream-subtle">
                  <tr className="font-caption uppercase tracking-wider text-charcoal-muted">
                    {table.getHeaderGroups()[0]?.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`px-4 py-3 font-bold ${responsiveColumnClass[header.column.id] ?? ''}`}
                      >
                        {header.column.getCanSort() ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <Icon
                              name={
                                header.column.getIsSorted() === 'asc'
                                  ? 'arrow_upward'
                                  : header.column.getIsSorted() === 'desc'
                                    ? 'arrow_downward'
                                    : 'unfold_more'
                              }
                              className={`text-[12px] ${
                                header.column.getIsSorted() ? 'text-primary' : 'text-charcoal-muted/50'
                              }`}
                            />
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-border-subtle hover:bg-surface-cream-subtle/60 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`px-4 py-3 ${responsiveColumnClass[cell.column.id] ?? ''}`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={table.getAllColumns().length}
                        className="px-4 py-10 text-center font-caption text-charcoal-muted"
                      >
                        No applications match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-border-subtle bg-surface-container-lowest shadow-sm">
                  <span className="font-label-sm text-charcoal-muted">Loading calendar…</span>
                </div>
              }
            >
              <ApplicationCalendar apps={visibleApps} />
            </Suspense>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <Icon name="event_upcoming" className="text-[20px] text-primary" />
            <h3 className="font-serif font-semibold text-[16px] text-primary">Upcoming Deadlines</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingDeadlines.map((d) => (
              <div
                key={d.title}
                className="flex gap-3 items-start p-2.5 rounded-lg bg-surface-cream-subtle min-w-0"
              >
                <div
                  className={`px-2 py-1.5 rounded-lg flex flex-col items-center flex-shrink-0 min-w-[48px] ${
                    d.urgent
                      ? 'bg-urgent-red-bg text-urgent-red'
                      : 'bg-surface-container-lowest text-charcoal-primary'
                  }`}
                >
                  <span className="font-caption text-[10px] font-bold uppercase">{d.month}</span>
                  <span className="font-serif text-[16px] font-bold leading-none">{d.day}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-label-sm text-primary font-semibold break-words">{d.title}</h4>
                  <p className="font-caption text-charcoal-muted break-words">{d.place}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-charcoal-muted font-caption">
            <Icon name="schedule" className="text-[14px] shrink-0" />
            <span>PKT (GMT+5)</span>
            <span className="h-2 w-2 rounded-full bg-urdu-green-deep shrink-0 ml-auto" />
          </div>
        </div>
      </div>

      {addOpen && (
        <AddApplicationModal onClose={() => setAddOpen(false)} onAdd={handleAddApplication} />
      )}
    </div>
  )
}
