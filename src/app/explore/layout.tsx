import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Solav | Explore',
  description: 'Explore Data',
}

export interface ExploreProps {
  children: React.ReactNode
}

const ExploreLayout: React.FC<ExploreProps> = ({ children }) => {
  return <Suspense fallback="Loading...">{children}</Suspense>
}

export default ExploreLayout
