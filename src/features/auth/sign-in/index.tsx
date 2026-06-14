import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { TemplateSignInForm } from '../components/template-sign-in-form'

export function SignIn() {
  const { t } = useTranslation()

  return (
    <AuthLayout>
      <Card className='mx-auto w-full max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('auth.signIn.title')}
          </CardTitle>
          <CardDescription>
            {t('auth.signIn.desc')} <br className='max-sm:hidden' />{' '}
            {t('auth.signIn.noAccount')}{' '}
            <a
              href='/sign-up'
              className='text-nowrap underline underline-offset-4 hover:text-primary'
            >
              {t('sidebar.nav.authSignUp')}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateSignInForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            {t('auth.legalPrefixSignIn')}{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.terms')}
            </a>{' '}
            {t('common.and')}{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.privacy')}
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
