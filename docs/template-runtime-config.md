# 模板运行时配置

本文只记录当前模板已经存在、并建议后续项目直接复用的运行时配置入口。

## 1. Reference Module 开关

当前模板内置一个参考模块：`resources`。

默认开启：

```bash
NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES=true
```

如果你准备把模板接到真实业务里，想先关掉参考模块：

```bash
NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES=false
```

关闭后的效果：

- sidebar / command menu 不再注册 `resources`
- `/resources` 路由入口直接 `notFound`
- middleware 不再把 `/resources` 当成模板主路径

代码入口：

- [src/config/template-modules.ts](/Users/ktlee/coding/shadcn-admin/src/config/template-modules.ts)

## 2. Mock Auth 演示账号规则

当前模板默认还是 mock auth 基线，不绑定真实 auth SDK。

规则不是固定死账号表，而是按邮箱模式识别权限档位：

### Viewer

- `viewer@template.dev`
- 任意包含 `+viewer@` 的邮箱

示例：

- `qa+viewer@template.dev`

### Operator

- `operator@template.dev`
- 任意包含 `+operator@` 的邮箱

示例：

- `ops+operator@template.dev`

### Admin

- 其他邮箱默认都会落到 `admin`

示例：

- `admin@template.dev`
- `founder@company.com`

代码入口：

- [src/services/auth/shared.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/shared.ts)

## 3. 浏览器测试运行时

当前模板的 Vitest Browser Mode 已经调整为：

- macOS 下优先读取系统默认浏览器
- 默认浏览器若是 Chrome / Edge，优先复用系统浏览器
- 未命中时回退到普通 `chromium`

### 推荐脚本

默认：

```bash
pnpm test
```

显式 Chrome：

```bash
pnpm run test:browser:chrome
```

显式 Edge：

```bash
pnpm run test:browser:edge
```

### 显式环境变量覆盖

如果你需要在特殊机器或 CI 上覆盖浏览器运行时，可用：

```bash
VITEST_BROWSER_CHANNEL=chrome
VITEST_BROWSER_CHANNEL=msedge
VITEST_BROWSER_INSTANCE=firefox
VITEST_BROWSER_INSTANCE=webkit
```

说明：

- `VITEST_BROWSER_CHANNEL` 主要用于 branded Chromium 浏览器
- `VITEST_BROWSER_INSTANCE` 用于切换到 `firefox / webkit / chromium`
- 这两个不是 Next.js 前端运行时变量，主要给测试命令使用

代码入口：

- [vite.config.ts](/Users/ktlee/coding/shadcn-admin/vite.config.ts)

## 4. UI 偏好 Cookie Key

当前模板主链使用的 UI 偏好 cookie key 为：

- `template-ui-theme`
- `template-ui-language`
- `font`
- `dir`

其中主题和语言已经保留对旧 key 的兼容读取：

- `vite-ui-theme`
- `vite-ui-language`

兼容策略：

- 若用户本地仍只有旧 key，当前模板仍可正常读取
- 当前主链完成 hydration 或用户交互后，会自动迁移到新的 `template-ui-*` key

代码入口：

- [src/lib/cookies.ts](/Users/ktlee/coding/shadcn-admin/src/lib/cookies.ts)
- [app/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/layout.tsx)
- [src/providers/theme-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/theme-provider.tsx)
- [src/i18n/index.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/index.ts)

## 5. 后续接管建议

如果你后续把这个仓库直接当业务母模板，建议：

1. 先保留当前这些模板开关
2. 先替换业务模块，再替换 mock 层
3. 不要一开始就把运行时配置入口打散进多个地方
