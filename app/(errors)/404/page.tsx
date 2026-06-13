'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Error404ShellPage() {
  const { t } = useTranslation()

  return (
    <Card className='border-border/70 shadow-sm'>
      <CardHeader>
        <div className='mb-2 inline-flex w-fit rounded-md border bg-background px-3 py-1 text-xs font-medium text-muted-foreground'>
          {t('multishell.errors.badge')}
        </div>
        <CardTitle>404</CardTitle>
        <CardDescription>{t('multishell.errors.title')}</CardDescription>
      </CardHeader>
      <CardContent className='text-sm leading-6 text-muted-foreground'>
        {t('multishell.errors.description')}
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href='/'>{t('multishell.errors.backHome')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
