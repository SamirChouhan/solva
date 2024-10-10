'use client'

import { WagmiProvider, cookieToInitialState } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { config } from './wagmiContext/config'
import { PromptProvider } from './PromptContext'
import { SubscriptionProvider } from './SubscriptionContext'
import { SignatureProvider } from './UserContext'
import 'react-toastify/dist/ReactToastify.css'

export default function Providers({ children, cookie }: { children: ReactNode; cookie: string | null }) {
  const initialState = cookieToInitialState(config)
  const queryClient = new QueryClient()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" storageKey="solav-theme">
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <SignatureProvider>
            <SubscriptionProvider>
              <PromptProvider>{children}</PromptProvider>
            </SubscriptionProvider>
          </SignatureProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WagmiProvider>
      <ToastContainer />
    </ThemeProvider>
  )
}
