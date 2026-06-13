# Spec: nextjs-m9-template-hardening-implementation-checkpoint

## Goal
- 要解决什么问题：把已经完成的 Next 模板壳从“人工验收可用”推进到“具备最小自动回归基线”的长期复用状态。
- 最终目标：模板在继续扩展业务模块前，已经有一组稳定的自动化证据，能保护 shell、权限、导航和参考 CRUD 的核心行为。
- 本轮核心目标：完成 `M9 - Template Hardening` 的最小自动测试闭环。
- 当前验收口径：先做定向 `vitest` 收敛，再决定是否扩大到全量测试与 build。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m7-reference-crud-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_22-35_nextjs-m7-reference-crud-implementation-checkpoint.md)
  - [nextjs-m8-auth-permission-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_22-50_nextjs-m8-auth-permission-implementation-checkpoint.md)
- 本文只解决：
  - auth shared helpers 单元测试
  - navigation registry / permission resolver 单元测试
  - dashboard route guard 组件测试
  - sign-out dialog Next 版行为测试
  - resources create drawer 的 duplicate slug 关键错误分支测试
  - i18n / theme provider 的 hydration smoke
- 本文不进入：
  - Playwright E2E 全链路
  - Hono API 集成测试
  - 全量覆盖率提升
  - 旧 Vite/TanStack Router 遗留测试体系全面清洗

## Done Contract
- 完成标准：
  - `auth`、`navigation`、`permission guard`、`sign-out`、`resources duplicate slug` 至少各有一组自动化测试
  - i18n 与 theme 至少有一组 hydration smoke
  - M9 新增测试能在当前仓库里通过定向 `vitest`
  - 如条件允许，再补一次 `pnpm build`
- 证明方式：
  - 定向 `vitest run` 结果
  - 必要时的 `pnpm build` 结果
  - spec 回写实际新增测试范围与未覆盖项
- 仍算未完成的情况：
  - 关键路径仍只靠人工记忆验收
  - duplicate slug 回填、权限过滤、Next sign-out 回跳没有自动化证据
  - hydration smoke 缺失，后续主题/语言回归无法被快速发现

## Canonical Decisions

### 1. M9 只补“模板骨架级”自动回归
- 优先保护跨项目复用最关键的行为
- 不把当前阶段扩展成全仓库测试重构

### 2. 先单元与轻组件，再补重交互
- 先补纯函数和轻组件，降低失败面
- `resources-mutate-drawer` 作为本轮最重的 UI 测试，最后收口

### 3. 继续沿用现有 Vitest Browser 测试风格
- 不另起 Jest 或 Testing Library 新体系
- mock 以当前 Next 版实现为准，而不是兼容旧 TanStack Router 写法

## Proposed File Scope

### 新增
- `src/services/auth/shared.test.ts`
- `src/modules/navigation.test.ts`
- `src/components/auth/dashboard-route-guard.test.tsx`
- `src/features/resources/components/resources-mutate-drawer.test.tsx`
- 可选：`src/providers/i18n-provider.test.tsx`
- 可选：`src/providers/theme-provider.test.tsx`

### 修改
- `src/components/sign-out-dialog.test.tsx`
- `vite.config.ts`（已移除失效的 `@tailwindcss/vite` 依赖引用，作为本轮前置修复）
- 其他仅在测试无法落地时做最小实现配套修正

## Execution Plan
1. 建立 `auth shared` 与 `navigation` 的纯单元测试。
2. 修复并更新 `dashboard route guard` 与 `sign-out dialog` 的 Next 版测试。
3. 为 `resources-mutate-drawer` 补 duplicate slug 错误映射测试。
4. 追加 i18n / theme hydration smoke。
5. 定向跑 `vitest`，收敛失败项。
6. 如定向通过，再跑 `pnpm build` 作为收尾证据。

## Validation Plan
- 首选命令：
  - `pnpm exec vitest run src/services/auth/shared.test.ts`
  - `pnpm exec vitest run src/modules/navigation.test.ts`
  - `pnpm exec vitest run src/components/auth/dashboard-route-guard.test.tsx`
  - `pnpm exec vitest run src/components/sign-out-dialog.test.tsx`
  - `pnpm exec vitest run src/features/resources/components/resources-mutate-drawer.test.tsx`
  - `pnpm exec vitest run src/providers/i18n-provider.test.tsx src/providers/theme-provider.test.tsx`
- 收尾命令：
  - `pnpm build`

## Recap Checkpoint
- 当前目标：为 Next 模板补上最小自动回归基线。
- 已知事实：M7/M8 功能已完成并有人肉验收；`vite.config.ts` 的测试阻断已清除。
- 当前边界：只补模板级关键测试，不做整库清洗。
- 下一步：先补纯函数与轻组件测试，再进入资源抽屉关键错误分支。

## Implementation Result

### 已新增的 M9 测试基线
- [src/services/auth/shared.test.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/shared.test.ts)
  - `detectPermissionProfile`
  - `createMockAuthSession`
  - session cookie serialize / parse
  - `hasPermission` / `hasAnyPermission`
- [src/modules/navigation.test.ts](/Users/ktlee/coding/shadcn-admin/src/modules/navigation.test.ts)
  - sidebar navigation permission filtering
  - command menu permission filtering
  - required permission path resolver
- [src/components/auth/dashboard-route-guard.test.tsx](/Users/ktlee/coding/shadcn-admin/src/components/auth/dashboard-route-guard.test.tsx)
  - 无权限时渲染 denied state
  - 有权限或无 required permission 时透传 children
- [src/features/resources/components/resources-mutate-drawer.test.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-mutate-drawer.test.tsx)
  - duplicate slug adapter error -> `slug` 字段错误
  - 抽屉不会因为错误而关闭
- [src/providers/i18n-provider.test.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/i18n-provider.test.tsx)
  - 初始语言会同步到 `document.documentElement.lang`
  - provider hydration 后翻译文本与语言状态一致
- [src/providers/theme-provider.test.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/theme-provider.test.tsx)
  - 初始主题会同步到 `html` class 与 `colorScheme`

### 已更新的旧测试
- [src/components/sign-out-dialog.test.tsx](/Users/ktlee/coding/shadcn-admin/src/components/sign-out-dialog.test.tsx)
  - 已从旧 TanStack Router / `zustand auth-store` 版本迁移到 Next 版
  - 现在验证：
    - `signOut()`
    - `setSession(null)`
    - `router.replace('/sign-in?redirect=...')`
    - `router.refresh()`

### 本轮环境修复
- [vite.config.ts](/Users/ktlee/coding/shadcn-admin/vite.config.ts)
  - 已移除不存在的 `@tailwindcss/vite` 引用，消除 Vitest 启动前阻断
- 本机测试环境已补齐 Playwright Chromium / Headless Shell 二进制，Vitest Browser Mode 可正常执行

## Validation Evidence

### 单项验证
- `pnpm exec vitest run --browser.enabled false src/services/auth/shared.test.ts`
  - 结果：`5 passed`
- `pnpm exec vitest run --browser.enabled false src/modules/navigation.test.ts`
  - 结果：`3 passed`
- `pnpm exec vitest run src/components/auth/dashboard-route-guard.test.tsx`
  - 结果：`3 passed`
- `pnpm exec vitest run src/components/sign-out-dialog.test.tsx`
  - 结果：`2 passed`
- `pnpm exec vitest run src/providers/i18n-provider.test.tsx`
  - 结果：`1 passed`
- `pnpm exec vitest run src/providers/theme-provider.test.tsx`
  - 结果：`1 passed`
- `pnpm exec vitest run src/features/resources/components/resources-mutate-drawer.test.tsx`
  - 结果：`1 passed`

### 聚合验证
- `pnpm exec vitest run src/services/auth/shared.test.ts src/modules/navigation.test.ts src/components/auth/dashboard-route-guard.test.tsx src/components/sign-out-dialog.test.tsx src/features/resources/components/resources-mutate-drawer.test.tsx src/providers/i18n-provider.test.tsx src/providers/theme-provider.test.tsx`
  - 结果：`7 passed`, `16 passed`

### 未执行项
- `pnpm build`
  - 本轮未主动执行；原因是当前项目规则要求未获明确指令时不主动跑 build。本轮已有聚合 Vitest 作为完成证据。

## Current Conclusion
- `M9 - Template Hardening` 的最小自动回归基线已建立。
- 当前模板已经具备：
  - shell / permission / navigation / reference CRUD 的核心自动化证据
  - i18n / theme hydration smoke
- 下一轮可以进入：
  - `M10` 级别的 lint / build / visual regression / browser acceptance 收口，或直接进入后续功能里程碑
