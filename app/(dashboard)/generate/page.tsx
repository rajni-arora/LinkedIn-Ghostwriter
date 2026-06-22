import { createClient } from '@/lib/supabase/server'
import PostGenerator from '@/components/PostGenerator'

export default async function GeneratePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: persona } = user
    ? await supabase.from('user_persona').select('role, industry, target_audience, preferred_tone').eq('user_id', user.id).single()
    : { data: null }

  return <PostGenerator persona={persona} />
}
