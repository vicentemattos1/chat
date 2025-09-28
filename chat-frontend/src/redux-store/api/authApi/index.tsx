import { baseApi } from '../baseApi'
import type { SignUserResponse, RegisterUserBody, SignUserBody } from './types'

export const authApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['auth'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      signUser: builder.mutation<SignUserResponse, SignUserBody>({
        query: ({ username, password }) => {
          const form = new URLSearchParams()
          form.set('grant_type', 'password')
          form.set('username', username)
          form.set('password', password)

          return {
            url: '/auth/token',
            method: 'POST',
            body: form, // isto define o Content-Type correto
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        },
      }),
      registerUser: builder.mutation<void, RegisterUserBody>({
        query: (body) => ({
          url: '/users',
          method: 'POST',
          body,
        }),
      }),
    }),
  })

export const { useSignUserMutation, useRegisterUserMutation } = authApi

export type { RegisterUserBody, SignUserBody } from './types'
