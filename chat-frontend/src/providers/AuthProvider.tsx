'use client'

import { Navigate, Outlet } from 'react-router'

import { credentialsHelper } from '@/utils/credentialsHelper'

const AuthProvider = () => {
  const token = credentialsHelper.get()
  const isAuthenticated = Boolean(token)

  if (!isAuthenticated) return <Navigate to="/login" />

  return <Outlet />
}

export default AuthProvider
