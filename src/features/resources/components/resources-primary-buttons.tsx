import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePermission } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { useResources } from './resources-provider'

export function ResourcesPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useResources()
  const canCreate = usePermission('resources.create')

  if (!canCreate) {
    return null
  }

  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>{t('resources.actions.create')}</span>
      <Plus size={18} />
    </Button>
  )
}
