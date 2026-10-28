import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OpportunitiesFeed from './pages/OpportunitiesFeed'
import ApplicationsTracker from './pages/ApplicationsTracker'
import SavedOpportunities from './pages/SavedOpportunities'
import Settings from './pages/Settings'
import { SavedProvider } from './context/SavedContext'
import { ThemeProvider } from './context/ThemeContext'

const OpportunitiesCalendar = lazy(() => import('./pages/OpportunitiesCalendar'))

function Shell() {
  return (
    <div className="min-h-screen bg-canvas-cream">
      <Sidebar />
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <Routes>
              <Route path="/" element={<OpportunitiesFeed />} />
              <Route
                path="/feed/calendar"
                element={
                  <Suspense
                    fallback={
                      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-border-subtle bg-surface-container-lowest shadow-sm">
                        <span className="font-label-sm text-charcoal-muted">
                          Loading calendar…
                        </span>
                      </div>
                    }
                  >
                    <OpportunitiesCalendar />
                  </Suspense>
                }
              />
              <Route path="/applications" element={<ApplicationsTracker />} />
              <Route path="/saved" element={<SavedOpportunities />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <SavedProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </SavedProvider>
    </ThemeProvider>
  )
}
