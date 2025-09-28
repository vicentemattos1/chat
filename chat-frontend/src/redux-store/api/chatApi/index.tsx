import { baseApi } from '../baseApi'
import type { ChatListResponse } from './types'

export const chatsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['chats'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getChatList: builder.query<ChatListResponse, void>({
        query: () => ({
          url: '/chats',
          method: 'GET',
        }),
      }),
      getChat: builder.query<ChatListResponse, string>({
        query: (id) => ({
          url: `/chats/${id}`,
          method: 'GET',
        }),
      }),
    }),
  })

export const { useGetChatListQuery, useGetChatQuery } = chatsApi

export type { ChatListResponse } from './types'
