# Spec: nextjs-m8-auth-permission-implementation-checkpoint

## Goal
- 要解决什么问题：让 Next 模板从“只有壳和 CRUD”进入“具备受保护页面与动作级裁剪”的可复用基线。
- 最终目标：模板 shell 不绑定具体 auth SDK，但已经具备 session、guard、permission resolver、导航裁剪和动作裁剪的稳定接法。
- 本轮核心目标：完成 `M8 - Auth + Permission Baseline` 的最小闭环。
- 验收结果：dashboard 路由已受保护，`resources` 动作已按权限裁剪，导航与命令面板也开始消费统一 permission resolver。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m7-reference-crud-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_22-35_nextjs-m7-reference-crud-implementation-checkpoint.md)
- 本文只解决：
  - auth contract
  - mock session cookie bridge
  - dashboard auth guard
  - action-level permission rendering
- 本文不进入：
  - 真实第三方 auth provider
  - server-side user store
  - ACL 管理后台
  - 自动化测试基线

## Done Contract
- 完成标准：
  - 存在共享 auth contract
  - 存在 client/server 可读 session bridge
  - dashboard 路由未登录会被重定向到 `/sign-in`
  - 导航、资源按钮、行操作、批量操作会按权限裁剪
  - 已有至少两组权限集可验证差异
- 证明方式：
  - `pnpm build` 通过
  - 内置浏览器完成 unauthenticated / viewer / admin 三种场景验收
  - 代码证据能说明 shell 仍未绑定具体 auth SDK
- 仍算未完成的情况：
  - 权限逻辑散落在多个组件里，没有统一 resolver
  - 登录只改前端状态，不落 session cookie
  - 未登录仍可直接进入 dashboard 页面

## Canonical Decisions

### 1. auth provider 仍保持 `auth-agnostic`
- 本轮不接 Clerk / NextAuth / Lucia
- 当前只落模板级 contract 与 `mock session` bridge
- 后续真实项目可替换 `services/auth/*` 而不改 shell

### 2. session 持久化采用 cookie
- 使用 `template-auth-session` cookie
- root layout 读 server session
- client provider 持有 hydrated session
- middleware 负责未登录重定向

### 3. 权限模型继续使用动作级 key
- 当前实际接入：
  - `dashboard.view`
  - `resources.view`
  - `resources.create`
  - `resources.edit`
  - `resources.delete`
  - `tasks.view`
  - `apps.view`
  - `chats.view`
  - `users.view`
  - `settings.view`
  - `help-center.view`

### 4. 模板演示权限集采用 email 驱动 mock profile
- `viewer@template.dev` -> viewer
- `operator@template.dev` -> operator
- 默认其他邮箱 -> admin
- 这样不需要额外 debug UI，就能完成模板级权限验收

## Proposed File Scope

### 新增
- [middleware.ts](/Users/ktlee/coding/shadcn-admin/middleware.ts)
- [src/contracts/auth.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/auth.ts)
- [src/services/auth/shared.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/shared.ts)
- [src/services/auth/client.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/client.ts)
- [src/services/auth/server.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/server.ts)
- [src/services/auth/index.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/index.ts)
- [src/providers/auth-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/auth-provider.tsx)
- [src/components/auth/dashboard-route-guard.tsx](/Users/ktlee/coding/shadcn-admin/src/components/auth/dashboard-route-guard.tsx)
- [src/components/auth/permission-denied-state.tsx](/Users/ktlee/coding/shadcn-admin/src/components/auth/permission-denied-state.tsx)
- [src/features/auth/components/template-sign-in-form.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/components/template-sign-in-form.tsx)

### 修改
- [app/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/layout.tsx)
- [app/(dashboard)/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/layout.tsx)
- [app/(auth)/sign-in/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/sign-in/page.tsx)
- [src/providers/app-providers.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/app-providers.tsx)
- [src/modules/navigation.ts](/Users/ktlee/coding/shadcn-admin/src/modules/navigation.ts)
- [src/components/layout/data/sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts)
- [src/components/layout/app-sidebar.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/app-sidebar.tsx)
- [src/components/command-menu.tsx](/Users/ktlee/coding/shadcn-admin/src/components/command-menu.tsx)
- [src/components/profile-dropdown.tsx](/Users/ktlee/coding/shadcn-admin/src/components/profile-dropdown.tsx)
- [src/components/sign-out-dialog.tsx](/Users/ktlee/coding/shadcn-admin/src/components/sign-out-dialog.tsx)
- `src/features/*/manifest.ts` 中与 dashboard 模块相关的 manifest
- `src/features/resources/components/*`
- [src/i18n/resources/zh-CN.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/zh-CN.ts)
- [src/i18n/resources/en.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/en.ts)

## Implementation Result

### auth contract 与 session bridge
- 已建立共享 auth schema：
  - session
  - user
  - permission
- 已建立：
  - `getServerSession()`
  - `getClientSession()`
  - `signIn()`
  - `signOut()`
  - `hasPermission()`
  - `hasAnyPermission()`

### dashboard guard
- `middleware.ts` 现在会保护：
  - `/`
  - `/resources`
  - `/tasks`
  - `/apps`
  - `/chats`
  - `/users`
  - `/settings/*`
  - `/help-center`
  - `/clerk/user-management`
- 未登录访问时会跳到 `/sign-in?redirect=...`
- dashboard layout 内还补了一层 `DashboardRouteGuard`，用于登录后但权限不足的情况

### 权限接入结果
- 导航：
  - sidebar 已按 permission 过滤
  - command menu 已按同一 resolver 过滤
- 资源模块：
  - `resources.view` 控制页面访问
  - `resources.create` 控制新建按钮
  - `resources.edit` / `resources.delete` 控制行操作
  - `resources.edit` / `resources.delete` 共同控制批量动作和选择列
- 用户展示：
  - profile dropdown 与 sidebar user 已使用当前 session 用户，而不再固定展示静态邮箱
- 退出登录：
  - sign-out dialog 已切到新 auth bridge，不再依赖旧 `zustand auth-store`

### 本轮修复
- 登录页最初存在一个回跳 bug：
  - 登录成功后会被页面 `useEffect` 抢先跳到 `/`
  - 覆盖掉 middleware 带下来的 `redirect`
- 现已删除该重定向 effect，回跳链路恢复正常

## Validation Evidence

### 技术验收
- `pnpm build` 已在 2026-06-12 22:49 HKT 通过
- 既存 warning 仍在：
  - `The Next.js plugin was not detected in your ESLint configuration`

### 浏览器验收
- 口径：`http://localhost:3001`
- 已完成：
  1. 未登录访问 `/resources`
     - 被重定向到 `/sign-in?redirect=%2Fresources`
  2. `viewer@template.dev`
     - 登录后正确回到 `/resources`
     - sidebar 中 `Tasks / Apps / Chats / Users` 被隐藏
     - `Create Resource` 不显示
     - 选择列与行操作菜单不显示
  3. viewer 直接访问 `/tasks`
     - 显示 `Access restricted`
     - 页面文案中带 `tasks.view`
  4. viewer 退出登录
     - 正确回到 `/sign-in?redirect=%2Ftasks`
  5. `admin@template.dev`
     - 登录后正确回到 `/tasks`
     - sidebar 中 `Tasks / Apps / Chats / Users` 恢复显示
     - 进入 `/resources` 后 `Create Resource`、选择列、行操作菜单恢复显示

## Current Conclusion
- `M8 - Auth + Permission Baseline` 已达到当前阶段目标。
- 下一轮可以进入：
  - `M9 - Template Hardening`
