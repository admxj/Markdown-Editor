import { useState, useEffect, useRef, useCallback } from 'react'
import { open, save } from '@tauri-apps/plugin-dialog'
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import mermaid from 'mermaid'
import { sampleContent } from './sample'
import './App.css'

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: { useMaxWidth: true, htmlLabels: true },
  sequence: { showSequenceNumbers: true },
  gantt: { titleTopMargin: 25, barHeight: 20 },
  pie: { useMaxWidth: true },
})

// Configure marked with highlight.js
const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value
        } catch {}
      }
      return hljs.highlightAuto(code).value
    }
  })
)

// Custom renderer for mermaid
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      if (lang === 'mermaid') {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        return `<div class="mermaid-container"><div class="mermaid" id="${id}">${text}</div></div>`
      }
      // Default code block rendering
      const language = lang && hljs.getLanguage(lang) ? lang : ''
      const highlighted = language
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
    }
  }
})

function App() {
  const [content, setContent] = useState<string>(sampleContent)
  const [html, setHtml] = useState<string>('')
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [splitRatio, setSplitRatio] = useState(50)
  const isDragging = useRef(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Render markdown to HTML
  useEffect(() => {
    const renderMarkdown = async () => {
      const result = await marked.parse(content)
      setHtml(result as string)
    }
    renderMarkdown()
  }, [content])

  // Render mermaid diagrams after HTML is set
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!previewRef.current) return

      const mermaidDivs = previewRef.current.querySelectorAll('.mermaid')

      mermaidDivs.forEach((div, index) => {
        if (div.querySelector('svg')) return // Already rendered

        const graphDefinition = div.textContent || ''
        const id = `mermaid-${index}-${Date.now()}`

        try {
          mermaid.render(id, graphDefinition).then(({ svg }) => {
            div.innerHTML = svg
          }).catch(() => {})
        } catch { /* empty */ }
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [html])

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString()
            setContent(newContent)
            setIsDirty(true)
          }
        }),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
          '&.cm-focused': { outline: 'none' }
        }, { dark: isDark })
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    editorViewRef.current = view

    return () => {
      view.destroy()
    }
  }, [isDark])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault()
        handleOpen()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleNew()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, currentFile])

  // Resizable split pane
  const handleMouseDown = useCallback(() => {
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const container = document.querySelector('.main-content') as HTMLElement
      if (!container) return
      const rect = container.getBoundingClientRect()
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100
      setSplitRatio(Math.min(Math.max(newRatio, 20), 80))
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleOpen = useCallback(async () => {
    try {
      const selected = await open({
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
        multiple: false
      })

      if (selected) {
        const filePath = selected as string
        const fileContent = await readTextFile(filePath)
        setContent(fileContent)
        setCurrentFile(filePath)
        setIsDirty(false)

        if (editorViewRef.current) {
          editorViewRef.current.dispatch({
            changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: fileContent }
          })
        }
      }
    } catch (err) {
      console.error('Failed to open file:', err)
    }
  }, [])

  const handleSave = useCallback(async () => {
    try {
      let filePath = currentFile

      if (!filePath) {
        const selected = await save({
          filters: [{ name: 'Markdown', extensions: ['md'] }],
          defaultPath: 'untitled.md'
        })

        if (!selected) return
        filePath = selected
      }

      await writeTextFile(filePath, content)
      setCurrentFile(filePath)
      setIsDirty(false)
    } catch (err) {
      console.error('Failed to save file:', err)
    }
  }, [content, currentFile])

  const handleNew = useCallback(() => {
    setContent(sampleContent)
    setCurrentFile(null)
    setIsDirty(false)

    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: sampleContent }
      })
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  const title = currentFile
    ? `${currentFile.split(/[\\/]/).pop()}${isDirty ? ' *' : ''} - Markdown Editor`
    : `Untitled${isDirty ? ' *' : ''} - Markdown Editor`

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <header className="toolbar">
        <div className="toolbar-left">
          <button onClick={handleNew} title="New (Ctrl+N)">New</button>
          <button onClick={handleOpen} title="Open (Ctrl+O)">Open</button>
          <button onClick={handleSave} title="Save (Ctrl+S)">Save</button>
        </div>
        <div className="toolbar-title">{title}</div>
        <div className="toolbar-right">
          <button onClick={toggleTheme} title="Toggle Theme">
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="editor-pane" style={{ width: `${splitRatio}%` }}>
          <div className="pane-header">Editor</div>
          <div ref={editorRef} className="editor-container" />
        </div>
        <div
          className="resizer"
          onMouseDown={handleMouseDown}
        />
        <div className="preview-pane" style={{ width: `${100 - splitRatio}%` }}>
          <div className="pane-header">Preview</div>
          <div
            ref={previewRef}
            className="preview-container"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>
    </div>
  )
}

export default App
