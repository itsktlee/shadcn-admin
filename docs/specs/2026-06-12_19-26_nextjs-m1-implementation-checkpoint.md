# Spec: nextjs-m1-implementation-checkpoint

## Goal
- 要解决什么问题：在真正开始 `M1 - Next Foundation` 编码前，把“会改什么、先改什么、哪些先不碰、为什么这样切”锁成一份实施前 checkpoint。
- 最终目标：后续执行者进入 M1 时，不再临场决定目录策略、入口替换方式、provider 组合边界和临时兼容策略。
- 本轮核心目标：补齐前序文档中还不够实现级的几处关键决策。
- 验收结果：M1 已具备可直接进入编码的实施前 checkpoint。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m1-foundation-file-plan](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-25_nextjs-m1-foundation-file-plan.md)
  - [nextjs-m1-foundation-execution-proposal](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-40_nextjs-m1-foundation-execution-proposal.md)
- 本文不推翻已有蓝图，只补齐 M1 真正编码前必须先说死的实现边界。

## Checkpoint Decisions

### 1. 仓库执行策略
- 采用：`同仓原地切到 Next.js 根工程`
- 不采用：在当前仓库内再套一层 `next-app/` 子目录
- 原因：
  - 蓝图已锁定模板最终形态是 `单仓单应用`
  - 如果先建子目录，后续还要再做一次根目录回迁，会把壳层迁移拆成两次结构性扰动
- M1 阶段允许：
  - 旧 Vite 源码先留在仓库中作为迁移参考
- M1 阶段不允许：
  - 让 Vite 与 Next 两套正式入口长期共存

### 2. 旧 Vite 代码的处理策略
- `src/main.tsx`
- `src/routes/**`
- `src/routeTree.gen.ts`
- `vite.config.ts`
- 当前 dashboard / auth / errors / feature 页面

在 M1 中统一视为：`legacy reference source`

- M1 对这些文件的原则：
  - 不删除
  - 不重命名
  - 不接入 Next 根入口
  - 不为了“先清爽”而做大规模搬迁
- 原因：
  - M1 目标是建立 Next 基础壳，不是清理旧实现
  - 过早移动旧文件，只会放大 diff 和回退成本

### 3. M1 必须补一个 i18n bootstrap provider
- 前序文档只锁定了：
  - `src/i18n/index.ts`
  - `en.ts`
  - `zh-CN.ts`
- 但在 Next 下，这还不够形成稳定语言初始化链路。
- 因此 M1 实际应新增：
  - `src/providers/i18n-provider.tsx`
- 责任：
  - 在客户端挂载时同步 `i18n` 单例
  - 接收来自 Root Layout 的初始语言
  - 兜住 cookie 优先、`html[lang]` 同步、切换后刷新保持

### 4. M1 必须补一个首屏主题预写入策略
- 当前 Vite 版主题依赖客户端 `window.matchMedia` 与 `document.documentElement.classList`
- 直接机械迁到 Next 会带来 `system` 主题下的首屏闪动
- 因此 M1 实际必须包含以下二选一中的一种：
  - `app/layout.tsx` 内联 theme bootstrap script
  - 单独的 `ThemeScript` 组件并在 Root Layout 最前面注入
- 推荐：`独立 ThemeScript 组件`
- 推荐原因：
  - 责任更单一
  - 后续 M3/M9 更容易补测试与复用

### 5. 字体加载不再沿用 index.html 外链
- 当前字体来源在 [index.html](/Users/ktlee/coding/shadcn-admin/index.html)
- Next 没有这个入口，因此 M1 必须同步重建字体装配
- 推荐：`next/font/google`
- M1 中的落地方式：
  - 在 `src/config/fonts.ts` 或独立字体模块内定义 `Inter` / `Manrope`
  - Root Layout 注入字体变量
  - `font-provider` 继续只负责切换 HTML class
- 原则：
  - 保留“字体是壳层偏好”的交互模型
  - 不把字体偏好改造成业务配置

### 6. Query provider 只迁最小稳定层
- 当前 [src/main.tsx](/Users/ktlee/coding/shadcn-admin/src/main.tsx) 里的 QueryClient 还绑定了：
  - `AxiosError`
  - `toast`
  - `auth-store`
  - `TanStack Router` 跳转
- 这些全部超出 M1 边界
- M1 只保留：
  - 最小 `QueryClient`
  - 基础默认选项
  - 不侵入 Router / Auth / Error 页面跳转

## M1 Exact File Scope

### A. 本轮会新建的文件
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `src/providers/app-providers.tsx`
- `src/providers/query-provider.tsx`
- `src/providers/theme-provider.tsx`
- `src/providers/font-provider.tsx`
- `src/providers/direction-provider.tsx`
- `src/providers/i18n-provider.tsx`

可选新增，但推荐直接建：
- `src/components/ui/theme-script.tsx`

### B. 本轮会迁移或改写的文件
- `package.json`
- `tsconfig.json`
- `components.json`
- `eslint.config.js`
- `src/i18n/index.ts`
- `src/i18n/resources/en.ts`
- `src/i18n/resources/zh-CN.ts`
- `src/lib/cookies.ts`
- `src/lib/utils.ts`
- `src/config/fonts.ts`
- `src/components/ui/sonner.tsx`

### C. 本轮只作为来源参考、不直接动的文件
- `src/main.tsx`
- `src/styles/index.css`
- `src/styles/theme.css`
- `src/context/theme-provider.tsx`
- `src/context/font-provider.tsx`
- `src/context/direction-provider.tsx`
- `src/context/search-provider.tsx`
- `src/context/layout-provider.tsx`
- `src/routes/**`
- `src/features/**`

### D. 本轮明确不创建的文件
- `app/(dashboard)/layout.tsx`
- `app/(auth)/layout.tsx`
- `app/(errors)/layout.tsx`
- `src/config/navigation.ts`
- `src/modules/registry.ts`
- `src/contracts/resources/*`
- `src/services/http/*`
- `src/services/mock/*`

## Package And Tooling Delta

### package.json 的 M1 目标状态
- `dev` -> `next dev`
- `build` -> `next build`
- `start` -> `next start`
- 保留现有测试/格式化相关命令，后续按里程碑再收口

### 迁移期允许的临时状态
- 旧 Vite 依赖可以暂时保留一段时间
- 原因：
  - 旧 `src/routes/**` 与 `src/main.tsx` 仍作为迁移参考文件留在仓库里
  - 在真正清退 legacy 代码之前，强行删依赖只会制造无关报错

### M1 不做的依赖清理
- 不在 M1 删除：
  - `@tanstack/react-router`
  - `@tanstack/router-plugin`
  - `@vitejs/plugin-react`
  - `vite`
- 这些清理由后续壳层迁移基本完成后再处理

## Root Layout Contract

### Root Layout 只允许承载
- HTML 基础结构
- 全局字体变量
- cookie 读取得到的初始：
  - theme
  - language
  - dir
  - font
- `AppProviders`
- `ThemeScript`
- `globals.css`

### Root Layout 明确禁止承载
- sidebar
- header
- settings shell
- search provider
- auth guard
- dashboard layout state

## AppProviders Contract

### 顺序固定为
1. `I18nProvider`
2. `ThemeProvider`
3. `FontProvider`
4. `DirectionProvider`
5. `QueryProvider`
6. `Toaster`

### 原则
- Root Layout 负责把初始偏好值传进来
- 各 provider 负责客户端后续交互与持久化
- 不允许某个 provider 自己再去偷读 dashboard 状态或业务状态

## Recommended Execution Order

### Step 1. 替换工程根入口
- 改 `package.json`
- 改 `tsconfig.json`
- 增加 Next 所需基础配置
- 调整 `components.json` 的 CSS 入口到 `app/globals.css`

### Step 2. 建立 App Router 最小骨架
- 建 `app/layout.tsx`
- 建 `app/page.tsx`
- 建 `app/globals.css`

### Step 3. 迁入主题 token 与全局基础样式
- 以 [src/styles/theme.css](/Users/ktlee/coding/shadcn-admin/src/styles/theme.css) 和 [src/styles/index.css](/Users/ktlee/coding/shadcn-admin/src/styles/index.css) 为来源
- 合并进入 `app/globals.css`

### Step 4. 迁入 i18n 基础层
- 迁 `src/i18n/resources/*`
- 重写 `src/i18n/index.ts`
- 新增 `src/providers/i18n-provider.tsx`

### Step 5. 迁入偏好 provider
- 重写：
  - `src/providers/theme-provider.tsx`
  - `src/providers/font-provider.tsx`
  - `src/providers/direction-provider.tsx`
- 同步处理：
  - `src/lib/cookies.ts`
  - `src/config/fonts.ts`
  - `src/components/ui/theme-script.tsx`

### Step 6. 迁入 Query + Toaster
- 建 `src/providers/query-provider.tsx`
- 调整 `src/components/ui/sonner.tsx`

### Step 7. 组合 AppProviders 并接入 Root Layout
- 建 `src/providers/app-providers.tsx`
- 在 `app/layout.tsx` 完成装配

### Step 8. 只做最小占位页验收
- `app/page.tsx` 只放最小内容
- 不提前伪装成 dashboard 首页

## M1 Validation Contract

### 当用户确认允许跑验证命令后，优先验证这些
1. `next build`
2. 本地打开首页
3. 主题切换后刷新保持
4. 语言切换后刷新保持
5. `html` 的 `lang` / `dir` / `class` 与 cookie 一致

### 在用户未批准执行命令前，可接受的静态验证
- 文件边界是否符合本文
- provider 组合是否未越界
- `globals.css` 是否已成为唯一全局样式入口
- Root Layout 是否仍然最小

## Exit Gate

只有满足下面全部条件，M1 才算可以结束：
- Next 根工程已经跑起来
- `app/layout.tsx` 仍然不含 dashboard 逻辑
- i18n 已经不只是“有资源文件”，而是有稳定 bootstrap
- `system` 主题下首屏闪动已经有明确处理
- 字体加载已经摆脱 `index.html` 外链依赖
- legacy Vite 代码仍然只是参考源，没有反向侵入 Next 根入口

## Next Action
- 当前已经到达：`M1 实施前 checkpoint 完成`
- 下一步唯一正确动作：
  - 先给用户一版“最小代码实施方案”
  - 等用户确认后，再真正开始改 M1 代码

## Reverse Sync

### 本轮已实际落地
- 已新增：
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/globals.css`
  - `next.config.ts`
  - `postcss.config.mjs`
  - `next-env.d.ts`
  - `src/providers/app-providers.tsx`
  - `src/providers/query-provider.tsx`
  - `src/providers/theme-provider.tsx`
  - `src/providers/font-provider.tsx`
  - `src/providers/direction-provider.tsx`
  - `src/providers/i18n-provider.tsx`
  - `src/components/ui/theme-script.tsx`
- 已改写：
  - `package.json`
  - `tsconfig.json`
  - `components.json`
  - `eslint.config.js`
  - `src/lib/cookies.ts`
  - `src/config/fonts.ts`
  - `src/i18n/index.ts`
  - `src/i18n/resources/en.ts`
  - `src/i18n/resources/zh-CN.ts`
  - `src/components/ui/sonner.tsx`

### 本轮仍未进入
- `app/(auth)`
- `app/(dashboard)`
- `app/(errors)`
- navigation config
- module registry
- auth guard
- reference module
- contracts / services adapter

### 当前验证状态
- 已完成：
  - 文件边界静态核对
  - Root Layout 边界核对
  - Provider 组合顺序核对
  - `globals.css` 单入口核对
  - `pnpm install --ignore-scripts`
  - `pnpm build`
- 未完成：
  - 本地浏览器验收
- 当前剩余观察项：
  - `build` 期间仍有一条 “Next.js plugin was not detected in your ESLint configuration” warning，但不影响本轮通过

### 下一步
- `M1` 基础壳已经具备进入下一里程碑的条件
- 若继续推进，应转入 `M2 - Multi-shell Layout`
