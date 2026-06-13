type ShellUser = {
  name: string
  email: string
  avatar: string
}

type ShellTeam = {
  name: string
  logo: React.ElementType
  plan: string
  planKey?: string
}

type BaseNavItem = {
  moduleId: string
  title: string
  titleKey?: string
  badge?: string
  icon?: React.ElementType
  permission?: string
}

type ResolvedNavLink = BaseNavItem & {
  url: string
  items?: never
}

type ResolvedNavCollapsible = BaseNavItem & {
  items: ResolvedNavLink[]
  url?: never
}

type ResolvedNavItem = ResolvedNavCollapsible | ResolvedNavLink

type ResolvedNavGroup = {
  id: string
  title: string
  titleKey?: string
  items: ResolvedNavItem[]
}

type BaseModuleManifest = {
  id: string
  title: string
  titleKey?: string
  badge?: string
  icon?: React.ElementType
  permission?: string
  searchable?: boolean
}

type LinkModuleManifest = BaseModuleManifest & {
  kind: 'link'
  href: string
  children?: never
}

type GroupModuleManifest = BaseModuleManifest & {
  kind: 'group'
  children: string[]
  href?: never
}

type ModuleManifest = LinkModuleManifest | GroupModuleManifest

type NavigationGroupConfig = {
  id: string
  title: string
  titleKey?: string
  items: string[]
}

export type {
  BaseNavItem,
  GroupModuleManifest,
  LinkModuleManifest,
  ModuleManifest,
  NavigationGroupConfig,
  ResolvedNavCollapsible,
  ResolvedNavGroup,
  ResolvedNavItem,
  ResolvedNavLink,
  ShellTeam,
  ShellUser,
}
