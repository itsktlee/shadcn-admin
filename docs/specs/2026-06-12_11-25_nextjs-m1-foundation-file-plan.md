# Spec: nextjs-m1-foundation-file-plan

## Goal
- 要解决什么问题：把 `M1 - Next Foundation` 从“里程碑描述”继续细化为文件级任务清单。
- 最终目标：进入代码实施时，可以明确知道 M1 具体新增/迁移哪些文件，哪些内容原样保留，哪些内容只保留契约不实现。
- 本轮核心目标：为 M1 建立文件级施工图与阶段边界。
- 验收结果：已完成 M1 文件级计划。

## Relationship
- 本文从属于：
  - [`nextjs-shell-template-blueprint`](./2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [`nextjs-shell-template-implementation-checklist`](./2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
- 作用：
  - 蓝图定义架构方向
  - 实施清单定义里程碑
  - 本文定义 M1 的文件级落地边界

## M1 Scope

### M1 要完成的事情
- 建立 Next.js App Router 基础工程
- 建立最小 Root Layout
- 落地全局基础 provider
- 建立 theme / i18n / query / toaster 启动链路
- 确保 cookie 优先偏好读取策略成立
- 为后续 `M2 ~ M9` 留出稳定目录骨架

### M1 不做的事情
- 不做 dashboard shell
- 不做 sidebar / header / search
- 不做 auth guard
- 不做 Reference Module
- 不做模块注册 / 导航配置
- 不做 CRUD / contracts / adapter 细节

## Migration Principles For M1

### 1. 迁移优先级
- 先迁全局基础层
- 后迁全局样式层
- 再建立 provider 装配
- 最后落最小页面占位

### 2. 内容迁移规则
- **原样高保真迁移**
  - theme token
  - i18n 资源
  - cookie 偏好策略
  - 基础全局样式
- **结构性重写**
  - `src/main.tsx` -> `app/layout.tsx` + `providers`
- **只留接口，不实现复杂逻辑**
  - dashboard shell provider
  - auth bridge
  - module registry

### 3. Root Layout 原则
- Root Layout 只承载：
  - html/body
  - theme bootstrap
  - i18n bootstrap
  - query provider
  - toaster
  - 全局 CSS
- 不允许在 M1 提前放入：
  - sidebar provider
  - layout provider
  - search provider
  - dashboard header/sidebar

## Existing Source Mapping

M1 重点参考当前仓库这些文件：

- 主题：
  - [src/context/theme-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/theme-provider.tsx)
- 字体：
  - [src/context/font-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/font-provider.tsx)
- 方向：
  - [src/context/direction-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/context/direction-provider.tsx)
- i18n 启动：
  - [src/i18n/index.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/index.ts)
- 全局样式：
  - [src/styles/index.css](/Users/ktlee/coding/shadcn-admin/src/styles/index.css)
  - [src/styles/theme.css](/Users/ktlee/coding/shadcn-admin/src/styles/theme.css)
- cookie 工具：
  - [src/lib/cookies.ts](/Users/ktlee/coding/shadcn-admin/src/lib/cookies.ts)

## Target File Plan

下面是 M1 建议落地的目标文件集合。

### A. App Router 入口层

#### 1. `app/layout.tsx`
- 责任：
  - 最小 Root Layout
  - 绑定 html/body
  - 注入全局 provider 入口
  - 引入全局样式
- 要包含：
  - `lang`
  - `suppressHydrationWarning`（如主题策略需要）
  - `AppProviders`
- 不包含：
  - sidebar
  - header
  - auth guard
  - dashboard 结构

#### 2. `app/page.tsx`
- 责任：
  - M1 阶段最小占位首页
- 要求：
  - 只证明 Next 项目已跑通
  - 不承担 dashboard shell

#### 3. `app/globals.css`
- 责任：
  - Next 全局样式入口
- 来源：
  - 由当前 `src/styles/index.css` 与 `src/styles/theme.css` 合并/迁移而来

### B. Provider 装配层

#### 4. `src/providers/app-providers.tsx`
- 责任：
  - Root Layout 级 provider 组合
- 要包含：
  - Query provider
  - Theme provider
  - Font provider
  - Direction provider
  - Toaster
- 不包含：
  - dashboard shell provider

#### 5. `src/providers/query-provider.tsx`
- 责任：
  - 单独封装 React Query provider
- 要求：
  - 先做最小稳定版本
  - 不提前接 dashboard 专用错误跳转逻辑

#### 6. `src/providers/theme-provider.tsx`
- 责任：
  - Next 版主题 provider
- 迁移重点：
  - 保留 cookie 优先策略
  - 保留 `light/dark/system`
  - 解决首屏闪动
- 注意：
  - 不能直接机械复制 Vite 版 `window` 依赖逻辑
  - 要兼容 Next 服务端首屏

#### 7. `src/providers/font-provider.tsx`
- 责任：
  - 字体偏好 provider
- 迁移重点：
  - 保留 cookie 优先
  - 保留 HTML class 写入模式

#### 8. `src/providers/direction-provider.tsx`
- 责任：
  - 文档方向 provider
- 迁移重点：
  - 保留 `dir` cookie
  - 保留 Radix DirectionProvider

### C. i18n 基础层

#### 9. `src/i18n/index.ts`
- 责任：
  - i18n 初始化
- 迁移重点：
  - 保留 `zh-CN / en`
  - 保留 cookie 优先检测
  - 保留 `html lang` 同步
- M1 约束：
  - 保持非路由型语言策略

#### 10. `src/i18n/resources/en.ts`
#### 11. `src/i18n/resources/zh-CN.ts`
- 责任：
  - 直接迁移现有模板资源
- M1 目标：
  - 先完整保留资源文件
  - 不在 M1 继续扩资源范围

### D. 基础配置与工具层

#### 12. `src/lib/cookies.ts`
- 责任：
  - cookie 读写基础工具
- 迁移重点：
  - 允许继续保留轻量实现
  - 后续如需拆出 server cookie helper，在 M2 之后再做

#### 13. `src/config/fonts.ts`
- 责任：
  - 字体配置
- M1 目标：
  - 为 font provider 提供单一配置源

#### 14. `src/lib/utils.ts`
- 责任：
  - 保留当前共享工具能力
- M1 原则：
  - 不做无关重构

### E. 样式基础层

#### 15. `app/globals.css` 内容迁移清单
- 必须迁入：
  - Tailwind import
  - `tw-animate-css`
  - Hero Spectrum token
  - `@custom-variant dark`
  - 全局基础层样式
  - 容器与 utility
  - 滚动条与移动端输入样式修正
- 暂不迁入：
  - 任何 dashboard 专属布局样式写死逻辑

#### 16. `src/styles/` 在 M1 的处理
- 建议：
  - M1 可先保留 `src/styles/theme.css` 作为来源文件
  - 但 Next 最终全局入口应统一走 `app/globals.css`
- 原则：
  - 不保留双入口并长期共存

### F. 目录骨架占位

M1 可以提前创建目录，但不提前实现复杂内容：

- `app/(auth)/`
- `app/(dashboard)/`
- `app/(errors)/`
- `src/components/layout/`
- `src/features/`
- `src/config/`
- `src/contracts/`
- `src/services/`

约束：
- 允许建目录与最小占位文件
- 不允许在 M1 填入 dashboard shell 逻辑

## File-level Task Checklist

### Step 1. 基础工程落位
- [ ] 创建 Next.js App Router 基础工程
- [ ] 配置 TypeScript / path alias
- [ ] 配置 ESLint / Prettier
- [ ] 配置 Tailwind 与 `shadcn/ui`

### Step 2. 全局样式迁移
- [ ] 建立 `app/globals.css`
- [ ] 迁移 `theme.css` token
- [ ] 迁移 `index.css` 基础样式
- [ ] 验证暗黑模式 class 驱动可用

### Step 3. i18n 基础层迁移
- [ ] 迁移 `src/i18n/index.ts`
- [ ] 迁移 `en.ts`
- [ ] 迁移 `zh-CN.ts`
- [ ] 验证 cookie 优先语言策略

### Step 4. 偏好 provider 迁移
- [ ] 迁移 theme provider
- [ ] 迁移 font provider
- [ ] 迁移 direction provider
- [ ] 迁移 cookie 工具
- [ ] 验证首屏偏好读取行为

### Step 5. Query 基础层迁移
- [ ] 建立 `query-provider.tsx`
- [ ] 建立最小 QueryClient
- [ ] 暂不接复杂全局错误跳转

### Step 6. Root Layout 装配
- [ ] 建立 `src/providers/app-providers.tsx`
- [ ] 建立 `app/layout.tsx`
- [ ] 引入 `globals.css`
- [ ] 挂载 toaster

### Step 7. 最小运行页
- [ ] 建立 `app/page.tsx`
- [ ] 页面可运行
- [ ] 验证主题 / 语言 / provider 链路正常

## Exit Criteria

M1 完成时，必须满足：

1. Next 项目可运行
2. `app/layout.tsx` 保持最小
3. 主题、语言、字体、方向可初始化
4. 偏好刷新后仍生效
5. 不含 dashboard shell
6. 不含业务模块
7. 不含 auth guard

## Validation Checklist

### 必做验证
- [ ] `build` 通过
- [ ] 首屏主题不明显闪动
- [ ] 首屏语言不明显回退
- [ ] `QueryProvider` 正常挂载
- [ ] toaster 可渲染

### 人工验收
- [ ] 打开页面可见基础内容
- [ ] 切换主题后刷新仍正确
- [ ] 切换语言后刷新仍正确
- [ ] HTML `lang` 与 `dir` 可同步

## Risks

### 1. 主题首屏闪动
- 来源：
  - 当前 Vite 版主题逻辑以客户端 `window/document` 为中心
- M1 对策：
  - 先把 cookie 读取纳入服务端首屏可见路径

### 2. i18n 在 Next 首屏回退
- 来源：
  - 当前 `i18next-browser-languagedetector` 默认偏客户端
- M1 对策：
  - 保证 cookie 语言偏好在首屏初始化阶段就可用

### 3. Root Layout 过早变重
- 来源：
  - 实施时容易顺手把 dashboard provider 提前挂进 root
- M1 对策：
  - 严格按本文边界，只放最小全局能力

## Explicit Non-goals

M1 不处理：
- dashboard sidebar
- header
- search
- settings shell
- Reference Module
- module registry
- contracts
- adapter
- auth guard
- permission
- CRUD

## What To Inspect Before Coding M1

真正进入 M1 代码实施前，应先逐个确认：

1. 当前主题 provider 中哪些逻辑必须保留，哪些需要为 Next 首屏改写
2. 当前 i18n cookie 策略如何映射到 Next Root Layout
3. 当前 `src/styles/index.css` 与 `theme.css` 如何合并进入 `app/globals.css`
4. 当前 cookie 工具是否需要拆分 client/server helper

## Resume / Handoff
- 当前状态：M1 已拆到文件级施工清单
- 下一步唯一动作：真正开始代码前，再基于本文列出具体创建/修改文件列表
- 下一轮核心目标：把 M1 文件计划转换成实施方案并等待用户批准
