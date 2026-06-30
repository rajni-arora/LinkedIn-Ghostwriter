'use client'

import { useState, useRef } from 'react'
import { Copy, Sparkles, Zap, Bookmark, Loader2, User, Crown, Check, LayoutGrid, Type, FileText, Smile } from 'lucide-react'
import { toast } from 'sonner'

const TONES = ['Authoritative', 'Conversational', 'Inspirational', 'Data-Driven', 'Storytelling']
const MAX_CHARS = 300

interface PostVariation {
  postText: string
  viralityScore: number
  viralityRationale: string
}

interface Persona {
  role: string
  industry: string
  target_audience: string
  preferred_tone: string
}

function scoreBadgeStyle(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 border border-green-200'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  return 'bg-orange-100 text-orange-800 border border-orange-200'
}

function cardBorderStyle(score: number): string {
  if (score >= 80) return 'border-green-400'
  if (score >= 60) return 'border-yellow-400'
  return 'border-orange-400'
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-6 w-14 bg-gray-200 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="bg-gray-100 rounded-lg p-4 space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-4/6 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-3/6 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 flex-1 bg-gray-200 rounded-lg" />
        <div className="h-9 flex-1 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

function VariationCard({
  variation, index, topic, tone,
}: {
  variation: PostVariation; index: number; topic: string; tone: string
}) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(variation.postText)
    toast.success('Copied to clipboard!')
  }

  async function handleSave() {
    if (saved || saving) return
    setSaving(true)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic, tone,
        post_text: variation.postText,
        virality_score: variation.viralityScore,
        virality_rationale: variation.viralityRationale,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      toast.success('Post saved to your library!')
    } else {
      toast.error('Failed to save post. Try again.')
    }
  }

  return (
    <div className={`bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col gap-4 ${cardBorderStyle(variation.viralityScore)}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Variation {index + 1}</span>
        <div className={`flex items-baseline gap-0.5 px-3 py-1 rounded-full text-sm font-bold ${scoreBadgeStyle(variation.viralityScore)}`}>
          <span className="text-base leading-none">{variation.viralityScore}</span>
          <span className="text-xs opacity-60">/100</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 italic leading-relaxed border-l-2 border-gray-200 pl-3">
        {variation.viralityRationale}
      </p>
      <div className="flex-1 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{variation.postText}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:border-[#0077B5] hover:text-[#0077B5] transition-all bg-white"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
        <button
          onClick={handleSave}
          disabled={saved || saving}
          className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            saved ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:border-[#0077B5] hover:text-[#0077B5]'
          } disabled:cursor-not-allowed`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-500' : ''}`} />}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}

const QUICK_EMOJIS = ['🚀', '💡', '🎯', '🔥', '✅', '💼', '📈', '🤝', '💪', '🌟', '⚡', '🧠']

export default function PostGenerator({ persona, displayName }: { persona: Persona | null; displayName: string }) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState(persona?.preferred_tone ?? 'Conversational')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [variations, setVariations] = useState<PostVariation[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function insertAtCursor(text: string) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const newValue = topic.slice(0, start) + text + topic.slice(end)
    setTopic(newValue)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + text.length, start + text.length)
    })
  }

  function handleBullet() {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const lineStart = topic.lastIndexOf('\n', start - 1) + 1
    const newValue = topic.slice(0, lineStart) + '• ' + topic.slice(lineStart)
    setTopic(newValue)
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + 2, start + 2) })
  }

  function handleCopyTopic() {
    if (!topic) return
    navigator.clipboard.writeText(topic)
    toast.success('Topic copied!')
  }

  function handleBold() {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = topic.slice(start, end)
    const wrapped = selected ? `**${selected}**` : '**bold**'
    const newValue = topic.slice(0, start) + wrapped + topic.slice(end)
    setTopic(newValue)
    requestAnimationFrame(() => {
      el.focus()
      selected ? el.setSelectionRange(start, start + wrapped.length) : el.setSelectionRange(start + 2, start + 6)
    })
  }

  function handleTemplate() {
    setTopic('Hook: \nInsight: \nCTA: ')
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(6, 6)
    })
  }

  async function handleGenerate() {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    setVariations([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), tone }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate posts')
      }
      const data = await res.json()
      setVariations(data.variations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Persona info card */}
        {persona && (
          <div className="bg-white border border-blue-100 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-gray-600">
              Writing as a{' '}
              <span className="font-semibold text-gray-900">{persona.role}</span>
              {' '}in{' '}
              <span className="font-semibold text-gray-900">{persona.industry}</span>
              {' '}· Audience:{' '}
              <span className="font-semibold text-gray-900">{persona.target_audience}</span>
            </div>
          </div>
        )}

        {/* Generator form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#0077B5]" />
            <h1 className="text-xl font-bold text-gray-900">Welcome back, {displayName} 👋</h1>
          </div>

          {/* Topic + character count */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">What do you want to post about?</label>
              <span className={`text-xs ${topic.length > MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                {topic.length} / {MAX_CHARS}
              </span>
            </div>

            {/* Formatting toolbar */}
            <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0">
              {[
                { icon: LayoutGrid, label: 'Bullet list', action: handleBullet },
                { icon: Copy, label: 'Copy topic', action: handleCopyTopic },
                { icon: Type, label: 'Bold', action: handleBold },
                { icon: FileText, label: 'Insert template', action: handleTemplate },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  onClick={action}
                  className="p-1.5 text-gray-400 hover:text-[#0077B5] hover:bg-white rounded transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}

              {/* Emoji picker */}
              <div className="relative">
                <button
                  type="button"
                  title="Insert emoji"
                  onClick={() => setShowEmojiPicker(v => !v)}
                  className="p-1.5 text-gray-400 hover:text-[#0077B5] hover:bg-white rounded transition-colors"
                >
                  <Smile className="w-4 h-4" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-8 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 w-40">
                    {QUICK_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => { insertAtCursor(emoji); setShowEmojiPicker(false) }}
                        className="text-base hover:bg-gray-100 rounded p-0.5 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <textarea
              ref={textareaRef}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              rows={3}
              placeholder="e.g. Why most startup pitches fail in the first 30 seconds"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-b-lg rounded-t-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-transparent resize-none transition"
            />
          </div>

          {/* Tone selector */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Post Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                    tone === t ? 'bg-[#0077B5] text-white border-[#0077B5]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#0077B5] hover:text-[#0077B5]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim() || topic.length > MAX_CHARS}
            className="w-full bg-[#0077B5] hover:bg-[#005f8e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />AI is writing your posts…</>
            ) : (
              <><Sparkles className="w-4 h-4" />Generate Posts</>
            )}
          </button>
        </div>

        {/* Skeleton while loading */}
        {loading && (
          <div className="space-y-4">
            <div className="h-5 w-36 bg-gray-300 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        )}

        {/* Output */}
        {!loading && variations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Generated Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {variations.map((v, i) => (
                <VariationCard key={i} variation={v} index={i} topic={topic} tone={tone} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && variations.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Enter a topic above and click Generate Posts</p>
          </div>
        )}
      </main>
    </div>
  )
}
