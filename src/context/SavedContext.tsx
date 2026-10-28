import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { opportunities, type Opportunity } from '../data'

const STORAGE_KEY = 'yaad.saved-opportunities'

const DEFAULT_SAVED_IDS = [
  'hec-need',
  'systems-trainee',
  'ignite-ngiri',
  'iba-admissions',
  'chevening',
  'sindh-hec-indigenous',
]

const validIds = new Set(opportunities.map((op) => op.id))

function readStoredIds(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SAVED_IDS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return DEFAULT_SAVED_IDS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULT_SAVED_IDS
    return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id))
  } catch {
    return DEFAULT_SAVED_IDS
  }
}

interface SavedContextValue {
  savedIds: string[]
  savedOpportunities: Opportunity[]
  isSaved: (id: string) => boolean
  toggleSaved: (id: string) => void
  removeSaved: (id: string) => void
  clearSaved: () => void
}

const SavedContext = createContext<SavedContextValue | null>(null)

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(readStoredIds)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
    } catch {
      // Storage can be unavailable (private mode, quota); saving still works for this session.
    }
  }, [savedIds])

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds])

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((ids) => (ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id]))
  }, [])

  const removeSaved = useCallback((id: string) => {
    setSavedIds((ids) => ids.filter((saved) => saved !== id))
  }, [])

  const clearSaved = useCallback(() => setSavedIds([]), [])

  const savedOpportunities = useMemo(
    () =>
      savedIds
        .map((id) => opportunities.find((op) => op.id === id))
        .filter((op): op is Opportunity => Boolean(op)),
    [savedIds],
  )

  const value = useMemo(
    () => ({ savedIds, savedOpportunities, isSaved, toggleSaved, removeSaved, clearSaved }),
    [savedIds, savedOpportunities, isSaved, toggleSaved, removeSaved, clearSaved],
  )

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
}

export function useSaved() {
  const context = useContext(SavedContext)
  if (!context) {
    throw new Error('useSaved must be used inside a SavedProvider')
  }
  return context
}
