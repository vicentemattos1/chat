import { baseApi } from '../baseApi'
import type {
  ChatDetailResponse,
  ChatListResponse,
  CreateChat,
  SendMessageParams,
} from './types'

export const chatsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['chats', 'chat'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getChatList: builder.query<ChatListResponse, void>({
        query: () => ({
          url: '/chats',
          method: 'GET',
        }),
      }),
      getChat: builder.query<ChatDetailResponse, string>({
        query: (id) => ({
          url: `/chats/${id}`,
          method: 'GET',
        }),
        providesTags: (_result, _error, id) => [{ type: 'chat', id }],
      }),
      createChat: builder.mutation<CreateChat, string>({
        query: (title) => ({
          url: '/chats',
          method: 'POST',
          body: {
            title,
          },
        }),
        invalidatesTags: ['chats'],
      }),
      sendMessage: builder.mutation<void, SendMessageParams>({
        query: ({ id, ...body }) => ({
          url: `/chats/${id}/messages`,
          method: 'POST',
          body: {
            ...body,
            role: 'user',
          },
        }),
        invalidatesTags: (_result, _error, { id }) => [{ type: 'chat', id }],
      }),
    }),
  })

export const {
  useGetChatListQuery,
  useGetChatQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useLazyGetChatListQuery,
} = chatsApi

export type { ChatListResponse, ChatDetailResponse } from './types'
