import { useTranslation } from 'react-i18next'
import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  const { t } = useTranslation()

  return (
    <ContentSection
      title={t('settings.sections.account.title')}
      desc={t('settings.sections.account.desc')}
    >
      <AccountForm />
    </ContentSection>
  )
}
