/* eslint-disable react-refresh/only-export-components */
/**
 * Legacy Vite entry retained only as a retired reference surface.
 * The active template runtime is Next.js App Router via `pnpm dev`.
 */
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'

function LegacyReferenceEntry() {
  return (
    <main className='min-h-svh bg-background px-6 py-12 text-foreground sm:px-10 lg:px-16'>
      <div className='mx-auto flex max-w-4xl flex-col gap-6'>
        <section className='rounded-xl border border-orange-500/25 bg-orange-50/90 p-5 text-orange-950 shadow-sm dark:border-orange-400/25 dark:bg-orange-950/70 dark:text-orange-100'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em]'>
            Legacy Reference Entry
          </p>
          <h1 className='mt-2 text-2xl font-semibold tracking-tight sm:text-3xl'>
            This Vite runtime has been retired.
          </h1>
          <p className='mt-3 max-w-3xl text-sm leading-6 text-orange-900/85 dark:text-orange-100/85'>
            The active template application now runs through Next.js App Router.
            This page remains only to mark the old Vite entry as reference
            material and to prevent future work from treating it as a second live
            application.
          </p>
        </section>

        <section className='grid gap-4 md:grid-cols-[1.2fr_0.8fr]'>
          <article className='rounded-xl border bg-card p-5 shadow-sm'>
            <h2 className='text-lg font-semibold tracking-tight'>Use this instead</h2>
            <div className='mt-4 rounded-lg border bg-muted/40 p-4'>
              <p className='text-sm text-muted-foreground'>
                Active development entry
              </p>
              <code className='mt-2 block text-sm font-medium'>pnpm dev</code>
            </div>
            <ul className='mt-4 space-y-2 text-sm text-muted-foreground'>
              <li>- Active runtime: Next.js App Router under `app/**`</li>
              <li>- Active auth/session chain: `src/providers/**` + `src/services/auth/**`</li>
              <li>- Active navigation/permission chain: module manifests + middleware</li>
            </ul>
          </article>

          <article className='rounded-xl border bg-card p-5 shadow-sm'>
            <h2 className='text-lg font-semibold tracking-tight'>Still retained</h2>
            <ul className='mt-4 space-y-2 text-sm text-muted-foreground'>
              <li>- `src/main.tsx` retired notice entry itself</li>
              <li>- selected legacy feature files kept as visual or migration references</li>
            </ul>
            <p className='mt-4 text-sm text-muted-foreground'>
              Those files are still present in the repository, but this entry no
              longer executes any retired route-tree runtime.
            </p>
          </article>
        </section>

        <section className='rounded-xl border bg-card p-5 shadow-sm'>
          <h2 className='text-lg font-semibold tracking-tight'>Why this page exists</h2>
          <p className='mt-3 text-sm leading-6 text-muted-foreground'>
            Earlier migration stages kept the old Vite route tree executable for
            reference. That was useful during the transition, but it also left the
            repository with two runnable entry points. This page closes that gap:
            the legacy source remains available, while the legacy runtime itself is
            explicitly retired.
          </p>
        </section>
      </div>
    </main>
  )
}

const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <LegacyReferenceEntry />
    </StrictMode>
  )
}
