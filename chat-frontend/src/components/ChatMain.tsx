import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SidebarTrigger } from './ui/sidebar'
import type { Chat } from '@/pages/chat'

interface ChatMainProps {
  chat: Chat | undefined
  onSendMessage: (message: string) => void
}

export const ChatMain = ({ chat, onSendMessage }: ChatMainProps) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative mx-auto flex-1 flex flex-col bg-chat-main">
      <SidebarTrigger className="absolute top-0 left-0 m-2 self-end text-sidebar-foreground hover:text-sidebar-primary" />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {chat ? (
            chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 animate-chat-slide-up ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[80%] ${
                    message.role === 'user' ? 'order-2' : ''
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-message-user text-message-user-foreground ml-auto p-1 rounded-md'
                        : 'bg-message-assistant text-message-assistant-foreground border border-border'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, index) => {
                        if (line.startsWith('```')) {
                          return null // Handle code blocks separately if needed
                        }
                        return (
                          <p
                            key={index}
                            className={`${index === 0 ? 'mt-0' : ''} ${
                              message.role === 'user'
                                ? 'text-message-user-foreground'
                                : 'text-message-assistant-foreground'
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
                    {formatTimestamp(message.timestamp)}
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
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center bg-chat-main">
              <div className="text-center text-muted-foreground">
                <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">
                  Welcome to ChatGPT
                </h2>
                <p>Send a message to start a conversation</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-background px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message ChatGPT..."
              className="min-h-[52px] max-h-[200px] pr-12 resize-none bg-chat-input border-border focus:ring-ring transition-all duration-fast"
              rows={1}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim()}
              className="bg-message-user hover:bg-message-user/80 absolute right-2 bottom-2 h-8 w-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast hover:scale-105 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
