'use client'

import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TemplateSignInForm } from './template-sign-in-form'

export function SignInShellPage() {
  const { t } = useTranslation()

  return (
    <section className='space-y-4'>
      <span className='inline-flex rounded-md border bg-background px-3 py-1 text-xs font-medium text-muted-foreground'>
        {t('multishell.auth.badge')}
      </span>
      <Card className='border-border/70 shadow-sm'>
        <CardHeader>
          <CardTitle>{t('multishell.auth.title')}</CardTitle>
          <CardDescription>{t('multishell.auth.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateSignInForm />
        </CardContent>
      </Card>
    </section>
  )
}
