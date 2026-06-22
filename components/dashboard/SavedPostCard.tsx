'use client'

import { useState } from 'react'
import { Copy, Check, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

interface SavedPost {
  id: string
  topic: string
  tone: string
  post_text: string
  virality_score: number
  virality_rationale: string
  created_at: string
}

function scoreBadgeStyle(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-orange-100 text-orange-800'
}

function PostModal({ post, onClose }: { post: SavedPost; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(post.post_text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{post.topic}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.tone}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreBadgeStyle(post.virality_score)}`}>
                {post.virality_score}/100
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full post text */}
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.post_text}
          </p>
        </div>

        {/* Copy button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border text-sm font-medium transition-all ${
              copied
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-white border-gray-300 text-gray-600 hover:border-[#0077B5] hover:text-[#0077B5]'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Full Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SavedPostCard({
  post,
  onDelete,
}: {
  post: SavedPost
  onDelete: (id: string) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(post.post_text)
    toast.success('Copied to clipboard!')
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setDeleting(true)
    await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
    toast.success('Post deleted.')
    onDelete(post.id)
  }

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 cursor-pointer hover:border-[#0077B5] hover:shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{post.topic}</p>
          <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${scoreBadgeStyle(post.virality_score)}`}>
            {post.virality_score}/100
          </span>
        </div>

        {/* Tone + Date */}
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.tone}</span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>

        {/* Post preview */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {post.post_text}
        </p>

        <p className="text-xs text-[#0077B5] font-medium">Click to read full post →</p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:border-[#0077B5] hover:text-[#0077B5] transition-all bg-white"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg border text-xs font-medium transition-all ${
              confirmDelete
                ? 'bg-red-50 border-red-400 text-red-600'
                : 'bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? 'Deleting...' : confirmDelete ? 'Confirm Delete' : 'Delete'}
          </button>
        </div>
      </div>

      {modalOpen && <PostModal post={post} onClose={() => setModalOpen(false)} />}
    </>
  )
}
