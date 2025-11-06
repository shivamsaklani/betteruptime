import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/components/redux-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Uptime",
  description: "Professional website monitoring and uptime tracking",
  generator: "uptime",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <ReduxProvider>{children}</ReduxProvider>
          </Suspense>
        </ThemeProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
