import { faqData } from '@/data/faq'
import { Accordion } from '@/components/ui/Accordion'

export function FaqAccordion() {
  const accordionItems = faqData.map((item) => ({
    id: item.id,
    title: item.question,
    content: item.answer,
  }))

  return (
    <div className="space-y-4">
      <Accordion items={accordionItems} />
    </div>
  )
}
export default FaqAccordion
