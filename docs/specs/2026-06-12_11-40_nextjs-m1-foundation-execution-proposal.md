# Spec: nextjs-m1-foundation-execution-proposal

## Goal
- 要解决什么问题：把 `M1 - Next Foundation` 从文件级施工图，进一步收敛为真正开始编码前可执行的实施方案。
- 最终目标：后续进入代码实施时，执行者只需要照着步骤推进，不再在 M1 内部反复判断“先改哪里”“哪些文件暂时不碰”。
- 本轮核心目标：明确 M1 的实施顺序、文件创建/迁移列表、每一步的检查点、风险回退点。
- 验收结果：已完成 M1 执行方案。

## Relationship
- 本文建立在以下文档之上：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m1-foundation-file-plan](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-25_nextjs-m1-foundation-file-plan.md)
- 蓝图负责架构约束，本文只负责 M1 编码执行顺序。

## M1 Execution Strategy

### 总体原则
- M1 只建立 **Next 基础工程 + 最小 Root Layout + 全局基础 provider**。
- M1 结束时，项目必须：
  - 能运行
  - 主题/语言/字体/方向可初始化
  - 不包含 dashboard shell
  - 不包含业务模块
- M1 期间不做任何“为了方便先把 dashboard 也带上”的偷跑。

### 实施方式
- 采用 **新建独立 Next 模板工程骨架** 的思路，不在现有 Vite 入口上做兼容层。
- 迁移顺序固定为：
  1. 工程骨架
  2. 全局样式
  3. i18n 基础层
  4. 偏好 provider
  5. Query / Toaster
  6. Root Layout 装配
  7. 最小占位页面

## Existing Source Decisions

### 必须高保真迁移的现有文件
- 主题 token：
  - [src/styles/theme.css](/Users/ktlee/coding/shadcn-admin/src/styles/theme.css)
- 全局基础样式：
  - [src/styles/index.css](/Users/ktlee/coding/shadcn-admin/src/styles/index.css)
- i18n 初始化：
  - [src/i18n/index.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/index.ts)
- i18n 资源：
  - [src/i18n/resources/en.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/en.ts)
  - [src/i18n/resources/zh-CN.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/zh-CN.ts)
- 主题偏好模型：
  - [src/context/theme-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/theme-provider.tsx)
- 字体偏好模型：
  - [src/context/font-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/font-provider.tsx)
- 方向偏好模型：
  - [src/context/direction-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/direction-provider.tsx)
- cookie 工具：
  - [src/lib/cookies.ts](/Users/ktlee/coding/shadcn-admin/src/lib/cookies.ts)
- 字体配置：
  - [src/config/fonts.ts](/Users/ktlee/coding/shadcn-admin/src/config/fonts.ts)
- Toaster 主题行为参考：
  - [src/components/ui/sonner.tsx](/Users/ktlee/coding/shadcn-admin/src/components/ui/sonner.tsx)

### M1 不应直接迁入的现有文件
- [src/main.tsx](/Users/ktlee/coding/shadcn-admin/src/main.tsx)
  - 原因：这是 Vite 入口，不适合作为 Next 根入口的迁移目标
- [src/context/search-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/search-provider.tsx)
  - 原因：属于 dashboard shell
- [src/context/layout-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/layout-provider.tsx)
  - 原因：属于 dashboard shell
- 任何 `features/*` 页面模块
  - 原因：M1 不进入业务和 shell 内容层

## Proposed Target File Set For M1

### A. Root and App Router
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

### B. Providers
- `src/providers/app-providers.tsx`
- `src/providers/query-provider.tsx`
- `src/providers/theme-provider.tsx`
- `src/providers/font-provider.tsx`
- `src/providers/direction-provider.tsx`

### C. i18n
- `src/i18n/index.ts`
- `src/i18n/resources/en.ts`
- `src/i18n/resources/zh-CN.ts`

### D. Shared Config / Lib
- `src/config/fonts.ts`
- `src/lib/cookies.ts`
- `src/lib/utils.ts`

### E. Shared UI foundation
- `src/components/ui/sonner.tsx`

### F. Directory placeholders only
- `app/(auth)/`
- `app/(dashboard)/`
- `app/(errors)/`
- `src/features/`
- `src/config/`
- `src/contracts/`
- `src/services/`

## Step-by-step Execution Order

## Step 1 - Create Next Project Skeleton

### Objective
- 建立最小 Next App Router 工程，不迁任何业务代码。

### Files
- `package.json`
- `tsconfig.json`
- `next.config.*`
- `postcss.config.*`
- `app/`
- `src/`

### Actions
- 初始化 Next 工程
- 配置别名 `@/`
- 准备 `src/` 目录作为 feature-first 容器

### Checkpoint
- Next 项目能启动
- `app/page.tsx` 能渲染最小文本

### Do Not
- 不复制 Vite route 结构
- 不迁任何 dashboard 页面

## Step 2 - Migrate Global CSS And Theme Tokens

### Objective
- 把 Hero Spectrum 主题 token 和全局基础样式迁进 Next。

### Source
- [src/styles/index.css](/Users/ktlee/coding/shadcn-admin/src/styles/index.css)
- [src/styles/theme.css](/Users/ktlee/coding/shadcn-admin/src/styles/theme.css)

### Target
- `app/globals.css`

### Actions
- 合并主题 token 与全局基础样式进入 `app/globals.css`
- 保留：
  - `@import 'tailwindcss'`
  - `@import 'tw-animate-css'`
  - dark variant
  - utility
  - scrollbar / mobile input fixes
- 清理仅与 Vite 结构相关、而非全局基础的部分

### Checkpoint
- 页面有主题变量
- dark class 可切换
- 没有 CSS 路径依赖错误

### Do Not
- 不在这里引入任何 dashboard 壳布局样式

## Step 3 - Migrate i18n Foundation

### Objective
- 保留当前模板已经成熟的中英双语基础层。

### Source
- [src/i18n/index.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/index.ts)
- [src/i18n/resources/en.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/en.ts)
- [src/i18n/resources/zh-CN.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/zh-CN.ts)

### Target
- `src/i18n/index.ts`
- `src/i18n/resources/en.ts`
- `src/i18n/resources/zh-CN.ts`

### Actions
- 完整迁移资源文件
- 保持：
  - `zh-CN / en`
  - cookie 优先检测
  - `html lang` 同步
- M1 阶段保留非路由型语言切换设计，不做 locale segment

### Checkpoint
- 初始化成功
- 默认中文
- 切换英文后刷新仍保持英文

### Do Not
- 不在 M1 扩展更多语言
- 不引入 Next locale 路由

## Step 4 - Migrate Preference Providers

### Objective
- 迁移主题、字体、方向三类本地偏好 provider。

### Source
- [src/context/theme-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/theme-provider.tsx)
- [src/context/font-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/font-provider.tsx)
- [src/context/direction-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/direction-provider.tsx)
- [src/lib/cookies.ts](/Users/ktlee/coding/shadcn-admin/src/lib/cookies.ts)
- [src/config/fonts.ts](/Users/ktlee/coding/shadcn-admin/src/config/fonts.ts)

### Target
- `src/providers/theme-provider.tsx`
- `src/providers/font-provider.tsx`
- `src/providers/direction-provider.tsx`
- `src/lib/cookies.ts`
- `src/config/fonts.ts`

### Actions
- 迁移 cookie 驱动偏好模型
- 将 provider 路径统一到 `src/providers`
- 改造主题 provider，使其适应 Next 首屏与 hydration
- 继续保留：
  - `system/light/dark`
  - font class 写入
  - `dir` 同步

### Checkpoint
- 刷新页面后：
  - theme 保持
  - font 保持
  - dir 保持

### Do Not
- 不把 dashboard layout state 混入 provider
- 不做用户级服务端偏好持久化

## Step 5 - Introduce Query Provider And Toaster

### Objective
- 建立最小 React Query 与 Sonner 基础链路。

### Source
- [src/components/ui/sonner.tsx](/Users/ktlee/coding/shadcn-admin/src/components/ui/sonner.tsx)

### Target
- `src/providers/query-provider.tsx`
- `src/components/ui/sonner.tsx`

### Actions
- 建立最小 QueryClient
- 不迁当前 Vite 入口里的复杂 router 跳转错误处理
- 迁移 Toaster UI 层，并让它消费主题 provider

### Checkpoint
- toaster 可渲染
- Query provider 可包裹应用

### Do Not
- 不在 M1 绑定业务错误码和权限错误跳转

## Step 6 - Compose AppProviders

### Objective
- 建立 Root Layout 可消费的统一 provider 组合。

### Target
- `src/providers/app-providers.tsx`

### Actions
- 组合：
  - Query provider
  - Theme provider
  - Font provider
  - Direction provider
  - Toaster
- 保持 Root Layout 最小，不在此文件放 dashboard 壳能力

### Checkpoint
- 单个 `AppProviders` 能完整包裹页面

### Do Not
- 不组合 search / sidebar / layout provider

## Step 7 - Build Minimal Root Layout

### Objective
- 用 Next Root Layout 接上所有全局基础能力。

### Target
- `app/layout.tsx`

### Actions
- 引入 `app/globals.css`
- 挂 `AppProviders`
- 设置 html/body 结构
- 根据需要设置：
  - `lang`
  - `dir`
  - `suppressHydrationWarning`

### Checkpoint
- 全局主题、语言、字体、方向在 Next layout 下全部可工作

### Do Not
- 不放 dashboard sidebar/header

## Step 8 - Add Minimal Placeholder Page

### Objective
- 为 M1 提供一个可运行、可验收的最小页面。

### Target
- `app/page.tsx`

### Actions
- 输出最小占位内容
- 必要时展示当前主题/语言切换是否已接好
- 不引入任何业务 feature

### Checkpoint
- 页面稳定可见
- 可以进行主题和语言的最小验收

### Do Not
- 不把它做成 dashboard 首页

## Deliverable Definition

M1 最终交付物必须具备：

1. 一个独立可运行的 Next App Router 基础工程
2. `app/globals.css` 下的完整全局基础样式
3. cookie 优先的 theme / font / dir / language 基础层
4. 最小 Root Layout
5. 最小 Query provider
6. 可用 Toaster
7. 最小占位首页

## Acceptance Criteria

### 技术完成标准
- `build` 通过
- 无 provider 装配错误
- 无样式入口错误
- 无 i18n 初始化错误

### 体验完成标准
- 默认进入中文态
- 主题切换刷新后保持
- 语言切换刷新后保持
- 不出现明显首屏主题闪烁
- 不出现明显首屏语言回退

## Explicit Boundaries

以下内容即使实现起来“顺手”，M1 也禁止提前做：

- sidebar
- header
- settings shell
- auth shell 页面内容
- error shell 页面内容
- module registry
- navigation config
- shared contracts
- mock/http adapter
- Reference Module
- auth guard
- permission resolver

## Rollback Checkpoints

如果 M1 实施中出现范围漂移，应回退到以下检查点：

### Checkpoint A
- 仅 Next skeleton 已建好
- 尚未迁 provider

### Checkpoint B
- globals.css 已稳定
- i18n / theme 尚未全部接入

### Checkpoint C
- provider 已稳定
- Root Layout 尚未接 dashboard 逻辑

原则：
- 任何问题都只回退到最近稳定检查点
- 不允许因为局部失败去推翻整个 M1 结构设计

## Definition Of Success For Starting M2

只有满足下面全部条件，才允许进入 M2：

1. Next 工程稳定运行
2. Root Layout 仍然最小
3. 偏好初始化链路稳定
4. 没有提前混入 dashboard shell
5. globals.css 已成为唯一全局样式入口

## Resume / Handoff
- 当前状态：M1 已具备执行方案，可直接转入真正代码实施准备
- 下一步唯一动作：在代码改动前，再输出一次“本轮要创建/修改的文件清单 + 执行顺序”，作为实施前 checkpoint
- 下一轮核心目标：提交 M1 代码实施方案并等待批准
