import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ServerProps {
  server: {
    region: string
    flag: string
    location: string
    mode: string
    status: "online" | "offline"
    url: string
  }
}

export function ServerCard({ server }: ServerProps) {
  const { region, flag, location, mode, status, url } = server

  return (
    <div
      className={`
      relative overflow-hidden rounded-xl border border-white/10 
      ${status === "online" ? "bg-black/40 backdrop-blur-lg" : "bg-black/20 backdrop-blur-sm opacity-60"}
      transition-all duration-300 hover:border-purple-500/30
      ${status === "online" ? "hover:shadow-lg hover:shadow-purple-500/10" : ""}
    `}
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{flag}</span>
            <h3 className="text-xl font-bold">{region}</h3>
          </div>
          <div
            className={`
            flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
            ${status === "online" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
          `}
          >
            <span
              className={`
              h-2 w-2 rounded-full
              ${status === "online" ? "bg-green-400" : "bg-gray-400"}
            `}
            ></span>
            {status === "online" ? "Online" : "Offline"}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-400">{location}</p>
          <p className="font-medium">{mode}</p>
        </div>

        <Button
          asChild
          variant={status === "online" ? "default" : "outline"}
          className={`
            w-full
            ${
              status === "online"
                ? "bg-purple-600 hover:bg-purple-700"
                : "border-white/10 bg-black/40 text-gray-400 hover:bg-white/5"
            }
          `}
          disabled={status === "offline"}
        >
          <Link href={url}>{status === "online" ? "Join Now" : "Offline"}</Link>
        </Button>
      </div>

      {/* Glow effect for online servers */}
      {status === "online" && (
        <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl"></div>
      )}
    </div>
  )
}
