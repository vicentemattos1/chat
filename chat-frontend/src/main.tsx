import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/components/ThemeProvider.tsx'
import { RouterProvider } from 'react-router'
import { router } from './routes.tsx'
import ReduxProvider from './redux-store/ReduxProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ReduxProvider>
        <RouterProvider router={router} />
      </ReduxProvider>
    </ThemeProvider>
  </StrictMode>,
)
