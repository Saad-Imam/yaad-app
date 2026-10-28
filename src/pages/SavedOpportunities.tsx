import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import Badge from '../components/Badge'
import { useSaved } from '../context/SavedContext'
import type { Opportunity } from '../data'

function SavedCard({ op, onRemove }: { op: Opportunity; onRemove: (id: string) => void }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(op.applyUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard access can be blocked; the link is still available via View Details.
    }
  }

  return (
    <article className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm border border-transparent transition-all hover:shadow-card hover:border-primary-container/60">
      <div className="flex flex-wrap items-center gap-2">
        <Badge label={op.type} />
        {op.verified && <Badge label="Verified" />}
        <Badge label={op.location} />
        <Badge
          label={op.deadline}
          tone={op.urgent ? 'urgent' : 'default'}
          className="ml-auto whitespace-nowrap"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-label-sm font-semibold uppercase tracking-wider text-charcoal-muted truncate">
          {op.org}
        </span>
        <h2 className="font-serif font-semibold text-title-card text-primary leading-snug break-words">
          {op.title}
        </h2>
        <p className="font-body-sm text-charcoal-primary line-clamp-3">{op.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={op.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold hover:bg-urdu-green-deep transition-colors shadow-sm"
          >
            View Details
            <Icon name="open_in_new" className="text-[16px]" />
          </a>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-cream-subtle text-charcoal-primary font-label-md hover:bg-surface-muted transition-colors"
            title="Copy application link"
          >
            <Icon name={copied ? 'check' : 'link'} className="text-[16px]" />
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
        <button
          onClick={() => onRemove(op.id)}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-label-sm font-medium text-charcoal-muted hover:text-urgent-red hover:bg-urgent-red-bg transition-colors"
          title="Remove from saved"
        >
          <Icon name="bookmark_remove" className="text-[18px]" />
          Remove
        </button>
      </div>
    </article>
  )
}

export default function SavedOpportunities() {
  const { savedOpportunities, removeSaved, clearSaved } = useSaved()
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [urgentOnly, setUrgentOnly] = useState(false)

  const types = useMemo(() => {
    const counts = new Map<string, number>()
    for (const op of savedOpportunities) {
      counts.set(op.type, (counts.get(op.type) ?? 0) + 1)
    }
    return Array.from(counts, ([type, count]) => ({ type, count }))
  }, [savedOpportunities])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return savedOpportunities.filter((op) => {
      if (activeType !== 'all' && op.type !== activeType) return false
      if (urgentOnly && !op.urgent) return false
      if (!q) return true
      return [op.title, op.org, op.description, op.location, op.type, ...op.flags]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [savedOpportunities, activeType, urgentOnly, query])

  const hasFilters = query.trim() !== '' || activeType !== 'all' || urgentOnly

  const resetFilters = () => {
    setQuery('')
    setActiveType('all')
    setUrgentOnly(false)
  }

  const clearAll = () => {
    clearSaved()
    resetFilters()
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <h1 className="font-serif font-bold text-headline-lg text-primary tracking-tight">
            Saved Opportunities
          </h1>
          <p className="font-body-sm text-charcoal-muted mt-1 max-w-xl">
            Everything you bookmark from the feed, collected in one place. Links open the original
            source so you can take the next step.
          </p>
        </div>
        {savedOpportunities.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-border-subtle shadow-sm hover:bg-surface-cream-subtle transition-colors font-label-md text-charcoal-secondary"
          >
            <Icon name="delete_sweep" className="text-[18px]" />
            Clear All
          </button>
        )}
      </div>

      {savedOpportunities.length > 0 && (
        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex w-full items-center gap-2 rounded-xl border border-border-subtle bg-surface-container-lowest px-3.5 py-2.5 shadow-sm sm:max-w-md">
              <Icon name="search" className="text-[20px] text-charcoal-muted shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search saved opportunities..."
                className="w-full min-w-0 bg-transparent font-body-sm text-charcoal-primary outline-none placeholder:text-charcoal-muted"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-charcoal-muted hover:bg-surface-cream-subtle shrink-0"
                  aria-label="Clear search"
                >
                  <Icon name="close" className="text-[16px]" />
                </button>
              )}
            </div>
            <span className="font-label-sm text-charcoal-muted">
              Showing {filtered.length} of {savedOpportunities.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-caption uppercase tracking-wider font-bold text-charcoal-muted mr-1">
              Type:
            </span>
            <button
              onClick={() => setActiveType('all')}
              className={`px-3 py-1 rounded-full font-label-sm font-medium transition-all shadow-sm ${
                activeType === 'all'
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-cream-subtle hover:bg-surface-container-lowest text-charcoal-primary'
              }`}
            >
              All ({savedOpportunities.length})
            </button>
            {types.map(({ type, count }) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1 rounded-full font-label-sm font-medium transition-all shadow-sm ${
                  activeType === type
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-cream-subtle hover:bg-surface-container-lowest text-charcoal-primary'
                }`}
              >
                {type} ({count})
              </button>
            ))}
            <button
              onClick={() => setUrgentOnly((value) => !value)}
              className={`px-3 py-1 rounded-full font-label-sm font-medium transition-all shadow-sm flex items-center gap-1.5 ${
                urgentOnly
                  ? 'bg-urgent-red text-on-primary'
                  : 'bg-surface-cream-subtle hover:bg-surface-container-lowest text-charcoal-primary'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${urgentOnly ? 'bg-on-primary' : 'bg-urgent-red'}`}
              />
              Urgent only
            </button>
          </div>
        </div>
      )}

      {savedOpportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-xl text-center shadow-sm">
          <Icon name="bookmark_border" className="text-[48px] text-charcoal-muted mb-2" />
          <h2 className="font-serif font-semibold text-headline-sm text-primary">
            Nothing saved yet
          </h2>
          <p className="font-body-sm text-charcoal-muted max-w-sm mt-1">
            Tap the bookmark on any opportunity in the feed to keep it here for later.
          </p>
          <Link
            to="/"
            className="mt-4 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold hover:bg-urdu-green-deep transition-colors"
          >
            Browse Opportunities
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-xl text-center shadow-sm">
          <Icon name="search_off" className="text-[48px] text-charcoal-muted mb-2" />
          <h2 className="font-serif font-semibold text-headline-sm text-primary">
            No matches in your saved list
          </h2>
          <p className="font-body-sm text-charcoal-muted max-w-sm mt-1">
            Try a different search, or clear the filters to see everything you saved.
          </p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold hover:bg-urdu-green-deep transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
          {filtered.map((op) => (
            <SavedCard key={op.id} op={op} onRemove={removeSaved} />
          ))}
        </div>
      )}
    </div>
  )
}
