import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_BACKEND_URL

// ── Icons ─────────────────────────────────────────────────────────────────────
const PrevIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const NextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

// ── PostSlider ────────────────────────────────────────────────────────────────
export default function PostSlider({ title = 'Featured Stories', limit = 8 }) {
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [animDir, setAnimDir] = useState('next') // 'next' | 'prev'
  const [animKey, setAnimKey] = useState(0)
  const autoRef = useRef(null)

  useEffect(() => {
    axios.get(`${API_BASE}/AllPost`)
      .then(({ data }) => setPosts((data.data || []).slice(0, limit)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [limit])

  // Auto-play every 5s
  useEffect(() => {
    if (posts.length < 2) return
    autoRef.current = setInterval(() => goNext(), 5000)
    return () => clearInterval(autoRef.current)
  }, [posts.length, current])

  const resetAuto = () => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => goNext(), 5000)
  }

  const goNext = () => {
    setAnimDir('next')
    setAnimKey(k => k + 1)
    setCurrent(c => (c + 1) % posts.length)
    resetAuto()
  }

  const goPrev = () => {
    setAnimDir('prev')
    setAnimKey(k => k + 1)
    setCurrent(c => (c - 1 + posts.length) % posts.length)
    resetAuto()
  }

  const goTo = (i) => {
    setAnimDir(i > current ? 'next' : 'prev')
    setAnimKey(k => k + 1)
    setCurrent(i)
    resetAuto()
  }

  if (loading) return (
    <div className="font-dm w-full rounded-3xl overflow-hidden bg-gray-100 animate-pulse aspect-[16/7]" />
  )

  if (posts.length === 0) return null

  const post = posts[current]
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const excerpt = post.description?.length > 160
    ? post.description.slice(0, 160) + '…'
    : post.description

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }

        /* Slide animations */
        .slide-next-enter { animation: slideNextIn .5s cubic-bezier(.22,1,.36,1) both; }
        .slide-prev-enter { animation: slidePrevIn .5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideNextIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slidePrevIn { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }

        /* Nav buttons */
        .slider-btn {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: all .2s cubic-bezier(.22,1,.36,1);
        }
        .slider-btn:hover { transform: scale(1.08); }
        .slider-btn:active { transform: scale(0.95); }

        /* Dot */
        .slider-dot { transition: all .3s cubic-bezier(.22,1,.36,1); }
      `}</style>

      <div className="font-dm w-full">
        {/* Section heading */}
        <div className="flex items-center justify-between mb-6 mx-12">
          <div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-400 mt-1">{posts.length} stories selected</p>
          </div>
          {/* Desktop prev/next */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={goPrev} aria-label="Previous"
              className="slider-btn w-11 h-11 cursor-pointer rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-300 flex items-center justify-center shadow-sm">
              <PrevIcon />
            </button>
            <button onClick={goNext} aria-label="Next"
              className="slider-btn w-11 h-11 cursor-pointer rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-md shadow-orange-200">
              <NextIcon />
            </button>
          </div>
        </div>

        {/* ── Main slide ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-2xl">

          {/* Background image */}
          <div className="absolute inset-0">
            {post.image ? (
              <img
                key={`img-${animKey}`}
                src={post.image}
                alt={post.title}
                className={`w-full h-full object-cover ${animDir === 'next' ? 'slide-next-enter' : 'slide-prev-enter'}`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-900 to-amber-800" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div
            key={`content-${animKey}`}
            className={`relative z-10 flex flex-col justify-end min-h-[420px] sm:min-h-[500px] p-8 sm:p-12 ${
              animDir === 'next' ? 'slide-next-enter' : 'slide-prev-enter'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Featured
              </span>
              <span className="flex items-center gap-1.5 text-white/60 text-xs">
                <UserIcon />{post.user?.username || 'Unknown'}
              </span>
              <span className="flex items-center gap-1.5 text-white/60 text-xs">
                <CalendarIcon />{formattedDate}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-playfair text-2xl sm:text-4xl font-bold text-white leading-tight mb-3 max-w-2xl">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-white/70 text-sm leading-relaxed max-w-xl mb-6 hidden sm:block">
              {excerpt}
            </p>

            {/* Read button */}
            <div className="flex items-center gap-4">
              <Link to={`/blog/${post._id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-orange-50 transition-colors active:scale-95 shadow-lg">
                Read Story <ArrowIcon />
              </Link>

              {/* Mobile prev/next inside slide */}
              <div className="flex items-center gap-2 sm:hidden">
                <button onClick={goPrev}
                  className="slider-btn w-10 h-10 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center">
                  <PrevIcon />
                </button>
                <button onClick={goNext}
                  className="slider-btn w-10 h-10 rounded-xl bg-orange-500/80 text-white flex items-center justify-center">
                  <NextIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Slide counter — top right */}
          <div className="absolute top-5 right-5 z-10 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
            {current + 1} / {posts.length}
          </div>
        </div>

        {/* ── Dots + thumbnail strip ── */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {posts.map((p, i) => (
            <button
              key={p._id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`slider-dot rounded-full transition-all ${
                i === current
                  ? 'w-8 h-2.5 bg-orange-500'
                  : 'w-2.5 h-2.5 bg-gray-200 hover:bg-orange-300'
              }`}
            />
          ))}
        </div>

        {/* ── Thumbnail strip (sm+) ── */}
        <div className="hidden sm:flex items-center gap-3 mt-5 overflow-x-auto pb-1">
          {posts.map((p, i) => (
            <button
              key={p._id}
              onClick={() => goTo(i)}
              className={`shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left max-w-[200px] ${
                i === current
                  ? 'border-orange-300 bg-orange-50 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/50'
              }`}
            >
              {/* thumb image */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {p.image
                  ? <img src={p.image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-400 text-xs font-bold">{(i + 1)}</div>
                }
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate leading-snug ${i === current ? 'text-orange-700' : 'text-gray-700'}`}>
                  {p.title}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{p.user?.username}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}