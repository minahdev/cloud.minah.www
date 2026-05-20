import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { Footer } from '@/components/footer'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'Pace - Healthcare Developer Portfolio',
  description: '헬스케어를 혁신하는 개발자, Pace',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Suspense fallback={<div className="h-16 shrink-0 border-b border-border/50 bg-background/80 md:h-20 lg:h-24" aria-hidden />}>
          <Header />
        </Suspense>
        <main className="flex min-h-0 flex-1 flex-col pb-20 md:pb-0">
          {children}
        </main>
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
