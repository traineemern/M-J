import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { EnquiryForm } from './EnquiryForm'
import { useEnquiry } from './EnquiryContext'
import { siteContent } from '@/data/site'

export const EnquiryPopup: React.FC = () => {
  const { isOpen, revision, closeEnquiry, prefilledService, prefilledTown } = useEnquiry()

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeEnquiry}
      title={siteContent.contact.form.title.value}
      titleId="enquiry-modal-title"
    >
      <p className="text-xs text-slate-700 mb-4 -mt-1">{siteContent.contact.form.intro.value}</p>
      <EnquiryForm
        key={revision}
        initialService={prefilledService}
        initialTown={prefilledTown}
        onClose={closeEnquiry}
      />
    </Modal>
  )
}

export default EnquiryPopup
