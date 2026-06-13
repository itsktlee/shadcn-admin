import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function LegacyErrorActions() {
  const { t } = useTranslation()

  return (
    <div className='mt-6 flex gap-4'>
      <Button
        variant='outline'
        onClick={() => {
          window.history.back()
        }}
      >
        {t('errorsShowcase.actions.goBack')}
      </Button>
      <Button
        onClick={() => {
          window.location.assign('/')
        }}
      >
        {t('errorsShowcase.actions.backHome')}
      </Button>
    </div>
  )
}
