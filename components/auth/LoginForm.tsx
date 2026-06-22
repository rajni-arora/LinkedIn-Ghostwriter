'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        setError('Please confirm your email first — check your inbox for a confirmation link.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    // Check if persona exists — skip setup if already done
    const { data: persona } = await supabase
      .from('user_persona')
      .select('id')
      .single()

    router.push(persona ? '/generate' : '/persona')
    router.refresh()
  }

  const inputClass =
    'w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0077B5] text-base'
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#0077B5] hover:bg-[#005f8e] text-white font-semibold rounded-[7px] text-base transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-gray-600 pt-2">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-[#0077B5] font-medium hover:underline">
          Sign up
        </a>
      </p>
    </form>
  )
}
