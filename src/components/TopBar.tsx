import { Icon } from './Icon'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border-subtle bg-canvas-cream/85 px-6 py-4 backdrop-blur-[8px]">
      <div className="flex max-w-[560px] flex-1 items-center gap-3 rounded-xl border border-border-subtle bg-surface-container-lowest px-4 py-3 shadow-sm mx-auto">
        <Icon name="search" className="text-[20px] text-charcoal-muted" />
        <span className="flex-1 truncate text-base text-charcoal-muted">
          Search opportunities, scholarships, grants...
        </span>
        <span className="rounded bg-surface-muted px-1.5 py-0.5 font-caption font-semibold text-charcoal-secondary">
          ⌘K
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-charcoal-secondary hover:bg-surface-muted/60 transition-colors">
          <Icon name="notifications" className="text-[22px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-urgent-red ring-2 ring-canvas-cream" />
        </button>
        <button className="h-10 w-10 overflow-hidden rounded-full bg-primary-container">
          <img src="https://i.pravatar.cc/72?img=12" alt="Profile" className="h-full w-full object-cover" />
        </button>
      </div>
    </header>
  )
}
