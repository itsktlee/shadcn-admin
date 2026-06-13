# Spec: nextjs-m3-shell-parity-implementation-checkpoint

## Goal
- 要解决什么问题：在真正开始 `M3 - Shell Parity` 编码前，把 Next 版 dashboard shell 需要迁入的视觉与交互壳边界、临时占位策略、Next 路由适配方式和视觉验收要求锁成一份实施前 checkpoint。
- 最终目标：后续进入 `M3` 编码时，不再临场决定“哪些组件直接迁”“哪些链接先占位”“TanStack Router 依赖怎么替成 Next”“视觉验收做到什么程度才算过”。
- 本轮核心目标：形成可直接指导 M3 编码执行的文件清单、边界、验证标准和禁止事项。
- 验收结果：`M3` 已具备可直接进入编码的实施前 checkpoint。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m2-multishell-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_19-48_nextjs-m2-multishell-implementation-checkpoint.md)
- 本文只解决 `M3` 的 shell parity，不进入 `M4` 的导航配置化和模块注册体系。

## Done Contract
- 完成标准：
  - dashboard shell 已具备与当前 Vite 模板一致的主要外观和交互入口
  - sidebar、header、theme switch、language switch、search 入口、settings shell 在 Next 下都可用
  - 至少一组 dashboard 常用路径和 settings 子路径可用于真实视觉验收
- 证明方式：
  - `pnpm build` 通过
  - 内置浏览器视觉验收通过
  - sidebar / header / theme / language / search / settings shell 的关键交互有证据
- 仍算未完成的情况：
  - 只是“看起来差不多”，但交互方式不一致
  - 代码没报错，但没做浏览器视觉验收
  - 壳层已经迁入，却把导航配置化、模块注册或 reference module 也提前卷进来

## Checkpoint Decisions

### 1. `M3` 仍使用临时静态导航源，不提前进入 `M4`
- 当前视觉来源仍以：
  - [src/components/layout/data/sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts)
- `M3` 可以继续使用这份静态数据做 shell parity
- `M3` 不做：
  - navigation config
  - module manifest
  - registry
- 原因：
  - `M4` 已明确承担“配置驱动导航 + 完整模块注册”
  - 如果在 `M3` 提前抽象，会把壳层迁移和架构治理混成一轮

### 2. Shell 组件中的 TanStack Router 依赖要直接改成 Next 路由原语
- 当前这些组件仍依赖 `@tanstack/react-router`：
  - [src/components/layout/nav-group.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/nav-group.tsx)
  - [src/components/profile-dropdown.tsx](/Users/ktlee/coding/shadcn-admin/src/components/profile-dropdown.tsx)
  - [src/features/settings/components/sidebar-nav.tsx](/Users/ktlee/coding/shadcn-admin/src/features/settings/components/sidebar-nav.tsx)
  - [src/components/command-menu.tsx](/Users/ktlee/coding/shadcn-admin/src/components/command-menu.tsx)
- `M3` 的决策是：
  - 在 shell 组件内直接切到 `next/link`、`usePathname`、`useRouter`
  - 不为 `M3` 再造一层“router adapter abstraction”
- 原因：
  - 这些组件已经属于 Next 母模板的壳层资产
  - 为过渡期再做一层适配器，会增加一次无必要的中间态

### 3. `M3` 允许用壳层占位页承接 sidebar/settings 路由
- `M3` 的目标是 shell parity，不是业务模块迁移
- 因此允许新增一组 dashboard 壳内占位页，例如：
  - `/tasks`
  - `/apps`
  - `/chats`
  - `/users`
  - `/help-center`
  - `/settings`
  - `/settings/account`
  - `/settings/language`
  - `/settings/appearance`
  - `/settings/notifications`
  - `/settings/display`
- 这些页面在 `M3` 只承担：
  - 壳层可点击路径
  - 顶栏结构
  - settings 子导航结构
- 不承担：
  - 真正列表/CRUD 内容
  - 真正表单逻辑

### 4. `CommandMenu` 在 M3 正式回归 dashboard 壳
- `M2` 故意只保留 `DashboardSearchProvider` 状态层
- `M3` 必须恢复：
  - `Search` 触发器
  - `CommandMenu` 弹层
  - 快捷键打开行为
- 但仍可临时继续依赖静态 `sidebar-data`
- 原因：
  - 搜索入口本来就是可感知 shell 交互的一部分
  - 它属于 `M3`，不属于 `M4`

### 5. `ConfigDrawer`、`ThemeSwitch`、`LanguageSwitch` 要改接 Next 版 provider
- 当前这些组件还指向旧 context：
  - [src/components/config-drawer.tsx](/Users/ktlee/coding/shadcn-admin/src/components/config-drawer.tsx)
  - [src/components/theme-switch.tsx](/Users/ktlee/coding/shadcn-admin/src/components/theme-switch.tsx)
  - [src/components/language-switch.tsx](/Users/ktlee/coding/shadcn-admin/src/components/language-switch.tsx)
- `M3` 必须统一改接：
  - `src/providers/theme-provider.tsx`
  - `src/providers/direction-provider.tsx`
  - `src/providers/dashboard-layout-provider.tsx`
  - `src/providers/dashboard-search-provider.tsx`
- 原则：
  - 不再回头使用 `src/context/*`
  - 旧 Vite context 继续只作为 reference source

### 6. `Header` 和 `Main` 的最终 owner 要明确
- dashboard 外层 owner：
  - `app/(dashboard)/layout.tsx`
  - 负责 `AppSidebar`、`CommandMenu`、`SidebarInset`
- dashboard 页面 owner：
  - 页面或页面级 shell
  - 负责 `Header`、`Main`、页面标题、页面主体
- settings shell owner：
  - `app/(dashboard)/settings/layout.tsx`
  - 负责设置页二级导航和统一顶栏
- 原因：
  - 如果把 `Header` 提到 `(dashboard)/layout.tsx`，后续不同页面的顶栏内容会被卡死

### 7. 浏览器视觉验收从本轮开始成为强制验证门
- 用户已明确要求：
  - 以后实施完、改动完前端代码后，必须调用内置浏览器做视觉验收
- 因此从 `M3` 起：
  - 静态检查和 `pnpm build` 只算技术验收
  - 不调用内置浏览器做视觉验收，不算完整完成
- 视觉验收默认使用：
  - Browser 插件 / Codex 内置浏览器
- 除非用户明确换工具，否则不改用别的浏览器工具

## Exact File Scope For M3

### A. 本轮建议修改的 shell 组件
- `src/components/layout/app-sidebar.tsx`
- `src/components/layout/nav-group.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/team-switcher.tsx`
- `src/components/theme-switch.tsx`
- `src/components/language-switch.tsx`
- `src/components/search.tsx`
- `src/components/command-menu.tsx`
- `src/components/config-drawer.tsx`
- `src/components/profile-dropdown.tsx`
- `src/components/layout/main.tsx`
- `src/features/settings/components/sidebar-nav.tsx`
- `src/components/layout/data/sidebar-data.ts`

### B. 本轮建议修改的 app 路由文件
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/page.tsx`

### C. 本轮建议新建的路由文件
- `app/(dashboard)/tasks/page.tsx`
- `app/(dashboard)/apps/page.tsx`
- `app/(dashboard)/chats/page.tsx`
- `app/(dashboard)/users/page.tsx`
- `app/(dashboard)/help-center/page.tsx`
- `app/(dashboard)/settings/layout.tsx`
- `app/(dashboard)/settings/page.tsx`
- `app/(dashboard)/settings/account/page.tsx`
- `app/(dashboard)/settings/language/page.tsx`
- `app/(dashboard)/settings/appearance/page.tsx`
- `app/(dashboard)/settings/notifications/page.tsx`
- `app/(dashboard)/settings/display/page.tsx`

### D. 本轮明确不做的文件或领域
- `src/config/navigation.ts`
- `src/modules/registry.ts`
- `src/contracts/**`
- `src/services/**`
- reference CRUD 页面
- auth guard bridge
- permission resolver
- 真正业务表格和真实表单内容迁移

## Route Contract

### dashboard 壳内必须具备的最小可视路径
- `/`
- `/tasks`
- `/apps`
- `/chats`
- `/users`
- `/help-center`
- `/settings`
- `/settings/account`
- `/settings/language`
- `/settings/appearance`
- `/settings/notifications`
- `/settings/display`

### `M3` 对这些路径的要求
- 必须能进入
- 必须能看到统一 dashboard 壳
- 必须能看到对应的 sidebar active 状态
- 允许页面主体仍是 placeholder

## Shell Composition Contract

### `app/(dashboard)/layout.tsx` 在 M3 必须包含
- `DashboardProviders`
- `AppSidebar`
- `CommandMenu`
- `SidebarInset`

### 但 `app/(dashboard)/layout.tsx` 仍不应包含
- 页面标题文案
- 页面级 search placeholder 文案
- settings 子导航
- 具体页面主体内容

### 页面级顶栏建议统一包含
- `Search`
- `LanguageSwitch`
- `ThemeSwitch`
- `ConfigDrawer`
- `ProfileDropdown`

## Settings Shell Contract

### `settings` 在 M3 的目标
- 恢复当前 Vite 设置页的信息结构
- 恢复设置页二级导航
- 恢复设置页顶栏入口组合

### `settings` 在 M3 不做
- 真实表单迁移
- 所有设置项逻辑完全可用
- 与 reference form 的数据提交行为对齐

### 推荐策略
- 用独立 `settings/layout.tsx` 承接：
  - `Header`
  - `Main`
  - settings sidebar nav
- 各子页先放 placeholder 或极简内容

## Recommended Execution Order

### Step 1. 迁移 dashboard 壳层骨架
- 在 `app/(dashboard)/layout.tsx` 接上：
  - `AppSidebar`
  - `CommandMenu`
  - `SidebarInset`

### Step 2. 迁移顶栏入口组件
- 先恢复：
  - `Header`
  - `Search`
  - `ThemeSwitch`
  - `LanguageSwitch`
  - `ConfigDrawer`
  - `ProfileDropdown`

### Step 3. 迁移 sidebar 结构
- 迁移：
  - `AppSidebar`
  - `NavGroup`
  - `TeamSwitcher`
  - `NavUser`
- 同步把 TanStack Router 依赖替成 Next 路由原语

### Step 4. 补 dashboard 壳内占位页
- 先让 sidebar 主入口都可访问

### Step 5. 迁移 settings shell
- 建 `settings/layout.tsx`
- 建最小 settings 子页占位路径

### Step 6. 做浏览器视觉验收
- 使用内置浏览器打开关键路径
- 做桌面态优先验收
- 必要时补一轮窄宽度或移动态验收

## Validation Contract

### 技术验收
1. `pnpm build`

### 视觉验收
必须使用内置浏览器执行，至少覆盖：
1. `/`
2. `/settings`
3. `/settings/language`

### 浏览器验收项
- sidebar 展开 / 收起
- sidebar active 状态
- header sticky 和滚动阴影
- search 入口点击与快捷键打开
- theme 切换
- language 切换
- settings 二级导航
- auth / errors 页面未误加载 dashboard 壳

### 本轮不接受的“完成”
- 只看 build 通过
- 只截图首页
- 只在一个路径上看过壳层

## Rollback Checkpoints

### Checkpoint A
- dashboard layout 已接入 sidebar inset
- sidebar/header 还没完全恢复

### Checkpoint B
- sidebar 和 header 已恢复
- settings shell 还没迁入

### Checkpoint C
- settings shell 已恢复
- 浏览器视觉验收还未执行

原则：
- 出问题只回退到最近稳定点
- 不允许因为某个设置子页未完成，就推翻整个 M3 的 dashboard shell 迁移

## Reverse Sync Candidate

### 本轮确定的长期事实
- `M3` 允许用 placeholder routes 承接壳层导航，不等于提前进入模块迁移
- shell 组件中的路由能力应直接切到 Next 原语，不再围绕 TanStack Router 做过渡层
- 从 `M3` 起，前端代码改动后的内置浏览器视觉验收是强制验证门

## Next Action
- 当前已经到达：`M3 实施前 checkpoint 完成`
- 下一步唯一正确动作：
  - 输出 M3 的最小代码实施方案
  - 等用户确认后，再真正开始写 `M3` 代码

## Implementation Result

### 已落地范围
- dashboard 外层已在 [app/(dashboard)/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/layout.tsx) 接入：
  - `DashboardProviders`
  - `AppSidebar`
  - `CommandMenu`
  - `SidebarInset`
- 壳层入口组件已切到 Next 原语 / 新 provider：
  - [src/components/layout/app-sidebar.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/app-sidebar.tsx)
  - [src/components/layout/nav-group.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/nav-group.tsx)
  - [src/components/search.tsx](/Users/ktlee/coding/shadcn-admin/src/components/search.tsx)
  - [src/components/command-menu.tsx](/Users/ktlee/coding/shadcn-admin/src/components/command-menu.tsx)
  - [src/components/config-drawer.tsx](/Users/ktlee/coding/shadcn-admin/src/components/config-drawer.tsx)
  - [src/components/theme-switch.tsx](/Users/ktlee/coding/shadcn-admin/src/components/theme-switch.tsx)
  - [src/components/language-switch.tsx](/Users/ktlee/coding/shadcn-admin/src/components/language-switch.tsx)
  - [src/components/profile-dropdown.tsx](/Users/ktlee/coding/shadcn-admin/src/components/profile-dropdown.tsx)
  - [src/components/sign-out-dialog.tsx](/Users/ktlee/coding/shadcn-admin/src/components/sign-out-dialog.tsx)
- settings 壳与 settings 子页已正式接入 Next：
  - [app/(dashboard)/settings/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/settings/layout.tsx)
  - `/settings`
  - `/settings/account`
  - `/settings/language`
  - `/settings/appearance`
  - `/settings/notifications`
  - `/settings/display`
- 为避免 sidebar / command menu 出现死链接，已补齐一批可访问占位路由：
  - dashboard：`/tasks` `/apps` `/chats` `/users` `/help-center`
  - clerk：`/clerk/sign-in` `/clerk/sign-up` `/clerk/user-management`
  - auth：`/sign-in-2` `/sign-up` `/forgot-password` `/otp`
  - errors：`/errors/unauthorized` `/errors/forbidden` `/errors/not-found` `/errors/internal-server-error` `/errors/maintenance-error`
- 为支持 M3 的页面级一致性，新增共享壳层组件：
  - [src/features/multishell/dashboard-page-shell.tsx](/Users/ktlee/coding/shadcn-admin/src/features/multishell/dashboard-page-shell.tsx)
  - [src/features/multishell/module-placeholder-page.tsx](/Users/ktlee/coding/shadcn-admin/src/features/multishell/module-placeholder-page.tsx)
  - [src/features/multishell/auth-placeholder-page.tsx](/Users/ktlee/coding/shadcn-admin/src/features/multishell/auth-placeholder-page.tsx)
  - [src/features/multishell/error-placeholder-page.tsx](/Users/ktlee/coding/shadcn-admin/src/features/multishell/error-placeholder-page.tsx)

### 与原 checkpoint 的偏差
- 原 checkpoint 里把 settings 子页定义成“可占位”，本轮实际直接接入了现有 settings 表单组件。
- 原 checkpoint 没显式要求补 `clerk` / `auth` / `errors` 的示例路径；本轮补上是为了让现有 sidebar 数据和 command menu 在 M3 阶段保持可点击闭环。

### 验证证据
- 技术验收：
  - `pnpm build` 已两次通过；当前仍有一个既存 warning：`The Next.js plugin was not detected in your ESLint configuration`
- 内置浏览器验收：
  - `/`：确认 dashboard 壳、sidebar、header 入口和命令菜单挂载存在
  - `/settings`：确认 settings 二级导航和 profile 页主体已加载
  - `/settings/language`：确认 settings 二级导航 active 正常，且已实际切换 `English -> 中文`
  - `/sign-in-2`：确认 auth 壳独立存在，未误加载 dashboard sidebar
  - `/errors/unauthorized`：确认 errors 壳独立存在，未误加载 dashboard sidebar
  - dashboard 主题按钮已实际切到暗色，`document.documentElement.className` 含 `dark`，`colorScheme` 为 `dark`
- 视觉验收过程中发现并修复：
  - 头像资源原先指向不存在的 `/avatars/*`
  - 现已统一改到仓库内真实存在的 `/images/shadcn-admin.png`

### 当前结论
- `M3 - Shell Parity` 已达到可交付状态
- 后续可以进入：
  - `M4` 导航配置化
  - module registry
  - reference module / CRUD / contract / service / auth guard / permission
