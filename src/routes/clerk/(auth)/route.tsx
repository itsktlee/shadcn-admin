import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ClerkFullLogo } from '@/assets/clerk-full-logo'
import { Logo } from '@/assets/logo'
import { LanguageSwitch } from '@/components/language-switch'
import { LearnMore } from '@/components/learn-more'

export const Route = createFileRoute('/clerk/(auth)')({
  component: ClerkAuthLayout,
})

// eslint-disable-next-line react-refresh/only-export-components
function ClerkAuthLayout() {
  const { t } = useTranslation()

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute top-4 right-4 z-10'>
        <LanguageSwitch />
      </div>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-e'>
        <div className='absolute inset-0 bg-primary/15 dark:bg-primary/10' />
        <Link
          to='/'
          className='relative z-20 flex items-center text-lg font-medium'
        >
          <Logo className='me-2' />
          {t('auth.brand')}
        </Link>

        <ClerkFullLogo className='relative m-auto size-96' />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo; {t('clerk.authLayout.quote')} &rdquo;
            </p>
            <footer className='text-sm'>{t('clerk.authLayout.quoteAuthor')}</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='relative mx-auto flex w-full flex-col items-center justify-center gap-4'>
          <LearnMore
            defaultOpen
            triggerProps={{
              className: 'absolute -top-12 inset-e-0 sm:inset-e-20 size-6',
            }}
            contentProps={{ side: 'top', align: 'end', className: 'w-auto' }}
          >
            {t('clerk.authLayout.learnMore')} <br />
            {t('clerk.authLayout.backToPrefix')}{' '}
            <Link
              to='/'
              className='underline decoration-dashed underline-offset-2'
            >
              {t('dashboard.title')}
            </Link>
          </LearnMore>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
