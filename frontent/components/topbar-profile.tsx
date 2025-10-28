import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  name?: string
  role?: string
}

export function TopBarProfile({ user }: { user: User | null }) {
  const displayName = user?.name || "User"
  const displayRole = user?.role || "Developer"

  return (
    <div className="flex items-center gap-3 rounded-full bg-[var(--surface)] shadow-neo pl-3 pr-4 py-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/diverse-avatars.png" alt="Avatar" />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <div className="text-sm font-medium text-[var(--text)]">{displayName}</div>
        <div className="text-xs text-[var(--muted)]">{displayRole}</div>
      </div>
    </div>
  )
}
