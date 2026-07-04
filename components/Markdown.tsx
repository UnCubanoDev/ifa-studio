'use client'

import type { ReactNode } from 'react'

const INLINE_REGEX = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|`([^`]+)`/g

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  const re = new RegExp(INLINE_REGEX.source, 'g')
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2] !== undefined) {
      parts.push(<strong key={parts.length}>{match[2]}</strong>)
    } else if (match[4] !== undefined) {
      parts.push(<em key={parts.length}>{match[4]}</em>)
    } else if (match[5] !== undefined) {
      parts.push(
        <code key={parts.length} className="bg-surface-container-high px-1.5 py-0.5 rounded text-sm font-mono text-primary">
          {match[5]}
        </code>,
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

export default function Markdown({ content, className = '' }: { content: string; className?: string }) {
  const paragraphs = content.split('\n').filter(Boolean)

  return (
    <div className={`space-y-stack-md ${className}`}>
      {paragraphs.map((para, i) => {
        if (/^#{1,6}\s/.test(para)) {
          const level = para.match(/^#{1,6}/)![0].length
          const text = para.replace(/^#{1,6}\s/, '')
          const sizes = ['font-headline-sm', 'font-headline-sm', 'font-title-md', 'font-title-sm']
          const Tag = (['h3', 'h4', 'h5', 'h6'] as const)[Math.min(level - 1, 3)]
          return (
            <Tag key={i} className={`${sizes[Math.min(level, 4)]} text-primary font-medium`}>
              {renderInline(text)}
            </Tag>
          )
        }

        if (/^- /.test(para)) {
          const items = para.split('\n').filter(l => /^- /.test(l)).map(l => l.replace(/^- /, ''))
          return (
            <ul key={i} className="list-disc list-inside space-y-1">
              {items.map((item, j) => (
                <li key={j} className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={i} className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {renderInline(para)}
          </p>
        )
      })}
    </div>
  )
}
