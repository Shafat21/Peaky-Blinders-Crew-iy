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

interface ServerData {
  players: Player[]
  online: boolean
}

// Cache to store server data with timestamps
const serverDataCache: {
  [serverId: string]: {
    data: any
    timestamp: number
  }
} = {}

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000

// Mock data for all servers
const MOCK_DATA = {
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
}

export async function GET(request: Request) {
  // Check if we should use real data from query param (default to mock)
  const { searchParams } = new URL(request.url)
  const useRealData = searchParams.get("real") === "true"

  // Define server IDs to fetch
  const IDS = ["US1", "US2", "EU1", "EU2"]

  try {
    // If we're not explicitly trying to use real data, return mock data immediately
    if (!useRealData) {
      console.log("Using mock data for all servers (default mode)")

      const mockServers = IDS.map((serverId) => ({
        serverId,
        players: MOCK_DATA[serverId as keyof typeof MOCK_DATA] || [],
        online: true,
        usingMockData: true,
      })).concat({
        serverId: "SEA1",
        players: [],
        online: false,
        error: "Server not available",
      })

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
        },
      )
    }

    // If we're trying to use real data, proceed with API calls
    console.log("Attempting to fetch real data from API...")

    // Fetch data for each server sequentially to avoid rate limiting
    const serverResults = []
    let apiAvailable = false
    let fetchFailCount = 0

    for (const serverId of IDS) {
      try {
        console.log(`Processing server ${serverId}...`)

        // Use the correct API endpoint format with serverId parameter
        const url = `https://api.gtacnr.net/cnr/players?serverId=${serverId}`

        console.log(`Fetching data for ${serverId} from ${url}`)

        // Add timeout to fetch using AbortController
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
          console.log(`Request timeout for server ${serverId}`)
        }, 5000) // Short timeout to fail faster

        try {
          const response = await fetch(url, {
            next: { revalidate: 300 }, // Cache for 5 minutes
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
            signal: controller.signal,
          })

          // Clear the timeout since the request completed
          clearTimeout(timeoutId)
          apiAvailable = true

          // Handle different HTTP status codes
          if (response.status === 404) {
            console.log(`Server ${serverId} not found (404)`)
            serverResults.push({
              serverId,
              players: [],
              online: false,
              error: `Server ${serverId} not found`,
            })
          } else if (response.status === 429) {
            console.log(`Rate limit hit for server ${serverId} (429)`)

            // Use mock data for rate limited servers
            serverResults.push({
              serverId,
              players: MOCK_DATA[serverId as keyof typeof MOCK_DATA] || [],
              online: true,
              rateLimited: true,
              usingMockData: true,
            })
          } else if (!response.ok) {
            console.error(`API responded with status ${response.status} for server ${serverId}`)

            // Use mock data for error responses
            serverResults.push({
              serverId,
              players: MOCK_DATA[serverId as keyof typeof MOCK_DATA] || [],
              online: true,
              error: `API error: ${response.status}`,
              usingMockData: true,
            })
          } else {
            const data = await response.json()

            console.log(`Successfully fetched data for ${serverId}`)

            // The API returns an array of player objects directly
            // Each player has a Uid and a Username object with Username and Timestamp
            const players = Array.isArray(data) ? data : []

            // Filter for P-B tagged players
            const pbPlayers = players.filter((player: ApiPlayer) => {
              const username = player.Username?.Username || ""
              return username.includes("P-B") || username.includes("P-B |") || username.includes("[P-B]")
            })

            console.log(`Found ${pbPlayers.length} P-B players on ${serverId}`)

            const serverData = {
              serverId,
              players: pbPlayers.map((player: ApiPlayer) => ({
                name: player.Username?.Username || "Unknown Player",
                id: player.Uid || Math.random().toString(36).substring(2, 9),
                // Generate a random ping since it's not in the API response
                ping: Math.floor(Math.random() * 80) + 20,
              })),
              online: true,
            }

            // Cache the server data
            serverDataCache[serverId] = {
              data: serverData,
              timestamp: Date.now(),
            }

            serverResults.push(serverData)
          }
        } catch (fetchError) {
          console.error(`Fetch error for server ${serverId}:`, fetchError)

          // Clear the timeout in case of error
          clearTimeout(timeoutId)
          fetchFailCount++

          // Use mock data as fallback
          serverResults.push({
            serverId,
            players: MOCK_DATA[serverId as keyof typeof MOCK_DATA] || [],
            online: true,
            error: "Connection unavailable",
            fetchFailed: true,
            usingMockData: true,
          })
        }

        // Add a small delay between requests to avoid rate limiting
        if (serverId !== IDS[IDS.length - 1]) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      } catch (serverError) {
        console.error(`Error processing server ${serverId}:`, serverError)
        fetchFailCount++

        // Use mock data as fallback
        serverResults.push({
          serverId,
          players: MOCK_DATA[serverId as keyof typeof MOCK_DATA] || [],
          online: true,
          error: "Connection unavailable",
          fetchFailed: true,
          usingMockData: true,
        })
      }
    }

    // Add SEA1 as offline since it's not available in the API
    serverResults.push({
      serverId: "SEA1",
      players: [],
      online: false,
      error: "Server not available",
    })

    // Count how many servers have mock data
    const mockDataCount = serverResults.filter((server) => server.usingMockData).length
    const totalServers = IDS.length
    const allServersMocked = mockDataCount === totalServers

    // Determine API status and message
    let apiStatus = "available"
    let message = null

    if (allServersMocked) {
      apiStatus = "unavailable"
      message = "Unable to connect to any servers. Using mock data for all servers."
    } else if (mockDataCount > 0) {
      apiStatus = "partial"
      message = `Using mock data for ${mockDataCount} of ${totalServers} servers due to connectivity issues.`
    }

    return NextResponse.json(
      {
        servers: serverResults,
        timestamp: new Date().toISOString(),
        usingMockData: mockDataCount > 0,
        mockDataCount: mockDataCount,
        apiStatus: apiStatus,
        apiAvailable: apiAvailable && !allServersMocked,
        message: message,
        fetchFailCount: fetchFailCount,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching server stats:", error)

    // Return mock data for all servers as a fallback
    return NextResponse.json(
      {
        servers: IDS.map((id) => ({
          serverId: id,
          players: MOCK_DATA[id as keyof typeof MOCK_DATA] || [],
          online: true,
          error: "Connection unavailable",
          fetchFailed: true,
          usingMockData: true,
        })).concat({
          serverId: "SEA1",
          players: [],
          online: false,
          error: "Server not available",
        }),
        timestamp: new Date().toISOString(),
        error: "Failed to fetch server data",
        usingMockData: true,
        mockDataCount: IDS.length,
        apiStatus: "unavailable",
        apiAvailable: false,
        message: "Unable to connect to server API. Using mock data for all servers.",
      },
      {
        status: 200, // Return 200 even though there was an error, since we're providing mock data
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}
