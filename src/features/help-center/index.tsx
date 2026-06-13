'use client'

import Link from 'next/link'
import { BookOpenText, FileText, LifeBuoy, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { LanguageSwitch } from '@/components/language-switch'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const QUICK_LINK_ICONS = [BookOpenText, FileText, ShieldCheck]

function HelpCenter() {
  const { t } = useTranslation()

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <LanguageSwitch />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        <section className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='outline'>{t('helpCenterPage.badge')}</Badge>
            <div className='inline-flex items-center gap-2 text-muted-foreground'>
              <LifeBuoy className='size-4' />
              <span className='text-sm'>{t('helpCenterPage.eyebrow')}</span>
            </div>
          </div>
          <div className='max-w-3xl space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>
              {t('helpCenterPage.title')}
            </h1>
            <p className='text-muted-foreground'>
              {t('helpCenterPage.description')}
            </p>
          </div>
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          {(['adoption', 'navigation', 'permissions'] as const).map(
            (item, index) => {
              const Icon = QUICK_LINK_ICONS[index]

              return (
                <Card key={item} className='gap-4'>
                  <CardHeader>
                    <div className='mb-2 inline-flex size-10 items-center justify-center rounded-lg border bg-muted'>
                      <Icon className='size-5' />
                    </div>
                    <CardTitle>{t(`helpCenterPage.quickLinks.${item}.title`)}</CardTitle>
                    <CardDescription>
                      {t(`helpCenterPage.quickLinks.${item}.description`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <Link
                      href={t(`helpCenterPage.quickLinks.${item}.href`)}
                      className='text-sm font-medium text-primary underline underline-offset-4'
                    >
                      {t('helpCenterPage.openLink')}
                    </Link>
                  </CardContent>
                </Card>
              )
            }
          )}
        </section>

        <section className='grid gap-4 lg:grid-cols-[1.4fr_1fr]'>
          <Card className='gap-4'>
            <CardHeader>
              <CardTitle>{t('helpCenterPage.faq.title')}</CardTitle>
              <CardDescription>{t('helpCenterPage.faq.description')}</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              {(['replaceShell', 'dataAdapters', 'themeAndLanguage'] as const).map(
                (item) => (
                  <div key={item} className='rounded-lg border p-4'>
                    <h3 className='font-medium'>
                      {t(`helpCenterPage.faq.items.${item}.question`)}
                    </h3>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      {t(`helpCenterPage.faq.items.${item}.answer`)}
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card className='gap-4'>
            <CardHeader>
              <CardTitle>{t('helpCenterPage.resources.title')}</CardTitle>
              <CardDescription>
                {t('helpCenterPage.resources.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {(['runtime', 'settings', 'resources'] as const).map((item) => (
                <div key={item} className='rounded-lg border p-4'>
                  <p className='font-medium'>
                    {t(`helpCenterPage.resources.items.${item}.title`)}
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {t(`helpCenterPage.resources.items.${item}.description`)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </Main>
    </>
  )
}

export { HelpCenter }
