import { createClient } from '@/lib/supabase/server'
import PostGenerator from '@/components/PostGenerator'

export default async function GeneratePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: persona }, { data: profile }] = await Promise.all([
    user
      ? supabase.from('user_persona').select('role, industry, target_audience, preferred_tone').eq('user_id', user.id).single()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('users').select('first_name, last_name').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
  ])

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
    : user?.email ?? ''

  return <PostGenerator persona={persona} displayName={displayName} />
}
