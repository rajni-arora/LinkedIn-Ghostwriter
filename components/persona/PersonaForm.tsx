'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ROLES = [
  'Founder', 'Executive', 'Marketer', 'Consultant', 'Sales Professional',
  'HR Professional', 'Engineer', 'Designer', 'Educator', 'Other',
]

const INDUSTRIES = [
  'SaaS / Tech', 'Finance', 'Healthcare', 'Marketing & Advertising',
  'Consulting', 'E-commerce', 'Education', 'Real Estate', 'Legal', 'Other',
]

const TONES = ['Authoritative', 'Conversational', 'Inspirational', 'Data-Driven', 'Storytelling']

interface Props {
  existing?: {
    role: string
    industry: string
    target_audience: string
    preferred_tone: string
  } | null
}

export default function PersonaForm({ existing }: Props) {
  const router = useRouter()
  const [role, setRole] = useState(existing?.role ?? '')
  const [industry, setIndustry] = useState(existing?.industry ?? '')
  const [targetAudience, setTargetAudience] = useState(existing?.target_audience ?? '')
  const [tone, setTone] = useState(existing?.preferred_tone ?? 'Conversational')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error: upsertError } = await supabase
      .from('user_persona')
      .upsert(
        {
          user_id: user.id,
          role,
          industry,
          target_audience: targetAudience,
          preferred_tone: tone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      setError(upsertError.message)
      setLoading(false)
      return
    }

    router.push('/generate')
  }

  const selectClass =
    'w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0077B5] text-base'
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role */}
      <div>
        <label className={labelClass}>Your Role</label>
        <select required value={role} onChange={e => setRole(e.target.value)} className={selectClass}>
          <option value="" disabled>Select your role</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Industry */}
      <div>
        <label className={labelClass}>Your Industry</label>
        <select required value={industry} onChange={e => setIndustry(e.target.value)} className={selectClass}>
          <option value="" disabled>Select your industry</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {/* Target Audience */}
      <div>
        <label className={labelClass}>Target Audience</label>
        <input
          type="text"
          required
          value={targetAudience}
          onChange={e => setTargetAudience(e.target.value)}
          placeholder="e.g. Early-stage startup founders, B2B SaaS decision makers"
          className={selectClass}
        />
      </div>

      {/* Preferred Tone */}
      <div>
        <label className={labelClass}>Preferred Tone</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {TONES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-[7px] border text-sm font-medium transition-all ${
                tone === t
                  ? 'bg-[#0077B5] text-white border-[#0077B5]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#0077B5] hover:text-[#0077B5]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#0077B5] hover:bg-[#005f8e] text-white font-semibold rounded-[7px] text-base transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? 'Saving...' : 'Save Persona & Continue'}
      </button>
    </form>
  )
}
