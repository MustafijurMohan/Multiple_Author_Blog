
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import axios from 'axios'
import { AuthContext } from '../context/Auth'
import TipTapEditor from '../components/TiptapEditor'

const API_BASE = import.meta.env.VITE_BACKEND_URL

// ── Icons ─────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)
const ShareIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ── Reading time ──────────────────────────────────────────────────────────────
const readingTime = (html = '') => {
  const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

// ── Delete Post Modal ─────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}/>
      <div className="relative bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm border border-gray-100 modal-in">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500"><TrashIcon/></div>
        <h3 className="font-playfair text-xl font-bold text-gray-900 text-center mb-2">Delete this post?</h3>
        <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">This is permanent and cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
            {loading ? <><SpinnerIcon/>Deleting…</> : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Comment Item ──────────────────────────────────────────────────────────────
function CommentItem({ comment, currentUser, token, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const isOwner = currentUser && (currentUser._id === comment.user?._id)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`${API_BASE}/comments/delete/${comment._id}`, {
        headers: {token},
      })
      onDeleted(comment._id)
    } catch { /* silent */ }
    finally { setDeleting(false) }
  }

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  const initials = (comment.user?.username || 'U')[0].toUpperCase()

  return (
    <div className="flex gap-3 group">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-orange-100 flex items-center justify-center text-orange-700 text-xs font-bold mt-0.5">
        {comment.user?.image ? (
          <img src={comment.user.image} alt="" className="w-full h-full object-cover"/>
        ) : initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{comment.user?.username || 'Unknown'}</span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
          {isOwner && (
            <button onClick={handleDelete} disabled={deleting}
              className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all disabled:opacity-40"
              title="Delete comment">
              {deleting ? <SpinnerIcon/> : <TrashIcon/>}
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed break-words">{comment.content}</p>
      </div>
    </div>
  )
}

// ── SinglePost ────────────────────────────────────────────────────────────────
export default function SinglePost() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user, token } = useContext(AuthContext)

  const [post,       setPost]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [editing,    setEditing]    = useState(false)
  const [editTitle,  setEditTitle]  = useState('')
  const [editDesc,   setEditDesc]   = useState('')
  const [editLoading,setEditLoading]= useState(false)
  const [editError,  setEditError]  = useState('')

  // Likes
  const [liked,      setLiked]      = useState(false)
  const [likeCount,  setLikeCount]  = useState(0)
  const [liking,     setLiking]     = useState(false)

  // Share
  const [copied,     setCopied]     = useState(false)

  // Comments
  const [comments,   setComments]   = useState([])
  const [commLoad,   setCommLoad]   = useState(true)
  const [commInput,  setCommInput]  = useState('')
  const [commSubmit, setCommSubmit] = useState(false)
  const [commError,  setCommError]  = useState('')

  // Toast
  const [toast,      setToast]      = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const isAuthor = user && post && (user._id === post.user?._id || user._id === post.user)

  // Fetch post
  useEffect(() => {
    axios.get(`${API_BASE}/SignlePost/${id}`)
      .then(({ data }) => {
        setPost(data.data)
        setEditTitle(data.data.title || '')
        setEditDesc(data.data.description || '')
      })
      .catch(() => setError('Post not found or failed to load.'))
      .finally(() => setLoading(false))
  }, [id])

  // Fetch likes
  useEffect(() => {
    axios.get(`${API_BASE}/likes/${id}`)
      .then(({ data }) => { setLiked(data.liked); setLikeCount(data.likeCount) })
      .catch(() => {})
  }, [id])

  // Fetch comments
  useEffect(() => {
    axios.get(`${API_BASE}/comments/${id}`)
      .then(({ data }) => setComments(data.data || []))
      .catch(() => {})
      .finally(() => setCommLoad(false))
  }, [id])

  // Like toggle
  const handleLike = async () => {
    if (!token) { navigate('/signin'); return }
    if (liking) return
    setLiking(true)
    setLiked(v => !v)
    setLikeCount(c => liked ? c - 1 : c + 1)
    try {
      const { data } = await axios.post(`${API_BASE}/like/${id}`, {}, {
        headers: {token},
      })
      setLiked(data.liked); setLikeCount(data.likeCount)
    } catch {
      setLiked(v => !v); setLikeCount(c => liked ? c + 1 : c - 1)
    } finally { setLiking(false) }
  }

  // Share handlers
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || '')}`
    window.open(url, '_blank')
  }

  // Delete post
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`${API_BASE}/DeletePost/${id}`, {
        headers: {token},
      })
      navigate('/blog')
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.')
      setDeleting(false); setShowDelete(false)
    }
  }

  // Update post (with TipTap content)
  const handleUpdate = async () => {
    setEditError('')
    if (!editTitle.trim()) { setEditError('Title is required.'); return }
    const stripped = editDesc.replace(/<[^>]*>/g, '').trim()
    if (!stripped) { setEditError('Content is required.'); return }

    setEditLoading(true)
    try {
      await axios.post(`${API_BASE}/UpdatePost/${id}`,
        { title: editTitle, description: editDesc },
        { headers: {token} }
      )
      setPost(prev => ({ ...prev, title: editTitle, description: editDesc }))
      setEditing(false)
      showToast('Post updated successfully!')
    } catch (err) {
      setEditError(err?.response?.data?.message || 'Update failed.')
    } finally {
      setEditLoading(false)
    }
  }


  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault()
    setCommError('')
    if (!commInput.trim()) { setCommError('Comment cannot be empty.'); return }
    if (!token) { navigate('/signin'); return }
    setCommSubmit(true)
    try {
      const { data } = await axios.post(`${API_BASE}/comments/${id}`,
        { content: commInput.trim() },
        { headers: {token} }
      )
      setComments(prev => [data.data, ...prev])
      setCommInput('')
    } catch (err) {
      setCommError(err?.response?.data?.message || 'Failed to post comment.')
    } finally {
      setCommSubmit(false)
    }
  }

  // Delete comment
  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(c => c._id !== commentId))
  }

  const formattedDate = post
    ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .page-in  { animation: pageIn  .45s cubic-bezier(.22,1,.36,1) both; }
        .edit-in  { animation: editIn  .3s  cubic-bezier(.22,1,.36,1) both; }
        .modal-in { animation: modalIn .2s  cubic-bezier(.22,1,.36,1) both; }
        .toast-in { animation: toastIn .3s  cubic-bezier(.22,1,.36,1) both; }
        @keyframes pageIn  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes editIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.94) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="font-dm fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl shadow-lg toast-in">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}

      {showDelete && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting}/>}

      <div className="font-dm min-h-screen bg-gray-50">

        {/* Loading */}
        {loading && (
          <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"/>
            <p className="text-sm text-gray-400">Loading post…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="max-w-md mx-auto px-4 py-24 text-center">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">Post not found</h3>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 mt-4">
              <ArrowLeftIcon/> Back to Blog
            </Link>
          </div>
        )}

        {/* Post */}
        {!loading && !error && post && (
          <div className="page-in max-w-3xl mx-auto px-4 py-10">

            {/* Back */}
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-600 transition-colors mb-8 group">
              <span className="group-hover:-translate-x-1 transition-transform"><ArrowLeftIcon/></span>
              Back to Blog
            </Link>

            {/* Author bar */}
            {isAuthor && (
              <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3.5 mb-7">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"/>
                  <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Your Post</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(v => !v); setEditError('') }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      editing ? 'bg-gray-200 text-gray-700' : 'bg-white border border-orange-200 text-orange-700 hover:bg-orange-100'
                    }`}>
                    <EditIcon/> {editing ? 'Cancel' : 'Edit'}
                  </button>
                  <button onClick={() => setShowDelete(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                    <TrashIcon/> Delete
                  </button>
                </div>
              </div>
            )}

            {/* Edit panel with TipTap */}
            {editing && isAuthor && (
              <div className="edit-in bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-7 space-y-4">
                <h3 className="font-playfair text-lg font-bold text-gray-900">Edit Post</h3>
                {editError && (
                  <div className="px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{editError}</div>
                )}
                {/* Title */}
                <input
                  value={editTitle}
                  onChange={e => { setEditTitle(e.target.value); setEditError('') }}
                  placeholder="Post title"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
                {/* TipTap editor */}
                <TipTapEditor
                  value={editDesc}
                  onChange={val => { setEditDesc(val); setEditError('') }}
                  placeholder="Update your story…"
                  minHeight="240px"
                />
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setEditing(false); setEditError('') }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleUpdate} disabled={editLoading}
                    className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
                    {editLoading ? <><SpinnerIcon/>Saving…</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Hero image */}
            {post.image && (
              <div className="rounded-2xl overflow-hidden aspect-[16/8] mb-8 bg-gray-100">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-5">
              <span className="flex items-center gap-1.5"><UserIcon/><span className="font-medium text-gray-600">{post.user?.username || 'Unknown'}</span></span>
              <span className="flex items-center gap-1.5"><CalendarIcon/>{formattedDate}</span>
              <span className="flex items-center gap-1.5"><ClockIcon/>{readingTime(post.description)}</span>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">{post.title}</h1>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gray-100"/>
              <div className="w-1.5 h-1.5 rounded-full bg-orange-300"/>
              <div className="h-px flex-1 bg-gray-100"/>
            </div>

            {/* Body — render TipTap HTML */}
            <div
              className="tiptap-prose mb-10"
              dangerouslySetInnerHTML={{ __html: post.description }}
            />

            {/* ── Action bar: Like + Share ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-t border-b border-gray-100 mb-10">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                  liked
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'
                }`}
              >
                <HeartIcon filled={liked}/>
                <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
              </button>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium mr-1">Share:</span>
                <button onClick={handleTwitter}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-black hover:text-white hover:border-black text-xs font-semibold transition-all cursor-pointer">
                  <TwitterIcon/> Twitter
                </button>
                <button onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    copied ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                  }`}>
                  {copied ? (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                  ) : (
                    <><ShareIcon/> Copy Link</>
                  )}
                </button>
              </div>
            </div>

            {/* ── Comments ── */}
            <div>
              <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">
                Comments <span className="text-base text-gray-400 font-normal">({comments.length})</span>
              </h2>

              {/* Add comment form */}
              {token ? (
                <form onSubmit={handleAddComment} className="mb-8">
                  <div className="flex gap-3 items-start">
                    {/* User avatar */}
                    <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden bg-orange-100 flex items-center justify-center text-orange-700 text-sm font-bold mt-0.5">
                      {user?.image
                        ? <img src={user.image} alt="" className="w-full h-full object-cover"/>
                        : (user?.username || 'U')[0].toUpperCase()
                      }
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commInput}
                        onChange={e => { setCommInput(e.target.value); setCommError('') }}
                        placeholder="Add a comment…"
                        rows={3}
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 outline-none resize-none leading-relaxed placeholder:text-gray-400 transition-all ${
                          commError
                            ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300'
                        }`}
                      />
                      {commError && <p className="mt-1 text-xs text-red-500 pl-1">{commError}</p>}
                      <div className="flex justify-end mt-2">
                        <button type="submit" disabled={commSubmit || !commInput.trim()}
                          className="flex cursor-pointer items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
                          {commSubmit ? <><SpinnerIcon/> Posting…</> : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-8 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-500 text-center">
                  <Link to="/signin" className="text-orange-600 font-semibold hover:underline">Sign in</Link> to leave a comment.
                </div>
              )}

              {/* Comments list */}
              {commLoad ? (
                <div className="space-y-5">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0"/>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-gray-100 rounded-full"/>
                        <div className="h-4 w-full bg-gray-100 rounded-lg"/>
                        <div className="h-4 w-3/4 bg-gray-100 rounded-lg"/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map(c => (
                    <CommentItem key={c._id} comment={c} currentUser={user} token={token} onDeleted={handleDeleteComment}/>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  )
}