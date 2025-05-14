import { MemberCard } from "@/components/member-card"

interface Member {
  name: string
  role: string
  discordId: string
  avatarUrl?: string // Optional custom avatar URL
}

interface RoleGroupProps {
  title: string
  members: Member[]
}

export function RoleGroup({ title, members }: RoleGroupProps) {
  return (
    <div className="mb-12 text-center">
      <h3 className="mb-6 text-xl font-bold">{title}</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-4xl">
        {members.map((member) => (
          <MemberCard
            key={member.discordId}
            name={member.name}
            role={member.role}
            discordId={member.discordId}
            avatarUrl={member.avatarUrl} // Pass the custom avatar URL if provided
          />
        ))}
      </div>
    </div>
  )
}
