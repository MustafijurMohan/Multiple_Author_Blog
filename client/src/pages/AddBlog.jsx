
import { useContext, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import { AuthContext } from '../context/Auth'
import TipTapEditor from '../components/TiptapEditor'

const API_BASE = import.meta.env.VITE_BACKEND_URL

// ── Icons ─────────────────────────────────────────────────────────────────────
const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10"/>
  </svg>
)
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)

// ── Floating Label Input ──────────────────────────────────────────────────────
function FloatInput({ id, label, value, onChange, error }) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  return (
    <div className="relative w-full">
      <input
        id={id} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={label}
        className={`w-full pt-5 pb-2 px-4 bg-white text-gray-900 text-sm rounded-xl border transition-all duration-200 outline-none placeholder-transparent ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : focused
            ? 'border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      <label htmlFor={id} className={`absolute left-4 pointer-events-none select-none transition-all duration-200 ${
        lifted ? 'top-2 text-[10px] font-semibold tracking-wider uppercase' : 'top-1/2 -translate-y-1/2 text-sm'
      } ${error ? 'text-red-400' : focused ? 'text-orange-500' : 'text-gray-400'}`}>
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
    </div>
  )
}

// ── AddBlog ───────────────────────────────────────────────────────────────────
export default function AddBlog() {
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  const fileRef   = useRef(null)

  const [title,        setTitle]        = useState('')
  const [description,  setDescription]  = useState('')
  const [imageFile,    setImageFile]    = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [errors,       setErrors]       = useState({})
  const [apiError,     setApiError]     = useState('')
  const [dragOver,     setDragOver]     = useState(false)

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = 'Title is required.'
    const stripped = description.replace(/<[^>]*>/g, '').trim()
    if (!stripped)     e.description = 'Content is required.'
    return e
  }

  const applyImage = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setApiError('Please upload a valid image file.'); return }
    if (file.size > 5 * 1024 * 1024)    { setApiError('Image must be under 5MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setApiError('')
  }

  const handleFileChange = e => applyImage(e.target.files[0])
  const handleDrop = e => { e.preventDefault(); setDragOver(false); applyImage(e.dataTransfer.files[0]) }
  const removeImage = () => { setImageFile(null); setImagePreview(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)      // HTML string from TipTap
      if (imageFile) formData.append('image', imageFile)

      await axios.post(`${API_BASE}/create-post`, formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' },
      })
      navigate('/blog')
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to publish. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm       { font-family: 'DM Sans', sans-serif; }
        .page-in { animation: pageIn .4s cubic-bezier(.22,1,.36,1) both; }
        @keyframes pageIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="font-dm min-h-screen bg-gray-50 py-10 px-4">
        <div className="page-in max-w-2xl mx-auto">

          {/* Back */}
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-600 transition-colors mb-8 group">
            <span className="transition-transform duration-200 group-hover:-translate-x-1"><ArrowLeftIcon/></span>
            Back to Blog
          </Link>

          {/* Card */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500"/>

            <div className="p-8">
              <h1 className="font-playfair text-2xl font-bold text-gray-900 mb-1">Write a new post</h1>
              <p className="text-sm text-gray-400 mb-8">Share your story with the QuillPress community.</p>

              {/* API Error */}
              {apiError && (
                <div className="mb-6 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Cover Image <span className="text-gray-300 normal-case font-normal">(optional · max 5MB)</span>
                  </label>
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-gray-100 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <button type="button" onClick={removeImage}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl transition-all">
                          <TrashIcon/> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`aspect-[16/7] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                        dragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className={dragOver ? 'text-orange-500' : 'text-gray-400'}><UploadIcon/></div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">{dragOver ? 'Drop it here!' : 'Click or drag to upload'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                </div>

                {/* Title */}
                <FloatInput
                  id="title" label="Post title"
                  value={title}
                  onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })) }}
                  error={errors.title}
                />

                {/* TipTap rich text editor */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Content
                  </label>
                  <TipTapEditor
                    value={description}
                    onChange={val => { setDescription(val); setErrors(p => ({ ...p, description: '' })) }}
                    placeholder="Write your story here… Use the toolbar to format headings, lists, quotes, and more."
                    minHeight="320px"
                    error={errors.description}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] disabled:bg-orange-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-100"
                >
                  {loading ? <><SpinnerIcon/> Publishing…</> : 'Publish Post'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}