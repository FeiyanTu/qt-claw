import { useState, useRef, useCallback, useEffect } from 'react'
import TitleBar from '@/components/layout/TitleBar'
import Sidebar, { type PageKey } from '@/components/layout/Sidebar'
import DashboardPage from '@/pages/DashboardPage'
import SettingsPage from '@/pages/SettingsPage'
import ModelsPage from '@/pages/ModelsPage'
import SkillsPage from '@/pages/SkillsPage'
import AgentPage from '@/pages/AgentPage'
import PersonaPage from '@/pages/PersonaPage'
import AboutPage from '@/pages/AboutPage'
import IntegrationsPage from '@/pages/IntegrationsPage'
import CronPage from '@/pages/CronPage'
import KnowledgeBasePage from '@/pages/KnowledgeBasePage'
import SecurityBoxPage from '@/pages/SecurityBoxPage'
import ClipboardPage from '@/pages/ClipboardPage'
import QuickPastePage from '@/pages/QuickPastePage'
import AuthPage from '@/pages/AuthPage'
import { GatewayProvider } from '@/contexts/GatewayContext'
import { AgentProvider } from '@/contexts/AgentContext'
import { AppearanceProvider } from '@/contexts/AppearanceContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import AppLifecycleOverlay from '@/components/AppLifecycleOverlay'

function KeepAlive({ active, children }: { active: boolean; children: React.ReactNode }) {
  const mountedRef = useRef(false)
  if (active) mountedRef.current = true
  if (!mountedRef.current) return null
  return (
    <div className={active ? 'flex flex-1 flex-col overflow-hidden' : 'hidden'}>
      {children}
    </div>
  )
}

const isQuickPasteMode = new URLSearchParams(window.location.search).get('mode') === 'quickpaste'

function MainApp({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  const [currentPage, setCurrentPage] = useState<PageKey>('agents')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [configVersion, setConfigVersion] = useState(0)
  const handleConfigSaved = useCallback(() => setConfigVersion(v => v + 1), [])

  return (
    <GatewayProvider>
      <AgentProvider>
      <AppearanceProvider>
      <div className="h-screen flex flex-col">
        <TitleBar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            userEmail={userEmail}
            onLogout={onLogout}
          />
          <main className="flex-1 flex flex-col overflow-hidden bg-background">
            <ErrorBoundary>
            <div className={currentPage === 'agents' ? 'flex flex-1 flex-col overflow-hidden' : 'hidden'}>
              <AgentPage onNavigateToModels={() => setCurrentPage('models')} configVersion={configVersion} />
            </div>
            <KeepAlive active={currentPage === 'dashboard'}>
              <DashboardPage />
            </KeepAlive>
            <KeepAlive active={currentPage === 'clipboard'}>
              <ClipboardPage active={currentPage === 'clipboard'} />
            </KeepAlive>
            <KeepAlive active={currentPage === 'integrations'}>
              <IntegrationsPage />
            </KeepAlive>
            <KeepAlive active={currentPage === 'cron'}>
              <CronPage active={currentPage === 'cron'} />
            </KeepAlive>
            <KeepAlive active={currentPage === 'models'}>
              <ModelsPage active={currentPage === 'models'} onSaved={handleConfigSaved} />
            </KeepAlive>
            <KeepAlive active={currentPage === 'settings'}>
              <SettingsPage active={currentPage === 'settings'} />
            </KeepAlive>
            <KeepAlive active={currentPage === 'skills'}>
              <SkillsPage />
            </KeepAlive>
            <KeepAlive active={currentPage === 'knowledge'}>
              <KnowledgeBasePage />
            </KeepAlive>
            <KeepAlive active={currentPage === 'securitybox'}>
              <SecurityBoxPage />
            </KeepAlive>
            <KeepAlive active={currentPage === 'persona'}>
              <PersonaPage active={currentPage === 'persona'} />
            </KeepAlive>
            <KeepAlive active={currentPage === 'about'}>
              <AboutPage onNavigate={setCurrentPage} />
            </KeepAlive>
            </ErrorBoundary>
          </main>
        </div>
      </div>
      </AppearanceProvider>
      </AgentProvider>
      <AppLifecycleOverlay />
    </GatewayProvider>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    window.electronAPI.auth.getToken().then(async (res) => {
      if (res.success && res.token && res.email) {
        const urlRes = await window.electronAPI.remoteUrl.get()
        if (urlRes.url) {
          const validRes = await window.electronAPI.auth.validate(urlRes.url, res.token!)
          if (validRes.success) {
            setUserEmail(res.email)
            setAuthenticated(true)
            setChecking(false)
            return
          }
        }
      }
      setAuthenticated(false)
      setChecking(false)
    }).catch(() => {
      setAuthenticated(false)
      setChecking(false)
    })
  }, [])

  if (isQuickPasteMode) {
    return <QuickPastePage />
  }

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="h-screen flex flex-col">
        <TitleBar />
        <AuthPage onLogin={(_token, email) => { setUserEmail(email); setAuthenticated(true) }} />
      </div>
    )
  }

  return <MainApp userEmail={userEmail} onLogout={() => { setAuthenticated(false); setUserEmail('') }} />
}
