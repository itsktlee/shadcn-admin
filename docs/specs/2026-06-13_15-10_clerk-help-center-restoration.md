# Spec: clerk-help-center-restoration

## Goal

收掉开源 demo admin 最后一批仍为 placeholder 的页面：

- `/clerk/sign-in`
- `/clerk/sign-up`
- `/clerk/user-management`
- `/help-center`

同时明确两类页面的最终定位：

- `clerk/*`：`optional integration demo`
- `/help-center`：`showcase page`

## Scope

### Clerk

- 把 `clerk/sign-in` 与 `clerk/sign-up` 从 dashboard placeholder 切到独立 auth 壳
- 保留 `clerk/user-management` 在 dashboard 壳中
- 恢复 Clerk 的缺 key 引导页
- 将 Clerk 环境变量入口切到 Next 可用的 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Help Center

- 用非占位口吻的静态 showcase 页面替换当前 placeholder

### Docs / Config

- `.env.example`
- `docs/template-runtime-config.md`
- `docs/template-active-surface.md`
- `CHANGELOG.md`

## Out of Scope

- 接入真实 Clerk key 并完成真实登录验收
- 新增真正的数据源或客服系统
- 将 `help-center` 升级为真实业务模块
- 改造 `src/routes/clerk/**` 的 legacy 参考面

## Done Contract

完成标准：

1. `clerk/*` 不再显示 placeholder page
2. `/help-center` 不再显示 placeholder page
3. `clerk/*` 页面能清楚表达“这是可选外部集成 demo”
4. `.env.example` 和模板运行时文档补齐 Clerk 环境变量入口
5. 完成一轮本地浏览器验收

仍算未完成的情况：

1. 页面仍出现“占位页 / 后续迁移 / 里程碑”文案
2. Clerk 页面继续引用 `VITE_CLERK_PUBLISHABLE_KEY`
3. 新页面虽然能打开，但页面语义仍让开源使用者误判为正式 reference module

## Canonical Decision

- `resources / settings / sign-in` 仍是模板优先参考页
- `apps / tasks / users / chats / auth / errors / help-center` 是完整 showcase 面
- `clerk/*` 是 `optional integration demo`，不属于普通业务参考页

## Implementation Result

- `help-center` 已从 dashboard placeholder 切换为静态 showcase 页面
- `clerk/sign-in` 与 `clerk/sign-up` 已迁回独立 auth 壳
- `clerk/user-management` 已在 dashboard 壳中恢复为可选外部集成演示
- Clerk 环境变量入口已切换为 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `.env.example`、`docs/template-runtime-config.md`、`docs/template-active-surface.md` 与 `CHANGELOG.md` 已同步口径

## Validation

- 本地 `pnpm dev --port 3001` 日志已确认：
  - `/help-center` 返回 `200`
  - `/clerk/sign-in` 返回 `200`
  - `/clerk/sign-up` 返回 `200`
  - `/clerk/user-management` 返回 `200`
- 已用内置浏览器回归以上四个页面，并确认它们均已显示真实展示内容或 Clerk 配置引导内容，不再是 placeholder
- 已通过静态搜索确认 `app/**` 当前主链中不再存在 `ModulePlaceholderPage / AuthPlaceholderPage / ErrorPlaceholderPage / ComingSoon` 的路由引用
