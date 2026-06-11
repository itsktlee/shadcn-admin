import { toast } from 'sonner'
import i18n from '@/i18n'

export function showSubmittedData(
  data: unknown,
  title: string = i18n.t('feedback.submittedValues')
) {
  toast.message(title, {
    description: (
      <pre className='mt-2 w-full overflow-x-auto rounded-md border bg-card p-4 text-card-foreground'>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
  })
}
