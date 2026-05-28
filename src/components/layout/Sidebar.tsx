import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  UserCircle2,
  Info,
  Plug2,
  Clock,
  BookOpen,
  LogOut,
  ChevronUp,
  Shield,
} from 'lucide-react'
import { useAppearance } from '@/contexts/AppearanceContext'

export type PageKey = 'agents' | 'dashboard' | 'clipboard' | 'integrations' | 'cron' | 'persona' | 'models' | 'settings' | 'skills' | 'knowledge' | 'securitybox' | 'about'

function AIIcon({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center justify-center w-4.5 h-4.5 min-w-4.5 shrink-0 text-[14px] font-semibold leading-none text-current translate-y-px', className)}>AI</span>
  )
}

interface SidebarProps {
  currentPage: PageKey
  onNavigate: (page: PageKey) => void
  collapsed: boolean
  onToggle: () => void
  userEmail?: string
  onLogout?: () => void
}

const navItems: { key: PageKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'knowledge', label: '知识库', icon: BookOpen },
  { key: 'securitybox', label: '安全箱', icon: Shield },
  { key: 'agents', label: '数字人', icon: Bot },
  { key: 'dashboard', label: '控制台', icon: LayoutDashboard },
  { key: 'integrations', label: '接入', icon: Plug2 },
  { key: 'cron', label: '定时', icon: Clock },
  { key: 'persona', label: '设定', icon: UserCircle2 },
  { key: 'skills', label: '技能', icon: Sparkles },
  { key: 'models', label: '模型', icon: AIIcon },
  { key: 'about', label: '关于', icon: Info },
]

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggle, userEmail, onLogout }: SidebarProps) {
  const { appName, iconDataUrl } = useAppearance()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    if (!userMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [userMenuOpen])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await window.electronAPI.auth.logout()
    onLogout?.()
  }

  const handleSettings = () => {
    onNavigate('settings')
    setUserMenuOpen(false)
  }

  const displayName = userEmail ? userEmail.split('@')[0] : '用户'

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-white border-r border-border shrink-0 transition-all duration-200 ease-in-out',
        collapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center shrink-0 h-12 px-3', collapsed ? 'justify-center' : 'gap-2.5')}>
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 bg-muted/30">
          <img src={iconDataUrl || `${import.meta.env.BASE_URL}icon.png`} alt="" className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden">
            {appName}
          </span>
        )}
      </div>

      {/* 导航 */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg text-sm transition-colors cursor-pointer',
              collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5',
              currentPage === key
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </button>
        ))}
      </nav>

      {/* 底部区域：用户信息 + 收起 */}
      <div className="border-t border-border">
        {/* 用户信息 */}
        {!collapsed && userEmail && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
              </div>
              <ChevronUp className={cn('w-3 h-3 text-muted-foreground transition-transform', userMenuOpen && 'rotate-180')} />
            </button>

            {/* 下拉菜单 */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-2 right-2 mb-1 bg-white border border-border rounded-lg shadow-md overflow-hidden z-50">
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  设置
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-muted transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  登出
                </button>
              </div>
            )}
          </div>
        )}

        {/* 收起按钮 */}
        <div className="px-2 py-2">
          <button
            onClick={onToggle}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer',
              collapsed ? 'justify-center px-0' : 'px-3'
            )}
            title={collapsed ? '展开侧栏' : '收起侧栏'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4.5 h-4.5" />
            ) : (
              <>
                <PanelLeftClose className="w-4.5 h-4.5" />
                <span className="text-sm whitespace-nowrap">收起</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
