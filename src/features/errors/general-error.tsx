import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { LegacyErrorActions } from './legacy-error-actions'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>
          {t('errorsShowcase.internalServerError.title')}
        </span>
        <p className='text-center text-muted-foreground'>
          {t('errorsShowcase.internalServerError.descriptionLineOne')}
          <br />
          {t('errorsShowcase.internalServerError.descriptionLineTwo')}
        </p>
        {!minimal && <LegacyErrorActions />}
      </div>
    </div>
  )
}
