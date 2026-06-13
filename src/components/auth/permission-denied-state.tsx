'use client'

import { ShieldX } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function PermissionDeniedState({
  actionKey,
  titleKey = 'permissions.denied.title',
  descriptionKey = 'permissions.denied.description',
}: {
  actionKey?: string
  descriptionKey?: string
  titleKey?: string
}) {
  const { t } = useTranslation()

  return (
    <div className='flex min-h-[420px] items-center justify-center'>
      <Card className='max-w-lg border-border/70 shadow-sm'>
        <CardHeader className='space-y-3 text-center'>
          <div className='mx-auto flex size-12 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground'>
            <ShieldX className='size-5' />
          </div>
          <div className='space-y-1'>
            <CardTitle>{t(titleKey)}</CardTitle>
            <CardDescription>
              {t(descriptionKey, {
                action: actionKey ? t(actionKey) : t('permissions.denied.defaultAction'),
              })}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='flex justify-center'>
          <Button variant='outline' asChild>
            <Link href='/'>{t('permissions.denied.backHome')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export { PermissionDeniedState }
