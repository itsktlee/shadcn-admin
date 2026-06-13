# Spec: dashboard-hydration-clerk-removal

## Goal

修复当前模板三处主链问题：

1. dashboard 顶部导航的 `Overview` 点击会跳到不存在的旧路由并触发默认 404
2. dashboard 壳的 sidebar `variant` 在 SSR / CSR 间不一致，导致 Next 开发态 hydration issue
3. 将 Clerk 相关演示从当前模板主链中完整移除，保持模板纯粹

## Scope

- 收掉 [src/features/dashboard/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/index.tsx) 顶部导航中的假链接
- 增加根级 `not-found` 接管，避免 Next 回落到默认 404 文案
- 让 dashboard layout cookie 从服务端传入 [src/providers/dashboard-layout-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/dashboard-layout-provider.tsx)
- 移除 active surface 中的 Clerk 路由、导航注册、i18n 文案、运行时文档和依赖声明
- 不主动运行 `pnpm install`，锁文件本轮不改

## Done Contract

完成标准：

1. 顶部 `Overview` 不再跳到默认 404
2. 左下角 `1 Issue` 消失
3. 当前 Next 主链中不再出现 Clerk 页面入口
4. 浏览器验收通过

## Change Log

- 将 dashboard 顶部 `TopNav` 的假路由收口到当前首页，避免点击 `Overview` 时进入不存在的旧路由
- 新增根级 `app/not-found.tsx`，让未知路径统一使用模板自定义 404 页面
- 让 dashboard layout 的 `variant / collapsible` 初始值由服务端 cookie 注入，修复 SSR/CSR hydration mismatch
- 从当前 Next 主链移除 Clerk 的 active routes、feature、导航注册、i18n、运行时文档与依赖声明
- 删除 legacy 参考面中的 `src/routes/clerk/**` 与 Clerk logo 资源，并同步收掉 `src/routeTree.gen.ts` 中对这些已删路由的历史引用，避免仓库内遗留断链

## Validation

- 浏览器验收通过：`/`
- 浏览器验收通过：点击顶部 `Overview` 后仍停留在 `/`
- 浏览器验收通过：`/this-route-does-not-exist` 已显示模板自定义 404，而非 Next 默认 404
- 浏览器验收通过：首页不再出现 `Secured by Clerk` 导航项
- 浏览器验收通过：首页未再出现左下角 `1 Issue / Console Error`
- 文本检索通过：`src/routeTree.gen.ts`、`src/`、`app/`、`package.json`、`.env.example`、active runtime docs 中已不再残留 Clerk 主链引用
