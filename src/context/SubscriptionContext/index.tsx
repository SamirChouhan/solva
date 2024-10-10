/**
 * @file Manages a prompt state within a React application.
 * @description This module provides a context and provider for managing prompts within the application.
 *
 * @exports PromptProvider - A provider component that wraps the application and provides the PromptContext.
 * @exports usePromptContext - A hook for consuming the PromptContext within functional components.
 *
 * @typedef {Object} PromptContextType - Defines the shape of the PromptContext.
 * @property {string} prompt - The current prompt value.
 * @property {function} setPrompt - A function to update the prompt value.
 *
 * @typedef {Object} PromptProviderProps - Defines the props for the PromptProvider component.
 * @property {React.ReactNode} children - The child components wrapped by the PromptProvider.
 */

import React, { createContext, useState, useContext, FC, Dispatch, SetStateAction } from 'react'

import { Plan } from '@/api-services/interfaces/home'

interface SubscriptionContextType {
  selectedPlan: Plan
  setSelectedPlan: Dispatch<SetStateAction<Plan>>
}

interface SubscriptionProviderProps {
  children: React.ReactNode
}

const initialValues: SubscriptionContextType = {
  selectedPlan: {} as Plan,
  setSelectedPlan: () => false,
}

const PromptContext = createContext<SubscriptionContextType | undefined>(initialValues)

export const useSubscriptionContext = (): SubscriptionContextType => {
  const context = useContext(PromptContext)
  if (context === undefined) {
    throw new Error('usePrompt must be used within a PromptProvider')
  }
  return context
}

export const SubscriptionProvider: FC<SubscriptionProviderProps> = ({ children }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan>({} as Plan)

  // Context value
  const contextValue: SubscriptionContextType = {
    selectedPlan,
    setSelectedPlan,
  }

  return <PromptContext.Provider value={contextValue}>{children}</PromptContext.Provider>
}
