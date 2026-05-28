import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Binary, GitBranch, ShieldAlert, Search, Copyright } from 'lucide-react'

type TabKey = 'binary' | 'dependency' | 'vulnerability' | 'mining' | 'ip'

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'binary', label: '二进制成分检测', icon: Binary },
  { key: 'dependency', label: '依赖关系分析', icon: GitBranch },
  { key: 'vulnerability', label: '安全漏洞检测', icon: ShieldAlert },
  { key: 'mining', label: '安全漏洞挖掘', icon: Search },
  { key: 'ip', label: '知识产权检测', icon: Copyright },
]

export default function SecurityBoxPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('binary')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">安全箱</h1>
        <p className="text-sm text-muted-foreground mt-0.5">开源安全综合服务工具箱，支持各类安全检测与评估</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧 Tab */}
        <div className="w-44 shrink-0 border-r border-border py-3">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors',
                activeTab === key
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'binary' && <BinaryDetection />}
          {activeTab === 'dependency' && <DependencyAnalysis />}
          {activeTab === 'vulnerability' && <VulnerabilityDetection />}
          {activeTab === 'mining' && <VulnerabilityMining />}
          {activeTab === 'ip' && <IPDetection />}
        </div>
      </div>
    </div>
  )
}

function BinaryDetection() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 aspect-square rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Binary className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">二进制成分检测</h2>
          <p className="text-sm text-muted-foreground">
            对软件二进制进行成分分析，识别内置的开源组件及其版本信息。
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        该功能支持对 ELF、PE、Mach-O 等格式的二进制文件进行分析，检测其中包含的开源库和组件。
      </p>
    </div>
  )
}

function DependencyAnalysis() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 aspect-square rounded-xl bg-green-500/20 flex items-center justify-center">
          <GitBranch className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">依赖关系分析</h2>
          <p className="text-sm text-muted-foreground">
            分析软件项目的依赖关系，识别直接依赖和传递依赖，检测潜在的安全风险。
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        支持 npm、pip、maven、gradle 等主流包管理器的依赖分析，生成依赖树并标记已知漏洞。
      </p>
    </div>
  )
}

function VulnerabilityDetection() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 aspect-square rounded-xl bg-red-500/20 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">安全漏洞检测</h2>
          <p className="text-sm text-muted-foreground">
            基于漏洞数据库，对源代码和依赖进行安全扫描，识别已知安全漏洞。
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        集成 CVE、CNVD 等漏洞库，支持持续更新和快速匹配，帮助发现和修复安全风险。
      </p>
    </div>
  )
}

function VulnerabilityMining() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 aspect-square rounded-xl bg-orange-500/20 flex items-center justify-center">
          <Search className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">安全漏洞挖掘</h2>
          <p className="text-sm text-muted-foreground">
            基于大模型和静态分析技术，自动挖掘潜在的安全漏洞和代码缺陷。
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        采用代码分析、数据流分析、污点分析等技术，自动识别缓冲区溢出、注入漏洞等安全问题。
      </p>
    </div>
  )
}

function IPDetection() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 aspect-square rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Copyright className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold">知识产权检测</h2>
          <p className="text-sm text-muted-foreground">
            检测软件代码的许可证合规性，识别开源协议的兼容性问题。
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        支持检测 GPL、LGPL、MIT、Apache 等常见开源许可证，帮助规避潜在的版权风险。
      </p>
    </div>
  )
}