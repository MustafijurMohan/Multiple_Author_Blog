import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

const NotFound = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  // Auto-redirect after 10 seconds
  useEffect(() => {
    if (countdown <= 0) { navigate('/'); return }
    const t = setTimeout(() => setCountdown(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, navigate])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }

        .nf-in { animation: nfIn .5s cubic-bezier(.22,1,.36,1) both; }
        .nf-in-slow { animation: nfIn .7s cubic-bezier(.22,1,.36,1) .15s both; }
        @keyframes nfIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .float { animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        /* Progress bar */
        .progress-bar {
          height: 3px;
          background: #ea580c;
          border-radius: 99px;
          animation: shrink 10s linear forwards;
        }
        @keyframes shrink { from{width:100%} to{width:0%} }
      `}</style>

      <div className="font-dm min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">

        {/* Background blobs */}
        <div className="blob w-96 h-96 bg-orange-100 opacity-50 -top-32 -left-32" />
        <div className="blob w-72 h-72 bg-amber-100 opacity-40 -bottom-24 -right-24" />

        {/* Main content */}
        <div className="relative text-center max-w-lg">

          {/* Giant 404 */}
          <div className="float nf-in relative mb-2 select-none">
            <span className="font-playfair text-[9rem] sm:text-[11rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-500">
              404
            </span>
            {/* Feather pen decoration */}
            <div className="absolute -top-2 -right-4 sm:-right-8 opacity-20 pointer-events-none">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round">
                <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
            </div>
          </div>

          {/* Divider line */}
          <div className="nf-in flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-orange-200" />
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">Page not found</span>
            <div className="h-px w-12 bg-orange-200" />
          </div>

          <h1 className="nf-in font-playfair text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Looks like this page went off-script
          </h1>
          <p className="nf-in-slow text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist, was moved, or is still being written. Let's get you back to something real.
          </p>

          {/* Action buttons */}
          <div className="nf-in-slow flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-orange-200"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go Home
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              Browse Blog
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Auto-redirect notice */}
          <div className="nf-in-slow bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm max-w-xs mx-auto">
            <p className="text-xs text-gray-400 mb-2">
              Redirecting to home in <span className="font-semibold text-orange-600">{countdown}s</span>
            </p>
            <div className="w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="progress-bar" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound