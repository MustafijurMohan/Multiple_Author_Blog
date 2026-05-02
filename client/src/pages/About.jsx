import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

// ── Icons ─────────────────────────────────────────────────────────────────────
const FeatherIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
)
const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
)
const GlobeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
)
const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { value: '12K+', label: 'Writers' },
  { value: '48K+', label: 'Articles' },
  { value: '2M+',  label: 'Readers' },
  { value: '94',   label: 'Countries' },
]

const values = [
  {
    icon: <FeatherIcon />,
    title: 'Authentic Writing',
    desc: 'We champion honest, thoughtful writing over clickbait. Every word should earn its place on the page.',
  },
  {
    icon: <UsersIcon />,
    title: 'Community First',
    desc: 'Our platform is built for writers and readers alike — a space where ideas spark conversations.',
  },
  {
    icon: <GlobeIcon />,
    title: 'Open to All',
    desc: 'From seasoned journalists to first-time bloggers, every voice deserves a platform and an audience.',
  },
  {
    icon: <HeartIcon />,
    title: 'Reader Respect',
    desc: 'No ads, no tracking walls. Just clean reading experiences that put content first.',
  },
]

const team = [
  { name: 'Sarah Okafor',    role: 'Founder & Editor-in-Chief', initials: 'SO', color: 'bg-orange-100 text-orange-700' },
  { name: 'Mikhail Petrov',  role: 'Lead Developer',            initials: 'MP', color: 'bg-amber-100 text-amber-700'  },
  { name: 'Lena Hartmann',   role: 'Head of Community',         initials: 'LH', color: 'bg-rose-100 text-rose-700'   },
  { name: 'James Osei',      role: 'Content Strategist',        initials: 'JO', color: 'bg-teal-100 text-teal-700'   },
]

// ── About Page ────────────────────────────────────────────────────────────────
const About = () => {
  const heroRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }

        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: .1s; }
        .reveal-delay-2 { transition-delay: .2s; }
        .reveal-delay-3 { transition-delay: .3s; }
        .reveal-delay-4 { transition-delay: .4s; }

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .value-card:hover .value-icon {
          transform: scale(1.1) rotate(-4deg);
          background: #ea580c;
          color: white;
        }
        .value-icon { transition: all .25s cubic-bezier(.22,1,.36,1); }
        .team-card:hover { transform: translateY(-4px); }
        .team-card { transition: transform .25s ease, box-shadow .25s ease; }
        .team-card:hover { box-shadow: 0 12px 40px rgba(234,88,12,.12); }
      `}</style>

      <div className="font-dm text-gray-900 bg-white">

        {/* ── Hero ── */}
        <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-24 pb-20 px-4">
          <div className="hero-blob w-96 h-96 bg-orange-100 opacity-60 -top-20 -left-20" />
          <div className="hero-blob w-72 h-72 bg-amber-100 opacity-50 bottom-0 right-0" />

          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-widest mb-6">
              Our Story
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              A home for writers who{' '}
              <em className="text-orange-600 not-italic">actually</em> have something to say
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
              QuillPress was built on a simple belief — that great writing deserves a great stage. We created a distraction-free platform where authors can focus on their craft and readers can find stories worth their time.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-orange-200"
            >
              Explore the Blog <ArrowRightIcon />
            </Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-14 border-y border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className={`reveal reveal-delay-${i + 1} text-center`}>
                <div className="font-playfair text-4xl font-bold text-orange-600 mb-1">{s.value}</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Our Mission</span>
              <h2 className="font-playfair text-3xl font-bold mt-3 mb-5 leading-snug">
                Democratising the written word, one story at a time
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We started QuillPress because we were tired of platforms that buried good writing under algorithms designed to maximise engagement rather than meaning.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Today, thousands of writers from journalists and academics to hobbyists and first-timers publish here every day. Our only metric for success is whether readers leave feeling like they learned something, felt something, or saw the world a little differently.
              </p>
            </div>
            {/* Decorative quote block */}
            <div className="reveal reveal-delay-2">
              <div className="relative bg-orange-50 border border-orange-100 rounded-3xl p-8">
                <div className="font-playfair italic text-2xl text-gray-700 leading-relaxed mb-6">
                  "The best writing doesn't just inform — it transforms. We built QuillPress to give that transformation room to breathe."
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-sm">SO</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Sarah Okafor</div>
                    <div className="text-xs text-gray-400">Founder, QuillPress</div>
                  </div>
                </div>
                {/* decorative quotation mark */}
                <div className="absolute top-4 right-6 font-playfair text-7xl text-orange-200 leading-none select-none">"</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 reveal">
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">What we stand for</span>
              <h2 className="font-playfair text-3xl font-bold mt-3 text-gray-900">Our core values</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {values.map((v, i) => (
                <div key={v.title} className={`value-card reveal reveal-delay-${i % 2 + 1} bg-white border border-gray-100 rounded-2xl p-6 flex gap-4`}>
                  <div className="value-icon w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 reveal">
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">The people</span>
              <h2 className="font-playfair text-3xl font-bold mt-3 text-gray-900">Meet our team</h2>
              <p className="mt-2 text-gray-400 text-sm max-w-md mx-auto">A small, fully remote team obsessed with good writing and clean interfaces.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <div key={member.name} className={`team-card reveal reveal-delay-${i % 3 + 1} text-center bg-white border border-gray-100 rounded-2xl p-6`}>
                  <div className={`w-14 h-14 rounded-2xl ${member.color} flex items-center justify-center text-lg font-bold mx-auto mb-4`}>
                    {member.initials}
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-amber-500">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="font-playfair text-3xl font-bold text-white mb-4">
              Ready to share your story?
            </h2>
            <p className="text-orange-100 text-sm mb-8 leading-relaxed">
              Join thousands of writers already publishing on QuillPress. It's free, fast, and built to make your words shine.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signin"
                className="px-6 py-3 bg-white text-orange-700 text-sm font-semibold rounded-xl hover:bg-orange-50 transition-colors active:scale-95 shadow-lg"
              >
                Start Writing Today
              </Link>
              <Link
                to="/blog"
                className="px-6 py-3 border border-white/40 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

export default About