# 模板使用指南

本文面向“后续直接拿这个仓库做项目”的使用场景。

## 1. 先理解这不是原始 Vite 版

当前仓库已经不是上游的原始 `Vite + TanStack Router` 项目，而是迁移后的 `Next.js App Router` 母模板。

默认应把它理解成：

- 一个保留完整 demo admin 展示面的开源模板
- 一个带工程基线的可接管母模板

而不是默认继续收缩成极简空壳。

如果你后续让 AI 在这个仓库上继续开发，应明确告诉它：

- 这是 `Next.js` 项目
- 保留现有 dashboard shell
- 使用现有 `feature-first` 结构
- 使用现有 `contracts / services / providers / modules` 分层

在真正开始接管前，建议先看这份边界说明：

- [当前模板活跃面与 Legacy 边界](./template-active-surface.md)

这份文档会明确告诉你：

- 哪些目录是当前真正运行的 Next 模板面
- 哪些旧 `Vite / TanStack Router` 文件只是迁移参考
- 哪些 `manifest.ts` 仍然活跃，但对应旧页面实现已经不是当前主线

如果你后续明确要做“极简母模板分支”或历史包袱裁剪，再看这两份：

- [Legacy 清理清单](./template-legacy-removal-checklist.md)
- [模板展示面策略](./template-showcase-strategy.md)

## 2. 业务接管的推荐顺序

在真正动手前，建议先明确你要走哪条路线：

### 路线 A：保留完整 demo admin

适合：

- 开源模板
- 内部基础模板
- 希望拉下来就能看到完整展示面

做法：

- 保留 `apps / tasks / users / chats / help-center / auth showcase / errors showcase`
- 优先替换导航、manifest、`resources`、mock auth 和 adapter

### 路线 B：极简母模板

适合：

- 只给内部项目组使用
- 不需要完整 demo admin 展示面
- 明确接受继续裁剪历史参考面

做法：

- 在保留工程基线后，按需进入 legacy / showcase 清理
- 这条路线不是当前仓库的默认建议

### 第一阶段：先接管壳

优先替换：

- `src/config/shell.ts`
- `src/features/*/manifest.ts`
- `src/config/navigation.ts`
- `src/modules/registry.ts`

目标是先让默认团队信息、左侧导航、命令面板、权限过滤和路由骨架变成你的业务模块。

### 第二阶段：再接管参考模块

当前模板的参考模块是 `resources`：

- 路由：`/resources`
- 作用：演示列表、CRUD、权限、adapter、query、字段错误映射

你可以：

1. 直接照抄它的模式做真实模块
2. 先关闭它，再换成你的业务模块

关闭方式：

```bash
NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES=false
```

### 第三阶段：替换 mock 层

优先替换：

- `src/services/auth/*`
- `src/services/adapters/mock/*`
- `src/services/adapters/http/*`

建议顺序：

1. 先换数据 adapter
2. 再换 auth bridge
3. 最后再考虑是否换权限来源

## 3. 当前模板里哪些属于“基线能力”

这些建议保留：

- `App Router` 壳层结构
- i18n provider
- theme provider
- auth provider
- module registry
- navigation resolver
- shared contracts / schema
- query key 组织方式

这些是“参考实现”，可以替换：

- `resources`
- mock auth profile
- mock adapter data
- 示例页面内容

另外要单独区分两类页面：

- `showcase demo`
  - `apps / tasks / users / chats / help-center / auth showcase / errors showcase`
- `engineering baseline`
  - `resources / settings / sign-in`

前者更偏展示和布局参考，后者更适合作为业务接管起点。

## 3.1 认证页的模板口径

当前模板里的认证页不只是登录入口，也是展示页：

- `/sign-in`
- `/sign-in-2`
- `/sign-up`
- `/forgot-password`
- `/otp`

这些页面在已登录状态下也仍然允许访问，目的是让接手模板的人随时查看 auth 页面样式，不会因为已有 session 被强制跳回 dashboard。

## 4. i18n 怎么继续接

当前模板不是自动翻译系统。

它做的是：

- 提供 `zh-CN / en` 资源结构
- 提供语言切换机制
- 提供文案组织方式

你后续开发时，仍然需要：

1. 写中文文案 key
2. 写对应英文文案
3. 在组件里使用 `t('...')`

它不会自动把你新增的中文页面翻译成英文。

## 5. 权限系统怎么继续接

当前权限基线是动作级 key，例如：

- `resources.view`
- `resources.create`
- `resources.edit`
- `resources.delete`

你后续新增业务模块时，建议延续同样模式：

- `orders.view`
- `orders.create`
- `orders.edit`
- `orders.delete`

这样可以继续复用：

- navigation filtering
- route guard
- action rendering

## 5.1 mock auth 怎么继续接

当前 mock auth 的规则是：

- 任意合法邮箱 + 至少 7 位密码可登录
- `viewer@...` 或 `+viewer@...` -> viewer 权限
- `operator@...` 或 `+operator@...` -> operator 权限
- 其他邮箱默认 -> admin 权限

这意味着它不是“固定演示账号”模式，而是“按邮箱前缀映射权限档位”的模板基线。后续如果你接入真实认证服务，优先替换：

- `src/services/auth/client.ts`
- `src/services/auth/shared.ts`
- `src/providers/auth-provider.tsx`

## 6. 测试运行时说明

当前模板的 Vitest Browser Mode 已调整为：

- macOS 下优先读取系统默认浏览器
- 默认浏览器若是 Chrome / Edge，直接复用本机浏览器

显式脚本：

```bash
pnpm run test:browser:chrome
pnpm run test:browser:edge
```

更完整的运行时配置入口见：

- [模板运行时配置](./template-runtime-config.md)

## 7. 这套模板最适合什么项目

适合：

- 中后台系统
- CRM / ERP / Admin Panel
- 以列表页、表单、权限、配置页为核心的业务系统

不适合直接拿来当：

- 营销官网
- 内容型站点
- 强 SEO 内容平台

## 8. 给后续 AI 的最小提示词

后续如果你继续让 AI 基于这个仓库开发，建议至少给它这几个事实：

1. 这是 `Next.js App Router` 模板，不是 Vite
2. 保留现有 dashboard shell，不要重做外框
3. 按 `feature-first` 新增模块
4. 复用现有 `contracts / services / modules / providers`
5. 优先参考 `resources` 模块的模式实现新业务模块
6. 这是保留完整展示面的模板，不要默认继续清 legacy
