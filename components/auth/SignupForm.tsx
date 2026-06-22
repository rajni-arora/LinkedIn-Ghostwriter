'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupForm() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase
        .from('users')
        .upsert(
          { id: data.user.id, email: data.user.email!, first_name: firstName, last_name: lastName },
          { onConflict: 'id' }
        )
    }

    router.push('/persona')
    router.refresh()
  }

  const inputClass =
    'w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0077B5] text-base'
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>First name</label>
        <input
          type="text"
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="John"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Last name</label>
        <input
          type="text"
          required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Doe"
          className={inputClass}
        />
      </div>

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
        <label className={labelClass}>Password (8 or more characters)</label>
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
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-600 pt-2">
        Already have an account?{' '}
        <a href="/login" className="text-[#0077B5] font-medium hover:underline">
          Sign in
        </a>
      </p>
    </form>
  )
}
