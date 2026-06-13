'use client'

import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DashboardPageShell } from './dashboard-page-shell'

type ModulePlaceholderPageProps = {
  path: string
  titleKey: string
}

export function ModulePlaceholderPage({
  path,
  titleKey,
}: ModulePlaceholderPageProps) {
  const { t } = useTranslation()
  const title = t(titleKey)

  return (
    <DashboardPageShell
      badge={t('multishell.shellParity.badge')}
      title={title}
      description={t('multishell.shellParity.moduleDescription', { title })}
    >
      <Card className='border-border/70 shadow-sm'>
        <CardHeader>
          <CardTitle>{t('multishell.shellParity.placeholderTitle')}</CardTitle>
          <CardDescription>
            {t('multishell.shellParity.moduleCardDescription')}
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
    </DashboardPageShell>
  )
}
