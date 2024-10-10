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

import { StaticImageData } from 'next/image'
import React, { createContext, useState, useContext, FC, Dispatch, SetStateAction } from 'react'

import { AIModalsValue } from '@/interfaces'
import { GeneratedNFT } from '@/api-services/interfaces/home'

interface PromptContextType {
  prompt: string
  setPrompt: (prompt: string) => void
  selectedNft: GeneratedNFT | undefined
  setSelectedNft: Dispatch<SetStateAction<GeneratedNFT | undefined>>
  aiModal: AIModalsValue
  setAiModal: Dispatch<SetStateAction<AIModalsValue>>
  promptImage: string | undefined | StaticImageData
  setPromptImage: Dispatch<SetStateAction<StaticImageData | undefined | string>>
}

interface PromptProviderProps {
  children: React.ReactNode
}

const initialValues: PromptContextType = {
  prompt: '',
  setPrompt: () => false,
  selectedNft: undefined,
  setSelectedNft: () => false,
  aiModal: 'realistic',
  setAiModal: () => false,
  promptImage: undefined,
  setPromptImage: () => false,
}

const PromptContext = createContext<PromptContextType | undefined>(initialValues)

export const usePromptContext = (): PromptContextType => {
  const context = useContext(PromptContext)
  if (context === undefined) {
    throw new Error('usePrompt must be used within a PromptProvider')
  }
  return context
}

export const PromptProvider: FC<PromptProviderProps> = ({ children }) => {
  const [prompt, setPrompt] = useState<string>('')
  const [aiModal, setAiModal] = useState<AIModalsValue>('realistic')
  const [promptImage, setPromptImage] = useState<string | StaticImageData | undefined>('')
  const [selectedNft, setSelectedNft] = useState<GeneratedNFT | undefined>(undefined)

  // Context value
  const contextValue: PromptContextType = {
    prompt,
    setPrompt,
    selectedNft,
    setSelectedNft,
    aiModal,
    setAiModal,
    promptImage,
    setPromptImage,
  }

  return <PromptContext.Provider value={contextValue}>{children}</PromptContext.Provider>
}
