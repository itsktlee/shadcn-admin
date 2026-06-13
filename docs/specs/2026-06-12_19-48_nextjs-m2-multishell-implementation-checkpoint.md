# Spec: nextjs-m2-multishell-implementation-checkpoint

## Goal
- 要解决什么问题：在进入 `M2 - Multi-shell Layout` 编码前，把多壳层路由、dashboard 专属 provider 下沉点、最小占位页面策略和禁止事项收敛成一份可直接执行的 checkpoint。
- 最终目标：后续开始写 `M2` 代码时，不再临场决定“首页归哪一层”“auth/errors 要不要先做完整 UI”“search provider 这一轮到底算不算 M3”。
- 本轮核心目标：为 `M2` 建立实施前文件清单、壳层边界、最小验证路径和回退点。
- 验收结果：`M2` 已具备可直接进入编码的实施前 checkpoint。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m1-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_19-26_nextjs-m1-implementation-checkpoint.md)
- 本文不进入 `M3` 的 sidebar/header/search UI 迁移，只解决 `M2` 的多壳层边界和 provider 下沉。

## Done Contract
- 完成标准：
  - 三类壳层 `(auth) / (dashboard) / (errors)` 的 layout 结构已经定义清楚
  - dashboard 专属 provider 已明确只挂在 dashboard 壳下
  - 至少存在一条可访问的 auth、dashboard、errors 占位路径用于边界验收
- 证明方式：
  - 文件清单清晰
  - 布局职责清晰
  - 验证路径清晰
- 仍算未完成的情况：
  - 还需要实现时临场决定 `/` 属于哪层
  - search/layout/sidebar provider 责任仍然模糊
  - `M2` 和 `M3` 的边界仍有混叠

## Checkpoint Decisions

### 1. `/` 必须正式归属 `(dashboard)`
- `M1` 的 [app/page.tsx](/Users/ktlee/coding/shadcn-admin/app/page.tsx) 只是基础壳占位页
- 进入 `M2` 后，首页 `/` 必须迁入：
  - `app/(dashboard)/page.tsx`
- `M2` 实施时应删除：
  - `app/page.tsx`
- 原因：
  - 模板基线已锁定 dashboard shell 是默认受保护主壳
  - 继续把 `/` 留在 root，会导致 shell 边界长期模糊

### 2. auth shell 先做结构，不做完整视觉迁移
- 当前 Vite 的 auth 布局参考来自：
  - [src/features/auth/auth-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/auth-layout.tsx)
- 但 `M2` 不应直接完整迁入：
  - `Logo`
  - `LanguageSwitch`
  - 完整 auth 页面视觉对齐
- `M2` 的 auth shell 目标只应是：
  - 独立 layout
  - 居中内容容器
  - 与 dashboard 壳显著不同
- 原因：
  - 这些视觉和交互细节属于 `M3 - Shell Parity`

### 3. errors shell 先做路径与容器，不做真实错误流
- 当前 Vite 错误页参考来自：
  - [src/features/errors/not-found-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/not-found-error.tsx)
- `M2` 只需要：
  - 一个错误壳 layout
  - 至少一个错误占位页用于壳层验收
- `M2` 不做：
  - 真实 `not-found` / `error.tsx` 全链路接管
  - 跳转恢复逻辑
  - 完整多错误页复刻

### 4. dashboard provider 必须整体下沉到 `(dashboard)` layout
- 当前 Vite 的壳层 provider 组合参考来自：
  - [src/components/layout/authenticated-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/authenticated-layout.tsx)
- `M2` 后这些能力不允许继续停留在 root：
  - sidebar state
  - layout preference
  - search state
- 应新增统一装配层：
  - `src/providers/dashboard-providers.tsx`
- 原因：
  - root layout 只保留 M1 已有全局能力
  - dashboard 专属状态必须随 dashboard shell 一起装卸载

### 5. `SearchProvider` 在 M2 只保留“状态层”
- 当前 [src/context/search-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/search-provider.tsx) 会同时：
  - 管理 open state
  - 注册快捷键
  - 直接渲染 `CommandMenu`
- 这会把 `M3` 的搜索 UI 提前带进 `M2`
- 因此 `M2` 的决策是：
  - 保留 search state provider
  - 允许保留快捷键监听
  - 暂不挂载 `CommandMenu`
- 推荐拆分为：
  - `dashboard-search-provider.tsx`：状态与快捷键
  - `CommandMenu`：延后到 `M3`

### 6. `SidebarProvider` 可复用现有 UI 基础设施，但不提前挂真实 Sidebar UI
- 当前 [src/components/ui/sidebar.tsx](/Users/ktlee/coding/shadcn-admin/src/components/ui/sidebar.tsx) 已包含：
  - `SidebarProvider`
  - `SidebarInset`
  - sidebar 容器状态模型
- `M2` 可复用这套基础设施
- 但 `M2` 不应迁入：
  - `AppSidebar`
  - header
  - top nav
  - team switcher
- `M2` 只需要一个稳定的 dashboard 内容容器

## Exact File Scope For M2

### A. 本轮建议新建的文件
- `app/(auth)/layout.tsx`
- `app/(auth)/sign-in/page.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/page.tsx`
- `app/(errors)/layout.tsx`
- `app/(errors)/404/page.tsx`
- `src/providers/dashboard-providers.tsx`
- `src/providers/dashboard-layout-provider.tsx`
- `src/providers/dashboard-search-provider.tsx`

### B. 本轮建议删除或替换的文件
- `app/page.tsx`
  - 用 `app/(dashboard)/page.tsx` 取代首页归属

### C. 本轮作为来源参考、默认不直接动的文件
- [src/components/layout/authenticated-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/authenticated-layout.tsx)
- [src/context/layout-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/layout-provider.tsx)
- [src/context/search-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/search-provider.tsx)
- [src/features/auth/auth-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/auth-layout.tsx)
- [src/features/errors/not-found-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/not-found-error.tsx)
- [src/components/layout/app-sidebar.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/app-sidebar.tsx)
- [src/components/layout/header.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/header.tsx)

### D. 本轮明确不创建的文件
- `src/config/navigation.ts`
- `src/modules/registry.ts`
- `src/components/layout/app-sidebar-next.tsx`
- `src/components/layout/header-next.tsx`
- `app/(dashboard)/settings/**`
- `app/(dashboard)/users/**`
- `app/(dashboard)/tasks/**`
- `app/(auth)/sign-up/page.tsx`
- `app/(errors)/500/page.tsx`

## Route Group Contract

### `(dashboard)` 组
- 负责：
  - dashboard 主壳
  - dashboard 专属 provider 组合
  - `/` 首页占位
- 不负责：
  - auth guard 细节
  - sidebar/header 真实 UI
  - 模块注册

### `(auth)` 组
- 负责：
  - auth 独立外层容器
  - `/sign-in` 占位页
- 不负责：
  - Clerk / NextAuth / Lucia 接入
  - 完整登录流程
  - 右上角语言入口的最终样式

### `(errors)` 组
- 负责：
  - 独立错误页外层容器
  - `/404` 占位页
- 不负责：
  - `not-found.tsx` 真实兜底
  - `error.tsx`
  - 恢复按钮行为

## DashboardProviders Contract

### 组合顺序建议
1. `DashboardSearchProvider`
2. `DashboardLayoutProvider`
3. `SidebarProvider`

### 每层职责
- `DashboardSearchProvider`
  - 只维护 `open / setOpen`
  - 可保留快捷键监听
  - 不渲染 `CommandMenu`
- `DashboardLayoutProvider`
  - 迁移 `layout_variant / layout_collapsible`
  - 保持 cookie 持久化
  - 不负责视觉组件
- `SidebarProvider`
  - 使用现有 `src/components/ui/sidebar.tsx`
  - 在 `M2` 只负责状态和内容容器

### M2 阶段禁止
- 不在 `DashboardProviders` 内 import：
  - `AppSidebar`
  - `Header`
  - `CommandMenu`
  - `ConfigDrawer`

## Layout Contract

### `app/(dashboard)/layout.tsx`
- 必须包含：
  - `DashboardProviders`
  - `SkipToMain`
  - 稳定的 `main` 或 `SidebarInset` 内容容器
- 不包含：
  - 真实 sidebar nav
  - header
  - settings shell

### `app/(auth)/layout.tsx`
- 必须包含：
  - 独立居中容器
  - 与 dashboard 壳不同的外层结构
- 不包含：
  - dashboard provider
  - sidebar state
  - search state

### `app/(errors)/layout.tsx`
- 必须包含：
  - 极简错误容器
- 不包含：
  - dashboard provider
  - auth shell 装饰

## Recommended Execution Order

### Step 1. 建立三类 route group 目录
- 建：
  - `app/(auth)/`
  - `app/(dashboard)/`
  - `app/(errors)/`

### Step 2. 下沉 dashboard provider
- 新建：
  - `src/providers/dashboard-providers.tsx`
  - `src/providers/dashboard-layout-provider.tsx`
  - `src/providers/dashboard-search-provider.tsx`
- 迁移来源：
  - `src/context/layout-provider.tsx`
  - `src/context/search-provider.tsx`

### Step 3. 迁移首页归属
- 删除 `app/page.tsx`
- 改由 `app/(dashboard)/page.tsx` 承担 `/`

### Step 4. 补最小 auth/errors 占位页
- `app/(auth)/sign-in/page.tsx`
- `app/(errors)/404/page.tsx`

### Step 5. 做边界验收
- `/`
- `/sign-in`
- `/404`
- 三条路径外层结构明显不同

## Validation Contract

### 当用户批准命令验证后，优先验证这些
1. `pnpm build`
2. 打开 `/`
3. 打开 `/sign-in`
4. 打开 `/404`
5. 确认 auth/errors 页面未加载 dashboard 壳

### 静态验证要点
- root layout 未新增 dashboard provider
- dashboard provider 未泄漏到 auth/errors
- `app/page.tsx` 已被移除
- `CommandMenu` 未在 M2 挂载

## Rollback Checkpoints

### Checkpoint A
- route group 目录已建
- provider 还未下沉

### Checkpoint B
- dashboard provider 已下沉
- 首页还未迁入 `(dashboard)`

### Checkpoint C
- 三类 layout 都已建好
- 真实 shell UI 仍未进入

原则：
- 任何异常只回退到最近稳定点
- 不允许因为 auth 或 errors 占位页问题去推翻 dashboard provider 下沉策略

## Reverse Sync Candidate

### 本轮确定的长期事实
- `M2` 结束后，`/` 必须属于 `(dashboard)`，不能再留在 root
- `SearchProvider` 必须拆成状态层与命令面板 UI，两者分别归 `M2` / `M3`
- `M2` 的验收目标是壳层边界，不是视觉一致性

## Next Action
- 当前已经到达：`M2 实施前 checkpoint 完成`
- 下一步唯一正确动作：
  - 输出 M2 的最小代码实施方案
  - 等用户确认后，再真正开始写 `M2` 代码

## Reverse Sync

### 本轮已实际落地
- 已新增：
  - `app/(auth)/layout.tsx`
  - `app/(auth)/sign-in/page.tsx`
  - `app/(dashboard)/layout.tsx`
  - `app/(dashboard)/page.tsx`
  - `app/(errors)/layout.tsx`
  - `app/(errors)/404/page.tsx`
  - `src/providers/dashboard-providers.tsx`
  - `src/providers/dashboard-layout-provider.tsx`
  - `src/providers/dashboard-search-provider.tsx`
- 已修改：
  - `src/components/ui/sidebar.tsx`
  - `src/hooks/use-mobile.tsx`
  - `src/i18n/resources/en.ts`
  - `src/i18n/resources/zh-CN.ts`
  - `.gitignore`
- 已移除：
  - `app/page.tsx`

### 本轮保持未进入
- `AppSidebar`
- `Header`
- `CommandMenu`
- navigation config
- module registry
- auth guard
- settings shell
- 业务模块页面

### 当前验证状态
- 已完成：
  - route group 目录结构核对
  - `/` 已迁入 `(dashboard)` 的静态核对
  - dashboard provider 未回流 root 的静态核对
  - auth/errors 未挂 dashboard provider 的静态核对
  - `CommandMenu` 未在 M2 挂载的静态核对
  - `pnpm build`
- 未完成：
  - 浏览器路径验收：`/`、`/sign-in`、`/404`
- 当前剩余观察项：
  - `build` 期间仍有一条 “Next.js plugin was not detected in your ESLint configuration” warning，但不影响本轮通过

### 下一步
- 若继续推进当前里程碑：
  - 可先补三条路径的本地验收
  - 或直接进入 `M3 - Shell Parity`
