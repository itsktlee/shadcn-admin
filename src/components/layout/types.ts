import type {
  ResolvedNavCollapsible as NavCollapsible,
  ResolvedNavGroup as NavGroup,
  ResolvedNavItem as NavItem,
  ResolvedNavLink as NavLink,
  ShellTeam as Team,
  ShellUser as User,
} from '@/modules/types'

type SidebarData = {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
