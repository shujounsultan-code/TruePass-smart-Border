import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
})

export const metadata: Metadata = {
  title: 'TruePass | لوحة تحكم موظف الجوازات',
  description:
    'نظام TruePass الذكي للتحقق من هوية الركاب عند المنافذ البرية — لوحة تحكم كشك التفتيش.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0b1f33',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={plexArabic.variable}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
