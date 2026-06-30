import SidebarNav from '@/components/dashboard/SidebarNav'
import UserMenu from '@/components/dashboard/UserMenu'
import { createClient } from '@/lib/supabase/server'
import { Users, Send } from 'lucide-react'

function getInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (firstName) return firstName[0].toUpperCase()
  if (email) return email[0].toUpperCase()
  return '?'
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('users').select('first_name, last_name').eq('id', user.id).single()
    : { data: null }

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
    : user?.email ?? ''

  const initials = getInitials(profile?.first_name, profile?.last_name, user?.email)

  return (
    <div className="flex min-h-screen bg-[#F3F2EF]">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        {/* Nav links */}
        <SidebarNav />

        {/* Upcoming features */}
        <div className="px-3 pb-2 space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 mb-1">Upcoming Feature</p>
          <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0077B5] text-white text-sm font-semibold rounded-lg">
            <Users className="w-4 h-4" />
            Influencer Tracking
          </button>
          <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0077B5] text-white text-sm font-semibold rounded-lg">
            <Send className="w-4 h-4" />
            Publish to LinkedIn
          </button>
        </div>

        <UserMenu displayName={displayName} initials={initials} />
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1">
        {children}
      </main>
    </div>
  )
}
