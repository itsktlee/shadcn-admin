export const fonts = ['inter', 'manrope', 'system'] as const

export type AppFont = (typeof fonts)[number]

export const DEFAULT_FONT: AppFont = 'system'

export function isFont(value?: string | null): value is AppFont {
  return Boolean(value && fonts.includes(value as AppFont))
}
