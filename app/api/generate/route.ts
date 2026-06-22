import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert LinkedIn content strategist and ghostwriter. Your job is to write LinkedIn posts that perform exceptionally well — posts that get high engagement, shares, and comments.

Always write posts that:
- Start with a powerful hook (first line must stop the scroll)
- Use short paragraphs and white space for LinkedIn readability
- Include a clear insight, story, or lesson
- End with a thought-provoking question or strong call to action
- Feel authentic and human — never robotic or generic

After writing each post, score it honestly on a viralityScore from 1–100 using these criteria:
- Hook strength (does the first line stop the scroll?) — 25 points
- Insight quality (is there a genuine takeaway?) — 25 points
- Emotional resonance (does it make the reader feel something?) — 25 points
- Call to action (does it drive comments/shares?) — 25 points

Be honest — not every post scores 80+. A generic post should score 50–65. A strong post scores 75–85. An exceptional post scores 86–95. Never give 96+ unless the post is truly outstanding.

You must respond ONLY with a valid JSON object. No explanation, no markdown, no backticks. Just raw JSON.`

function buildUserPrompt(
  topic: string,
  tone: string,
  persona: { role: string; industry: string; target_audience: string; preferred_tone: string } | null
): string {
  const personaContext = persona
    ? `
The author of these posts has the following profile — write in their voice:
- Role: ${persona.role}
- Industry: ${persona.industry}
- Target Audience: ${persona.target_audience}
- Preferred Tone: ${persona.preferred_tone}

Make sure the posts feel like they were written by a ${persona.role} in the ${persona.industry} space, speaking directly to ${persona.target_audience}.
`
    : ''

  return `Write 3 LinkedIn post variations about the following topic: ${topic}

Use this tone for all variations: ${tone}
${personaContext}
Return this exact JSON structure with your honest scores (do NOT use placeholder numbers — evaluate each post individually):
{
  "variations": [
    {
      "postText": "full post text here",
      "viralityScore": <your honest score 1-100>,
      "viralityRationale": "One sentence explaining the specific reason this post will or won't perform well."
    },
    {
      "postText": "full post text here",
      "viralityScore": <your honest score 1-100>,
      "viralityRationale": "One sentence explaining the specific reason this post will or won't perform well."
    },
    {
      "postText": "full post text here",
      "viralityScore": <your honest score 1-100>,
      "viralityRationale": "One sentence explaining the specific reason this post will or won't perform well."
    }
  ]
}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, tone } = body

    if (!topic || !tone) {
      return NextResponse.json(
        { error: 'Topic and tone are required' },
        { status: 400 }
      )
    }

    // Fetch user's persona server-side
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: persona } = user
      ? await supabase.from('user_persona').select('*').eq('user_id', user.id).single()
      : { data: null }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(topic, tone, persona) },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error('Empty response from OpenAI')

    const parsed = JSON.parse(content)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[/api/generate]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate posts' },
      { status: 500 }
    )
  }
}
