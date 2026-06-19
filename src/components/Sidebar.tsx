import { NavLink } from 'react-router-dom'
import { 
  StickyNote, Database, Globe, Key, FileJson, 
  Hash, Dna, Ruler, Palette, QrCode, Lock, CaseSensitive, ChevronLeft, ChevronRight,
  Binary
} from 'lucide-react'

const links = [
  { to: '/notes', icon: StickyNote, label: 'Quick Notes' },
  { to: '/sql-formatter', icon: Database, label: 'SQL Formatter' },
  { to: '/sql-explain', icon: Database, label: 'SQL Explain' },
  { to: '/rest-api', icon: Globe, label: 'REST API Tester' },
  { to: '/jwt', icon: Key, label: 'JWT Decoder' },
  { to: '/json-tools', icon: FileJson, label: 'JSON Tools' },
  { to: '/guid', icon: Hash, label: 'GUID Generator' },
  { to: '/hash', icon: Dna, label: 'Hash Generator' },
  { to: '/base64', icon: Binary, label: 'Base64' },
  { to: '/unit-converter', icon: Ruler, label: 'Unit Converter' },
  { to: '/color-picker', icon: Palette, label: 'Color Picker' },
  { to: '/qr', icon: QrCode, label: 'QR Generator' },
  { to: '/password', icon: Lock, label: 'Password' },
  { to: '/text-case', icon: CaseSensitive, label: 'Text Case' },
]

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={`bg-sidebar text-sidebar-text flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'} h-screen sticky top-0`}>
      <div className="flex items-center justify-between p-3 border-b border-sidebar-active">
        {!collapsed && <span className="text-sidebar-text-active font-bold text-sm">Dev Tools</span>}
        <button onClick={onToggle} className="p-1.5 rounded hover:bg-sidebar-hover cursor-pointer">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 mx-2 rounded-md text-sm transition-colors ${
                isActive ? 'bg-sidebar-active text-sidebar-text-active' : 'hover:bg-sidebar-hover'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
