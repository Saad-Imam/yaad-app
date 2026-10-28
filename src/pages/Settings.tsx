import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { APP_FONTS, useTheme } from '../context/ThemeContext'
import {
  COLOR_GROUPS,
  COLOR_TOKENS,
  DEFAULT_COLORS,
  formatHsv,
  normalizeHex,
} from '../theme/colors'

function HexInput({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(value)

  useEffect(() => setDraft(value), [value])

  const commit = () => {
    const normalized = normalizeHex(draft)
    if (normalized) {
      onChange(normalized)
      setDraft(normalized)
    } else {
      setDraft(value)
    }
  }

  return (
    <input
      type="text"
      value={draft}
      onChange={(event) => {
        const next = event.target.value
        setDraft(next)
        if (/^#?[0-9a-fA-F]{6}$/.test(next.trim())) {
          const normalized = normalizeHex(next)
          if (normalized) onChange(normalized)
        }
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          commit()
          event.currentTarget.blur()
        }
      }}
      spellCheck={false}
      aria-label={`${label} hex value`}
      className="w-[92px] rounded-lg border border-border-subtle bg-surface-cream-subtle px-2 py-1 font-caption font-semibold uppercase text-charcoal-primary outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/40"
    />
  )
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-urdu-green-light text-primary-container">
        <Icon name={icon} className="text-[20px]" />
      </span>
      <div>
        <h2 className="font-serif font-semibold text-title-card text-primary">{title}</h2>
        <p className="font-body-sm text-charcoal-muted mt-0.5">{description}</p>
      </div>
    </div>
  )
}

export default function Settings() {
  const {
    font,
    fontId,
    setFont,
    colors,
    setColor,
    resetColor,
    resetColors,
    resetTheme,
    exportColorSheet,
    importColorSheet,
  } = useTheme()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const customizedCount = COLOR_TOKENS.filter(
    (token) => colors[token.id] !== DEFAULT_COLORS[token.id],
  ).length

  const handleImport = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await file.text()
      const result = importColorSheet(text)
      if (result.imported === 0) {
        setImportStatus('No matching color tokens were found in that file.')
      } else {
        const skippedNote = result.skipped > 0 ? `, ${result.skipped} skipped` : ''
        setImportStatus(`Imported ${result.imported} colors${skippedNote}. Theme updated live.`)
      }
    } catch {
      setImportStatus('Could not read that file. Try a CSV or JSON color sheet.')
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-headline-lg text-primary tracking-tight">Settings</h1>
          <p className="font-body-sm text-charcoal-muted mt-1">
            Personalise how Yaad looks and export the design tokens for later use.
          </p>
        </div>
        <button
          type="button"
          onClick={resetTheme}
          className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-lowest px-4 py-2 font-label-md text-charcoal-secondary shadow-sm transition-colors hover:bg-surface-cream-subtle"
        >
          <Icon name="restart_alt" className="text-[18px]" />
          Reset all
        </button>
      </div>

      <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-card border border-border-subtle">
        <SectionHeader
          icon="text_fields"
          title="Application font"
          description="The chosen typeface is applied to both body copy and headings."
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {APP_FONTS.map((option) => {
            const active = option.id === fontId
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFont(option.id)}
                aria-pressed={active}
                className={`relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? 'border-primary-container bg-urdu-green-light shadow-card'
                    : 'border-border-subtle bg-surface-cream-subtle/50 hover:border-secondary-container hover:bg-surface-cream-subtle'
                }`}
              >
                <span
                  className="text-[1.35rem] leading-tight text-primary"
                  style={{ fontFamily: option.stack }}
                >
                  {option.label}
                </span>
                <span className="font-caption text-charcoal-muted">{option.description}</span>
                {active && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-container text-on-primary">
                    <Icon name="check" className="text-[14px]" />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-5 rounded-xl border border-border-subtle bg-canvas-cream p-4">
          <p className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
            Preview
          </p>
          <p
            className="mt-2 text-headline-sm font-semibold text-primary"
            style={{ fontFamily: font.stack }}
          >
            Yaad keeps every opportunity within reach.
          </p>
          <p
            className="mt-1 font-body-sm text-charcoal-secondary"
            style={{ fontFamily: font.stack }}
          >
            Chevening Scholarship · deadline in 6 days · United Kingdom
          </p>
        </div>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-card border border-border-subtle">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionHeader
            icon="palette"
            title="Color tokens"
            description="Every color in the app is named. Adjust a swatch to retheme the whole interface."
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-cream-subtle px-3 py-1 font-label-sm font-medium text-charcoal-secondary">
              {customizedCount > 0 ? `${customizedCount} customized` : 'Defaults'}
            </span>
            <button
              type="button"
              onClick={resetColors}
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-2 font-label-md text-charcoal-secondary transition-colors hover:bg-surface-cream-subtle"
            >
              <Icon name="ink_eraser" className="text-[17px]" />
              Reset colors
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle py-2 pl-2.5 pr-3 font-label-md text-charcoal-secondary transition-colors hover:bg-surface-cream-subtle"
            >
              <Icon name="upload" className="text-[17px]" />
              Import
            </button>
            <button
              type="button"
              onClick={exportColorSheet}
              className="flex items-center gap-1.5 rounded-lg bg-primary-container px-3 py-2 font-label-md font-semibold text-on-primary shadow-sm transition-opacity hover:opacity-90"
            >
              <Icon name="download" className="text-[17px]" />
              Export color sheet
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              className="hidden"
              onChange={(event) => {
                void handleImport(event.target.files?.[0])
                event.target.value = ''
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {COLOR_GROUPS.map((group) => (
            <div key={group}>
              <h3 className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
                {group}
              </h3>
              <div className="mt-2 divide-y divide-border-subtle rounded-xl border border-border-subtle">
                {COLOR_TOKENS.filter((token) => token.group === group).map((token) => {
                  const value = colors[token.id]
                  const isCustom = value !== DEFAULT_COLORS[token.id]
                  return (
                    <div
                      key={token.id}
                      className="flex flex-wrap items-center gap-3 bg-surface-container-lowest px-4 py-3 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <label className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border-subtle shadow-sm">
                        <span
                          className="absolute inset-0"
                          style={{ backgroundColor: value }}
                        />
                        <input
                          type="color"
                          value={value}
                          onChange={(event) => setColor(token.id, event.target.value)}
                          aria-label={`Change ${token.label}`}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-label-md font-semibold text-charcoal-primary">
                            {token.label}
                          </span>
                          <span className="rounded bg-surface-cream-subtle px-1.5 py-0.5 font-caption text-charcoal-muted">
                            --c-{token.id}
                          </span>
                          {isCustom && (
                            <span className="rounded bg-secondary-fixed px-1.5 py-0.5 font-caption font-semibold text-on-secondary-fixed">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="font-caption text-charcoal-muted">{token.description}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <HexInput
                            label={token.label}
                            value={value}
                            onChange={(hex) => setColor(token.id, hex)}
                          />
                          <span className="hidden w-[110px] text-right font-caption text-charcoal-muted sm:block">
                            {formatHsv(value)}
                          </span>
                          <button
                            type="button"
                            onClick={() => resetColor(token.id)}
                            disabled={!isCustom}
                            title={`Reset ${token.label}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-charcoal-muted transition-colors hover:bg-surface-cream-subtle hover:text-charcoal-primary disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Icon name="undo" className="text-[16px]" />
                          </button>
                        </div>
                        <span className="font-caption text-charcoal-muted sm:hidden">
                          {formatHsv(value)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 flex items-center gap-1.5 font-caption text-charcoal-muted">
          <Icon name="info" className="text-[15px]" />
          Export or import a CSV/JSON color sheet. Imported colors apply live and are saved automatically.
        </p>
        {importStatus && (
          <p className="mt-2 flex items-center gap-1.5 font-caption font-semibold text-primary-container">
            <Icon name="check_circle" className="text-[15px]" />
            {importStatus}
          </p>
        )}
      </section>
    </div>
  )
}
