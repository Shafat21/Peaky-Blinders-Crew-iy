import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch data from Discord API
    const response = await fetch("https://discord.com/api/guilds/1206571308456878100/widget.json", {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Discord API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Discord data:", error)
    return NextResponse.json({ error: "Failed to fetch Discord data" }, { status: 500 })
  }
}
