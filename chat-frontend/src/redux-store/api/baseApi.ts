import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { credentialsHelper } from '@/utils/credentialsHelper'
import type { ApiError } from './chatApi/types'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_CHAT_API_URL,
  prepareHeaders: (headers) => {
    const token = credentialsHelper.get()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithErrorHandling = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error) {
    const error = result.error as ApiError

    if (error.status === 401 && window.location.pathname !== '/login') {
      credentialsHelper.clear()
      window.location.replace('/login')
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'schedulingApi',
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
})

// Export para ser usado pelas APIs específicas
export const { reducerPath, reducer, middleware } = baseApi
