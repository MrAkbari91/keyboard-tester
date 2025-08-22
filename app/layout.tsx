import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Keyboard & Mouse Tester by Dhruv Akbari - Test Your Hardware Online",
  description:
    "Use Dhruv Akbari's free online keyboard and mouse tester to check every key and button in real time. Ensure your hardware is functioning perfectly with instant feedback.",
  keywords:
    "Dhruv Akbari, keyboard tester, mouse tester, test keyboard online, key checker, button test, hardware test, keyboard test tool, check keyboard keys, online key test",
  authors: [{ name: "Dhruv Akbari" }],
  creator: "Dhruv Akbari",
  publisher: "Dhruv Akbari",
  robots: "index, follow",
  openGraph: {
    title: "Keyboard & Mouse Tester by Dhruv Akbari",
    description: "Test your keyboard keys and mouse buttons online with real-time visual feedback. Built by Dhruv Akbari.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyboard & Mouse Tester by Dhruv Akbari",
    description: "Test your keyboard keys and mouse buttons online with real-time visual feedback. Built by Dhruv Akbari.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
        {/* favicon */}
        <link rel="icon" href="/favicon.png"  />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
