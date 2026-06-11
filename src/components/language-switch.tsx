import { Check, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { normalizeLanguage, type AppLanguage } from '@/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languageOptions: AppLanguage[] = ['zh-CN', 'en']

export function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage)

  const labels: Record<AppLanguage, string> = {
    'zh-CN': t('settings.languageForm.languages.zhCN'),
    en: t('settings.languageForm.languages.en'),
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <Languages className='size-[1.2rem]' />
          <span className='sr-only'>{t('languageSwitch.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languageOptions.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => i18n.changeLanguage(language)}
          >
            {labels[language]}
            <Check
              size={14}
              className={cn(
                'ms-auto',
                currentLanguage !== language && 'hidden'
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
