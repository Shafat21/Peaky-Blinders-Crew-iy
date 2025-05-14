import { RoleGroup } from "@/components/role-group"

export function InsidersSection() {
  const leadershipData = {
    leaders: [
      {
        name: "P-B | JamstarOG",
        role: "Creator",
        discordId: "396059469337067522",
        // Example of custom avatar URL - replace with actual URL
        avatarUrl: "https://wallpapers.com/images/featured/discord-profile-pictures-xk3qyllfj1j46kte.jpg",
      },
      {
        name: "P-B | 💦Slim Shady💦",
        role: "Creator",
        discordId: "341967945318006795",
        // Example of custom avatar URL - replace with actual URL
        avatarUrl: "https://wallpapers.com/images/featured/discord-profile-pictures-xk3qyllfj1j46kte.jpg",
      },
    ],
    bosses: [
      {
        name: "P-B | TheFrup!OG",
        role: "Boss",
        discordId: "683750652039528452",
        // No avatarUrl provided, will use default Discord avatar
      },
      {
        name: "P-B | DEVIN",
        role: "Boss",
        discordId: "212641775272067073",
        // No avatarUrl provided, will use default Discord avatar
      },
      {
        name: "P-B | DynamixOG",
        role: "Boss",
        discordId: "460482036247822346",
        // No avatarUrl provided, will use default Discord avatar
      },
    ],
    underbosses: [
      {
        name: "P-B | Artjom471",
        role: "Underboss",
        discordId: "432492018317524992",
        // No avatarUrl provided, will use default Discord avatar
      },
      {
        name: "P-B | ShivanshST89",
        role: "Underboss",
        discordId: "735052328415002625",
        // No avatarUrl provided, will use default Discord avatar
      },
      {
        name: "P-B | WolficekOG",
        role: "Underboss",
        discordId: "207608039656783876",
        // No avatarUrl provided, will use default Discord avatar
      },
    ],
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-900/10">
      <div className="container mx-auto px-4">
        {/* About Us Card */}
        <div className="mx-auto mb-16 max-w-4xl rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-lg">
          <h3 className="mb-4 text-center text-2xl font-bold">About Our Crew</h3>
          <p className="text-center text-gray-300 leading-relaxed">
            We are Peaky Blinders, a close-knit CnR crew that loves to game together and create unforgettable moments.
            Whether it's teaming up for intense events, chilling with casual roleplay, or just vibing and having fun,
            we're all about building a strong community. We also organize exclusive events and giveaways for our
            members—because being part of the crew has its perks! If you're looking for a crew that knows how to balance
            having a great time with a bit of roleplay and some healthy competition, welcome to the Peaky Blinders.
          </p>
        </div>

        {/* Crew Leadership */}
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-10 text-center text-2xl font-bold">
            <span className="mr-2">🎖️</span> Crew Leadership
          </h3>

          <RoleGroup title="Leader / Creators" members={leadershipData.leaders} />
          <RoleGroup title="Co-Leader/Bosses" members={leadershipData.bosses} />
          <RoleGroup title="Underbosses" members={leadershipData.underbosses} />
        </div>
      </div>
    </section>
  )
}
