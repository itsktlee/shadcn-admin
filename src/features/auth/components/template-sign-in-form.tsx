'use client'

import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, LogIn } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { signIn } from '@/services/auth/client'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type SignInFormValues = {
  email: string
  password: string
}

function TemplateSignInForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setSession } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const redirectTo = searchParams.get('redirect') || '/'
  const schema = z.object({
    email: z.email({
      error: (issue) =>
        issue.input === '' ? t('auth.signIn.errors.emailRequired') : undefined,
    }),
    password: z
      .string()
      .min(1, t('auth.signIn.errors.passwordRequired'))
      .min(7, t('auth.signIn.errors.passwordMin')),
  })

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true)
    const loadingId = toast.loading(t('auth.signIn.loading'))

    try {
      const session = await signIn(values)
      setSession(session)
      toast.success(t('auth.signIn.success', { email: values.email }), {
        id: loadingId,
      })
      router.replace(redirectTo)
      router.refresh()
    } catch {
      toast.error(t('common.error'), { id: loadingId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-3'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('auth.signIn.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('auth.signIn.passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t('auth.signIn.action')}
        </Button>
      </form>
    </Form>
  )
}

export { TemplateSignInForm }
