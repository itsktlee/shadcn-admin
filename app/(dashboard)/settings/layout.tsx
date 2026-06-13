import type { ReactNode } from 'react'
import { Settings } from '@/features/settings'

export default function SettingsLayout({
  children,
}: {
  children: ReactNode
}) {
  return <Settings>{children}</Settings>
}
