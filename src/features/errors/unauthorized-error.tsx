import { useTranslation } from 'react-i18next'
import { LegacyErrorActions } from './legacy-error-actions'

export function UnauthorisedError() {
  const { t } = useTranslation()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>
          {t('errorsShowcase.unauthorized.title')}
        </span>
        <p className='text-center text-muted-foreground'>
          {t('errorsShowcase.unauthorized.descriptionLineOne')}
          <br />
          {t('errorsShowcase.unauthorized.descriptionLineTwo')}
        </p>
        <LegacyErrorActions />
      </div>
    </div>
  )
}
