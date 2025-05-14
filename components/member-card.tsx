import Image from "next/image"

interface MemberProps {
  name: string
  role: string
  discordId: string
  avatarUrl?: string // Optional custom avatar URL
}

export function MemberCard({ name, role, discordId, avatarUrl }: MemberProps) {
  // If a custom avatarUrl is provided, use it
  // Otherwise, generate a default Discord avatar based on Discord ID
  const defaultIndex = Number.parseInt(discordId.slice(-1), 10) % 6
  const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`

  // Use custom avatar if provided, otherwise fall back to default
  const imageUrl = avatarUrl || defaultAvatarUrl

  return (
    <div className="glass-card group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-lg transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20">
      <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-purple-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-purple-500/20 transition-all duration-300 group-hover:border-purple-500/50">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/0 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>

        <h3 className="mb-1 text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
    </div>
  )
}
