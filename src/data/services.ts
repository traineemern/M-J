import { resolveContent, siteContent } from '@/data/site'

export interface CompactServiceItem {
  id: string
  title: string
  line: string
  icon: string
}

const serviceIcons = ['Drill', 'Drill', 'Gauge', 'Droplets', 'Wrench', 'Droplets', 'ClipboardCheck', 'Construction', 'Shovel', 'Wrench']
const serviceImages = siteContent.services.map((service) => resolveContent(service.image) ?? '')

export const servicesPageData = {
  heading: siteContent.pages.services.title.value,
  intro: siteContent.pages.services.description.value,
  services: siteContent.services.map((service, index) => ({
    id: service.id.value,
    title: service.title.value,
    line: resolveContent(service.summary) ?? '',
    icon: serviceIcons[index] ?? 'Drill',
  })) satisfies CompactServiceItem[],
}

export const nightRigServices = siteContent.services.map((service, index) => ({
  id: service.id.value,
  title: service.title.value,
  line: resolveContent(service.summary) ?? '',
  image: serviceImages[index] ?? '',
  enquiryService: service.enquiryService.value,
  specs: [],
}))
