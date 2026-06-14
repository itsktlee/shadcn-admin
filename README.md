# Shadcn Admin Next.js Template

基于 `satnaing/shadcn-admin` 视觉壳重建的 `Next.js App Router` 母模板。当前仓库已经不再是原始的 `Vite + TanStack Router` 版本，而是面向长期复用的 `Next.js` 模板壳。

![Shadcn Admin](public/images/shadcn-admin.png)

## 当前模板定位

这个仓库现在提供的是一套可复用的后台母模板，重点在：

- 保留原项目的整体壳层风格与交互结构
- 切到 `Next.js App Router`
- 保留浅色 / 深色模式
- 接入模板级 `i18next`
- 提供动作级权限基线
- 提供一个可关闭的 `Reference Module` 参考实现
- 保留完整 demo admin 展示面
- 提供最小自动回归测试基线

它的默认交付形态不是“极简空壳”，而是同时提供：

- 一套可以直接开源展示的完整后台模板
- 一套可以逐步接管为真实业务系统的工程基线

## 当前技术栈

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Shadcn UI + Radix UI`
- `Tailwind CSS v4`
- `TanStack Query`
- `i18next`
- `Vitest Browser Mode`

## 模板能力

- Dashboard Shell
- Sidebar / Header / Command Menu
- 中英双语切换
- 亮色 / 暗色 / 系统主题
- Mock Auth Session 基线
- 认证页展示逻辑基线
- 动作级权限裁剪
- `resources` 参考列表 + CRUD 模块
- 模板级 `Reference Module` 启停开关

## 展示面分层

当前仓库同时保留三层内容：

- `Showcase Demo`
  - `dashboard / apps / tasks / users / chats / help-center / auth showcase / errors showcase`
- `Engineering Baseline`
  - `resources / settings / sign-in`
- `Optional Legacy Reference`
  - `index.html + src/main.tsx` 与少量未接回 `app/**` 的旧参考实现

这三层的详细边界见：

- [模板展示面策略](./docs/template-showcase-strategy.md)
- [当前模板活跃面与 Legacy 边界](./docs/template-active-surface.md)

## 目录锚点

- `app/`
  - Next.js App Router 入口
- `src/features/`
  - feature-first 模块
- `src/modules/`
  - 模块注册与导航解析
- `src/contracts/`
  - 共享契约 / schema
- `src/services/`
  - auth / adapter / query 等服务层
- `src/providers/`
  - theme / i18n / auth / query provider
- `docs/`
  - 模板使用、展示面、运行时与裁剪路线说明

## 本地运行

安装依赖：

```bash
pnpm install
```

启动开发环境：

```bash
pnpm dev
```

说明：

- `pnpm dev` 是当前正式的 `Next.js App Router` 开发入口
- 仓库里保留的 `index.html + src/main.tsx` 仅作为 retired legacy reference entry，不是当前模板主运行链

## Mock Auth 规则

当前模板默认内置一层 mock auth，便于直接验收壳层、权限和表单流程。

- 登录页不是固定演示账号模式
- 任意合法邮箱 + 至少 7 位密码都可以登录
- 权限档位由邮箱前缀决定：
  - `viewer@...` 或 `xxx+viewer@...` -> viewer
  - `operator@...` 或 `xxx+operator@...` -> operator
  - 其他邮箱 -> admin

示例：

- `admin@template.dev / 1234567`
- `viewer@template.dev / 1234567`
- `operator@template.dev / 1234567`

另外，`/sign-in`、`/sign-in-2`、`/sign-up`、`/forgot-password`、`/otp` 这些认证页在当前模板里同时承担 `showcase` 作用，所以即使已经登录，也仍然可以继续访问查看页面样式。

## 测试脚本

默认浏览器测试：

```bash
pnpm test
```

显式使用本机 Chrome：

```bash
pnpm run test:browser:chrome
```

显式使用本机 Edge：

```bash
pnpm run test:browser:edge
```

说明：

- 当前模板已经调整为优先复用本机默认浏览器
- 若默认浏览器是 Chrome / Edge，会优先走系统已安装浏览器
- 不再默认依赖 Playwright 自带 Chromium 二进制
- 当前 `Vitest` 配置只承担浏览器测试运行时，不再承载 legacy `TanStack Router` 文件路由树

## 参考模块开关

当前模板提供一个 `resources` 参考模块，默认开启。

如果你接手模板做真实业务，想先关掉它，可设置：

```bash
NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES=false
```

关闭后：

- sidebar / command menu 不再注册 `resources`
- `/resources` 路由会直接 `notFound`
- middleware 不再把 `/resources` 视为模板主入口

## 模板接管建议

推荐接管顺序：

1. 先替换 sidebar 导航里的业务模块
2. 再替换 `resources` 参考模块为真实业务模块
3. 最后替换 mock auth / mock adapter

不建议一开始就把壳层、权限、i18n、数据契约一起推倒重来。

如果你准备开源或内部长期复用，默认建议保留完整 demo admin 展示面；只有在你明确要做“极简母模板分支”时，再进入裁剪路线。

## 深入文档

- [模板展示面策略](./docs/template-showcase-strategy.md)
- [模板使用指南](./docs/template-adoption-guide.md)
- [Legacy 清理清单（可选裁剪路线）](./docs/template-legacy-removal-checklist.md)
- [模板运行时配置](./docs/template-runtime-config.md)

## License

沿用原项目许可证，详见仓库内 license 文件。
