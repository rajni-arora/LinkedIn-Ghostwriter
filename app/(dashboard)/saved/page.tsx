'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Sparkles } from 'lucide-react'
import Link from 'next/link'
import SavedPostCard from '@/components/dashboard/SavedPostCard'

interface SavedPost {
  id: string
  topic: string
  tone: string
  post_text: string
  virality_score: number
  virality_rationale: string
  created_at: string
}

export default function SavedPostsPage() {
  const [posts, setPosts] = useState<SavedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts ?? [])
        setLoading(false)
      })
  }, [])

  function handleDelete(id: string) {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Bookmark className="w-5 h-5 text-[#0077B5]" />
          <h1 className="text-xl font-bold text-gray-900">Saved Posts</h1>
          {!loading && posts.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          )}
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">Loading your posts...</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm mb-3">No saved posts yet. Generate your first post!</p>
            <Link
              href="/generate"
              className="text-sm text-[#0077B5] font-medium hover:underline"
            >
              Go to Generate
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <SavedPostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
