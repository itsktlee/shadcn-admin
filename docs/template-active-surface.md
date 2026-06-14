# 当前模板活跃面与 Legacy 边界

本文只回答一个问题：**现在这个仓库里，哪些是当前真正运行的 Next 模板面，哪些只是为了迁移参考而保留的旧实现。**

如果你后续要把这个仓库当成长期母模板，请先看这份说明，再决定从哪里接手。

如果你想先理解“为什么这里要同时保留完整展示面和工程基线”，先看：

- [模板展示面策略](./template-showcase-strategy.md)

如果你明确要做“极简母模板”或历史裁剪，可继续看：

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

后续如果要改模板的全局行为，应该从这里入手，而不是从已退役的 legacy 参考面入手。

### 1.2 当前真实页面覆盖范围

当前 `app/**` 里主要分成三层：

1. `Showcase Demo`
   - `/`
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

2. `Engineering Baseline`
   - `/resources`
   - `/settings`
   - `/settings/account`
   - `/settings/appearance`
   - `/settings/display`
   - `/settings/language`
   - `/settings/notifications`
   - `/sign-in`

3. `Configurable Reference Module`
   - `/resources`
   - 由 `src/config/template-modules.ts` 控制启停

需要特别注意两点：

- `/` 虽然当前入口是 `src/features/dashboard/index.tsx`，但它承担的是模板首页 showcase 角色
- `resources / settings / sign-in` 更适合作为后续业务接管时的工程参考起点

这意味着：**当前模板的正式运行面既包含完整 demo admin 展示页，也包含更适合复用的工程基线页。**

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
- `src/features/auth/sign-in/index.tsx`
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
- `sign-in / sign-in-2 / sign-up / forgot-password / otp / errors / help-center` 的独立示例页结构与壳层边界处理

这里要区分两件事：

- “可直接拿来写业务”的工程参考程度
- “是否已经接在当前 Next 主链上”

`apps / tasks / users / chats / help-center / auth showcase / errors showcase` 这些页面现在**已经接在当前 Next 主链上**，只是它们更偏展示面，不是首选工程基线。

## 3. manifest 是活跃的，很多 feature 页面本身也已经是活跃展示面

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

而在当前仓库里，很多 `manifest` 对应的 feature 页面本身也已经被 `app/**` 接回来了。

例如：

- `src/features/users/manifest.ts` 是活跃的
- `app/(dashboard)/users/page.tsx` 当前也确实接到了 `src/features/users/index.tsx`

因此后续接管时要区分：

- `manifest.ts` 是否属于当前导航注册链
- `index.tsx` 当前是作为 `showcase demo` 还是 `engineering baseline`
- 目录里的旧测试、旧桥接代码、历史兼容逻辑是否仍值得继续保留

## 4. 当前 Legacy 参考面

以下内容目前应视为 **legacy 迁移参考面**，不是当前正式模板主线。

### 4.0 已退役的 legacy 入口

- `index.html`
- `src/main.tsx`

当前这两个文件仍保留在仓库里，但边界已经更新为：

- `index.html` 仍会加载 `/src/main.tsx`
- `src/main.tsx` 现在只渲染 retired legacy notice
- 它不再启动旧 `TanStack Router + Vite` runtime

也就是说，仓库里仍保留 legacy 入口源码，但已经不再保留“第二套可执行应用”。

### 4.1 已物理移除的首批 legacy 链

- `src/routes/**`
- `src/routeTree.gen.ts`
- `src/components/navigation-progress.tsx`
- `src/stores/auth-store.ts`
- `src/features/auth/sign-in/components/user-auth-form.tsx`

这批文件已经从仓库中删除。它们不再是“还能接回来”的预留面，而是已经完成退役的旧实现。

### 4.2 已进一步收窄的旧 shell / feature 参考实现

以下这类文件目前更多是“迁移参考遗留面”，不应作为新开发的默认起点：

- 未接入当前 `app/**` 主链的旧 `TanStack Router` 页面与布局文件

也就是说，当前 remaining legacy 已经不再是一整套旧路由树，也不再包含旧 provider 壳，而是更窄的旧页面实现参考面。

其中有一类情况要单独说明：

- `apps / tasks / users / chats / help-center / auth showcase / errors showcase` 已经重新接回当前 `app/**` 主链
- 它们是当前正式模板的一部分
- 但它们承担的是展示面角色，不等于都是首选工程基线

所以更准确的说法是：

- 它们是当前正式页面实现
- 但后续做真实业务接管时，优先级仍低于 `resources / settings / sign-in`

## 5. 后续接管时应该从哪里开始

如果你要把这个仓库拿去做新项目，推荐顺序是：

1. 先改 `src/config/navigation.ts`
2. 再改各业务模块的 `manifest.ts`
3. 用 `resources` 的模式新增真实业务模块
4. 逐步用你的业务页面替换当前 showcase demo
5. 只有在你明确要走极简路线时，再考虑清理 legacy 参考面

不要一上来从这些地方开始：

- 旧 `src/features/auth/*` 页面实现
- 旧 `src/features/tasks/*` / `src/features/users/*` 列表实现

因为它们虽然已经接回当前 Next 主链，但承担的是展示面角色；如果直接把业务长期堆在这些 demo 页面上，后续模块边界会比较混。

## 6. 如果后续要继续清理 legacy

这不是当前模板的默认下一步，只在你明确要做裁剪分支时再看。建议顺序是：

1. 先确认 `app/**` 是否已经完全替代对应页面
2. 再确认 `manifest.ts` 是否还需要保留
3. 最后才移除剩余旧 feature 页面实现与相关依赖

尤其注意：

- 有些模块虽然页面实现已经 legacy 化，但 `manifest.ts` 还在被当前导航系统消费
- 不能把“旧页面实现”与“当前导航注册信息”一起误删

## 7. 一句话结论

现在这仓库应该这样理解：

- **正式模板主线**：`app/** + providers + modules + config + services`
- **完整展示面**：`dashboard + apps + tasks + users + chats + help-center + auth showcase + errors showcase`
- **工程基线**：`resources + settings + sign-in`
- **已物理删除的 legacy 链**：`src/routes/** + src/routeTree.gen.ts + auth-store + navigation-progress + src/context/** + authenticated-layout`
- **可保留的迁移参考**：`src/main.tsx + 若干旧 feature 页面实现`
- **接管时优先入口**：`navigation / manifest / resources 模式`
