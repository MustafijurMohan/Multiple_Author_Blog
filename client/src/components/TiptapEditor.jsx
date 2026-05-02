import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'

// ── Toolbar icon buttons ──────────────────────────────────────────────────────
function ToolBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-150 ${
        active
          ? 'bg-orange-600 text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  )
}

const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1"/>

// ── TipTap Editor ─────────────────────────────────────────────────────────────
/**
 * Props:
 *   value       – HTML string (controlled)
 *   onChange    – fn(html: string)
 *   placeholder – string
 *   minHeight   – string  (e.g. '280px')
 *   error       – string | undefined
 */
export default function TipTapEditor({ value, onChange, placeholder = 'Write your story here…', minHeight = '280px', error }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none',
        style: `min-height:${minHeight}; padding: 16px;`,
      },
    },
  })

  // Sync external value changes (e.g. edit mode loading content)
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  if (!editor) return null

  const setLink = () => {
    const prev = editor.getAttributes('link').href
    const url  = window.prompt('Enter URL:', prev)
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <>
      <style>{`
        /* Toolbar + editor wrapper */
        .tiptap-wrap { border: 1.5px solid #e5e7eb; border-radius: 14px; overflow: hidden; transition: border-color .2s, box-shadow .2s; background: #fff; }
        .tiptap-wrap:focus-within { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,.12); }
        .tiptap-wrap.error { border-color: #f87171; }
        .tiptap-wrap.error:focus-within { box-shadow: 0 0 0 3px rgba(248,113,113,.12); }

        /* Prose styles inside editor */
        .tiptap-editor h1 { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:700; margin:1rem 0 .5rem; color:#111; }
        .tiptap-editor h2 { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:700; margin:.8rem 0 .4rem; color:#222; }
        .tiptap-editor h3 { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:600; margin:.6rem 0 .3rem; color:#333; }
        .tiptap-editor p  { margin:.4rem 0; color:#374151; line-height:1.75; font-size:.9rem; }
        .tiptap-editor p.is-editor-empty:first-child::before { content:attr(data-placeholder); color:#9ca3af; float:left; height:0; pointer-events:none; }
        .tiptap-editor ul { list-style:disc; padding-left:1.5rem; margin:.4rem 0; }
        .tiptap-editor ol { list-style:decimal; padding-left:1.5rem; margin:.4rem 0; }
        .tiptap-editor li { color:#374151; font-size:.9rem; line-height:1.7; margin:.1rem 0; }
        .tiptap-editor blockquote { border-left:3px solid #f97316; padding-left:1rem; margin:1rem 0; color:#6b7280; font-style:italic; }
        .tiptap-editor strong { font-weight:700; color:#111; }
        .tiptap-editor em { font-style:italic; }
        .tiptap-editor u { text-decoration:underline; }
        .tiptap-editor code { background:#f3f4f6; border-radius:4px; padding:1px 6px; font-size:.85rem; color:#ea580c; font-family:monospace; }
        .tiptap-editor pre  { background:#1f2937; color:#f9fafb; padding:1rem; border-radius:10px; overflow-x:auto; margin:.8rem 0; }
        .tiptap-editor pre code { background:none; color:inherit; padding:0; }
        .tiptap-editor a { color:#ea580c; text-decoration:underline; cursor:pointer; }
        .tiptap-editor hr { border:none; border-top:1.5px solid #e5e7eb; margin:1rem 0; }

        /* Read-only prose (SinglePost) */
        .tiptap-prose h1 { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:700; margin:1.2rem 0 .6rem; color:#111; }
        .tiptap-prose h2 { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:700; margin:1rem 0 .4rem; color:#222; }
        .tiptap-prose h3 { font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:600; margin:.8rem 0 .3rem; color:#333; }
        .tiptap-prose p  { margin:.5rem 0; color:#374151; line-height:1.85; font-size:.95rem; }
        .tiptap-prose ul { list-style:disc; padding-left:1.5rem; margin:.5rem 0; }
        .tiptap-prose ol { list-style:decimal; padding-left:1.5rem; margin:.5rem 0; }
        .tiptap-prose li { color:#374151; font-size:.95rem; line-height:1.75; }
        .tiptap-prose blockquote { border-left:3px solid #f97316; padding-left:1rem; margin:1.2rem 0; color:#6b7280; font-style:italic; }
        .tiptap-prose strong { font-weight:700; color:#111; }
        .tiptap-prose em { font-style:italic; }
        .tiptap-prose code { background:#f3f4f6; border-radius:4px; padding:1px 6px; font-size:.875rem; color:#ea580c; font-family:monospace; }
        .tiptap-prose pre  { background:#1f2937; color:#f9fafb; padding:1rem; border-radius:10px; overflow-x:auto; margin:1rem 0; }
        .tiptap-prose pre code { background:none; color:inherit; padding:0; }
        .tiptap-prose a { color:#ea580c; text-decoration:underline; }
        .tiptap-prose hr { border:none; border-top:1.5px solid #e5e7eb; margin:1.2rem 0; }
        .tiptap-prose img { border-radius:10px; max-width:100%; }
      `}</style>

      <div className={`tiptap-wrap${error ? ' error' : ''}`}>
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap px-3 py-2 border-b border-gray-100 bg-gray-50/80">

          {/* Headings */}
          <ToolBtn title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>H1</ToolBtn>
          <ToolBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</ToolBtn>
          <ToolBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</ToolBtn>

          <Divider/>

          {/* Text formatting */}
          <ToolBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
          </ToolBtn>
          <ToolBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </ToolBtn>
          <ToolBtn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
          </ToolBtn>
          <ToolBtn title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6C16 6 14.5 4 12 4s-5 1.5-5 4c0 5 10 3 10 8s-3 4-5 4-5-2-5-2"/></svg>
          </ToolBtn>
          <ToolBtn title="Code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </ToolBtn>

          <Divider/>

          {/* Lists */}
          <ToolBtn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
          </ToolBtn>
          <ToolBtn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" fontSize="7" fill="currentColor" stroke="none">1.</text><text x="2" y="14" fontSize="7" fill="currentColor" stroke="none">2.</text><text x="2" y="20" fontSize="7" fill="currentColor" stroke="none">3.</text></svg>
          </ToolBtn>
          <ToolBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </ToolBtn>
          <ToolBtn title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="10" x2="8" y2="10"/><polyline points="8 10 11 13 8 16"/><line x1="13" y1="16" x2="16" y2="16"/></svg>
          </ToolBtn>

          <Divider/>

          {/* Alignment */}
          <ToolBtn title="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign:'left' })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn title="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign:'center' })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn title="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign:'right' })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
          </ToolBtn>

          <Divider/>

          {/* Link + HR + Undo/Redo */}
          <ToolBtn title="Link" onClick={setLink} active={editor.isActive('link')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </ToolBtn>
          <ToolBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </ToolBtn>
          <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} active={false}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></svg>
          </ToolBtn>
          <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} active={false}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 014-4h12"/></svg>
          </ToolBtn>
        </div>

        {/* Editor area */}
        <EditorContent editor={editor}/>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 pl-1">{error}</p>}
    </>
  )
}