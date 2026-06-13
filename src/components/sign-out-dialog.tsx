'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { signOut } from '@/services/auth/client'
import { useAuth } from '@/providers/auth-provider'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setSession } = useAuth()
  const { t } = useTranslation()

  const handleSignOut = () => {
    signOut()
    setSession(null)
    const currentQuery = searchParams.toString()
    const currentPath = currentQuery ? `${pathname}?${currentQuery}` : pathname
    router.replace(`/sign-in?redirect=${encodeURIComponent(currentPath)}`)
    router.refresh()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('signOutDialog.title')}
      desc={t('signOutDialog.desc')}
      confirmText={t('signOutDialog.confirm')}
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
