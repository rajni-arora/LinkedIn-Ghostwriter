'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, FileText, User } from 'lucide-react'

const links = [
  { href: '/generate', label: 'Write a Post', icon: Sparkles },
  { href: '/persona', label: 'My Persona', icon: User },
  { href: '/saved', label: 'Saved Posts', icon: FileText },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors font-medium ${
              active
                ? 'bg-[#0077B5] text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-[#0077B5]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
