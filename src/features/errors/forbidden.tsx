import { useTranslation } from 'react-i18next'
import { LegacyErrorActions } from './legacy-error-actions'

export function ForbiddenError() {
  const { t } = useTranslation()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>
          {t('errorsShowcase.forbidden.title')}
        </span>
        <p className='text-center text-muted-foreground'>
          {t('errorsShowcase.forbidden.descriptionLineOne')}
          <br />
          {t('errorsShowcase.forbidden.descriptionLineTwo')}
        </p>
        <LegacyErrorActions />
      </div>
    </div>
  )
}
