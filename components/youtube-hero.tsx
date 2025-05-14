"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface YouTubeHeroProps {
  videoId: string
}

export function YouTubeHero({ videoId }: YouTubeHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Set loaded after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(timer)
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0 bg-black">
        {isLoaded && (
          <div
            className={`relative h-full w-full ${!isLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute h-[calc(100%+120px)] w-[calc(100%+120px)] -left-[60px] -top-[60px]"
              style={{
                pointerEvents: "none",
                // Scale up the video to cover the container even with the padding
                transform: isMobile ? "scale(1.5)" : "scale(1.2)",
              }}
              frameBorder="0"
              title="Peaky Blinders Crew Video"
            />
          </div>
        )}

        {/* Overlay to darken the video */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Peaky Blinders
          </span>
        </h1>
        <p className="mb-8 max-w-2xl text-xl text-gray-300 sm:text-2xl">
          Cops and Robbers V — Rule the Law or Break It
        </p>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href="https://discord.gg/2WgXGbcvYN">Join Our Discord</Link>
        </Button>
      </div>
    </section>
  )
}
