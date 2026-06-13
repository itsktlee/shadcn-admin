import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import type { ShellTeam, ShellUser } from '@/modules/types'

const shellUser: ShellUser = {
  name: 'Template Admin',
  email: 'admin@template.dev',
  avatar: '/images/shadcn-admin.png',
}

const shellTeams: ShellTeam[] = [
  {
    name: 'Template Workspace',
    logo: Command,
    plan: 'Next.js Template',
  },
  {
    name: 'Operations',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise',
    planKey: 'sidebar.teams.plans.enterprise',
  },
  {
    name: 'Sandbox',
    logo: AudioWaveform,
    plan: 'Startup',
    planKey: 'sidebar.teams.plans.startup',
  },
]

export { shellTeams, shellUser }
