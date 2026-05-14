import { Heart, TrendingUp, Clock, ArrowUpRight, Activity, Smartphone } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "심박수 분석",
    description: "실시간 심박 데이터 모니터링 및 이상 패턴 감지",
  },
  {
    icon: TrendingUp,
    title: "운동 추천",
    description: "개인 건강 데이터 기반 맞춤형 운동 플랜 생성",
  },
  {
    icon: Clock,
    title: "루틴 최적화",
    description: "AI가 분석한 최적의 운동 루틴과 휴식 시간 제안",
  },
]

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <p className="text-primary font-mono text-sm tracking-wider mb-4">Featured Project</p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          AI 운동 앱 프로젝트
        </h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">
          머신러닝 알고리즘을 활용한 개인 맞춤형 피트니스 솔루션
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Phone Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-3xl p-8 pb-0 overflow-hidden">
              {/* Phone Frame */}
              <div className="bg-card border border-border rounded-[2.5rem] p-6 shadow-2xl max-w-xs mx-auto">
                {/* Phone Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">FitPace</span>
                  </div>
                  <span className="text-xs text-muted-foreground">v2.4</span>
                </div>

                {/* Heart Rate Card */}
                <div className="bg-secondary/50 border border-border rounded-2xl p-4 mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-muted-foreground">현재 심박수</span>
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-primary">78</span>
                    <span className="text-sm text-muted-foreground">BPM</span>
                  </div>
                  {/* Heart Rate Graph */}
                  <div className="flex items-end gap-1 h-12">
                    {[40, 60, 45, 70, 55, 80, 50, 65, 75, 45, 60, 70].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/80 rounded-sm"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-secondary/50 border border-border rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">오늘 걸음</p>
                    <p className="text-xl font-bold text-primary">8,432</p>
                  </div>
                  <div className="bg-secondary/50 border border-border rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">칼로리</p>
                    <p className="text-xl font-bold text-foreground">524</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="bg-primary/20 border border-primary/30 rounded-xl p-4">
                  <p className="text-xs text-primary font-medium mb-1">AI 추천</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    오늘은 고강도 인터벌 트레이닝이 적합합니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Button */}
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary/10 transition-colors mt-4">
              프로젝트 자세히 보기
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
