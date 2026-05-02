import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/Auth'
import PostCard from '../components/PostCard'

const API_BASE = import.meta.env.VITE_BACKEND_URL

// ── Country list ──────────────────────────────────────────────────────────────
const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Brazil','Cambodia','Canada','Chile','China','Colombia','Croatia',
  'Czech Republic','Denmark','Egypt','Ethiopia','Finland','France','Germany',
  'Ghana','Greece','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel',
  'Italy','Japan','Jordan','Kenya','Malaysia','Mexico','Morocco','Myanmar',
  'Nepal','Netherlands','New Zealand','Nigeria','Norway','Pakistan','Peru',
  'Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','Senegal',
  'Serbia','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sudan',
  'Sweden','Switzerland','Tanzania','Thailand','Turkey','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Vietnam','Zimbabwe',
]

// ── Icons ─────────────────────────────────────────────────────────────────────
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)
const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)
const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
  </svg>
)
const GlobeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

// ── Floating Label Input ──────────────────────────────────────────────────────
function FloatInput({ id, label, value, onChange, icon, readOnly, hint }) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || (value && value.length > 0)
  return (
    <div className="relative w-full">
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
        readOnly ? 'text-gray-300' : focused ? 'text-orange-500' : 'text-gray-400'
      }`}>{icon}</span>
      <input
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        readOnly={readOnly}
        placeholder={label}
        className={`w-full pt-5 pb-2 pl-10 pr-4 text-sm rounded-xl border transition-all duration-200 outline-none placeholder-transparent ${
          readOnly
            ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
            : focused
            ? 'bg-white text-gray-900 border-orange-400 focus:ring-2 focus:ring-orange-100'
            : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'
        }`}
      />
      <label htmlFor={id} className={`absolute left-10 pointer-events-none select-none transition-all duration-200 ${
        lifted ? 'top-2 text-[10px] font-semibold tracking-wider uppercase' : 'top-1/2 -translate-y-1/2 text-sm'
      } ${readOnly ? 'text-gray-300' : focused ? 'text-orange-500' : 'text-gray-400'}`}>
        {label}
      </label>
      {hint && <p className="mt-1 text-[11px] text-gray-400 pl-1">{hint}</p>}
    </div>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[16/9] bg-gray-100"/>
    <div className="p-5 space-y-3">
      <div className="h-3 w-24 bg-gray-100 rounded-full"/>
      <div className="h-5 w-3/4 bg-gray-100 rounded-lg"/>
      <div className="h-4 w-full bg-gray-100 rounded-lg"/>
      <div className="h-4 w-5/6 bg-gray-100 rounded-lg"/>
    </div>
  </div>
)

// ── Profile Page ──────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, setUser, token } = useContext(AuthContext)
  const fileRef = useRef(null)

  const [username,    setUsername]    = useState(user?.name    || '')
  const [country,     setCountry]     = useState(user?.country || '')
  const [imageFile,   setImageFile]   = useState(null)
  const [imagePreview,setImagePreview]= useState(user?.image   || null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [toast,       setToast]       = useState({ show: false, type: '', msg: '' })

  const [posts,       setPosts]       = useState([])
  const [postsLoading,setPostsLoading]= useState(true)

  // Load user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/AllPost`)
        const mine = (data.data || []).filter(p =>
          p.user?._id === user?._id || p.user === user?._id
        )
        setPosts(mine)
      } catch { /* silent */ }
      finally { setPostsLoading(false) }
    }
    if (user?._id) fetchPosts()
  }, [user?._id])

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg })
    setTimeout(() => setToast({ show: false, type: '', msg: '' }), 3200)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select a valid image.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('Image must be under 5MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) { setError('Username is required.'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', username)
      if (country) formData.append('country', country)
      if (imageFile) formData.append('image', imageFile)

      const { data } = await axios.post(`${API_BASE}/update-profile`, formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data',
        },
      })

      // Sync context + localStorage
      const updated = {
        ...user,
        name:    data.data.username,
        country: data.data.country,
        image:   data.data.image,
      }
      setUser(updated)
      setImageFile(null)
      showToast('success', 'Profile updated successfully!')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Update failed. Try again.'
      setError(msg)
      showToast('error', msg)
    } finally {
      setLoading(false)
    }
  }

  const handlePostDeleted = (id) => setPosts(prev => prev.filter(p => p._id !== id))

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : ''

  const initials = (user?.name || 'U').charAt(0).toUpperCase()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .page-in  { animation: pageIn .45s cubic-bezier(.22,1,.36,1) both; }
        .card-in  { animation: cardIn .4s  cubic-bezier(.22,1,.36,1) both; }
        .toast-in { animation: toastIn .3s cubic-bezier(.22,1,.36,1) both; }
        @keyframes pageIn  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
        @keyframes modalIn { from{opacity:0;transform:scale(.94) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .avatar-ring { box-shadow: 0 0 0 4px #fff, 0 0 0 6px #fed7aa; }
      `}</style>

      {/* Toast */}
      {toast.show && (
        <div className={`font-dm fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border toast-in ${
          toast.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {toast.type === 'success' ? <CheckIcon /> : null}
          {toast.msg}
        </div>
      )}

      <div className="font-dm min-h-screen bg-gray-50">

        {/* ── Profile header banner ── */}
        <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 h-44 overflow-hidden">
          {/* decorative dots */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="page-in max-w-5xl mx-auto px-4">

          {/* ── Avatar + name row ── */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 mb-10 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-2xl avatar-ring overflow-hidden bg-orange-100 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-playfair text-4xl font-bold text-orange-600">{initials}</span>
                )}
              </div>
              {/* Camera button */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 cursor-pointer rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-lg shadow-orange-200 transition-colors"
                title="Change photo"
              >
                <CameraIcon />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* Name + meta */}
            <div className="pb-1 flex-1 min-w-0">
              <h1 className="font-playfair text-2xl font-bold text-gray-900 truncate">
                {user?.name || 'Your Profile'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <MailIcon />{user?.email}
                </span>
                {user?.country && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <GlobeIcon />{user.country}
                  </span>
                )}
                {joinDate && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <CalendarIcon />Joined {joinDate}
                  </span>
                )}
              </div>
            </div>

            {/* Post count badge */}
            <div className="shrink-0 bg-white border border-orange-100 rounded-2xl px-5 py-3 text-center shadow-sm">
              <div className="font-playfair text-2xl font-bold text-orange-600">{posts.length}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Posts</div>
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid lg:grid-cols-[340px_1fr] gap-8 pb-16">

            {/* ── Left: Edit form ── */}
            <div className="card-in">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />
                <div className="p-6">
                  <h2 className="font-playfair text-lg font-bold text-gray-900 mb-5">Edit Profile</h2>

                  {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-start gap-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">

                    {/* Avatar preview strip */}
                    {imageFile && (
                      <div className="flex items-center gap-3 px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-xl">
                        <img src={imagePreview} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{imageFile.name}</p>
                          <p className="text-[10px] text-gray-400">{(imageFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(user?.image || null) }}
                          className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Username */}
                    <FloatInput
                      id="username" label="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      icon={<UserIcon />}
                    />

                    {/* Email — readonly */}
                    <FloatInput
                      id="email" label="Email address"
                      value={user?.email || ''}
                      icon={<MailIcon />}
                      readOnly
                      hint="Email cannot be changed"
                    />

                    {/* Country select */}
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <GlobeIcon />
                      </span>
                      <select
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full pt-5 pb-2 pl-10 pr-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none appearance-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300 transition-all"
                      >
                        <option value="">Select country…</option>
                        {COUNTRIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <label className="absolute left-10 top-2 text-[10px] font-semibold tracking-wider uppercase text-gray-400 pointer-events-none">
                        Country
                      </label>
                      {/* chevron */}
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex cursor-pointer items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] disabled:bg-orange-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-100 mt-2"
                    >
                      {loading ? <><SpinnerIcon />Saving…</> : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* ── Right: User's posts ── */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-playfair text-xl font-bold text-gray-900">Your Posts</h2>
                <span className="text-xs text-gray-400 font-medium">{posts.length} published</span>
              </div>

              {postsLoading && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                </div>
              )}

              {!postsLoading && posts.length === 0 && (
                <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-gray-800 mb-1">No posts yet</h3>
                  <p className="text-sm text-gray-400 mb-5">Share your first story with the world.</p>
                  <a href="/add-blog"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    Write a Post
                  </a>
                </div>
              )}

              {!postsLoading && posts.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {posts.map((post, i) => (
                    <div key={post._id} style={{ animationDelay: `${i * 60}ms` }} className="card-in">
                      <PostCard post={post} onDeleted={handlePostDeleted} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}