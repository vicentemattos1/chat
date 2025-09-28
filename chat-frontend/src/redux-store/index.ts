import { configureStore } from '@reduxjs/toolkit'

import { reducerPath, reducer, middleware } from '@/redux-store/api/baseApi'
import userSlice from './slice/user'

export const store = configureStore({
  reducer: {
    [reducerPath]: reducer,
    user: userSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
