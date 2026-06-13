import { ShieldCheck } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const authManifests: ModuleManifest[] = [
  {
    id: 'auth',
    kind: 'group',
    title: 'Auth',
    titleKey: 'sidebar.nav.auth',
    icon: ShieldCheck,
    children: [
      'auth-sign-in',
      'auth-sign-in-2',
      'auth-sign-up',
      'auth-forgot-password',
      'auth-otp',
    ],
    searchable: false,
  },
  {
    id: 'auth-sign-in',
    kind: 'link',
    title: 'Sign In',
    titleKey: 'sidebar.nav.authSignIn',
    href: '/sign-in',
  },
  {
    id: 'auth-sign-in-2',
    kind: 'link',
    title: 'Sign In (2 Col)',
    titleKey: 'sidebar.nav.authSignInTwoCol',
    href: '/sign-in-2',
  },
  {
    id: 'auth-sign-up',
    kind: 'link',
    title: 'Sign Up',
    titleKey: 'sidebar.nav.authSignUp',
    href: '/sign-up',
  },
  {
    id: 'auth-forgot-password',
    kind: 'link',
    title: 'Forgot Password',
    titleKey: 'sidebar.nav.authForgotPassword',
    href: '/forgot-password',
  },
  {
    id: 'auth-otp',
    kind: 'link',
    title: 'OTP',
    titleKey: 'sidebar.nav.authOtp',
    href: '/otp',
  },
]

export { authManifests }
