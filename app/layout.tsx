import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Peaky Blinders | Cops and Robbers V Crew",
  description:
    "Official website of the Peaky Blinders crew for Cops and Robbers V. Join our community, check server stats, and connect with fellow members.",
  keywords: ["Peaky Blinders", "Cops and Robbers V", "GTA", "FiveM", "Gaming Crew", "CNRV"],
  authors: [{ name: "Peaky Blinders Crew" }],
  creator: "Peaky Blinders",
  publisher: "Peaky Blinders",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://peaky-blinders-crew.vercel.app"),
  openGraph: {
    title: "Peaky Blinders | Cops and Robbers V Crew",
    description:
      "Join the dominant force in FiveM's Cops and Robbers. From high-stakes heists to law enforcement takeovers, Peaky Blinders plays hard and fair.",
    url: "https://peaky-blinders-crew.vercel.app",
    siteName: "Peaky Blinders Crew",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Peaky Blinders Crew",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peaky Blinders | Cops and Robbers V Crew",
    description:
      "Join the dominant force in FiveM's Cops and Robbers. From high-stakes heists to law enforcement takeovers, Peaky Blinders plays hard and fair.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="theme-color" content="#5865F2" />

        {/* Discord specific meta tags */}
        <meta property="discord:invite" content="https://discord.gg/2WgXGbcvYN" />
        <meta property="discord:server:id" content="1206571308456878100" />
        <meta property="discord:members" content="104" />
        <meta property="discord:online" content="64" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
