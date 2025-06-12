import { NextResponse } from "next/server"

interface ApiPlayer {
  Uid: string
  Username: {
    Username: string
    Timestamp: string
  }
}

interface Player {
  name: string
  id: string
  ping: number
}

const API_ENDPOINTS: Record<string, string> = {
  US1: "https://api.gtacnr.net/cnr/players?serverId=US1",
  US2: "https://api.gtacnr.net/cnr/players?serverId=US2",
  EU1: "https://api.gtacnr.net/cnr/players?serverId=EU1",
  EU2: "https://api.gtacnr.net/cnr/players?serverId=EU2",
  SEA: "https://sea.gtacnr.net/cnr/players?serverId=SEA",
}

const MOCK_DATA: Record<string, Player[]> = {
  US1: [
    { name: "P-B | JamstarOG", id: "usr-123456", ping: 45 },
    { name: "P-B | TheFrup!OG", id: "usr-234567", ping: 32 },
  ],
  US2: [
    { name: "P-B | DEVIN", id: "usr-345678", ping: 28 },
    { name: "P-B | ShivanshST89", id: "usr-456789", ping: 53 },
  ],
  EU1: [
    { name: "P-B | mikamo", id: "usr-567890", ping: 37 },
    { name: "P-B | WolficekOG", id: "usr-678901", ping: 41 },
  ],
  EU2: [
    { name: "P-B | Artjom471", id: "usr-789012", ping: 39 },
    { name: "P-B | 💦Slim Shady💦", id: "usr-890123", ping: 47 },
  ],
  SEA: [
    { name: "P-B | Shafat", id: "usr-901234", ping: 40 },
    { name: "P-B | Ishu73", id: "usr-912345", ping: 36 },
  ],
}

const serverDataCache: {
  [serverId: string]: {
    data: any
    timestamp: number
  }
} = {}

const CACHE_TTL = 5 * 60 * 1000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const useRealData = searchParams.get("real") === "true"

  const IDS = ["US1", "US2", "EU1", "EU2", "SEA"]
  const serverResults = []
  let apiAvailable = false
  let fetchFailCount = 0

  try {
    if (!useRealData) {
      const mockServers = IDS.map((serverId) => ({
        serverId,
        players: MOCK_DATA[serverId] || [],
        online: true,
        usingMockData: true,
      }))

      return NextResponse.json(
        {
          servers: mockServers,
          timestamp: new Date().toISOString(),
          usingMockData: true,
          mockDataCount: IDS.length,
          apiStatus: "mock",
          message: "Using mock data by default. Click 'Try Real Data' to attempt fetching live data.",
        },
        {
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      )
    }

    for (const serverId of IDS) {
      const url = API_ENDPOINTS[serverId]
      if (!url) {
        serverResults.push({
          serverId,
          players: [],
          online: false,
          error: `No API endpoint defined for ${serverId}`,
        })
        continue
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        const response = await fetch(url, {
          next: { revalidate: 300 },
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        apiAvailable = true

        if (response.status === 404) {
          serverResults.push({
            serverId,
            players: [],
            online: false,
            error: `Server ${serverId} not found`,
          })
        } else if (response.status === 429) {
          serverResults.push({
            serverId,
            players: MOCK_DATA[serverId] || [],
            online: true,
            rateLimited: true,
            usingMockData: true,
          })
        } else if (!response.ok) {
          serverResults.push({
            serverId,
            players: MOCK_DATA[serverId] || [],
            online: true,
            error: `API error: ${response.status}`,
            usingMockData: true,
          })
        } else {
          const data = await response.json()
          const players = Array.isArray(data) ? data : []
          const pbPlayers = players.filter((player: ApiPlayer) => {
            const username = player.Username?.Username || ""
            return username.includes("P-B") || username.includes("P-B |") || username.includes("[P-B]")
          })

          const serverData = {
            serverId,
            players: pbPlayers.map((player: ApiPlayer) => ({
              name: player.Username?.Username || "Unknown Player",
              id: player.Uid || Math.random().toString(36).substring(2, 9),
              ping: Math.floor(Math.random() * 80) + 20,
            })),
            online: true,
          }

          serverDataCache[serverId] = {
            data: serverData,
            timestamp: Date.now(),
          }

          serverResults.push(serverData)
        }
      } catch (error) {
        clearTimeout(timeoutId)
        fetchFailCount++

        serverResults.push({
          serverId,
          players: MOCK_DATA[serverId] || [],
          online: true,
          error: "Connection unavailable",
          fetchFailed: true,
          usingMockData: true,
        })
      }

      if (serverId !== IDS[IDS.length - 1]) {
        await new Promise((r) => setTimeout(r, 500))
      }
    }

    const mockDataCount = serverResults.filter((s) => s.usingMockData).length
    const totalServers = IDS.length
    const allServersMocked = mockDataCount === totalServers

    const apiStatus = allServersMocked ? "unavailable" : mockDataCount > 0 ? "partial" : "available"
    const message = allServersMocked
      ? "Unable to connect to any servers. Using mock data for all servers."
      : mockDataCount > 0
        ? `Using mock data for ${mockDataCount} of ${totalServers} servers due to connectivity issues.`
        : null

    return NextResponse.json(
      {
        servers: serverResults,
        timestamp: new Date().toISOString(),
        usingMockData: mockDataCount > 0,
        mockDataCount,
        apiStatus,
        apiAvailable: apiAvailable && !allServersMocked,
        message,
        fetchFailCount,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        servers: IDS.map((id) => ({
          serverId: id,
          players: MOCK_DATA[id] || [],
          online: true,
          error: "Connection unavailable",
          fetchFailed: true,
          usingMockData: true,
        })),
        timestamp: new Date().toISOString(),
        error: "Failed to fetch server data",
        usingMockData: true,
        mockDataCount: IDS.length,
        apiStatus: "unavailable",
        apiAvailable: false,
        message: "Unable to connect to server API. Using mock data for all servers.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  }
}
