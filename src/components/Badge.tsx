export default function Badge({
  label,
  tone = 'default',
  className = '',
}: {
  label: string
  tone?: 'default' | 'urgent'
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-caption font-semibold ${
        tone === 'urgent'
          ? 'border-urgent-red/20 text-urgent-red'
          : 'border-border-subtle bg-surface-cream-subtle text-charcoal-secondary'
      } ${className}`}
    >
      {label}
    </span>
  )
}
