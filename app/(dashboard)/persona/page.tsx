import { createClient } from '@/lib/supabase/server'
import PersonaForm from '@/components/persona/PersonaForm'
import { User } from 'lucide-react'

export default async function PersonaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: existing } = user
    ? await supabase.from('user_persona').select('*').eq('user_id', user.id).single()
    : { data: null }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-[#0077B5]" />
          <h1 className="text-2xl font-bold text-gray-900">
            {existing ? 'Edit Your Persona' : 'Set Up Your Persona'}
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          This helps AI write posts in your voice. You only need to do this once.
        </p>
      </div>

      <div className="bg-white rounded-[7px] border border-gray-200 shadow-sm p-8">
        <PersonaForm existing={existing} />
      </div>
    </div>
  )
}
