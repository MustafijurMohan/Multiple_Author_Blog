
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_BACKEND_URL

// ── Icons ─────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2L3 7v5c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)
const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)
const CheckStepIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0110 10" />
  </svg>
)

// ── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Email',    icon: <MailIcon /> },
  { id: 2, label: 'OTP',      icon: <ShieldIcon /> },
  { id: 3, label: 'Password', icon: <LockIcon /> },
]

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all duration-300 ${
            t.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
          style={{ animation: 'toastIn .3s cubic-bezier(.22,1,.36,1) both' }}
        >
          {t.type === 'success' ? <CheckCircleIcon /> : <AlertIcon />}
          {t.message}
        </div>
      ))}
    </div>
  )
}

// ── OTP Box ───────────────────────────────────────────────────────────────────
function OtpBox({ index, value, inputRef, onChange, onKeyDown, onPaste }) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={e => onChange(index, e.target.value)}
      onKeyDown={e => onKeyDown(index, e)}
      onPaste={onPaste}
      className="w-12 h-14 text-center text-xl font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300"
    />
  )
}

// ── Floating Label Input ──────────────────────────────────────────────────────
function FloatInput({ id, label, type = 'text', value, onChange, icon, rightSlot, error }) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  return (
    <div className="relative w-full">
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${focused ? 'text-orange-500' : 'text-gray-400'}`}>
        {icon}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        placeholder={label}
        className={`w-full pt-5 pb-2 pl-10 ${rightSlot ? 'pr-11' : 'pr-4'} bg-white text-gray-900 text-sm rounded-xl border transition-all duration-200 outline-none placeholder-transparent ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : focused
            ? 'border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-10 pointer-events-none select-none transition-all duration-200 ${
          lifted ? 'top-2 text-[10px] font-semibold tracking-wider uppercase' : 'top-1/2 -translate-y-1/2 text-sm'
        } ${error ? 'text-red-400' : focused ? 'text-orange-500' : 'text-gray-400'}`}
      >
        {label}
      </label>
      {rightSlot && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>}
      {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step,            setStep]            = useState(1)
  const [email,           setEmail]           = useState('')
  const [emailError,      setEmailError]      = useState('')
  const [otp,             setOtp]             = useState(['','','','','',''])
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass,        setShowPass]        = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')
  const [resendTimer,     setResendTimer]     = useState(0)
  const [toasts,          setToasts]          = useState([])
  const [passError,       setPassError]       = useState('')
  const [confirmError,    setConfirmError]    = useState('')

  // OTP refs
  const otpRefs = Array.from({ length: 6 }, () => useRef(null))

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  // ── STEP 1: Send OTP ──────────────────────────────────────────────────────
  const handleEmailSubmit = async () => {
    setEmailError('')
    if (!email.trim()) { setEmailError('Email is required.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email address.'); return }

    setLoading(true)
    try {
      const { data } = await axios.post(`${API_BASE}/verifyEamil/${email.trim()}`)
      setStep(2)
      setResendTimer(60)
      showToast(data.message || 'OTP sent! Check your inbox.')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send OTP. Try again.'
      setEmailError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── OTP handlers ──────────────────────────────────────────────────────────
  const handleOtpChange = (index, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[index] = val; setOtp(next)
    setError('')
    if (val && index < 5) otpRefs[index + 1].current?.focus()
  }
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      otpRefs[index - 1].current?.focus()
  }
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    otpRefs[Math.min(pasted.length, 5)].current?.focus()
    e.preventDefault()
  }

  // ── STEP 2: Verify OTP ────────────────────────────────────────────────────
  const handleOtpSubmit = async () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter all 6 digits.'); return }
    setLoading(true); setError('')
    try {
      await axios.post(`${API_BASE}/verifyOtp`, { email, otp: code })
      setStep(3)
      showToast('OTP verified successfully!')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return
    setLoading(true); setError('')
    try {
      await axios.post(`${API_BASE}/verifyEamil/${email}`)
      setOtp(['','','','','',''])
      setResendTimer(60)
      showToast('New OTP sent to your email.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP.')
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 3: Reset password ─────────────────────────────────────────────────
  const handleResetPassword = async () => {
    setPassError(''); setConfirmError(''); setError('')
    let valid = true
    if (!newPassword)               { setPassError('Password is required.');                    valid = false }
    else if (newPassword.length < 6){ setPassError('Password must be at least 6 characters.');  valid = false }
    if (!confirmPassword)           { setConfirmError('Please confirm your password.');          valid = false }
    else if (newPassword !== confirmPassword){ setConfirmError('Passwords do not match.');       valid = false }
    if (!valid) return

    setLoading(true)
    try {
      await axios.post(`${API_BASE}/resetPassword`, { email, otp: otp.join(''), newPassword })
      showToast('Password reset successfully! Redirecting…')
      setTimeout(() => navigate('/signin'), 1800)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  // ── Password strength ──────────────────────────────────────────────────────
  const strength = newPassword.length === 0 ? 0
    : newPassword.length < 4 ? 1
    : newPassword.length < 7 ? 2
    : newPassword.length < 10 ? 3 : 4
  const strengthLabel = ['', 'Too short', 'Weak', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-500'][strength]

  // ── Step bar ──────────────────────────────────────────────────────────────
  const StepBar = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              step > s.id  ? 'bg-orange-600 border-orange-600 text-white'
              : step===s.id? 'bg-orange-50 border-orange-500 text-orange-600'
              :              'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              {step > s.id ? <CheckStepIcon /> : s.icon}
            </div>
            <span className={`text-[10px] font-semibold tracking-wide uppercase whitespace-nowrap ${step >= s.id ? 'text-orange-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-14 h-0.5 mb-5 mx-1 transition-all duration-500 ${step > s.id ? 'bg-orange-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .card-in  { animation: cardIn  .35s cubic-bezier(.22,1,.36,1) both; }
        .step-in  { animation: stepIn  .28s cubic-bezier(.22,1,.36,1) both; }
        @keyframes cardIn  { from{opacity:0;transform:translateY(18px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes stepIn  { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      <Toast toasts={toasts} />

      <div className="font-dm min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 py-12">

        {/* Blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-100 opacity-60 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-amber-100 opacity-50 blur-3xl" />
        </div>

        {/* Card */}
        <div className="card-in relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-orange-100/60 border border-orange-50 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

          <div className="px-8 pt-8 pb-10">

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="font-playfair text-2xl font-bold text-gray-900 tracking-tight">Reset Password</h1>
              <p className="mt-1 text-sm text-gray-400">
                {step === 1 && 'Verify your email to get started'}
                {step === 2 && <>Code sent to <span className="font-medium text-gray-600">{email}</span></>}
                {step === 3 && 'Create a strong new password'}
              </p>
            </div>

            <StepBar />

            {/* General error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertIcon />
                {error}
              </div>
            )}

            {/* ── STEP 1: Email Input ── */}
            {step === 1 && (
              <div className="step-in space-y-4">
                <FloatInput
                  id="email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  icon={<MailIcon />}
                  error={emailError}
                />

                <button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] disabled:bg-orange-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-200"
                >
                  {loading ? <><SpinnerIcon /> Sending OTP…</> : 'Send OTP'}
                </button>

                <button
                  onClick={() => navigate('/signin')}
                  className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <div className="step-in space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-5">
                    Enter the 6-digit code sent to your inbox
                  </p>

                  {/* OTP Boxes */}
                  <div className="flex items-center justify-center gap-2.5">
                    {otp.map((digit, i) => (
                      <OtpBox
                        key={i}
                        index={i}
                        value={digit}
                        inputRef={otpRefs[i]}
                        onChange={handleOtpChange}
                        onKeyDown={handleOtpKeyDown}
                        onPaste={handleOtpPaste}
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <p className="mt-4 text-sm text-gray-400">
                    Didn't receive it?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-orange-400 font-medium">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        onClick={handleResend}
                        disabled={loading}
                        className="text-orange-600 font-semibold hover:text-orange-700 transition-colors disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>
                </div>

                <button
                  onClick={handleOtpSubmit}
                  disabled={loading || otp.join('').length < 6}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] disabled:bg-orange-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-200"
                >
                  {loading ? <><SpinnerIcon /> Verifying…</> : 'Verify OTP'}
                </button>

                <button
                  onClick={() => { setStep(1); setOtp(['','','','','','']); setError('') }}
                  className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Change Email
                </button>
              </div>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === 3 && (
              <div className="step-in space-y-4">

                <FloatInput
                  id="newPassword"
                  label="New password"
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setPassError('') }}
                  icon={<LockIcon />}
                  error={passError}
                  rightSlot={
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none">
                      {showPass ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />

                {/* Password strength bar */}
                {newPassword.length > 0 && (
                  <div className="flex items-center gap-2 px-1 -mt-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${strength >= i ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                    <span className="text-xs text-gray-400 whitespace-nowrap">{strengthLabel}</span>
                  </div>
                )}

                <FloatInput
                  id="confirmPassword"
                  label="Confirm new password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setConfirmError('') }}
                  icon={<LockIcon />}
                  error={confirmError}
                  rightSlot={
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none">
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] disabled:bg-orange-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-200"
                >
                  {loading ? <><SpinnerIcon /> Resetting…</> : 'Reset Password'}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword