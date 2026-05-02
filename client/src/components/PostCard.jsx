

import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { AuthContext } from '../context/Auth'

const API_BASE = import.meta.env.VITE_BACKEND_URL

// ── Reading time ──────────────────────────────────────────────────────────────
export const readingTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ── Delete modal ──────────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}/>
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100"
        style={{ animation:'modalIn .2s cubic-bezier(.22,1,.36,1) both' }}>
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
          <TrashIcon/>
        </div>
        <h3 className="font-playfair text-lg font-bold text-gray-900 text-center mb-2">Delete Post?</h3>
        <p className="text-sm text-gray-400 text-center mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer">
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── PostCard ──────────────────────────────────────────────────────────────────
export default function PostCard({ post, onDeleted }) {
  const { user, token } = useContext(AuthContext)
  const navigate        = useNavigate()

  const [liked,      setLiked]      = useState(false)
  const [likeCount,  setLikeCount]  = useState(0)
  const [liking,     setLiking]     = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  const isAuthor = user && post.user && (user._id === post.user?._id || user._id === post.user)

  // Fetch like status on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/likes/${post._id}`)
        setLiked(data.liked)
        setLikeCount(data.likeCount)
      } catch { /* silent */ }
    }
    fetchLikes()
  }, [post._id])

  const handleLike = async (e) => {
    e.preventDefault()
    if (!token) { navigate('/signin'); return }
    if (liking) return
    setLiking(true)
    // Optimistic update
    setLiked(v => !v)
    setLikeCount(c => liked ? c - 1 : c + 1)
    try {
      const { data } = await axios.post(`${API_BASE}/like/${post._id}`, {}, {
        headers: { token },
      })
      setLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch {
      // Revert on error
      setLiked(v => !v)
      setLikeCount(c => liked ? c + 1 : c - 1)
    } finally {
      setLiking(false)
    }
  }

  const handleShare = async (e) => {
    e.preventDefault()
    const url = `${window.location.origin}/blog/${post._id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`${API_BASE}/DeletePost/${post._id}`, {
        headers: {token},
      })
      setShowDelete(false)
      onDeleted?.(post._id)
    } catch { /* silent */ }
    finally { setDeleting(false) }
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  // Strip HTML tags from tiptap content for excerpt
  const rawText = post.description?.replace(/<[^>]*>/g, '') || ''
  const excerpt = rawText.length > 115 ? rawText.slice(0, 115) + '…' : rawText

  return (
    <>
      {showDelete && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting}/>}

      <article className="post-card group relative bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col">

        {/* Image */}
        <Link to={`/single-post/${post._id}`} className="block overflow-hidden aspect-[16/9] bg-gradient-to-br from-orange-50 to-amber-50 shrink-0">
          {post.image ? (
            <img src={post.image} alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round">
                <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
                <line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
              </svg>
            </div>
          )}
        </Link>

        {/* Author action buttons */}
        {isAuthor && (
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={() => navigate(`/single-post/${post._id}`)}
              className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
              title="Edit">
              <EditIcon/>
            </button>
            <button onClick={() => setShowDelete(true)}
              className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-300 flex items-center justify-center transition-all shadow-sm cursor-pointer"
              title="Delete">
              <TrashIcon/>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Meta row */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3 flex-wrap">
            <span className="flex items-center gap-1"><UserIcon/>{post.user?.username || 'Unknown'}</span>
            <span className="flex items-center gap-1"><CalendarIcon/>{formattedDate}</span>
            <span className="flex items-center gap-1"><ClockIcon/>{readingTime(rawText)}</span>
          </div>

          {/* Title */}
          <Link to={`/single-post/${post._id}`}>
            <h2 className="font-playfair text-[17px] font-bold text-gray-900 mb-2 leading-snug line-clamp-2 hover:text-orange-700 transition-colors">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">{excerpt}</p>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <Link to={`/single-post/${post._id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors group/link">
              Read more
              <span className="transition-transform duration-200 group-hover/link:translate-x-1"><ArrowIcon/></span>
            </Link>
            <div className="flex items-center gap-3">
              {/* Like */}
              <button onClick={handleLike}
                className={`flex items-center gap-1 text-xs font-medium transition-all active:scale-90 cursor-pointer ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                <HeartIcon filled={liked}/>
                <span>{likeCount}</span>
              </button>
              {/* Share */}
              <button onClick={handleShare}
                className={`flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer ${copied ? 'text-green-600' : 'text-gray-400 hover:text-orange-500'}`}>
                {copied ? <CheckIcon/> : <ShareIcon/>}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}