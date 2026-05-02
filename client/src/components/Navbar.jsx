import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../context/Auth";

// ── Icons ─────────────────────────────────────────────────────────────────────

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const PenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const SignOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const SignInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const BlogIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔁 Replace with your real auth — Context, Redux, Zustand, etc.
  const {token, user} = useContext(AuthContext)
    
  // const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/signin");
  };

  const initials = (user?.name || "U")[0].toUpperCase();

  // NavLink class helpers
  const desktopNavClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "text-orange-700 bg-orange-50"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
    }`;

  const drawerNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-orange-700 bg-orange-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Animation keyframes injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .anim-drop   { animation: dropIn  0.18s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-slide  { animation: slideIn 0.26s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade   { animation: fadeIn  0.22s ease both; }
        @keyframes dropIn  { from { opacity:0; transform:scale(.94) translateY(-6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
      `}</style>

      {/* ── Top Navbar ── */}
      <nav className="font-dm sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
            {/* <img
              src=""
              alt=""
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:-rotate-6"
            /> */}
            <span className="font-playfair text-[19px] tracking-tight text-gray-900">
              Quill<span className="text-orange-600">Press</span>
            </span>
          </NavLink>

          {/* ── Center nav (desktop) ── */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={desktopNavClass}>Home</NavLink>
            <NavLink to="/about" className={desktopNavClass}>About</NavLink>
            <NavLink to="/blog" className={desktopNavClass}>Blog</NavLink>
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Authenticated → Avatar + Dropdown */}
            {token ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-label="User menu"
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 cursor-pointer ${
                    dropdownOpen
                      ? "border-orange-500 scale-105"
                      : "border-transparent hover:border-orange-400 hover:scale-105"
                  }`}
                >
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover cursor-pointer" />
                  ) : (
                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-sm font-semibold text-orange-700">
                      {initials}
                    </div>
                  )}
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div className="anim-drop absolute right-0 top-[calc(100%+10px)] w-52 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || ""}</p>
                    </div>

                    {/* Links */}
                    <div className="py-1.5">
                      <NavLink
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-150"
                      >
                        <UserIcon /> Profile
                      </NavLink>
                      <NavLink
                        to="/add-blog"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-150"
                      >
                        <PenIcon /> Add Blog
                      </NavLink>
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-gray-100 py-1.5">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                      >
                        <SignOutIcon /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In button */
              <NavLink
                to="/signin"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 active:scale-95 rounded-lg transition-all duration-200 shadow-sm"
              >
                <SignInIcon /> Sign In
              </NavLink>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all duration-150"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div className="font-dm fixed inset-0 z-[999] md:hidden ">

          {/* Overlay */}
          <div
            className="anim-fade absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="anim-slide absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <NavLink
                to="/"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                {/* <img src="/logo.png" alt="logo" className="w-7 h-7 object-contain" /> */}
                <span className="font-playfair text-[18px] text-gray-900">
                  Quill<span className="text-orange-600">Press</span>
                </span>
              </NavLink>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <NavLink to="/" end className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <HomeIcon /> Home
              </NavLink>
              <NavLink to="/about" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <InfoIcon /> About
              </NavLink>
              <NavLink to="/blog" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                <BlogIcon /> Blog
              </NavLink>

              {/* Authenticated extra links */}
              {token && (
                <>
                  <div className="my-3 border-t border-gray-100" />
                  <p className="px-4 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    Account
                  </p>
                  <NavLink to="/profile" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                    <UserIcon /> Profile
                  </NavLink>
                  <NavLink to="/add-blog" className={drawerNavClass} onClick={() => setMenuOpen(false)}>
                    <PenIcon /> Add Blog
                  </NavLink>
                </>
              )}

              {/* Sign In — unauthenticated */}
              {!token && (
                <>
                  <div className="my-3 border-t border-gray-100" />
                  <NavLink
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors duration-200"
                  >
                    <SignInIcon /> Sign In
                  </NavLink>
                </>
              )}
            </nav>

            {/* Authenticated user footer */}
            {token && (
              <div className="border-t border-gray-100">
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200 shrink-0">
                    {user?.photo ? (
                      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center text-sm font-semibold text-orange-700">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
                  </div>
                </div>
                <div className="px-3 pb-5">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-500 border border-red-100 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <SignOutIcon /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


export default Navbar




