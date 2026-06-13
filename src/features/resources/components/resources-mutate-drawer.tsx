'use client'

import { z } from 'zod'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resource } from '@/contracts/resources'
import { isAdapterError } from '@/services/adapters'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { resourceCategoryOptions, resourceStatusOptions } from '../data/data'
import { useResourcesMutations } from '../hooks/use-resources-mutations'

type ResourceFormValues = {
  name: string
  slug: string
  owner: string
  category: string
  status: string
  description?: string
  tagsInput?: string
}

type ResourcesMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Resource
}

function createResourceFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().trim().min(1, t('resources.validation.nameRequired')),
    slug: z.string().trim().min(1, t('resources.validation.slugRequired')),
    owner: z.string().trim().min(1, t('resources.validation.ownerRequired')),
    category: z.string().min(1, t('resources.validation.categoryRequired')),
    status: z.string().min(1, t('resources.validation.statusRequired')),
    description: z.string().trim().max(500).optional().default(''),
    tagsInput: z.string().trim().optional().default(''),
  })
}

export function ResourcesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: ResourcesMutateDrawerProps) {
  const { t } = useTranslation()
  const isUpdate = !!currentRow
  const { createResourceMutation, updateResourceMutation } =
    useResourcesMutations()
  const formSchema = createResourceFormSchema(t)
  const defaultValues: ResourceFormValues = currentRow
    ? {
        name: currentRow.name,
        slug: currentRow.slug,
        owner: currentRow.owner,
        category: currentRow.category,
        status: currentRow.status,
        description: currentRow.description ?? '',
        tagsInput: stringifyTags(currentRow.tags),
      }
    : {
        name: '',
        slug: '',
        owner: '',
        category: '',
        status: 'draft',
        description: '',
        tagsInput: '',
      }

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (values: ResourceFormValues) => {
    form.clearErrors()

    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      owner: values.owner.trim(),
      category: values.category as Resource['category'],
      status: values.status as Resource['status'],
      description: values.description?.trim()
        ? values.description.trim()
        : undefined,
      tags: parseTags(values.tagsInput),
    }

    const mutationPromise = isUpdate
      ? updateResourceMutation.mutateAsync({
          id: currentRow.id,
          input: payload,
        })
      : createResourceMutation.mutateAsync(payload)

    const loadingMessage = isUpdate
      ? t('resources.dialogs.update.loading')
      : t('resources.dialogs.create.loading')
    const successMessage = isUpdate
      ? t('resources.dialogs.update.success')
      : t('resources.dialogs.create.success')
    const toastId = toast.loading(loadingMessage)

    try {
      await mutationPromise
      toast.success(successMessage, { id: toastId })

      onOpenChange(false)
      form.reset(defaultValues)
    } catch (error) {
      toast.error(
        isAdapterError(error) ? error.apiError.message : t('common.error'),
        { id: toastId }
      )

      if (isAdapterError(error)) {
        applyFieldErrors(form, error.apiError.fields)
      }
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value)
        form.reset(defaultValues)
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {isUpdate
              ? t('resources.dialogs.update.title')
              : t('resources.dialogs.create.title')}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? t('resources.dialogs.update.desc')
              : t('resources.dialogs.create.desc')}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='resources-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('resources.columns.name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('resources.dialogs.placeholders.name')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('resources.fields.slug')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('resources.dialogs.placeholders.slug')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='owner'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('resources.columns.owner')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('resources.dialogs.placeholders.owner')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('resources.columns.category')}</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      isControlled
                      placeholder={t('resources.dialogs.placeholders.category')}
                      items={resourceCategoryOptions.map((item) => ({
                        label: t(item.labelKey),
                        value: item.value,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('resources.columns.status')}</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      isControlled
                      placeholder={t('resources.dialogs.placeholders.status')}
                      items={resourceStatusOptions.map((item) => ({
                        label: t(item.labelKey),
                        value: item.value,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='tagsInput'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('resources.columns.tags')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('resources.dialogs.placeholders.tags')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('resources.fields.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder={t(
                        'resources.dialogs.placeholders.description'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>{t('common.close')}</Button>
          </SheetClose>
          <Button
            form='resources-form'
            type='submit'
            disabled={
              createResourceMutation.isPending ||
              updateResourceMutation.isPending
            }
          >
            {t('resources.dialogs.save')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function parseTags(value?: string) {
  if (!value) {
    return []
  }

  return Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  )
}

function stringifyTags(tags: string[]) {
  return tags.join(', ')
}

function applyFieldErrors(
  form: UseFormReturn<ResourceFormValues>,
  fields?: Record<string, string[]>
) {
  if (!fields) {
    return
  }

  Object.entries(fields).forEach(([key, messages]) => {
    const message = messages[0]

    if (!message) {
      return
    }

    const fieldName = (
      key === 'tags' ? 'tagsInput' : key
    ) as keyof ResourceFormValues
    form.setError(fieldName, {
      type: 'server',
      message,
    })
  })
}
