'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, UserPlus, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserMenuProps {
  displayName: string
  initials: string
}

export default function UserMenu({ displayName, initials }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div ref={ref} className="relative px-3 py-3 border-t border-gray-100">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <div className="text-left min-w-0">
          <p className="text-xs font-medium text-gray-800 truncate">{displayName}</p>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-[#0077B5] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            </div>
          </div>

          {/* Account settings */}
          <button
            onClick={() => { setOpen(false); router.push('/persona') }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            Account settings
          </button>

          {/* Organization section */}
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Your Organization</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-4 h-4 text-gray-400" />
            Invite team members
          </button>

          {/* Logout */}
          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Start Free Trial */}
          <div className="px-3 py-3 border-t border-gray-100">
            <button className="w-full py-2 bg-[#0077B5] hover:bg-[#005f8e] text-white text-sm font-semibold rounded-lg transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
