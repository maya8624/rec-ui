import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Building2 } from 'lucide-react'
import type { CopilotMessage } from '../../../types/copilot'
import { SuburbSummaryMessage } from './SuburbSummaryMessage'
import { ListingThumbnails } from './ListingThumbnails'

export function AiMessage({ message }: { message: CopilotMessage }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-lg bg-gold flex items-center justify-center flex-shrink-0 mt-0.5">
        <Building2 className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1">
        {message.type === 'suburb-summary' && message.suburbSummary ? (
          <SuburbSummaryMessage data={message.suburbSummary} />
        ) : (
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                a: ({ href, children }) => {
                  const text = Array.isArray(children) ? children.join('') : String(children ?? '')
                  if (text === href) return null
                  return <span className="font-medium">{children}</span>
                },
                ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 space-y-2 mb-2">{children}</ol>,
                li: ({ children }) => <li className="leading-snug">{children}</li>,
              }}
            >
              {message.text}
            </ReactMarkdown>
            {message.streaming && (
              <span
                aria-hidden
                className="inline-block w-0.5 h-[1em] bg-gold animate-pulse ml-0.5 align-text-bottom"
              />
            )}
          </div>
        )}
        {message.listings && message.listings.length > 0 && (
          <div className="mt-3">
            <ListingThumbnails listings={message.listings} />
          </div>
        )}
      </div>
    </div>
  )
}
