'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  )
}
