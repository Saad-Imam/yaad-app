export interface ColorToken {
  id: string
  label: string
  defaultHex: string
  group: ColorGroup
  description: string
}

export type ColorGroup = 'Surfaces' | 'Brand & Accents' | 'Text' | 'Status'

export const COLOR_GROUPS: ColorGroup[] = ['Surfaces', 'Brand & Accents', 'Text', 'Status']

export const COLOR_TOKENS: ColorToken[] = [
  {
    id: 'canvas-cream',
    label: 'Canvas Cream',
    defaultHex: '#FAF7F2',
    group: 'Surfaces',
    description: 'App background',
  },
  {
    id: 'surface-container-lowest',
    label: 'Surface Lowest',
    defaultHex: '#FFFFFF',
    group: 'Surfaces',
    description: 'Cards and elevated panels',
  },
  {
    id: 'surface-cream-subtle',
    label: 'Surface Cream Subtle',
    defaultHex: '#F5F1EB',
    group: 'Surfaces',
    description: 'Soft fills and hover states',
  },
  {
    id: 'surface-muted',
    label: 'Surface Muted',
    defaultHex: '#ECE7DF',
    group: 'Surfaces',
    description: 'Muted fills, badges and scrollbar',
  },
  {
    id: 'border-subtle',
    label: 'Border Subtle',
    defaultHex: '#E4DDD3',
    group: 'Surfaces',
    description: 'Dividers and outlines',
  },
  {
    id: 'scrim',
    label: 'Scrim',
    defaultHex: '#000000',
    group: 'Surfaces',
    description: 'Modal backdrop overlay',
  },
  {
    id: 'urdu-green-deep',
    label: 'Urdu Green Deep',
    defaultHex: '#143628',
    group: 'Brand & Accents',
    description: 'Wordmark and deep brand text',
  },
  {
    id: 'urdu-green-light',
    label: 'Urdu Green Light',
    defaultHex: '#E8F0E6',
    group: 'Brand & Accents',
    description: 'Light brand tint',
  },
  {
    id: 'primary',
    label: 'Primary',
    defaultHex: '#012D1D',
    group: 'Brand & Accents',
    description: 'Primary text and actions',
  },
  {
    id: 'primary-container',
    label: 'Primary Container',
    defaultHex: '#1B4332',
    group: 'Brand & Accents',
    description: 'Active nav, focus rings, shadows',
  },
  {
    id: 'on-primary',
    label: 'On Primary',
    defaultHex: '#FFFFFF',
    group: 'Brand & Accents',
    description: 'Text on primary fills',
  },
  {
    id: 'secondary',
    label: 'Secondary',
    defaultHex: '#805600',
    group: 'Brand & Accents',
    description: 'Secondary accent text',
  },
  {
    id: 'secondary-container',
    label: 'Secondary Container',
    defaultHex: '#FFB630',
    group: 'Brand & Accents',
    description: 'Warm accent fills',
  },
  {
    id: 'secondary-fixed',
    label: 'Secondary Fixed',
    defaultHex: '#FFDDAF',
    group: 'Brand & Accents',
    description: 'Fixed warm accent',
  },
  {
    id: 'on-secondary-fixed',
    label: 'On Secondary Fixed',
    defaultHex: '#281800',
    group: 'Brand & Accents',
    description: 'Text on warm accent fills',
  },
  {
    id: 'saffron-light',
    label: 'Saffron Light',
    defaultHex: '#FEF3C7',
    group: 'Brand & Accents',
    description: 'Badge and highlight fill',
  },
  {
    id: 'charcoal-primary',
    label: 'Charcoal Primary',
    defaultHex: '#1B1B1D',
    group: 'Text',
    description: 'Default body text',
  },
  {
    id: 'charcoal-secondary',
    label: 'Charcoal Secondary',
    defaultHex: '#374151',
    group: 'Text',
    description: 'Secondary body text',
  },
  {
    id: 'charcoal-muted',
    label: 'Charcoal Muted',
    defaultHex: '#6B7280',
    group: 'Text',
    description: 'Captions, placeholders, hints',
  },
  {
    id: 'urgent-red',
    label: 'Urgent Red',
    defaultHex: '#DC2626',
    group: 'Status',
    description: 'Deadlines and errors',
  },
  {
    id: 'urgent-red-bg',
    label: 'Urgent Red Background',
    defaultHex: '#FEE2E2',
    group: 'Status',
    description: 'Error surface tint',
  },
]

export const DEFAULT_COLORS: Record<string, string> = Object.fromEntries(
  COLOR_TOKENS.map((token) => [token.id, token.defaultHex]),
)

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed
      .split('')
      .map((char) => char + char)
      .join('')
      .toUpperCase()}`
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toUpperCase()}`
  }
  return null
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHex(hex) ?? '#000000'
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  }
}

export function hexToRgbChannels(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  return `${r} ${g} ${b}`
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const { r, g, b } = hexToRgb(hex)
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === red) h = 60 * (((green - blue) / delta) % 6)
    else if (max === green) h = 60 * ((blue - red) / delta + 2)
    else h = 60 * ((red - green) / delta + 4)
  }
  if (h < 0) h += 360

  const s = max === 0 ? 0 : delta / max
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(max * 100),
  }
}

export function formatHsv(hex: string): string {
  const { h, s, v } = hexToHsv(hex)
  return `hsv(${h}, ${s}%, ${v}%)`
}

export function buildColorSheetCsv(colors: Record<string, string>): string {
  const header = ['Name', 'Token', 'CSS Variable', 'HEX', 'RGB', 'Hue', 'Saturation', 'Value', 'HSV']
  const rows = COLOR_TOKENS.map((token) => {
    const hex = colors[token.id] ?? token.defaultHex
    const { r, g, b } = hexToRgb(hex)
    const { h, s, v } = hexToHsv(hex)
    return [
      token.label,
      token.id,
      `--c-${token.id}`,
      hex,
      `rgb(${r}, ${g}, ${b})`,
      `${h}°`,
      `${s}%`,
      `${v}%`,
      `hsv(${h}, ${s}%, ${v}%)`,
    ]
  })

  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

export interface ColorSheetImport {
  colors: Record<string, string>
  fontId?: string
  imported: number
  skipped: number
}

const TOKEN_IDS = new Set(COLOR_TOKENS.map((token) => token.id))

function emptyImport(): ColorSheetImport {
  return { colors: {}, imported: 0, skipped: 0 }
}

function collectColors(
  source: Record<string, unknown>,
  skippedKeys: string[] = [],
): ColorSheetImport {
  const colors: Record<string, string> = {}
  let skipped = 0
  for (const [id, value] of Object.entries(source)) {
    if (skippedKeys.includes(id)) continue
    if (!TOKEN_IDS.has(id) || typeof value !== 'string') {
      skipped += 1
      continue
    }
    const normalized = normalizeHex(value)
    if (!normalized) {
      skipped += 1
      continue
    }
    colors[id] = normalized
  }
  return { colors, imported: Object.keys(colors).length, skipped }
}

function parseJsonSheet(text: string): ColorSheetImport {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return emptyImport()
  }
  if (typeof data !== 'object' || data === null) return emptyImport()

  const root = data as Record<string, unknown>
  const hasNestedColors = typeof root.colors === 'object' && root.colors !== null
  const source = (hasNestedColors ? root.colors : root) as Record<string, unknown>
  const fontId = typeof root.fontId === 'string' ? root.fontId : undefined
  const result = collectColors(source, ['fontId'])
  return { ...result, fontId }
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          cell += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') {
      cell += char
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  return rows
}

function parseCsvSheet(text: string): ColorSheetImport {
  const rows = parseCsvRows(text).filter((row) => row.some((cell) => cell.trim() !== ''))
  if (rows.length === 0) return emptyImport()

  const headerIndex = rows.findIndex((row) => {
    const cells = row.map((cell) => cell.trim().toLowerCase())
    return cells.some((cell) => cell === 'token') && cells.some((cell) => cell === 'hex')
  })

  let tokenIndex = 0
  let hexIndex = 1
  let startIndex = 0

  if (headerIndex >= 0) {
    const header = rows[headerIndex].map((cell) => cell.trim().toLowerCase())
    tokenIndex = header.findIndex((cell) => cell === 'token')
    hexIndex = header.findIndex((cell) => cell === 'hex')
    if (hexIndex < 0) hexIndex = header.findIndex((cell) => cell === 'css variable')
    if (tokenIndex < 0) tokenIndex = 0
    if (hexIndex < 0) hexIndex = 1
    startIndex = headerIndex + 1
  }

  const colors: Record<string, string> = {}
  let skipped = 0

  for (const row of rows.slice(startIndex)) {
    const rawToken = row[tokenIndex]?.trim() ?? ''
    const token = rawToken.replace(/^--c-/, '')
    const rawHex = row[hexIndex]?.trim() ?? ''
    if (!token && !rawHex) continue

    if (!TOKEN_IDS.has(token)) {
      skipped += 1
      continue
    }
    const normalized = normalizeHex(rawHex)
    if (!normalized) {
      skipped += 1
      continue
    }
    colors[token] = normalized
  }

  return { colors, imported: Object.keys(colors).length, skipped }
}

export function parseColorSheet(text: string): ColorSheetImport {
  const trimmed = text.trim()
  if (!trimmed) return emptyImport()
  return trimmed.startsWith('{') ? parseJsonSheet(trimmed) : parseCsvSheet(trimmed)
}

export function downloadColorSheet(colors: Record<string, string>) {
  const csv = buildColorSheetCsv(colors)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'yaad-color-sheet.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
