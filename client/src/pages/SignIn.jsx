import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { AuthContext } from "../context/Auth";
import logo from '../assets/images/logo.png'

// ── Base URL — change to your backend ────────────────────────────────────────



// ── Icons ─────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0110 10" />
  </svg>
);

// ── Floating Label Input ───────────────────────────────────────────────────────
function FloatInput({ id, label, type = "text", value, onChange, icon, rightSlot, error }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative w-full">
      {/* Icon */}
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
        focused ? "text-orange-500" : "text-gray-400"
      }`}>
        {icon}
      </span>

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        className={`peer w-full pt-5 pb-2 pl-10 pr-${rightSlot ? "11" : "4"} bg-white text-gray-900 text-sm rounded-xl border transition-all duration-200 outline-none placeholder-transparent ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : focused
            ? "border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
        placeholder={label}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-200 pointer-events-none select-none ${
          lifted
            ? "top-2 text-[10px] font-semibold tracking-wider uppercase"
            : "top-1/2 -translate-y-1/2 text-sm"
        } ${
          error
            ? "text-red-400"
            : focused
            ? "text-orange-500"
            : "text-gray-400"
        }`}
      >
        {label}
      </label>

      {/* Right slot (e.g. eye icon) */}
      {rightSlot && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
}

// ── Main AuthPage ──────────────────────────────────────────────────────────────
const SignIn = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const {setToken, setUser} = useContext(AuthContext)
  const API_BASE = import.meta.env.VITE_BACKEND_URL

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
    setApiError("");
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (mode === "signup" && !form.username.trim()) errs.username = "Username is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (mode === "signup" && form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data } = await axios.post(`${API_BASE}/register`, {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        // Save token + user
        setToken(data.token);
        setUser(data.data);
        setSuccessMsg("Account created! Redirecting…");
        setTimeout(() => navigate("/"), 1200);

      } else {
        const { data } = await axios.post(`${API_BASE}/login`, {
          email: form.email,
          password: form.password,
        });
        setToken(data.token);
        setUser(data.data);
        setSuccessMsg("Welcome back! Redirecting…");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Switch mode — reset state ─────────────────────────────────────────────
  const switchMode = (m) => {
    setMode(m);
    setForm({ username: "", email: "", password: "" });
    setErrors({});
    setApiError("");
    setSuccessMsg("");
    setShowPassword(false);
    setAgreed(false);
  };

  const isSignUpDisabled = mode === "signup" && !agreed;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }

        .tab-underline {
          position: relative;
          transition: color 0.2s;
        }
        .tab-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0; right: 0;
          height: 2px;
          border-radius: 99px;
          background: #ea580c;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .tab-underline.active::after { transform: scaleX(1); }

        .card-appear {
          animation: cardIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Checkbox custom style */
        .custom-check {
          appearance: none;
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.18s;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .custom-check:checked {
          background: #ea580c;
          border-color: #ea580c;
        }
        .custom-check:checked::after {
          content: '';
          width: 5px; height: 9px;
          border: 2px solid white;
          border-top: none; border-left: none;
          transform: rotate(45deg) translateY(-1px);
          display: block;
        }
        .custom-check:focus { outline: none; box-shadow: 0 0 0 3px rgba(234,88,12,0.2); }
      `}</style>

      {/* ── Full-page background ── */}
      <div className="font-dm min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 py-12">

        {/* Decorative blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-100 opacity-60 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 w-md h-md rounded-full bg-amber-100 opacity-50 blur-3xl" />
        </div>

        {/* ── Card ── */}
        <div className="card-appear relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-orange-100/60 border border-orange-50 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

          <div className="px-8 pt-8 pb-10">

            {/* Logo + Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 mb-4">
                <img src={logo} alt="logo" className="w-7 h-7 object-contain" />
              </div>
              <h1 className="font-playfair text-2xl font-bold text-gray-900 tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create an account"}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                {mode === "signin"
                  ? "Sign in to continue to QuillPress"
                  : "Join thousands of writers today"}
              </p>
            </div>

            {/* ── Mode Tabs ── */}
            <div className="flex items-center gap-6 border-b border-gray-100 mb-7">
              {["signin", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`tab-underline pb-3 text-sm font-semibold transition-colors cursor-pointer ${
                    mode === m ? "active text-orange-600" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {m === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* ── API Error / Success ── */}
            {apiError && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {apiError}
              </div>
            )}
            {successMsg && (
              <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                {successMsg}
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Username — signup only */}
              {mode === "signup" && (
                <FloatInput
                  id="username"
                  label="Username"
                  value={form.username}
                  onChange={set("username")}
                  icon={<UserIcon />}
                  error={errors.username}
                />
              )}

              {/* Email */}
              <FloatInput
                id="email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={set("email")}
                icon={<MailIcon />}
                error={errors.email}
              />

              {/* Password */}
              <FloatInput
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                icon={<LockIcon />}
                error={errors.password}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              {/* Forgot password — signin only */}
              {mode === "signin" && (
                <div className="flex justify-end -mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-orange-500 hover:text-orange-700 transition-colors underline underline-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Terms checkbox — signup only */}
              {mode === "signup" && (
                <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    className="custom-check mt-0.5"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="text-sm text-gray-500 leading-snug">
                    I agree to the{" "}
                    <Link to="/terms" className="text-orange-600 hover:underline font-medium">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-orange-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || isSignUpDisabled}
                className={`mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
                  loading || isSignUpDisabled
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 cursor-pointer active:scale-[0.98] shadow-lg shadow-orange-200"
                }`}
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    {mode === "signin" ? "Signing in…" : "Creating account…"}
                  </>
                ) : mode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* ── Bottom switch ── */}
            <p className="mt-6 text-center text-sm text-gray-400">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn