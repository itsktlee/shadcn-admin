import { useTranslation } from 'react-i18next'
import { LegacyErrorActions } from './legacy-error-actions'

export function NotFoundError() {
  const { t } = useTranslation()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>{t('errorsShowcase.notFound.title')}</span>
        <p className='text-center text-muted-foreground'>
          {t('errorsShowcase.notFound.descriptionLineOne')}
          <br />
          {t('errorsShowcase.notFound.descriptionLineTwo')}
        </p>
        <LegacyErrorActions />
      </div>
    </div>
  )
}
