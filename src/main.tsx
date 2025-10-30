import { observable } from 'mobx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { Navbar } from './components/Navbar/index.tsx'
import { CommunityPage } from './pages/CommunityPage/index.tsx'
import { LoginPage } from './pages/LoginPage/index.tsx'
import { ProfilePetPage } from './pages/ProfilePetPage/index.tsx'
import { TermsPage } from './pages/Terms/index.tsx'
import { UserProfilePage } from './pages/UserProfilePage/index.tsx'
import { AppContextProps } from './services/AppContext.tsx'

import './index.css'
import './i18n.ts'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

async function main() {
  let appContext: AppContextProps = observable({
    session: { token: '' },
    user: null,
  })

  const unauthenticatedRouter = createBrowserRouter([
    {
      path: '/',
      element: <Navbar />,
      children: [
        {
          path: '/login',
          element: <LoginPage />,
        },
        {
          path: '/pet/:id',
          element: <ProfilePetPage />,
        },
        {
          path: '/user/:id',
          element: <UserProfilePage />,
        },
        {
          path: '/community',
          element: <CommunityPage />,
        },
        {
          path: '/terms',
          element: <TermsPage />,
        },
        {
          path: '/',
          element: <LoginPage />,
        },
        {
          path: '*',
          element: <LoginPage />,
        },
      ],
    },
  ])

  // Always render unauthenticated version in demo mode
  // Backend authentication disabled for Vercel deployment
  return ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  ).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={unauthenticatedRouter} />
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>,
  )
}

void main()
