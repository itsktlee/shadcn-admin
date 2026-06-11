import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Languages,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
      planKey: 'sidebar.teams.plans.enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
      planKey: 'sidebar.teams.plans.startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      titleKey: 'sidebar.groups.general',
      items: [
        {
          title: 'Dashboard',
          titleKey: 'sidebar.nav.dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          titleKey: 'sidebar.nav.tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Apps',
          titleKey: 'sidebar.nav.apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          titleKey: 'sidebar.nav.chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          titleKey: 'sidebar.nav.users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Secured by Clerk',
          titleKey: 'sidebar.nav.clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'Sign In',
              titleKey: 'sidebar.nav.clerkSignIn',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              titleKey: 'sidebar.nav.clerkSignUp',
              url: '/clerk/sign-up',
            },
            {
              title: 'User Management',
              titleKey: 'sidebar.nav.clerkUserManagement',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: 'Pages',
      titleKey: 'sidebar.groups.pages',
      items: [
        {
          title: 'Auth',
          titleKey: 'sidebar.nav.auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              titleKey: 'sidebar.nav.authSignIn',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              titleKey: 'sidebar.nav.authSignInTwoCol',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              titleKey: 'sidebar.nav.authSignUp',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              titleKey: 'sidebar.nav.authForgotPassword',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              titleKey: 'sidebar.nav.authOtp',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          titleKey: 'sidebar.nav.errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              titleKey: 'sidebar.nav.errorUnauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              titleKey: 'sidebar.nav.errorForbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              titleKey: 'sidebar.nav.errorNotFound',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              titleKey: 'sidebar.nav.errorInternalServerError',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              titleKey: 'sidebar.nav.errorMaintenanceError',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      titleKey: 'sidebar.groups.other',
      items: [
        {
          title: 'Settings',
          titleKey: 'sidebar.nav.settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              titleKey: 'sidebar.nav.settingsProfile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              titleKey: 'sidebar.nav.settingsAccount',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Language',
              titleKey: 'sidebar.nav.settingsLanguage',
              url: '/settings/language',
              icon: Languages,
            },
            {
              title: 'Appearance',
              titleKey: 'sidebar.nav.settingsAppearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              titleKey: 'sidebar.nav.settingsNotifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              titleKey: 'sidebar.nav.settingsDisplay',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          titleKey: 'sidebar.nav.helpCenter',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
