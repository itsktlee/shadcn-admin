import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'

function LegacyRouteRuntimeNotice() {
  return (
    <div className='fixed inset-x-3 top-3 z-[1000] rounded-lg border border-orange-500/25 bg-orange-50/95 px-3 py-2 text-xs font-medium text-orange-900 shadow-lg backdrop-blur dark:border-orange-400/25 dark:bg-orange-950/85 dark:text-orange-100'>
      Legacy TanStack Router reference runtime. Active template runtime uses
      Next.js App Router via <code className='rounded bg-black/8 px-1 py-0.5 dark:bg-white/12'>pnpm dev</code>.
    </div>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <LegacyRouteRuntimeNotice />
        <Outlet />
        <Toaster duration={5000} />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
