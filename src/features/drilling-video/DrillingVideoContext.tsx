import React, { createContext, useContext, useState, useCallback } from 'react'

interface DrillingVideoContextType {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const DrillingVideoContext = createContext<DrillingVideoContextType | undefined>(undefined)

export const DrillingVideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <DrillingVideoContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </DrillingVideoContext.Provider>
  )
}

export function useDrillingVideo() {
  const context = useContext(DrillingVideoContext)
  if (!context) {
    throw new Error('useDrillingVideo must be used within a DrillingVideoProvider')
  }
  return context
}

export default DrillingVideoContext
