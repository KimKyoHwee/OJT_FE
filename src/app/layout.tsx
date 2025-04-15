import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Batch Job Management System',
  description: '배치 작업을 관리하고 모니터링하기 위한 웹 기반 대시보드',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
