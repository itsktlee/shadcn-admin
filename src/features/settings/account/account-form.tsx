import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
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
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/date-picker'

type AccountFormValues = {
  name: string
  dob: Date
}

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
}

export function AccountForm() {
  const { t } = useTranslation()
  const accountFormSchema = z.object({
    name: z
      .string()
      .min(1, t('settings.accountForm.errors.nameRequired'))
      .min(2, t('settings.accountForm.errors.nameMin'))
      .max(30, t('settings.accountForm.errors.nameMax')),
    dob: z.date(t('settings.accountForm.errors.dobRequired')),
  })
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.accountForm.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('settings.accountForm.namePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('settings.accountForm.nameDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('settings.accountForm.dob')}</FormLabel>
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormDescription>{t('settings.accountForm.dobDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('settings.accountForm.submit')}</Button>
      </form>
    </Form>
  )
}
