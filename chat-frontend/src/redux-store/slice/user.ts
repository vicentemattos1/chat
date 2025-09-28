import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { shallowEqual, useSelector } from 'react-redux'

import type { RootState } from '..'

export type Permission = Record<string, string[]>

export type User = { id: string; email: string }

type UserState = {
  user: User | null
}

const initialState: UserState = { user: null }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },

    clearUser: (state) => {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

export const userSelector = ({ user }: RootState) => {
  return {
    user,
  }
}

export const useUserSlice = () => {
  const { user } = useSelector(userSelector, shallowEqual)

  return { user: user.user }
}
