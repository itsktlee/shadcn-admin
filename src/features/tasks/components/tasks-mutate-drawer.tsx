import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { labels, priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

function createTaskFormSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t('tasks.mutateDrawer.validation.titleRequired')),
    status: z
      .string()
      .min(1, t('tasks.mutateDrawer.validation.statusRequired')),
    label: z.string().min(1, t('tasks.mutateDrawer.validation.labelRequired')),
    priority: z
      .string()
      .min(1, t('tasks.mutateDrawer.validation.priorityRequired')),
  })
}

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const { t } = useTranslation()
  const isUpdate = !!currentRow
  const formSchema = createTaskFormSchema(t)
  type TaskForm = z.infer<typeof formSchema>

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
  })

  const onSubmit = (data: TaskForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {isUpdate
              ? t('tasks.mutateDrawer.updateTitle')
              : t('tasks.mutateDrawer.createTitle')}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? t('tasks.mutateDrawer.updateDesc')
              : t('tasks.mutateDrawer.createDesc')}{' '}
            {t('tasks.mutateDrawer.saveHint')}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tasks.actions.columns.title')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('tasks.mutateDrawer.titlePlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tasks.actions.columns.status')}</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('tasks.mutateDrawer.statusPlaceholder')}
                    items={statuses.map(({ labelKey, value }) => ({
                      label: t(labelKey),
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>{t('common.label')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      {labels.map((label) => (
                        <FormItem
                          key={label.value}
                          className='flex items-center'
                        >
                          <FormControl>
                            <RadioGroupItem value={label.value} />
                          </FormControl>
                          <FormLabel className='font-normal'>
                            {t(label.labelKey)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>{t('tasks.actions.columns.priority')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      {priorities
                        .filter(
                          (priority) =>
                            priority.value === 'high' ||
                            priority.value === 'medium' ||
                            priority.value === 'low'
                        )
                        .map((priority) => (
                          <FormItem
                            key={priority.value}
                            className='flex items-center'
                          >
                            <FormControl>
                              <RadioGroupItem value={priority.value} />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              {t(priority.labelKey)}
                            </FormLabel>
                          </FormItem>
                        ))}
                    </RadioGroup>
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
          <Button form='tasks-form' type='submit'>
            {t('tasks.mutateDrawer.saveChanges')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
