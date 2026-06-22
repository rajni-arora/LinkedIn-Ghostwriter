import Image from 'next/image'
import SignOutButton from '@/components/auth/SignOutButton'
import SidebarNav from '@/components/dashboard/SidebarNav'
import { createClient } from '@/lib/supabase/server'

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
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <Image src="/logo.png" alt="LinkedInWrites" width={150} height={50} />
        </div>

        {/* Nav links */}
        <SidebarNav />

        {/* User avatar + Logout */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <span className="text-xs text-gray-600 truncate">{displayName}</span>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1">
        {children}
      </main>
    </div>
  )
}
