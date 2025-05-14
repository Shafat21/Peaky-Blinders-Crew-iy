"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ServerIcon, RefreshCw, AlertTriangle, Clock, WifiOff, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Player {
  name: string
  id: number | string
  ping: number
}

interface ServerStats {
  serverId: string
  players: Player[]
  online: boolean
  error?: string
  rateLimited?: boolean
  usingCachedData?: boolean
  fetchFailed?: boolean
  usingMockData?: boolean
}

interface ApiResponse {
  servers: ServerStats[]
  timestamp: string
  error?: string
  message?: string
  apiStatus?: "available" | "partial" | "unavailable" | "mock"
  usingMockData?: boolean
  mockDataCount?: number
  apiAvailable?: boolean
  fetchFailCount?: number
}

export function LiveServerStats() {
  const [serverStats, setServerStats] = useState<ServerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<string>("loading")
  const [totalPBMembers, setTotalPBMembers] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [nextRefresh, setNextRefresh] = useState<Date | null>(null)
  const [usingMockData, setUsingMockData] = useState(true) // Default to mock data
  const [mockDataCount, setMockDataCount] = useState(0)
  const [apiAvailable, setApiAvailable] = useState(false)

  async function fetchServerStats(useRealData = false) {
    try {
      setIsRefreshing(true)

      // Add a timestamp to prevent caching
      const timestamp = Date.now()

      // Build query params
      let url = `/api/server-stats?t=${timestamp}`
      if (useRealData) url += "&real=true"

      // Add a timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      try {
        const response = await fetch(url, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          signal: controller.signal,
        })

        // Clear the timeout since the request completed
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Failed to fetch server stats: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        setServerStats(data.servers)
        setLastUpdated(new Date(data.timestamp || Date.now()))

        // Set status message
        setStatusMessage(data.message || null)

        // Set API status
        setApiStatus(data.apiStatus || "mock")

        // Set mock data status
        setUsingMockData(data.usingMockData || false)
        setMockDataCount(data.mockDataCount || 0)

        // Set API availability
        setApiAvailable(data.apiAvailable || false)

        // Set next refresh time to 2 minutes from now
        const nextRefreshTime = new Date()
        nextRefreshTime.setMinutes(nextRefreshTime.getMinutes() + 2)
        setNextRefresh(nextRefreshTime)

        // Calculate total P-B members online
        const total = data.servers.reduce((acc: number, server: ServerStats) => acc + (server.players?.length || 0), 0)
        setTotalPBMembers(total)

        // Set error from API response if present
        if (data.error) {
          setError(data.error)
        } else {
          setError(null)
        }
      } catch (fetchError) {
        // Clear the timeout in case of error
        clearTimeout(timeoutId)

        console.error("Error fetching server stats:", fetchError)

        // Check if it's an AbortError (timeout)
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          setError("Request timed out. The server may be unavailable.")
        } else {
          setError("Failed to fetch server stats. Please try again later.")
        }

        setStatusMessage("Connection to server API failed. Using mock data.")
        setApiStatus("unavailable")
        setUsingMockData(true)
      }
    } catch (err) {
      console.error("Unexpected error in fetchServerStats:", err)
      setError("An unexpected error occurred. Please try again later.")
      setStatusMessage("Connection to server API failed. Using mock data.")
      setApiStatus("unavailable")
      setUsingMockData(true)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  // Function to force refresh with real data
  const tryRealData = () => {
    fetchServerStats(true)
  }

  // Function to use mock data
  const useMockData = () => {
    fetchServerStats(false)
  }

  useEffect(() => {
    fetchServerStats() // Default to mock data on initial load

    // Refresh data every 2 minutes
    const intervalId = setInterval(() => fetchServerStats(), 120000)

    return () => clearInterval(intervalId)
  }, [])

  // Format the last updated time
  const formattedTime = lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""

  // Format the next refresh time
  const formattedNextRefresh = nextRefresh
    ? nextRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : ""

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-lg">
        <div className="mb-4 flex items-center justify-center">
          <BarChart3 className="mr-2 h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-bold">Live Server Stats</h3>
        </div>
        <div className="mb-4 flex items-center justify-center">
          <Skeleton className="h-6 w-40 bg-white/10" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    )
  }

  // Sort servers: online with players first, then online without players, then offline
  const sortedServers = [...serverStats].sort((a, b) => {
    if (a.online && a.players.length > 0 && (!b.online || b.players.length === 0)) return -1
    if (b.online && b.players.length > 0 && (!a.online || a.players.length === 0)) return 1
    if (a.online && !b.online) return -1
    if (!a.online && b.online) return 1
    return a.serverId.localeCompare(b.serverId)
  })

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-lg">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-center">
          <BarChart3 className="mr-2 h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-bold">Live Server Stats</h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="outline" className="bg-purple-500/20 px-3 py-1 text-sm">
            {totalPBMembers} P-B Members Online
          </Badge>

          {lastUpdated && <span className="text-xs text-gray-400">Last updated: {formattedTime}</span>}

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-white/10 bg-black/40 hover:bg-white/10"
                    onClick={() => fetchServerStats()}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Auto-refreshes at {formattedNextRefresh}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {usingMockData && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-white/10 bg-black/40 hover:bg-white/10"
                      onClick={tryRealData}
                      disabled={isRefreshing}
                    >
                      <ServerIcon className="h-3.5 w-3.5 mr-1" />
                      Try Real Data
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Attempt to fetch real data from API</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {!usingMockData && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-white/10 bg-black/40 hover:bg-white/10"
                      onClick={useMockData}
                      disabled={isRefreshing}
                    >
                      <Database className="h-3.5 w-3.5 mr-1" />
                      Use Mock Data
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Switch to mock data for all servers</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-red-500/10 px-3 py-1 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {usingMockData && (
          <div className="mt-4 rounded-md border border-blue-500/20 bg-blue-500/5 p-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" />
              <h4 className="font-medium text-blue-300">
                {apiStatus === "mock" ? "Using Mock Data" : "Partial Mock Data"}
              </h4>
            </div>
            <p className="mt-1 text-sm text-gray-300">{statusMessage || "Showing mock data to preview the feature."}</p>
            {apiStatus === "mock" && (
              <p className="mt-2 text-xs text-gray-400">
                This is a preview using sample data. Click "Try Real Data" to attempt to fetch live data.
              </p>
            )}
            {apiStatus !== "mock" && apiAvailable && (
              <p className="mt-2 text-xs text-gray-400">
                Some servers are using real data, others are using mock data due to connectivity issues.
              </p>
            )}
          </div>
        )}

        {!usingMockData && apiStatus === "partial" && (
          <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
            <WifiOff className="h-4 w-4" />
            <span>Some servers are currently unreachable</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedServers.map((server) => (
          <div
            key={server.serverId}
            className={`
              rounded-xl border p-4 transition-all
              ${
                server.online && server.players.length > 0
                  ? "border-purple-500/30 bg-black/60"
                  : "border-white/10 bg-black/20 opacity-70"
              }
              ${server.fetchFailed ? "border-red-500/30" : ""}
              ${server.usingMockData ? "border-blue-500/30" : ""}
            `}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ServerIcon className="h-5 w-5 text-purple-400" />
                <h4 className="font-bold">{server.serverId}</h4>
                {server.fetchFailed && !server.usingMockData && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <WifiOff className="h-3.5 w-3.5 text-red-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Connection unavailable</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {server.usingMockData && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Database className="h-3.5 w-3.5 text-blue-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Using mock data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {server.rateLimited && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Rate limited - data may be delayed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {server.usingCachedData && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Using cached data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Badge
                variant="outline"
                className={`
                  ${server.online ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                `}
              >
                {server.online ? "Online" : "Offline"}
              </Badge>
            </div>

            {server.usingMockData && (
              <div className="mb-2 rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-400 text-center">
                Mock Data
              </div>
            )}

            {server.fetchFailed && !server.usingMockData && (
              <div className="mb-2 rounded-md bg-red-500/10 px-2 py-1 text-sm text-red-400 font-medium text-center">
                Connection unavailable
              </div>
            )}

            {server.error && !server.fetchFailed && !server.usingMockData && (
              <div className="mb-2 rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400">
                <span>{server.error}</span>
              </div>
            )}

            {server.online && server.players.length > 0 ? (
              <ul className="space-y-2">
                {server.players.map((player, index) => (
                  <li
                    key={player.id || index}
                    className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-2"
                  >
                    <span className="font-medium text-purple-100">{player.name}</span>
                    <span className="text-xs text-gray-400">{player.ping}ms</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">
                {server.fetchFailed && !server.usingMockData
                  ? "Connection unavailable"
                  : server.online
                    ? server.rateLimited
                      ? "Rate limited - try again later"
                      : "No P-B members online"
                    : "Server offline"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
