import { RoleGroup } from "@/components/role-group"

export function InsidersSection() {
  const leadershipData = {
    leaders: [
      {
        name: "P-B | JamstarOG",
        role: "Creator",
        discordId: "396059469337067522",
        // Example of custom avatar URL - replace with actual URL
        avatarUrl: "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/5c7a5ed1ae87a63a291d5eaeddcc615e-1596969636/cc%20and%20downscale_6/create-a-gif-for-your-discord-nitro-profile.gif",
      },
      {
        name: "P-B | 💦Slim Shady💦",
        role: "Creator",
        discordId: "341967945318006795",
        // Example of custom avatar URL - replace with actual URL
        avatarUrl: "https://cdnb.artstation.com/p/assets/images/images/045/952/021/original/maddie_creates-600x600.gif?1643923145",
      },
    ],
    bosses: [
      {
        name: "P-B | TheFrup!OG",
        role: "Boss",
        discordId: "683750652039528452",
        avatarUrl: "https://i.postimg.cc/ryYQCtnd/360-F-570799631-o-Gks9-H7-Hi-HUhn2-LWA4-Qy-J3-TXge-QA7-XSc.jpg",
      },
      {
        name: "P-B | DEVIN",
        role: "Boss",
        discordId: "212641775272067073",
        avatarUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f044d663-80b9-446e-abdf-e4533aed7115/diflbe8-a71d6e94-afdc-4d04-b351-cce20ba22951.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2YwNDRkNjYzLTgwYjktNDQ2ZS1hYmRmLWU0NTMzYWVkNzExNVwvZGlmbGJlOC1hNzFkNmU5NC1hZmRjLTRkMDQtYjM1MS1jY2UyMGJhMjI5NTEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.sv_9iS9pCpQ-niJEdSFDmZyPMEs7Vq6b3ZYNyiqAeTs",
      },
      {
        name: "P-B | DynamixOG",
        role: "Boss",
        discordId: "460482036247822346",
        avatarUrl: "https://i.postimg.cc/rsX4pMy9/gta-vi-colors-of-the-logo-v0-esec9eww9p3c1-1-1.jpg",
      },
    ],
    underbosses: [
      {
        name: "P-B | Artjom471",
        role: "Underboss",
        discordId: "432492018317524992",
        avatarUrl: "https://i.postimg.cc/65XLhLVp/360-F-786609151-A8u21e8lv-PFymx9-Ki-Isph-Jmce-Uw-Vd-Ov-G.jpg",
      },
      {
        name: "P-B | ShivanshST89",
        role: "Underboss",
        discordId: "735052328415002625",
        avatarUrl: "https://woodpunchsgraphics.com/cdn/shop/files/Glitch-Discord-Server-Icon-Purple.webp?v=1737952288",
      },
      {
        name: "P-B | WolficekOG",
        role: "Underboss",
        discordId: "207608039656783876",
        avatarUrl: "https://media.tenor.com/ltpyiPEvEE0AAAAM/magic-wolf.gif",
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
