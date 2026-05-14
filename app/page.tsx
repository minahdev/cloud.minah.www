import { Zap, Brain, BarChart3, Activity } from "lucide-react"

export default function HomePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border mb-8">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Healthcare × Technology</span>
        </div>

        {/* Hero Text */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
          <span className="text-primary">헬스케어</span>
          <span className="text-foreground">를 혁신하는</span>
          <br />
          <span className="text-foreground">개발자, </span>
          <span className="text-primary">Pace</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          AI 기반 헬스케어 솔루션을 설계하고 구축합니다. 데이터 분석과 사용자 경험을 결합하여 의료 서비스의 미래를 만들어갑니다.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 md:gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12+</p>
              <p className="text-sm text-muted-foreground">AI 프로젝트</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary border border-border rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">50M+</p>
              <p className="text-sm text-muted-foreground">데이터 처리량</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">5년</p>
              <p className="text-sm text-muted-foreground">헬스케어 경력</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
