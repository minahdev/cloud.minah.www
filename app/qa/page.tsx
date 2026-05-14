"use client"

import { useState } from "react"
import { Activity, Sparkles, Send, Bot } from "lucide-react"

const suggestedQuestions = [
  "운동 후 근육통을 줄이는 방법은?",
  "심박수 변이도(HRV)란 무엇인가요?",
  "당뇨 환자의 운동 권장 사항은?",
]

export default function QAPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "안녕하세요! 헬스케어 Q&A 봇입니다. 건강, 운동, 의료 데이터에 관한 질문을 해주세요.",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: "user", content: input }])
    setInput("")
  }

  const handleSuggestedQuestion = (question: string) => {
    setMessages([...messages, { role: "user", content: question }])
  }

  return (
    <div className="pt-28 md:pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            헬스케어 Q&A 챗봇
          </h1>
          <p className="text-muted-foreground">
            의료 데이터 분석 기반의 인공지능 상담 시스템
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Pace Health Assistant</p>
              <p className="text-xs text-primary flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                온라인
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 min-h-[300px] space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-3">
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-md ${
                    message.role === "assistant"
                      ? "bg-secondary text-foreground"
                      : "bg-primary text-primary-foreground ml-auto"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Questions */}
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-2">추천 질문</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-1.5 bg-secondary border border-border rounded-full text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="건강에 관한 질문을 입력하세요..."
                className="flex-1 bg-secondary border border-border rounded-full px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={handleSend}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
