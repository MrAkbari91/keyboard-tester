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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Keyboard Tester & Mouse Test Online | Dhruv Akbari",
    template: "%s | Keyboard Tester by Dhruv Akbari",
  },
  description:
    "Free online keyboard and mouse tester by Dhruv Akbari. Test all keyboard keys and mouse buttons instantly with real-time visual feedback. Fast, accurate, and easy to use.",
  keywords: [
    "Dhruv Akbari",
    "keyboard tester",
    "keyboard tester online",
    "mouse tester",
    "keyboard test",
    "test keyboard keys",
    "online keyboard test",
    "key tester",
    "keyboard checker",
    "mouse button test",
    "hardware tester",
    "keyboard testing website",
    "keyboard tester by Dhruv Akbari",
  ],
  authors: [{ name: "Dhruv Akbari", url: "https://keyboard-tester-teal.vercel.app/" }],
  creator: "Dhruv Akbari",
  publisher: "Dhruv Akbari",
  applicationName: "Keyboard & Mouse Tester",
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://keyboard-tester-teal.vercel.app/",
  },
  openGraph: {
    title: "Keyboard Tester & Mouse Test Online | Dhruv Akbari",
    description:
      "Test your keyboard keys and mouse buttons online with instant real-time feedback. Built by Dhruv Akbari.",
    url: "https://keyboard-tester-teal.vercel.app/",
    siteName: "Keyboard Tester by Dhruv Akbari",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/image.png", // add this image for better sharing
        width: 1200,
        height: 630,
        alt: "Keyboard Tester by Dhruv Akbari",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyboard Tester & Mouse Test Online | Dhruv Akbari",
    description:
      "Free online keyboard and mouse tester with real-time feedback. Built by Dhruv Akbari.",
    creator: "@DhruvAkbari", // optional if you have one
    images: ["/image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "M71tdDiU-O499RIu-uqiDLBLkJAVh67t9e107tz2UVk",
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