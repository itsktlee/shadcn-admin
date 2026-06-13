import { useTranslation } from 'react-i18next'
import { Logo } from '@/assets/logo'
import { LanguageSwitch } from '@/components/language-switch'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className='relative grid min-h-svh bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8'>
      <div className='absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8'>
        <LanguageSwitch />
      </div>
      <div className='mx-auto flex w-full max-w-md flex-col justify-center space-y-4 self-center'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2' />
          <h1 className='text-xl font-medium'>{t('auth.brand')}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
