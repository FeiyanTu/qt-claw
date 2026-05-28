import { useState, useEffect } from 'react'

type TabType = 'login' | 'register'
type StepType = 'setup' | 'auth'

export default function AuthPage({ onLogin }: { onLogin: (token: string, email: string) => void }) {
  const [step, setStep] = useState<StepType>('auth')
  const [tab, setTab] = useState<TabType>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [remoteUrl, setRemoteUrl] = useState('')
  const [setupUrl, setSetupUrl] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    window.electronAPI.remoteUrl.get().then((res) => {
      if (res.url) {
        setRemoteUrl(res.url)
        setStep('auth')
      } else {
        setStep('setup')
      }
      setChecking(false)
    })
  }, [])

  const handleSetup = async () => {
    setError('')
    if (!setupUrl.trim()) { setError('请输入远程地址'); return }
    setLoading(true)
    try {
      await window.electronAPI.remoteUrl.set(setupUrl.trim())
      setRemoteUrl(setupUrl.trim())
      setStep('auth')
    } catch (e) {
      setError(String(e))
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    setError('')
    setSuccessMsg('')
    if (!email.trim()) { setError('请输入邮箱'); return }
    if (!password) { setError('请输入密码'); return }
    if (tab === 'register' && !username.trim()) { setError('请输入用户名'); return }
    setLoading(true)

    try {
      if (tab === 'register') {
        // 保存远程地址
        if (remoteUrl.trim()) {
          await window.electronAPI.remoteUrl.set(remoteUrl.trim())
        }
        const res = await window.electronAPI.auth.register(remoteUrl, username.trim(), email.trim(), password)
        if (res.success) {
          setSuccessMsg('注册成功，请登录')
          setTab('login')
          setUsername('')
          setLoading(false)
          return
        }
        setError(res.error || res.message || '注册失败')
      } else {
        const res = await window.electronAPI.auth.login(remoteUrl, email.trim(), password)
        if (res.success && res.token) {
          onLogin(res.token, email.trim())
          return
        }
        setError(res.error || res.message || '登录失败')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (step === 'setup') {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">QT Claw</h1>
            <p className="text-sm text-muted-foreground mt-1">清陶动力科技（上海）有限公司</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">WeKnora 服务地址</label>
              <input
                type="text"
                placeholder="http://your-server:8080"
                value={setupUrl}
                onChange={(e) => setSetupUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={handleSetup}
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? '请稍候...' : '确认'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">QT Claw</h1>
          <p className="text-sm text-muted-foreground mt-1">清陶动力科技（上海）有限公司</p>
        </div>

        <div className="flex rounded-lg bg-muted p-1">
          <button
            onClick={() => { setTab('login'); setError(''); setSuccessMsg('') }}
            className={`flex-1 py-2 text-sm rounded-md transition-colors cursor-pointer ${
              tab === 'login' ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); setSuccessMsg('') }}
            className={`flex-1 py-2 text-sm rounded-md transition-colors cursor-pointer ${
              tab === 'register' ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            注册
          </button>
        </div>

        <div className="space-y-4">
          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">远程地址</label>
                <input
                  type="text"
                  placeholder="http://your-server:8080"
                  value={remoteUrl}
                  onChange={(e) => setRemoteUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">邮箱</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">密码</label>
            <input
              type="password"
              placeholder="至少6位"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          {successMsg && !error && (
            <p className="text-xs text-emerald-500">{successMsg}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? '请稍候...' : tab === 'login' ? '登录' : '注册'}
          </button>
        </div>
      </div>
    </div>
  )
}
