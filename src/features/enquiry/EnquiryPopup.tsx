import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { EnquiryForm } from './EnquiryForm'
import { useEnquiry } from './EnquiryContext'

export const EnquiryPopup: React.FC = () => {
  const { isOpen, closeEnquiry, prefilledService, prefilledTown } = useEnquiry()

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeEnquiry}
      title="Request a Free Estimate"
      titleId="enquiry-modal-title"
    >
      <p className="text-xs text-water-700 mb-4 -mt-1">
        Fast, honest estimates from licensed West Michigan well drillers.
      </p>
      <EnquiryForm
        initialService={prefilledService}
        initialTown={prefilledTown}
        onClose={closeEnquiry}
      />
    </Modal>
  )
}

export default EnquiryPopup
