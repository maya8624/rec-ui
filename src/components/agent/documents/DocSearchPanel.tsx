import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { WorkflowFooter } from '../layout/WorkflowFooter'
import { useDocumentSearch } from '../../../hooks/useDocumentSearch'
import { suggestedQuestions, docSearchWorkflowSteps } from '../../../data/agent/demoData'
import type { SourceNode, DocType } from '../../../types/agent'

function citationClass(type: DocType) {
  if (type === 'pdf') return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20'
  if (type === 'docx') return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
  return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
}

function CitationChip({ node }: { node: SourceNode }) {
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${citationClass(node.type)}`}>
      {node.source} · p.{node.page}
    </span>
  )
}

function SourceCard({ node }: { node: SourceNode }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{node.source}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500">p.{node.page}</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400">{Math.round(node.score * 100)}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{node.text}</p>
    </div>
  )
}

export function DocSearchPanel() {
  const { messages, isSearching, error, search } = useDocumentSearch()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!input.trim() || isSearching) return
    search(input.trim())
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col h-[600px] md:h-auto md:flex-1 md:min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-[70%] bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">{msg.content}</p>
              </div>
            ) : (
              <div className="max-w-[85%] space-y-2.5">
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                  AI
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{msg.content}</p>
                {msg.sourceNodes && msg.sourceNodes.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sourceNodes.map((node, i) => <CitationChip key={i} node={node} />)}
                    </div>
                    <div className="space-y-2">
                      {msg.sourceNodes.map((node, i) => <SourceCard key={i} node={node} />)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {isSearching && (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Searching documents…</span>
          </div>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 px-5 pb-2 flex flex-wrap gap-1.5">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => search(q)}
            disabled={isSearching}
            className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex-shrink-0 px-5 pb-4">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus-within:border-indigo-300 dark:focus-within:border-indigo-500/50 transition-colors">
          <input
            className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
            placeholder="Ask about a document, clause, or tenant…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isSearching}
          />
          <button
            onClick={handleSend}
            disabled={isSearching || !input.trim()}
            className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="w-3.5 h-3.5 text-navy-900" />
          </button>
        </div>
      </div>

      <WorkflowFooter steps={docSearchWorkflowSteps} />
    </div>
  )
}
