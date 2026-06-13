'use client'

import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AuthPlaceholderPageProps = {
  path: string
  titleKey: string
}

export function AuthPlaceholderPage({
  path,
  titleKey,
}: AuthPlaceholderPageProps) {
  const { t } = useTranslation()

  return (
    <section className='space-y-4'>
      <span className='inline-flex rounded-md border bg-background px-3 py-1 text-xs font-medium text-muted-foreground'>
        {t('multishell.auth.badge')}
      </span>
      <Card className='border-border/70 shadow-sm'>
        <CardHeader>
          <CardTitle>{t(titleKey)}</CardTitle>
          <CardDescription>
            {t('multishell.shellParity.authRouteDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-lg border border-dashed border-border/80 bg-muted/20 p-6 text-sm leading-6 text-muted-foreground'>
            <span className='font-medium text-foreground'>
              {t('multishell.shellParity.routeLabel')}:
            </span>{' '}
            {path}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
