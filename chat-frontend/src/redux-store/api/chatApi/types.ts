export interface ApiError {
  message: string
  status: number
  data?: any
}

export interface ChatListItem {
  id: number
  title: string
  created_at: string
  last_message_at: string
}

export interface ChatListResponse {
  chats: ChatListItem[]
}

export interface Message {
  id: number
  role: 'user' | 'bot'
  content: string
  created_at: string
}

export interface ChatDetailResponse {
  id: number
  title: string
  created_at: string
  last_message_at: string
  messages: Message[]
}

export interface SendMessageParams {
  id: number
  content: string
}

export interface CreateChat {
  id: number
  title: string
  created_at: string
  last_message_at: string
}
