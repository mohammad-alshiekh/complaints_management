import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { Toaster } from '@/components/ui/sonner'
import ToasterProvider from '@/components/ToasterProvider'

export const metadata: Metadata = {
  title: 'CMS',
  description: 'Complaints Magagement System',
  generator: 'cms',
  icons: {
    icon: [
      {
        url: '/singleClass.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/singleClass.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/singleClass.png',
        type: 'image/png',
      },
    ],
   },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <Toaster />
          <ToasterProvider />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
