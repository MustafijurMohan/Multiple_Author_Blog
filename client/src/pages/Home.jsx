
import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import { AuthContext } from '../context/Auth'
import PostCard from '../components/PostCard'
import PostSlider from '../components/PostSlider'

const API_BASE = import.meta.env.VITE_BACKEND_URL

// ── Icons ─────────────────────────────────────────────────────────────────────
const FeatherIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
    <line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const STATS = [
  { value: '12K+', label: 'Writers'  },
  { value: '48K+', label: 'Articles' },
  { value: '2M+',  label: 'Readers'  },
  { value: '94',   label: 'Countries'},
]

// ── Skeleton ──────────────────────────────────────────────────────────────────
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

// ── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { isLoggedIn, user } = useContext(AuthContext)
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_BASE}/AllPost`)
      .then(({ data }) => setPosts((data.data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .reveal { opacity:0; transform:translateY(22px); transition:opacity .6s ease, transform .6s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .reveal-d1 { transition-delay:.1s; }
        .reveal-d2 { transition-delay:.2s; }
        .reveal-d3 { transition-delay:.3s; }
        .hero-in { animation: heroIn .7s cubic-bezier(.22,1,.36,1) both; }
        .hero-in-d1 { animation: heroIn .7s cubic-bezier(.22,1,.36,1) .15s both; }
        .hero-in-d2 { animation: heroIn .7s cubic-bezier(.22,1,.36,1) .3s both; }
        @keyframes heroIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
        @keyframes modalIn { from{opacity:0;transform:scale(.94) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .post-card:hover { transform:translateY(-4px); }
        .post-card { transition:transform .25s ease, box-shadow .25s ease; }
      `}</style>

      <div className="font-dm bg-white">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 pt-24 pb-20 px-4">
          {/* Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none"/>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"/>
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'28px 28px' }}/>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="hero-in inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold rounded-full uppercase tracking-widest mb-7">
              <FeatherIcon /> Multi-Author Blog Platform
            </div>

            <h1 className="hero-in-d1 font-playfair text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
              Where great writers find{' '}
              <em className="text-orange-400 not-italic">their audience</em>
            </h1>

            <p className="hero-in-d2 text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              QuillPress is a distraction-free publishing platform for curious minds. Write, publish, and connect with readers who care about depth over clickbait.
            </p>

            <div className="hero-in-d2 flex flex-wrap items-center justify-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link to="/add-blog"
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/40">
                    Write a Post <ArrowIcon />
                  </Link>
                  <Link to="/blog"
                    className="flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded-xl transition-all">
                    Explore Blog
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signin"
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/40">
                    Start Writing Free <ArrowIcon />
                  </Link>
                  <Link to="/blog"
                    className="flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded-xl transition-all">
                    Explore Stories
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-b border-gray-100 bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={s.label} className={`reveal reveal-d${(i % 3) + 1} text-center`}>
                <div className="font-playfair text-3xl font-bold text-orange-600 mb-1">{s.value}</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Slider ── */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto reveal">
            <PostSlider title="Featured Stories" limit={8} />
          </div>
        </section>

        {/* ── Latest Posts ── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8 reveal">
              <div>
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Latest</span>
                <h2 className="font-playfair text-3xl font-bold text-gray-900 mt-1">Fresh from the press</h2>
              </div>
              <Link to="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors group">
                View all
                <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
              </Link>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium">No posts yet.</p>
                <Link to="/add-blog" className="mt-4 inline-block text-orange-600 font-semibold hover:underline">Be the first to write →</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                  <div key={post._id} className={`reveal reveal-d${(i % 3) + 1}`}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Write CTA ── */}
        {!isLoggedIn && (
          <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-amber-500">
            <div className="max-w-2xl mx-auto text-center reveal">
              <h2 className="font-playfair text-3xl font-bold text-white mb-4">
                Ready to share your story?
              </h2>
              <p className="text-orange-100 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Join thousands of writers already publishing on QuillPress. Free forever.
              </p>
              <Link to="/signin"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-orange-700 text-sm font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg active:scale-95">
                Create Free Account <ArrowIcon />
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  )
}