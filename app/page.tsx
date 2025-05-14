import Link from "next/link"
import { DiscordWidget } from "@/components/discord-widget"
import { ServerCard } from "@/components/server-card"
import { Button } from "@/components/ui/button"
import { InsidersSection } from "@/components/insiders-section"
import { LiveServerStats } from "@/components/live-server-stats"
import { YouTubeHero } from "@/components/youtube-hero"

export default function Home() {
  const servers = [
    {
      region: "NA1",
      flag: "🇺🇸",
      location: "Chicago",
      mode: "Featured Server",
      status: "online",
      url: "https://cfx.re/join/a6aope",
    },
    {
      region: "NA2",
      flag: "🇺🇸",
      location: "Chicago",
      mode: "Hardcore Mode",
      status: "online",
      url: "https://cfx.re/join/zlvypp",
    },
    {
      region: "NA3",
      flag: "🇺🇸",
      location: "Chicago",
      mode: "Offline",
      status: "offline",
      url: "https://cfx.re/join/qmv4z4",
    },
    {
      region: "EU1",
      flag: "🇪🇺",
      location: "Frankfurt",
      mode: "Featured",
      status: "online",
      url: "https://cfx.re/join/kx98er",
    },
    {
      region: "EU2",
      flag: "🇪🇺",
      location: "Frankfurt",
      mode: "Hardcore",
      status: "online",
      url: "https://cfx.re/join/abo683",
    },
    {
      region: "SEA",
      flag: "🇸🇬",
      location: "Singapore",
      mode: "Offline",
      status: "offline",
      url: "https://cfx.re/join/apyap9",
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section with YouTube Video */}
      <YouTubeHero videoId="eJis4tGVwj8" />

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-lg">
            <h2 className="mb-6 text-center text-3xl font-bold">About Our Crew</h2>
            <p className="text-center text-lg text-gray-300">
              We're a dominant force in FiveM's Cops and Robbers. From high-stakes heists to law enforcement takeovers,
              Peaky Blinders plays hard and fair.
            </p>
          </div>
        </div>
      </section>

      {/* Insiders Section */}
      <InsidersSection />

      {/* Discord Section */}
      <section className="py-20 bg-gradient-to-b from-black/0 to-purple-900/20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Live Chat</h2>
          <DiscordWidget />
        </div>
      </section>

      {/* Live Server Stats Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            <span className="mr-2">📊</span> Live Server Stats
          </h2>
          <LiveServerStats />
        </div>
      </section>

      {/* Servers Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">
            <span className="mr-2">🎮</span> CNRV Servers
          </h2>
          <p className="mb-8 text-center text-gray-400">
            Click a link to join or search 'Cops and Robbers V' in FiveM.
          </p>

          <div className="mb-8 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-black/40 backdrop-blur-lg hover:bg-white/10"
            >
              <Link href="https://gtacnr.net/servers">Check Real-Time Status</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <ServerCard key={server.region} server={server} />
            ))}
          </div>
        </div>
      </section>
      <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
        <Link href="https://discord.gg/2WgXGbcvYN">Join Our Discord</Link>
      </Button>
    </main>
  )
}
