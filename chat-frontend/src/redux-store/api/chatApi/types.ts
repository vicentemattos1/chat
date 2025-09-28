export interface ApiError {
  message: string
  status: number
  data?: any
}

export interface ChatListResponse {
  chats: [
    {
      id: 0
      title: 'string'
      created_at: '2025-09-28T14:10:00.306Z'
      last_message_at: '2025-09-28T14:10:00.306Z'
    },
  ]
}
