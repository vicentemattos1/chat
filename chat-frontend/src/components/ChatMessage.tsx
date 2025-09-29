import type { Message } from '@/redux-store/api/chatApi/types'
import { formatTimestamp } from '@/utils/formatTimestamp'
import { Bot, User } from 'lucide-react'

type ChatMessageProps = {
  message: Omit<Message, 'id'>
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-4 animate-chat-slide-up ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'bot' && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      )}

      <div
        className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.role === 'user'
              ? 'bg-primary text-message-user-foreground ml-auto p-1 rounded-md'
              : 'bg-message-bot text-message-bot-foreground border border-border'
          }`}
        >
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, index) => {
              if (line.startsWith('```')) {
                return null
              }
              return (
                <p
                  key={index}
                  className={`${index === 0 ? 'mt-0' : ''} ${
                    message.role === 'user'
                      ? 'text-message-user-foreground'
                      : 'text-message-bot-foreground'
                  }`}
                >
                  {line || '\u00A0'}
                </p>
              )
            })}
          </div>
        </div>
        <div
          className={`mt-1 text-xs text-muted-foreground ${
            message.role === 'user' ? 'text-right' : ''
          }`}
        >
          {formatTimestamp(message.created_at)}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0 order-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-secondary-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
