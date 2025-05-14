import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const discordId = searchParams.get("id")

  if (!discordId) {
    return NextResponse.json({ error: "Discord ID is required" }, { status: 400 })
  }

  try {
    // Try to fetch the Discord avatar
    const response = await fetch(`https://cdn.discordapp.com/avatars/${discordId}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Discord avatar")
    }

    // Get the avatar as a blob
    const avatarBlob = await response.blob()

    // Return the avatar image
    return new NextResponse(avatarBlob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching Discord avatar:", error)

    // Return a 302 redirect to a placeholder image
    return NextResponse.redirect(`/placeholder.svg?height=96&width=96&query=gaming profile avatar`, 302)
  }
}
