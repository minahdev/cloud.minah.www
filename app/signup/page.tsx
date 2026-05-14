export default function SignupPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">회원가입</h1>
          <p className="text-muted-foreground">Pace와 함께 헬스케어의 미래를 만들어가세요</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="example@pace.dev"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              가입하기
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
