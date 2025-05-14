"use client"

import { useEffect, useState } from "react"
import { DiscordLogo } from "@/components/discord-logo"

interface DiscordMember {
  id: string
  username: string
  avatar_url: string
  status: string
}

interface DiscordData {
  name: string
  instant_invite: string
  presence_count: number
  members: DiscordMember[]
}

export function DiscordWidget() {
  const [discordData, setDiscordData] = useState<DiscordData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDiscordData() {
      try {
        setLoading(true)
        // Use our API route instead of calling Discord directly
        const response = await fetch("/api/discord")

        if (!response.ok) {
          throw new Error("Failed to fetch Discord data")
        }

        const data = await response.json()
        setDiscordData(data)
      } catch (err) {
        console.error("Discord widget error:", err)
        setError("Could not load Discord widget")
      } finally {
        setLoading(false)
      }
    }

    fetchDiscordData()

    // Refresh data every 2 minutes
    const intervalId = setInterval(fetchDiscordData, 120000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#1e1f22] p-4 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <DiscordLogo className="h-12 w-12 text-[#5865F2] animate-pulse mb-4" />
          <p>Loading Discord data...</p>
        </div>
      </div>
    )
  }

  if (error || !discordData) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#1e1f22] p-4 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <DiscordLogo className="h-12 w-12 text-gray-500 mb-4" />
          <p className="text-red-400 mb-2">{error || "Could not load Discord widget"}</p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1e1f22]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <DiscordLogo className="h-6 w-6 text-[#5865F2]" />
        <div>
          <h3 className="font-bold text-white">{discordData.name}</h3>
          <p className="text-sm text-gray-400">{discordData.presence_count} members online</p>
        </div>
      </div>

      {/* Members list */}
      <div className="max-h-80 overflow-y-auto">
        {discordData.members.length > 0 ? (
          <div className="divide-y divide-white/5">
            {discordData.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-4 hover:bg-white/5">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <img
                    src={member.avatar_url || "/placeholder.svg"}
                    alt={member.username}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1e1f22] ${
                      member.status === "online"
                        ? "bg-green-500"
                        : member.status === "idle"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  ></div>
                </div>
                <span className="text-white">{member.username}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No members currently online</p>
        )}
      </div>

      {/* Join button */}
      <div className="p-4">
        <a
          href="https://discord.gg/2WgXGbcvYN"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-md bg-[#5865F2] py-3 font-medium text-white hover:bg-[#4752C4] transition-colors"
        >
          Join Server
        </a>
      </div>
    </div>
  )
}
