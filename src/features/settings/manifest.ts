import { Bell, Languages, Monitor, Palette, Settings, UserCog, Wrench } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const settingsManifests: ModuleManifest[] = [
  {
    id: 'settings',
    kind: 'group',
    title: 'Settings',
    titleKey: 'sidebar.nav.settings',
    icon: Settings,
    permission: 'settings.view',
    children: [
      'settings-profile',
      'settings-account',
      'settings-language',
      'settings-appearance',
      'settings-notifications',
      'settings-display',
    ],
    searchable: false,
  },
  {
    id: 'settings-profile',
    kind: 'link',
    title: 'Profile',
    titleKey: 'sidebar.nav.settingsProfile',
    href: '/settings',
    icon: UserCog,
    permission: 'settings.view',
  },
  {
    id: 'settings-account',
    kind: 'link',
    title: 'Account',
    titleKey: 'sidebar.nav.settingsAccount',
    href: '/settings/account',
    icon: Wrench,
    permission: 'settings.view',
  },
  {
    id: 'settings-language',
    kind: 'link',
    title: 'Language',
    titleKey: 'sidebar.nav.settingsLanguage',
    href: '/settings/language',
    icon: Languages,
    permission: 'settings.view',
  },
  {
    id: 'settings-appearance',
    kind: 'link',
    title: 'Appearance',
    titleKey: 'sidebar.nav.settingsAppearance',
    href: '/settings/appearance',
    icon: Palette,
    permission: 'settings.view',
  },
  {
    id: 'settings-notifications',
    kind: 'link',
    title: 'Notifications',
    titleKey: 'sidebar.nav.settingsNotifications',
    href: '/settings/notifications',
    icon: Bell,
    permission: 'settings.view',
  },
  {
    id: 'settings-display',
    kind: 'link',
    title: 'Display',
    titleKey: 'sidebar.nav.settingsDisplay',
    href: '/settings/display',
    icon: Monitor,
    permission: 'settings.view',
  },
]

export { settingsManifests }
