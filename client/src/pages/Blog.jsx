
import { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'

const API_BASE  = import.meta.env.VITE_BACKEND_URL
const PAGE_SIZE = 6

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[16/9] bg-gray-100"/>
    <div className="p-5 space-y-3">
      <div className="flex gap-3"><div className="h-3 w-20 bg-gray-100 rounded-full"/><div className="h-3 w-24 bg-gray-100 rounded-full"/></div>
      <div className="h-5 w-3/4 bg-gray-100 rounded-lg"/>
      <div className="h-4 w-full bg-gray-100 rounded-lg"/>
      <div className="h-4 w-5/6 bg-gray-100 rounded-lg"/>
      <div className="h-4 w-20 bg-orange-50 rounded-full mt-2"/>
    </div>
  </div>
)

// ── Pagination button ─────────────────────────────────────────────────────────
function PaginationBtn({ active, disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
        active
          ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
      }`}
    >
      {children}
    </button>
  )
}

// ── Blog Page ─────────────────────────────────────────────────────────────────
export default function Blog() {
  const [allPosts, setAllPosts] = useState([])
  const [page,     setPage]     = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    axios.get(`${API_BASE}/AllPost`)
      .then(({ data }) => setAllPosts(data.data || []))
      .catch(err => setError(err?.response?.data?.message || 'Failed to load posts.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDeleted = (id) => setAllPosts(prev => prev.filter(p => p._id !== id))

  // Filter by search
  const filtered = allPosts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.username?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage    = Math.min(page, Math.max(1, totalPages))
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Reset to page 1 when search changes
  const handleSearch = (val) => { setSearch(val); setPage(1) }

  // Build page number array with ellipsis
  const getPageNums = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (safePage > 3) pages.push('…')
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
    if (safePage < totalPages - 2) pages.push('…')
    pages.push(totalPages)
    return pages
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .post-card { animation: cardIn .4s cubic-bezier(.22,1,.36,1) both; }
        @keyframes cardIn  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .post-card { transition: transform .25s ease, box-shadow .25s ease; }
        .post-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(234,88,12,.1); }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
        @keyframes modalIn { from{opacity:0;transform:scale(.94) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      <div className="font-dm min-h-screen bg-gray-50">

        {/* ── Hero Header ── */}
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 border-b border-gray-100 pt-14 pb-12 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-widest mb-5">
              All Stories
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Explore the Blog</h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
              Discover stories, ideas, and perspectives from writers around the world.
            </p>

            {/* Search bar */}
            <div className="relative max-w-md mx-auto">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text" value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by title or author…"
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400 shadow-sm"
              />
              {search && (
                <button onClick={() => handleSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-6xl mx-auto px-4 py-12">

          {/* Error */}
          {error && (
            <div className="max-w-md mx-auto mb-8 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">{error}</div>
          )}

          {/* Skeletons */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i}/>)}
            </div>
          )}

          {!loading && !error && (
            <>
              {filtered.length > 0 ? (
                <>
                  {/* Results info */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-xs text-gray-400 font-medium">
                      {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
                      {search && <> matching "<span className="text-orange-500 font-semibold">{search}</span>"</>}
                    </p>
                    <p className="text-xs text-gray-400">
                      Page {safePage} of {totalPages}
                    </p>
                  </div>

                  {/* Posts grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginated.map((post, i) => (
                      <div key={post._id} style={{ animationDelay: `${i * 70}ms` }}>
                        <PostCard post={post} onDeleted={handleDeleted}/>
                      </div>
                    ))}
                  </div>

                  {/* ── Pagination ── */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      {/* Prev */}
                      <PaginationBtn
                        disabled={safePage === 1}
                        onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                      </PaginationBtn>

                      {/* Page numbers */}
                      {getPageNums().map((p, i) =>
                        p === '…' ? (
                          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                        ) : (
                          <PaginationBtn
                            key={p}
                            active={p === safePage}
                            onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          >
                            {p}
                          </PaginationBtn>
                        )
                      )}

                      {/* Next */}
                      <PaginationBtn
                        disabled={safePage === totalPages}
                        onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </PaginationBtn>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state */
                <div className="text-center py-24">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">No posts found</h3>
                  <p className="text-sm text-gray-400">
                    {search ? `No results for "${search}". Try a different keyword.` : 'No stories published yet.'}
                  </p>
                  {search && (
                    <button onClick={() => handleSearch('')}
                      className="mt-4 text-sm font-semibold text-orange-600 hover:underline">
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}