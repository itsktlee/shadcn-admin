'use client'

import React from 'react'
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { resolveCommandMenuNavigationGroups } from '@/modules/navigation'
import { useAuth } from '@/providers/auth-provider'
import { useDashboardSearch } from '@/providers/dashboard-search-provider'
import { useTheme } from '@/providers/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useDashboardSearch()
  const { hasPermission } = useAuth()
  const { t } = useTranslation()
  const commandMenuNavigationGroups = React.useMemo(
    () => resolveCommandMenuNavigationGroups(hasPermission),
    [hasPermission]
  )

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('searchDialog.placeholder')} />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>{t('searchDialog.empty')}</CommandEmpty>
          {commandMenuNavigationGroups.map((group) => (
            <CommandGroup
              key={group.titleKey ?? group.title}
              heading={group.titleKey ? t(group.titleKey) : group.title}
            >
              {group.items.map((navItem, i) => {
                const navTitle = navItem.titleKey
                  ? t(navItem.titleKey)
                  : navItem.title

                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navTitle}
                      onSelect={() => {
                        runCommand(() => router.push(navItem.url))
                      }}
                    >
                      <div className='flex size-4 items-center justify-center'>
                        <ArrowRight className='size-2 text-muted-foreground/80' />
                      </div>
                      {navTitle}
                    </CommandItem>
                  )

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
                    value={`${navTitle}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => router.push(subItem.url))
                    }}
                  >
                    <div className='flex size-4 items-center justify-center'>
                      <ArrowRight className='size-2 text-muted-foreground/80' />
                    </div>
                    {navTitle} <ChevronRight />{' '}
                    {subItem.titleKey ? t(subItem.titleKey) : subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading={t('searchDialog.themeGroup')}>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun /> <span>{t('common.light')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='scale-90' />
              <span>{t('common.dark')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop />
              <span>{t('common.system')}</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
