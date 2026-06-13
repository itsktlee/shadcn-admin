# Spec: phase1-tail-phase2-auth-errors-restoration

## Goal

先收掉开源 demo admin 的 `Phase 1` 尾项，再把 `auth / errors` 这批仍为 placeholder 的页面恢复为完整 showcase 页面，继续消除“迁移中 / 占位页”的误导感。

## Scope

### Phase 1 尾项

- 收掉 `/chats` 当前的 Next warning
- 补一轮 `apps / tasks / users / chats` 的浏览器回归验收

### Phase 2

- `/sign-in-2`
- `/sign-up`
- `/forgot-password`
- `/otp`
- `/errors/unauthorized`
- `/errors/forbidden`
- `/errors/not-found`
- `/errors/internal-server-error`
- `/errors/maintenance-error`

## Out of Scope

- `/help-center`
- `/clerk/*`
- README 全量重写
- 把 showcase 页升级成 reference module
- 为旧 errors/auth demo 做额外的视觉重设计

## Done Contract

完成标准：

1. `/chats` 不再出现当前默认导出 JSON 的命名访问 warning
2. 上述 auth / errors 路由不再渲染 placeholder page
3. 这些路由改为直接展示现有旧 demo 内容
4. `docs/template-active-surface.md` 明确 auth / errors 的 showcase 定位
5. 至少完成一轮本地浏览器可视验收

仍算未完成的情况：

1. 页面仍显示“占位页 / 后续迁移 / 里程碑”文案
2. 页面能打开，但出现新的 runtime crash
3. 只完成路由接线，没有同步当前活跃面文档

## Candidate File Scope

### Phase 1 Tail

- `src/features/chats/index.tsx`

### Phase 2 Auth

- `app/(auth)/sign-in-2/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/otp/page.tsx`

### Phase 2 Errors

- `app/(errors)/errors/unauthorized/page.tsx`
- `app/(errors)/errors/forbidden/page.tsx`
- `app/(errors)/errors/not-found/page.tsx`
- `app/(errors)/errors/internal-server-error/page.tsx`
- `app/(errors)/errors/maintenance-error/page.tsx`

### Docs

- `docs/template-active-surface.md`
- `CHANGELOG.md`

## Canonical Decision

- `apps / tasks / users / chats / auth showcase / errors showcase` 这一批页面维持 `showcase page` 定位
- 它们负责提供完整 demo admin 的展示面
- `resources / settings / sign-in` 仍是优先参考的 `reference pages`

## Implementation Plan

1. 先用最小改动修 `chats` 的导入 warning
2. 把 auth / errors 路由从 placeholder 接到现有旧 demo 组件
3. 更新活跃面文档与 changelog
4. 做浏览器回归验收，并把证据回写 spec

## Implementation Result

- `src/features/chats/index.tsx` 已改为通过 `src/features/chats/data/conversations.ts` 间接消费 `convo.json`，收掉 Next 对默认导出 JSON 模块的 warning
- `/sign-in-2`、`/sign-up`、`/forgot-password`、`/otp` 已从 `AuthPlaceholderPage` 切回旧 auth demo 页面
- `src/features/auth/sign-in/sign-in-2.tsx` 已补齐 Next 静态图片 `.src` 兼容，避免请求 `/[object Object]`
- `/errors/unauthorized`、`/errors/forbidden`、`/errors/not-found`、`/errors/internal-server-error`、`/errors/maintenance-error` 已从 `ErrorPlaceholderPage` 切回旧错误页 demo 页面
- 恢复后的错误页已接入 `errorsShowcase.*` i18n key，避免中文模式下回退成英文硬编码
- `docs/template-active-surface.md` 与 `CHANGELOG.md` 已同步当前活跃面口径

## Validation

- 本地 `pnpm dev --port 3001` 日志已确认 `chats` 页重新编译后不再出现默认导出 JSON 模块 warning
- 本地 `pnpm dev --port 3001` 日志已确认 `/sign-in-2` 不再出现 `GET /[object%20Object] 404`
- 已用内置浏览器回归以下页面，并确认均已显示真实 demo 内容而非 placeholder：
  - `/chats`
  - `/sign-in-2`
  - `/sign-up`
  - `/forgot-password`
  - `/otp`
  - `/errors/unauthorized`
  - `/errors/forbidden`
  - `/errors/not-found`
  - `/errors/internal-server-error`
  - `/errors/maintenance-error`
