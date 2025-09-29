import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/components/ThemeProvider.tsx'
import { RouterProvider } from 'react-router'
import { router } from './routes.tsx'
import ReduxProvider from './providers/ReduxProvider.tsx'

import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ReduxProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" expand theme="system" />
      </ReduxProvider>
    </ThemeProvider>
  </StrictMode>,
)
