import { NavLink, useLocation } from 'react-router-dom'
import { Icon } from './Icon'
import { useSaved } from '../context/SavedContext'

const navItems = [
  { to: '/', icon: 'token', label: 'Feed', badge: null, end: true },
  { to: '/applications', icon: 'id_card', label: 'Applications', badge: '4' },
  { to: '/saved', icon: 'bookmark', label: 'Saved', badge: null },
  { to: '/settings', icon: 'tune', label: 'Settings', badge: null },
]

export default function Sidebar() {
  const { savedIds } = useSaved()
  const { pathname } = useLocation()
  const savedBadge = savedIds.length > 0 ? String(savedIds.length) : null

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-canvas-cream border-r border-border-subtle lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <h1 className="font-serif text-[1.5rem] font-bold text-urdu-green-deep">Yaad</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1.5 px-4">
        {navItems.map((item) => {
          const badge = item.to === '/saved' ? savedBadge : item.badge
          const forceActive =
            item.to === '/' && (pathname === '/' || pathname.startsWith('/feed'))
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-4 py-3 font-label-md text-label-md transition-colors ${
                  isActive || forceActive
                    ? 'bg-primary-container text-on-primary font-semibold'
                    : 'text-charcoal-secondary hover:bg-surface-muted/60'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon name={item.icon} className="text-[20px]" />
                {item.label}
              </span>
              {badge && (
                <span
                  className={`flex h-6 items-center justify-center rounded-full px-2 font-label-sm font-semibold ${
                    'bg-saffron-light text-charcoal-primary'
                  }`}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
