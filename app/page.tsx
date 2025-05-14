import Link from "next/link"
import { DiscordWidget } from "@/components/discord-widget"
import { ServerCard } from "@/components/server-card"
import { Button } from "@/components/ui/button"
import { InsidersSection } from "@/components/insiders-section"
import { LiveServerStats } from "@/components/live-server-stats"
import { YouTubeHero } from "@/components/youtube-hero"
import { Footer } from "@/components/footer"

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

      {/* Footer */}
      <Footer />
    </main>
  )
}
