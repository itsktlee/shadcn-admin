import type { ReactNode } from 'react'

export default function ErrorsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className='flex min-h-svh items-center justify-center bg-muted/10 px-6 py-12'>
      <div className='w-full max-w-xl'>{children}</div>
    </div>
  )
}
