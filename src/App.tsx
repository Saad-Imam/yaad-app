import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OpportunitiesFeed from './pages/OpportunitiesFeed'
import ApplicationsTracker from './pages/ApplicationsTracker'

function Saved() {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <h1 className="font-serif font-bold text-headline-md text-primary">Saved Opportunities</h1>
      <p className="font-body-sm text-charcoal-muted mt-1">Your bookmarked listings appear here.</p>
    </div>
  )
}

function Settings() {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <h1 className="font-serif font-bold text-headline-md text-primary">Settings</h1>
      <p className="font-body-sm text-charcoal-muted mt-1">Preferences and notifications.</p>
    </div>
  )
}

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
              <Route path="/applications" element={<ApplicationsTracker />} />
              <Route path="/saved" element={<Saved />} />
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
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
