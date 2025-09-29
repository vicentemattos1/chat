import { MessageSquarePlus, MoreHorizontal, Trash2, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetChatListQuery } from '@/redux-store/api/chatApi'
import type { ChatListItem } from '@/redux-store/api/chatApi/types'
import { useNavigate, useParams } from 'react-router'

export const ChatSidebar = () => {
  const { id } = useParams()
  const { data } = useGetChatListQuery()
  const navigate = useNavigate()

  const activeChat = id ? parseInt(id) : undefined
  const chatGroups = groupChatsByDate(data?.chats ?? [])

  return (
    <Sidebar className="bg-chat-sidebar border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Button
          onClick={() => navigate('/', { replace: true })}
          className="w-full bg-sidebar-accent hover:bg-primary text-sidebar-accent-foreground hover:text-sidebar-primary-foreground transition-colors duration-fast group"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4 transition-transform duration-fast group-hover:scale-110" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <div className="space-y-4">
          {Object.entries(chatGroups).map(([date, dateChats]) => (
            <div key={date} className="animate-fade-in-left">
              <h3 className="text-xs font-medium text-sidebar-foreground px-3 py-2 uppercase tracking-wider">
                {date}
              </h3>
              <div className="space-y-1">
                {dateChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group/item relative hover:bg-accent-foreground/10 flex items-center rounded-lg transition-all duration-fast hover:bg-chat-sidebar-hover ${
                      activeChat === chat.id
                        ? 'bg-chat-sidebar-active text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <Button
                      className="flex flex-1 overflow-hidden max-w-full justify-start hover:bg-transparent bg-transparent text-white"
                      onClick={() => navigate(`/${chat.id}`)}
                    >
                      <MessageSquarePlus className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast h-8 w-8 p-0 hover:bg-sidebar-accent"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="flex items-center">
                          <Edit3 className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {data?.chats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-sidebar-foreground text-sm">
            <MessageSquarePlus className="h-8 w-8 mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-xs opacity-75">Start a new chat to begin</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

const formatDate = (dateStr: string) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0 || dateStr === null) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

const groupChatsByDate = (chats: ChatListItem[]) => {
  const groups: { [key: string]: ChatListItem[] } = {}

  chats.forEach((chat) => {
    const date = formatDate(chat.last_message_at)
    if (!groups[date]) groups[date] = []
    groups[date].push(chat)
  })

  return groups
}
