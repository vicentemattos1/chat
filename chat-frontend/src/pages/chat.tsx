import { SidebarProvider } from '@/components/ui/sidebar'

import { ChatMain } from '@/components/ChatMain'
import { ChatSidebar } from '@/components/ChatSidebar'

export interface Message {
  id: string
  content: string
  role: 'user' | 'bot'
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const ChatPage = () => {
  return (
    <div className="flex h-screen w-full bg-chat-main">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-full w-screen">
          <ChatSidebar />

          <ChatMain />
        </div>
      </SidebarProvider>
    </div>
  )
}

export default ChatPage
