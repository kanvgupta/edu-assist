import type { Metadata } from 'next'
import './globals.css'
import { NextAuthProvider } from '@/components/providers/session-provider'
import { AuthButton } from '@/components/auth/auth-button'
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: 'Special Ed Platform',
  description: 'AI Teaching Assistant for Special Education',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen">
        <NextAuthProvider>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* <div className="container flex h-14 items-center justify-between">
              <span className="font-bold">AI Teacher's Aid</span>
              <AuthButton />
            </div> */}
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="py-6 md:px-8 md:py-0 border-t">
            {/* <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground">
                Built by Your Name/Team.
              </p>
            </div> */}
          </footer>

        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
