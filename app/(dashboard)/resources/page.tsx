import { notFound } from 'next/navigation'
import { isTemplateModuleEnabled } from '@/config/template-modules'
import { Resources } from '@/features/resources'

export default function ResourcesPage() {
  if (!isTemplateModuleEnabled('resources')) {
    notFound()
  }

  return <Resources />
}
