import { useState, useEffect } from 'react'

export default function KnowledgeBasePage() {
  const [src, setSrc] = useState('')
  const [preload, setPreload] = useState('')

  useEffect(() => {
    Promise.all([
      window.electronAPI.remoteUrl.get(),
      window.electronAPI.kb.getPreloadPath(),
    ]).then(([urlRes, preloadPath]) => {
      if (urlRes.url) {
        const baseUrl = urlRes.url.replace(/\/+$/, '')
        setSrc(`${baseUrl}/platform/knowledge-bases`)
      }
      if (preloadPath) {
        setPreload(`file:///${preloadPath.replace(/\\/g, '/')}`)
      }
    }).catch(() => {})
  }, [])

  if (!src) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        请先在设置中配置远程地址
      </div>
    )
  }

  return (
    <webview
      src={src}
      preload={preload}
      className="flex-1 w-full h-full"
      style={{ border: 'none' }}
    />
  )
}
