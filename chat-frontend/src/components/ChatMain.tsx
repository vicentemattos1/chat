import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SidebarTrigger } from './ui/sidebar'
import { useNavigate, useParams } from 'react-router'
import {
  useCreateChatMutation,
  useGetChatQuery,
  useSendMessageMutation,
} from '@/redux-store/api/chatApi'
import { ChatMessage } from './ChatMessage'

type OptimisticMessage = {
  role: 'user' | 'bot'
  content: string
  created_at: string
}

export const ChatMain = () => {
  const { id } = useParams()
  const isValidId = !isNaN(parseInt(id ?? ''))
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()

  const { data: chat, error } = useGetChatQuery(id ?? '', { skip: !isValidId })
  const [sendMessage] = useSendMessageMutation()
  const [createChat] = useCreateChatMutation()

  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessage[]
  >([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()

    setOptimisticMessages([])
  }, [chat?.messages])

  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      navigate('/', { replace: true })
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let chatId = !isNaN(parseInt(id ?? '')) ? id : ''
    try {
      setOptimisticMessages([
        {
          content: input,
          created_at: new Date().toISOString(),
          role: 'user',
        },
        {
          content: '...',
          created_at: '',
          role: 'bot',
        },
      ])

      if (!chatId) {
        const response = await createChat(input.slice(0, 50)).unwrap()

        chatId = `${response.id}`
      }

      await sendMessage({
        id: parseInt(chatId),
        content: input,
      }).unwrap()

      setInput('')
      navigate(`/${chatId}`)
    } catch {}
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

  return (
    <div className="relative mx-auto flex-1 flex flex-col bg-chat-main">
      <SidebarTrigger className="absolute top-0 left-0 m-2 self-end text-sidebar-foreground hover:text-sidebar-primary" />

      <div className="flex-1 overflow-y-auto px-4 py-6" key={id ?? 'default'}>
        <div className="max-w-3xl mx-auto space-y-6">
          {isValidId && (chat || optimisticMessages.length > 0) ? (
            <>
              {chat?.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {optimisticMessages.map((message) => (
                <ChatMessage
                  key={`optimistic-${message.role}`}
                  message={message}
                />
              ))}
            </>
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
              className="bg-primary hover:bg-primary/80 absolute right-2 bottom-2 h-8 w-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast hover:scale-105 disabled:hover:scale-100"
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
