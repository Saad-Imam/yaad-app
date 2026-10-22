export function Icon({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) {
  return <span className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`}>{name}</span>
}
