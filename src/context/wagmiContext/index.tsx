// 'use client'
import React, { ReactNode } from 'react'
import { headers } from 'next/headers'

import Providers from '../provider'

// Modify ContextProvider to receive props of type AppPropsWithChildren
export function ContextProvider({ children }: { children: ReactNode }) {
  return <Providers cookie={headers().get('cookie')}>{children}</Providers>
}
