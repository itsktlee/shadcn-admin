# 当前模板活跃面与 Legacy 边界

本文只回答一个问题：**现在这个仓库里，哪些是当前真正运行的 Next 模板面，哪些只是为了迁移参考而保留的旧实现。**

如果你后续要把这个仓库当成长期母模板，请先看这份说明，再决定从哪里接手。

如果你下一步准备继续清理旧残留，可继续看：

- [Legacy 清理清单](./template-legacy-removal-checklist.md)

## 1. 当前正式运行面

以下内容属于当前 `Next.js App Router` 模板的正式运行面。

### 1.1 根入口与壳层

- `app/layout.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(auth)/layout.tsx`
- `app/(errors)/layout.tsx`
- `middleware.ts`

这条链路已经决定了：

- 根 provider 组合
- 主题 / 语言 / 字体 / 方向初始化
- dashboard shell 装配
- 登录态路由守卫

后续如果要改模板的全局行为，应该从这里入手，而不是从 `src/routes/**` 入手。

### 1.2 当前真实页面覆盖范围

当前 `app/**` 里主要分成三类页面：

1. 已有真实实现的页面
   - `/`
   - `/resources`
   - `/settings`
   - `/settings/account`
   - `/settings/appearance`
   - `/settings/display`
   - `/settings/language`
   - `/settings/notifications`
   - `/sign-in`

其中要特别注意：

- `/` 当前接的是旧 `shadcn-admin` 的 dashboard showcase
- 入口是 `src/features/dashboard/index.tsx`

2. 已接入壳层、并已恢复为完整 showcase demo 的页面
   - `/tasks`
   - `/apps`
   - `/chats`
   - `/users`
   - `/help-center`
   - `/sign-in-2`
   - `/sign-up`
   - `/forgot-password`
   - `/otp`
   - `/errors/unauthorized`
   - `/errors/forbidden`
   - `/errors/not-found`
   - `/errors/internal-server-error`
   - `/errors/maintenance-error`

   这一批页面当前已经不再是迁移占位卡，而是直接展示旧 `shadcn-admin` demo 内容，或展示与模板接管相关的静态 showcase 内容，用于保证模板开源展示面的完整度。其中 `auth / errors / help-center` 这组页面仍维持 showcase 定位，不作为当前模板业务实现的首选参考页。

3. 可按配置关闭的参考模块页面
   - `/resources`
   - 由 `src/config/template-modules.ts` 控制

这意味着：**当前模板真正可作为业务参考模块直接复用的，是 `resources` 和 `settings` 这一组；`apps / tasks / users / chats / auth showcase / errors showcase / help-center showcase` 已作为完整 demo 页面恢复，用来承接开源展示面。**

## 2. 当前活跃支撑层

这些目录和模块是当前 Next 模板真实在消费的基础能力。

### 2.1 配置与导航

- `src/config/navigation.ts`
- `src/config/shell.ts`
- `src/config/template-modules.ts`
- `src/modules/registry.ts`
- `src/modules/navigation.ts`
- `src/modules/types.ts`

这里控制的是：

- 左侧导航结构
- 命令面板模块来源
- 模板模块注册
- 模块可见性与排序

### 2.2 Provider 与全局状态

- `src/providers/**`
- `src/i18n/**`
- `src/lib/cookies.ts`
- `src/components/ui/theme-script.tsx`

这里控制的是：

- i18n
- theme
- direction
- font
- auth session 注入
- query provider
- dashboard sidebar 状态

### 2.3 Auth 与路由接入

- `src/services/auth/**`
- `src/components/auth/**`
- `middleware.ts`

这里控制的是：

- mock session
- 动作级权限判断
- dashboard route guard
- 公共/受保护路径划分

### 2.4 当前可直接参考的 feature

- `src/features/resources/**`
- `src/features/settings/**`
- `src/features/apps/**`
- `src/features/tasks/**`
- `src/features/users/**`
- `src/features/chats/**`
- `src/features/help-center/**`
- `src/features/auth/sign-in/sign-in-2.tsx`
- `src/features/auth/sign-up/**`
- `src/features/auth/forgot-password/**`
- `src/features/auth/otp/**`
- `src/features/errors/**`
- `src/features/auth/components/template-sign-in-form.tsx`

建议你后续新增业务模块时，优先参考：

- `resources` 的 list + CRUD + adapter + query + permission
- `settings` 的子导航与表单页组织
- `apps / tasks / users / chats` 的完整 demo 页面布局与视觉组织
- `sign-in-2 / sign-up / forgot-password / otp / errors / help-center` 的独立示例页结构与壳层边界处理

## 3. manifest 是活跃的，但不等于整组 feature 都活跃

这是当前仓库里最容易误判的一点。

`src/modules/registry.ts` 现在仍然会注册这些 manifest：

- `src/features/apps/manifest.ts`
- `src/features/tasks/manifest.ts`
- `src/features/users/manifest.ts`
- `src/features/auth/manifest.ts`
- `src/features/errors/manifest.ts`
- 以及 `resources / settings / dashboard / chats / help-center`

这表示：

- 这些模块的导航元数据仍是活跃的
- sidebar、command menu、受保护路由前缀仍然会引用它们

但这**不表示**对应的旧页面实现也仍然是当前正式运行面。

例如：

- `src/features/users/manifest.ts` 是活跃的
- 但 `src/features/users/index.tsx` 以及其旧表格实现并不是当前 Next 页面主链

因此后续接管时要区分：

- `manifest.ts` 是否属于当前导航注册链
- `index.tsx / old components / old tests` 是否仍属于当前实际页面实现

## 4. 当前 Legacy 参考面

以下内容目前应视为 **legacy 迁移参考面**，不是当前正式模板主线。

### 4.1 旧路由树

- `src/routes/**`

这是原先 `TanStack Router` 体系残留的主要目录。它包含：

- auth 路由
- dashboard 路由
- errors 路由

现在这些不再是当前 Next 模板的入口来源。

### 4.2 旧 context 体系

- `src/context/**`

这些是旧 Vite 版本留下的 provider / layout 状态组织方式。当前正式运行面已经改用 `src/providers/**`。

当前还有一个要点：

- 非 legacy 主链里的 `@/context/*` direct 引用已经清空
- 当前还能直接看到的 `@/context/*` 依赖，主要集中在 `src/context/**` 自身及其旧测试面

### 4.3 旧 feature 页面实现

以下这类文件目前更多是“迁移参考遗留面”，不应作为新开发的默认起点：

- `src/components/layout/authenticated-layout.tsx`
- `src/components/navigation-progress.tsx`
- 未接入当前 `app/**` 主链的旧 `TanStack Router` 页面与布局文件

也就是说，真正还带着旧路由范式的，主要集中在 legacy `src/routes/**` 周边，而不是当前 `app/**` 已接线的 showcase 页面本身。

其中有一类情况要单独说明：

- `apps / tasks / users / chats` 这四组 feature 树里，已经重新接回当前 `app/**` 主链，作为 showcase 页面存在
- 它们负责恢复完整 demo admin 的开源展示面
- 但这不改变 `resources / settings / sign-in` 仍是模板工程标准参考页这一层级

其中 `src/components/layout/authenticated-layout.tsx` 需要特别说明：

- 它仍属于 legacy `TanStack Router` layout 面
- 但当前已改为复用 `src/providers/dashboard-providers.tsx`
- 这表示它的 provider 组合已与现行 dashboard 壳对齐，不再直接依赖旧 `src/context/**`
- 同时，`Outlet` 的渲染职责也已经迁回 `src/routes/**`
- 因此它现在本身已是纯布局组件，不再直接依赖 `@tanstack/react-router`

其中 `src/components/navigation-progress.tsx` 也要单独说明：

- 它仍保留在仓库里作为 legacy 参考组件
- 但当前已经不再挂载到 `src/routes/__root.tsx`
- 也就是说，它不再属于当前仍参与 legacy 运行时的旧组件

所以这些旧 feature 可以当视觉和交互参考，但不应该被误认为“当前已接线的正式页面实现”。

## 5. 后续接管时应该从哪里开始

如果你要把这个仓库拿去做新项目，推荐顺序是：

1. 先改 `src/config/navigation.ts`
2. 再改各业务模块的 `manifest.ts`
3. 用 `resources` 的模式新增真实业务模块
4. 逐步用你的业务页面替换当前占位页
5. 等你自己的模块接管完成后，再考虑清理 legacy 参考面

不要一上来从这些地方开始：

- `src/routes/**`
- `src/context/**`
- 旧 `src/features/auth/*` 页面实现
- 旧 `src/features/tasks/*` / `src/features/users/*` 列表实现

因为它们不是当前 Next 模板的主链，直接在这些文件上续写，很容易把项目重新拉回旧 Vite/TanStack 结构。

## 6. 如果后续要继续清理 legacy

建议按这个顺序做：

1. 先确认 `app/**` 是否已经完全替代对应页面
2. 再确认 `manifest.ts` 是否还需要保留
3. 最后才移除 `src/routes/**`、`src/context/**` 和旧 feature 页面实现

尤其注意：

- 有些模块虽然页面实现已经 legacy 化，但 `manifest.ts` 还在被当前导航系统消费
- 不能把“旧页面实现”与“当前导航注册信息”一起误删

## 7. 一句话结论

现在这仓库应该这样理解：

- **正式模板主线**：`app/** + providers + modules + config + services + resources/settings`
- **可保留的迁移参考**：`src/routes/** + src/context/** + 若干旧 feature 页面实现`
- **接管时优先入口**：`navigation / manifest / resources 模式`
