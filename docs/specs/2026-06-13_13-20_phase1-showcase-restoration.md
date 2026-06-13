# Spec: phase1-showcase-restoration

## Goal

把开源模板第一批最关键的 dashboard showcase 路由从迁移期 placeholder 恢复为完整 demo 页面，消除“后续里程碑迁移”的误导感。

## Scope

本轮只处理四个 dashboard showcase 页面：

- `/apps`
- `/tasks`
- `/users`
- `/chats`

本轮不处理：

- `auth showcase`：`/sign-in-2`、`/sign-up`、`/forgot-password`、`/otp`
- `errors showcase`
- `help-center`
- `clerk/*`
- README 的完整开源说明重写

## Done Contract

完成标准：

1. 以上四个 Next 路由不再渲染 `ModulePlaceholderPage`
2. 四个路由改为展示现有旧 demo 页面内容
3. `docs/template-active-surface.md` 明确这四页已从占位页提升为 showcase 页面

仍算未完成的情况：

1. 页面仍出现“后续迁移 / 占位页 / 里程碑”文案
2. 这四页仍只是显示 route path 的说明卡

## File Scope

### 修改

- `app/(dashboard)/apps/page.tsx`
- `app/(dashboard)/tasks/page.tsx`
- `app/(dashboard)/users/page.tsx`
- `app/(dashboard)/chats/page.tsx`
- `docs/template-active-surface.md`
- `CHANGELOG.md`

## Canonical Decision

这四页在开源模板里采用：

- `showcase page` 定位
- 直接复用现有旧 demo 内容
- 不强行提升为 `reference module`

也就是说：

- 它们负责展示完整 admin demo 的页面观感
- 真正的工程标准参考页仍是 `resources / settings / sign-in`

## Implementation Result

- `apps / tasks / users / chats` 四个路由已改为直接渲染现有旧 demo 页面内容
- `tasks` 页面额外补了 `src/features/tasks/components/tasks-import-dialog.tsx` 的 SSR-safe `FileList` 校验，消除 Next 预渲染时的 `FileList is not defined` 阻断
- 当前模板页面分层收口为：
  - `reference pages`：`/resources`、`/settings/*`、`/sign-in`
  - `showcase pages`：`/apps`、`/tasks`、`/users`、`/chats`

## Validation

- 本地 `pnpm dev --port 3001` 日志已确认 `/tasks` 从 `ReferenceError: FileList is not defined` 恢复为 `GET /tasks 200`
- 已确认 `/apps`、`/users`、`/chats` 在本轮恢复后没有新增 runtime 阻断日志
- 内置浏览器会话可读到当前 tab URL，但 `domSnapshot/screenshot` 在本轮 dev 页上持续超时，因此未产出稳定截图证据

## Next Step

下一轮进入：

- `auth showcase` 恢复
- `errors showcase` 恢复
- 再处理 `help-center` 与 `clerk/*` 的单独口径
