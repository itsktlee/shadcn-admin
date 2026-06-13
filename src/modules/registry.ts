import { appsManifest } from '@/features/apps/manifest'
import { authManifests } from '@/features/auth/manifest'
import { chatsManifest } from '@/features/chats/manifest'
import { dashboardManifest } from '@/features/dashboard/manifest'
import { errorManifests } from '@/features/errors/manifest'
import { helpCenterManifest } from '@/features/help-center/manifest'
import { resourcesManifest } from '@/features/resources/manifest'
import { settingsManifests } from '@/features/settings/manifest'
import { tasksManifest } from '@/features/tasks/manifest'
import { usersManifest } from '@/features/users/manifest'
import { isTemplateModuleEnabled } from '@/config/template-modules'
import type { ModuleManifest } from './types'

const registeredModules: ModuleManifest[] = [
  dashboardManifest,
  ...(isTemplateModuleEnabled('resources') ? [resourcesManifest] : []),
  tasksManifest,
  appsManifest,
  chatsManifest,
  usersManifest,
  ...authManifests,
  ...errorManifests,
  ...settingsManifests,
  helpCenterManifest,
]

const registeredModuleMap = new Map(
  registeredModules.map((manifest) => [manifest.id, manifest])
)

function getModuleManifest(id: string) {
  return registeredModuleMap.get(id)
}

export { getModuleManifest, registeredModuleMap, registeredModules }
