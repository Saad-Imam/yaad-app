import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  COLOR_TOKENS,
  DEFAULT_COLORS,
  buildColorSheetCsv,
  downloadColorSheet,
  hexToRgbChannels,
  normalizeHex,
  parseColorSheet,
  type ColorSheetImport,
} from '../theme/colors'

export interface AppFont {
  id: string
  label: string
  stack: string
  description: string
}

export const APP_FONTS: AppFont[] = [
  {
    id: 'dm-sans',
    label: 'DM Sans',
    stack: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    description: 'Clean geometric sans · default',
  },
  {
    id: 'playfair',
    label: 'Playfair Display',
    stack: '"Playfair Display", Georgia, serif',
    description: 'Editorial serif with high contrast',
  },
  {
    id: 'inter',
    label: 'Inter',
    stack: '"Inter", ui-sans-serif, system-ui, sans-serif',
    description: 'Neutral interface sans',
  },
  {
    id: 'urdu',
    label: 'Noto Nastaliq Urdu',
    stack: '"Noto Nastaliq Urdu", serif',
    description: 'Calligraphic Nastaliq script',
  },
  {
    id: 'system',
    label: 'System UI',
    stack: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    description: 'Use the operating system font',
  },
]

const STORAGE_KEY = 'yaad.theme'
const DEFAULT_FONT_ID = 'dm-sans'

interface StoredTheme {
  fontId?: string
  colors?: Record<string, string>
}

interface ThemeContextValue {
  font: AppFont
  fontId: string
  setFont: (fontId: string) => void
  colors: Record<string, string>
  setColor: (tokenId: string, hex: string) => void
  resetColor: (tokenId: string) => void
  resetColors: () => void
  resetTheme: () => void
  exportColorSheet: () => void
  importColorSheet: (text: string) => ColorSheetImport
  colorSheetCsv: string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): StoredTheme {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as StoredTheme
  } catch {
    return {}
  }
}

function sanitizeColors(input: unknown): Record<string, string> {
  if (typeof input !== 'object' || input === null) return {}
  const source = input as Record<string, unknown>
  const validIds = new Set(COLOR_TOKENS.map((token) => token.id))
  const result: Record<string, string> = {}
  for (const [id, value] of Object.entries(source)) {
    if (!validIds.has(id) || typeof value !== 'string') continue
    const normalized = normalizeHex(value)
    if (normalized) result[id] = normalized
  }
  return result
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored] = useState<StoredTheme>(readStoredTheme)
  const [fontId, setFontId] = useState(
    APP_FONTS.some((font) => font.id === stored.fontId) ? stored.fontId! : DEFAULT_FONT_ID,
  )
  const [overrides, setOverrides] = useState<Record<string, string>>(() => sanitizeColors(stored.colors))

  const colors = useMemo<Record<string, string>>(
    () => ({ ...DEFAULT_COLORS, ...overrides }),
    [overrides],
  )

  const font = useMemo(
    () => APP_FONTS.find((candidate) => candidate.id === fontId) ?? APP_FONTS[0],
    [fontId],
  )

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--font-app', font.stack)
    root.style.setProperty('--font-heading', font.stack)
  }, [font])

  useEffect(() => {
    const root = document.documentElement
    for (const token of COLOR_TOKENS) {
      root.style.setProperty(`--c-${token.id}`, hexToRgbChannels(colors[token.id]))
    }
  }, [colors])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontId, colors: overrides }))
    } catch {
      // Storage may be unavailable; theme still applies for this session.
    }
  }, [fontId, overrides])

  const setFont = useCallback((nextFontId: string) => {
    if (APP_FONTS.some((candidate) => candidate.id === nextFontId)) {
      setFontId(nextFontId)
    }
  }, [])

  const setColor = useCallback((tokenId: string, hex: string) => {
    const normalized = normalizeHex(hex)
    if (!normalized) return
    setOverrides((current) => ({ ...current, [tokenId]: normalized }))
  }, [])

  const resetColor = useCallback((tokenId: string) => {
    setOverrides((current) => {
      if (!(tokenId in current)) return current
      const next = { ...current }
      delete next[tokenId]
      return next
    })
  }, [])

  const resetColors = useCallback(() => setOverrides({}), [])

  const resetTheme = useCallback(() => {
    setFontId(DEFAULT_FONT_ID)
    setOverrides({})
  }, [])

  const exportColorSheet = useCallback(() => downloadColorSheet(colors), [colors])

  const importColorSheet = useCallback((text: string) => {
    const result = parseColorSheet(text)
    if (result.imported > 0) {
      setOverrides((current) => ({ ...current, ...result.colors }))
    }
    if (result.fontId && APP_FONTS.some((candidate) => candidate.id === result.fontId)) {
      setFontId(result.fontId)
    }
    return result
  }, [])

  const colorSheetCsv = useMemo(() => buildColorSheetCsv(colors), [colors])

  const value = useMemo<ThemeContextValue>(
    () => ({
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
      colorSheetCsv,
    }),
    [
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
      colorSheetCsv,
    ],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }
  return context
}
