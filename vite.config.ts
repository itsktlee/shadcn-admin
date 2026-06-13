/// <reference types="vitest/config" />
import { execSync } from 'node:child_process'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { playwright } from '@vitest/browser-playwright'

type VitestBrowserName = 'chromium' | 'firefox' | 'webkit'

type VitestBrowserRuntime = {
  browser: VitestBrowserName
  channel?: string
}

const macBrowserBundleToRuntime: Array<{
  matcher: RegExp
  runtime: VitestBrowserRuntime
}> = [
  {
    matcher: /^com\.microsoft\.edgemac$/i,
    runtime: {
      browser: 'chromium',
      channel: 'msedge',
    },
  },
  {
    matcher: /^com\.google\.chrome(?:\..+)?$/i,
    runtime: {
      browser: 'chromium',
      channel: 'chrome',
    },
  },
]

function parseMacDefaultBrowserBundleId(input: string) {
  const blocks = input.split(/\n\s*}\s*,?/g)
  const preferredBlock =
    blocks.find((block) => block.includes('LSHandlerURLScheme = https;')) ??
    blocks.find((block) =>
      block.includes('LSHandlerContentType = "com.apple.default-app.web-browser";')
    ) ??
    blocks.find((block) => block.includes('LSHandlerContentType = "public.html";'))

  return preferredBlock?.match(/LSHandlerRoleAll = "([^"]+)";/)?.[1] ?? null
}

function detectMacDefaultBrowserBundleId() {
  if (process.platform !== 'darwin') {
    return null
  }

  try {
    return parseMacDefaultBrowserBundleId(
      execSync(
        'defaults read com.apple.LaunchServices/com.apple.launchservices.secure LSHandlers',
        {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }
      )
    )
  } catch {
    return null
  }
}

function resolveVitestBrowserRuntime(): VitestBrowserRuntime {
  const explicitBrowser = process.env.VITEST_BROWSER_INSTANCE?.trim()
  const explicitChannel = process.env.VITEST_BROWSER_CHANNEL?.trim()

  if (explicitBrowser === 'firefox' || explicitBrowser === 'webkit') {
    return { browser: explicitBrowser }
  }

  if (explicitBrowser === 'chromium') {
    return {
      browser: 'chromium',
      channel: explicitChannel || undefined,
    }
  }

  if (explicitChannel) {
    return {
      browser: 'chromium',
      channel: explicitChannel,
    }
  }

  const defaultBundleId = detectMacDefaultBrowserBundleId()

  return (
    macBrowserBundleToRuntime.find(({ matcher }) =>
      matcher.test(defaultBundleId ?? '')
    )?.runtime ?? {
      browser: 'chromium',
    }
  )
}

function isVitestProcess() {
  if (process.env.VITEST === 'true' || process.env.VITEST === '1') {
    return true
  }

  if (process.env.NODE_ENV === 'test') {
    return true
  }

  return process.argv.some((arg) => /\bvitest\b/i.test(arg))
}

function shouldEnableTanstackRouterPlugin() {
  const explicit = process.env.VITEST_ENABLE_TANSTACK_ROUTER_PLUGIN?.trim()

  if (explicit === 'true' || explicit === '1') {
    return true
  }

  return !isVitestProcess()
}

const vitestBrowserRuntime = resolveVitestBrowserRuntime()
const vitestBrowserProvider = playwright(
  vitestBrowserRuntime.browser === 'chromium' && vitestBrowserRuntime.channel
    ? {
        launchOptions: {
          channel: vitestBrowserRuntime.channel,
        },
      }
    : undefined
)

const plugins = [react()]

if (shouldEnableTanstackRouterPlugin()) {
  plugins.unshift(
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    })
  )
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    silent: 'passed-only',
    unstubEnvs: true,
    browser: {
      enabled: true,
      provider: vitestBrowserProvider,
      instances: [{ browser: vitestBrowserRuntime.browser }],
    },
    coverage: {
      // include: ['src/**/*.{js,jsx,ts,tsx}'], // Uncomment to expand the report to all src/**/* so untested modules appear as 0% coverage.
      exclude: [
        'src/components/ui/**',
        'src/assets/**',
        'src/tanstack-table.d.ts',
        'src/routeTree.gen.ts',
        'src/test-utils/**',
        'src/routes/**',
      ],
    },
  },
})
