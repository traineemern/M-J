import React, { createContext, useContext, useState, useCallback } from 'react'

interface EnquiryContextType {
  isOpen: boolean
  prefilledService?: string
  prefilledTown?: string
  openEnquiry: (service?: string, town?: string) => void
  closeEnquiry: () => void
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined)

export const EnquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [prefilledService, setPrefilledService] = useState<string | undefined>(undefined)
  const [prefilledTown, setPrefilledTown] = useState<string | undefined>(undefined)

  const openEnquiry = useCallback((service?: string, town?: string) => {
    setPrefilledService(service)
    setPrefilledTown(town)
    setIsOpen(true)
  }, [])

  const closeEnquiry = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <EnquiryContext.Provider value={{ isOpen, prefilledService, prefilledTown, openEnquiry, closeEnquiry }}>
      {children}
    </EnquiryContext.Provider>
  )
}

export function useEnquiry() {
  const context = useContext(EnquiryContext)
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider')
  }
  return context
}

export default EnquiryContext
