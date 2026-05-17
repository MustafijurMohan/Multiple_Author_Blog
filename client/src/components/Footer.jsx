import { Link } from 'react-router'
import logo from '../assets/images/logo.png'

// ── Social Icons ──────────────────────────────────────────────────────────────
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
    
  </svg>
)
const RssIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 11a9 9 0 019 9"/><path d="M4 4a16 16 0 0116 16"/>
    <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

// ── Links data ────────────────────────────────────────────────────────────────
const footerLinks = [
  {
    heading: 'Platform',
    links: [
      { label: 'Home',      to: '/'         },
      { label: 'Blog',      to: '/blog'     },
      { label: 'About',     to: '/about'    },
      { label: 'Authors',   to: '/authors'  },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign In',      to: '/signin'       },
      { label: 'Sign Up',      to: '/signin'       },
      { label: 'Profile',      to: '/profile'      },
      { label: 'Write a Blog', to: '/add-blog'     },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',   to: '/privacy' },
      { label: 'Terms of Service', to: '/terms'   },
      { label: 'Cookie Policy',    to: '/cookies' },
      { label: 'Contact Us',       to: '/contact' },
    ],
  },
]

const socials = [
  { icon: <TwitterIcon />,   href: 'https://x.com/home', label: 'Twitter'   },
  { icon: <GithubIcon />,    href: 'https://github.com/MustafijurMohan', label: 'GitHub'    },
  { icon: <InstagramIcon />, href: 'https://www.instagram.com/mustafijurmohan/', label: 'Instagram' },
  { icon: <LinkedInIcon />,  href: 'https://www.linkedin.com/in/mustafijur-mohan-7a9958209/', label: 'LinkedIn'  },
  { icon: <RssIcon />,       href: '#', label: 'RSS Feed'  },
]

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .footer-link { transition: color .15s, transform .15s; display: inline-block; }
        .footer-link:hover { color: #ea580c; transform: translateX(3px); }
        .social-btn { transition: all .2s cubic-bezier(.22,1,.36,1); }
        .social-btn:hover { background: #ea580c; color: white; transform: translateY(-2px); }
      `}</style>

      <footer className="font-dm bg-gray-950 text-gray-400">

        {/* Newsletter strip */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 py-10 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-playfair text-xl font-semibold text-white mb-1">Stay in the loop</h3>
              <p className="text-orange-100 text-sm">Get the best stories delivered to your inbox every week.</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-orange-100 text-sm outline-none focus:bg-white/30 transition-colors"
              />
              <button className="px-5 py-2.5 bg-white text-orange-700 text-sm font-semibold rounded-xl hover:bg-orange-50 transition-colors active:scale-95 whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main footer body */}
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <img src={logo} alt="QuillPress" className="w-5 h-5 object-contain brightness-0 invert" />
                </div>
              </Link>
                {/* <span className="font-playfair text-[18px] text-white">
                  Quill<span className="text-orange-500">Press</span>
                </span> */}
              
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                A home for writers who have something real to say. Distraction-free publishing for curious minds.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="social-btn w-9 h-9 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerLinks.map(col => (
              <div key={col.heading}>
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
                  {col.heading}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.label} target='_blank' rel="noreferrer">
                      <Link to={l.to}  className="footer-link text-sm text-gray-500 hover:text-orange-500">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <span>© {year} All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              Made with
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#ea580c" stroke="none">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              by the MustafijurMohan team
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer