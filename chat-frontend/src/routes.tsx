import { createBrowserRouter } from 'react-router'
import ChatPage from './pages/chat'
import Login from './pages/login'
import SignUp from './pages/register'
import AuthProvider from './providers/AuthProvider'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <SignUp /> },
  {
    path: '/',
    element: <AuthProvider />,
    children: [
      { path: '/', element: <ChatPage /> },
      { path: '/:id', element: <ChatPage /> },
    ],
  },
])
