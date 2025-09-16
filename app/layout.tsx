import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Keyboard & Mouse Tester by Dhruv Akbari - Test Your Hardware Online",
  description:
    "Use Dhruv Akbari's free online keyboard and mouse tester to check every key and button in real time. Ensure your hardware is functioning perfectly with instant feedback.",
  keywords: [
    "Dhruv Akbari",
    "keyboard tester",
    "mouse tester",
    "test keyboard online",
    "key checker",
    "button test",
    "hardware test",
    "keyboard test tool",
    "check keyboard keys",
    "online key test",
  ],
  authors: [{ name: "Dhruv Akbari" }],
  creator: "Dhruv Akbari",
  publisher: "Dhruv Akbari",
  robots: "index, follow",
  openGraph: {
    title: "Keyboard & Mouse Tester by Dhruv Akbari",
    description:
      "Test your keyboard keys and mouse buttons online with real-time visual feedback. Built by Dhruv Akbari.",
    type: "website",
    locale: "en_US",
    url: "https://keyboard-tester-teal.vercel.app/", // Replace with actual URL
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyboard & Mouse Tester by Dhruv Akbari",
    description:
      "Test your keyboard keys and mouse buttons online with real-time visual feedback. Built by Dhruv Akbari.",
  },
  icons: {
    icon: "/favicon.png", // Corrected this path
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}