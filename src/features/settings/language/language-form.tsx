import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { normalizeLanguage } from '@/i18n'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type LanguageFormValues = {
  language: 'zh-CN' | 'en'
}

export function LanguageForm() {
  const { t, i18n } = useTranslation()
  const languageFormSchema = z.object({
    language: z.enum(['zh-CN', 'en'], {
      error: () => t('settings.languageForm.errors.languageRequired'),
    }),
  })

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      language: normalizeLanguage(i18n.resolvedLanguage),
    },
  })

  useEffect(() => {
    form.setValue('language', normalizeLanguage(i18n.resolvedLanguage))
  }, [form, i18n.resolvedLanguage])

  async function onSubmit(data: LanguageFormValues) {
    await i18n.changeLanguage(data.language)
    showSubmittedData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='space-y-4'>
              <div className='space-y-1'>
                <FormLabel>{t('settings.languageForm.language')}</FormLabel>
                <FormDescription>
                  {t('settings.languageForm.languageDesc')}
                </FormDescription>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className='grid max-w-md gap-3'
                >
                  {[
                    {
                      value: 'zh-CN',
                      title: t('settings.languageForm.languages.zhCN'),
                    },
                    {
                      value: 'en',
                      title: t('settings.languageForm.languages.en'),
                    },
                  ].map((option) => (
                    <FormItem key={option.value}>
                      <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                        <FormControl>
                          <RadioGroupItem
                            value={option.value}
                            className='sr-only'
                          />
                        </FormControl>
                        <div className='rounded-md border-2 border-muted p-4 hover:border-accent'>
                          <div className='font-medium'>{option.title}</div>
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription>
                {t('settings.languageForm.languageHint')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>{t('settings.languageForm.submit')}</Button>
      </form>
    </Form>
  )
}
