'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ErrorPlaceholderPageProps = {
  path: string
  titleKey: string
}

export function ErrorPlaceholderPage({
  path,
  titleKey,
}: ErrorPlaceholderPageProps) {
  const { t } = useTranslation()

  return (
    <Card className='border-border/70 shadow-sm'>
      <CardHeader className='space-y-3'>
        <span className='inline-flex w-fit rounded-md border bg-background px-3 py-1 text-xs font-medium text-muted-foreground'>
          {t('multishell.errors.badge')}
        </span>
        <div className='space-y-1'>
          <CardTitle>{t(titleKey)}</CardTitle>
          <CardDescription>
            {t('multishell.shellParity.errorRouteDescription')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className='rounded-lg border border-dashed border-border/80 bg-muted/20 p-6 text-sm leading-6 text-muted-foreground'>
          <span className='font-medium text-foreground'>
            {t('multishell.shellParity.routeLabel')}:
          </span>{' '}
          {path}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant='outline'>
          <Link href='/'>{t('multishell.errors.backHome')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
