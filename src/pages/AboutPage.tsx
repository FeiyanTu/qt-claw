import { Info, BookOpen, Bot, Shield, Wrench, Cpu } from 'lucide-react'
import { useAppearance } from '@/contexts/AppearanceContext'

const features = [
  {
    icon: BookOpen,
    title: '知识库与微调',
    desc: '电控系统测试领域知识库 + 大模型安全微调，实现增量学习与轻量化部署',
  },
  {
    icon: Bot,
    title: '多 Agent 协作',
    desc: '知识增强的多 Agent 协作，支持需求与代码上下文推理，缺陷定位与因果链分析',
  },
  {
    icon: Shield,
    title: '智能测试',
    desc: '静态缺陷检测与误报消除，智能化单元/集成测试',
  },
  {
    icon: Wrench,
    title: '安全工具箱',
    desc: '开源安全工具箱集成，支持成分检测、依赖分析、漏洞挖掘、知识产权检测',
  },
  {
    icon: Cpu,
    title: '代码分析',
    desc: '代码质量度量、静态缺陷检测、误报消除、用例自动生成、电磁兼容性能分析',
  },
]

export default function AboutPage() {
  const { appName } = useAppearance()

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          关于
        </h1>

        {/* 标题 */}
        <div className="text-center space-y-1 pb-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{appName}</h2>
          <p className="text-sm text-muted-foreground">智能安全分析工具，由清陶动力科技（上海）有限公司开发</p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 gap-3">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                <item.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <span className="text-xs text-muted-foreground"> - {item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/60 text-center pt-4 border-t border-border">
          清陶动力科技（上海）有限公司
        </p>
      </div>
    </div>
  )
}
