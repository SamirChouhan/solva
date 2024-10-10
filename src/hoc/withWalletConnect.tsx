'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export default function withWalletConnect(WrappedComponent: React.FC<any>) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter()

    const { isConnected } = useAccount()

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        // Redirect to the login page if the user is not authenticated
        router.push('/')
      }
      // Add logic to check if the user is connected to a wallet here
    }, [router])

    useEffect(() => {
      if (!isConnected) {
        // Redirect to the login page if the user is not authenticated
        router.push('/')
      }
      // Add logic to check if the user is connected to a wallet here
    }, [isConnected, router])

    return <WrappedComponent {...props} />
  }
}
