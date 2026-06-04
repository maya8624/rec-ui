import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Lock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { docSearchSuggestions } from '../../../data/agent/demoData'
import type { DocMessage, SourceChunk } from '../../../types/agent'

function SourceCard({ chunk }: { chunk: SourceChunk }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-start justify-between gap-3">
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{chunk.text}</p>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {chunk.page != null && <span className="text-xs text-slate-400 dark:text-slate-500">p.{chunk.page}</span>}
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{Math.round(chunk.score * 100)}%</span>
      </div>
    </div>
  )
}

interface DocSearchPanelProps {
  messages: DocMessage[]
  isLoading: boolean
  error: string | null
  search: (query: string) => void
  propertyId: string | null
}

export function DocSearchPanel({ messages, isLoading, error, search, propertyId }: DocSearchPanelProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [input])

  function handleSend() {
    if (!input.trim() || isLoading) return
    search(input.trim())
    setInput('')
  }

  const handleKey = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }, [input, isLoading])

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col flex-1 min-h-0">
      <div className="p-5 space-y-5 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
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
                {msg.streaming && !msg.content ? (
                  <div className="flex items-center gap-1 pt-1">
                    <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                ) : (
                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-slate-800 dark:text-slate-100">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      }}
                    >{msg.content}</ReactMarkdown>
                  </div>
                )}
                {msg.sources && msg.sources.length > 0 && (
                  <>
                    <div className="space-y-3">
                      {Object.entries(
                        msg.sources.reduce<Record<string, SourceChunk[]>>((acc, chunk) => {
                          (acc[chunk.fileName] ??= []).push(chunk)
                          return acc
                        }, {})
                      ).map(([fileName, chunks]) => (
                        <div key={fileName}>
                          <p className="text-xs font-medium text-slate-800 dark:text-white truncate mb-1.5">{fileName}</p>
                          <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                            {chunks.map((chunk, i) => <SourceCard key={i} chunk={chunk} />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 px-5 pb-4 space-y-2">
        {propertyId ? (
          <>
            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30">
              <Lock className="w-3 h-3" />
              Scoped to selected property
            </div>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {docSearchSuggestions.map(q => (
                  <button
                    key={q}
                    onClick={() => { search(q) }}
                    disabled={isLoading}
                    className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 focus-within:border-indigo-300 dark:focus-within:border-indigo-500/50 transition-colors">
              <textarea
                ref={textareaRef}
                rows={1}
                className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none overflow-hidden leading-5 max-h-40"
                placeholder="Ask about a document, clause, or tenant…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-7 h-7 flex-shrink-0 rounded-lg bg-gold flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send className="w-3.5 h-3.5 text-navy-900" />
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
            Select an enquiry to search its property documents.
          </p>
        )}
      </div>
    </div>
  )
}
