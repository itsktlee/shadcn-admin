## [2026-06-13] - Auth 响应式与移动端收口

### 修复

- **变更摘要**：调整 [app/(auth)/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/layout.tsx) 与 [src/features/auth/auth-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/auth-layout.tsx) 的职责边界，移除 auth 路由组统一窄容器限制，将语言切换入口提升为页面级右上角，修复 `/sign-in-2` 双栏页被压缩和普通 auth 页入口定位错误的问题。
- **变更摘要**：更新 [app/(auth)/sign-in/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/sign-in/page.tsx) 与 [src/features/auth/sign-in/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/index.tsx)，让 `/sign-in` 从 shell 占位页恢复为真实登录展示页。
- **变更摘要**：更新 [src/features/auth/sign-up/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-up/index.tsx)、[src/features/auth/forgot-password/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/forgot-password/index.tsx)、[src/features/auth/otp/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/otp/index.tsx)，修复注册/找回密码/OTP 页在手机竖屏下卡片宽度异常收缩的问题。
- **变更摘要**：收口 [src/components/layout/header.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/header.tsx)、[src/components/search.tsx](/Users/ktlee/coding/shadcn-admin/src/components/search.tsx) 与 [src/features/dashboard/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/index.tsx) 的移动端布局，消除 dashboard 首页手机竖屏的轻微横向溢出。
- **变更摘要**：新增 `@next/eslint-plugin-next` 并更新 [eslint.config.js](/Users/ktlee/coding/shadcn-admin/eslint.config.js) 的 flat config 结构，补齐 Next lint 集成；同时调整 [src/components/auth/permission-denied-state.tsx](/Users/ktlee/coding/shadcn-admin/src/components/auth/permission-denied-state.tsx)、[src/features/auth/sign-in/sign-in-2.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/sign-in-2.tsx)、[src/features/chats/components/new-chat.tsx](/Users/ktlee/coding/shadcn-admin/src/features/chats/components/new-chat.tsx) 与 [next.config.ts](/Users/ktlee/coding/shadcn-admin/next.config.ts)，收掉最终门禁中新增暴露的 `Link` / `Image` / remote image 规则问题。
- **变更摘要**：更新 [.gitignore](/Users/ktlee/coding/shadcn-admin/.gitignore) 并清理 `.codegraph/`、`.DS_Store`、`.next`、`dist`、`.tanstack`、`pnpm-workspace.yaml` 等本地生成物，确保提交前工作区只保留需要入库的源码与文档。
- **影响范围**：影响 auth showcase 页的桌面/移动端展示质量、语言切换入口的页面级一致性，以及 dashboard 首页手机竖屏的可用性。
- **影响范围**：同时影响最终交付前的 ESLint / Next build 门禁质量，以及提交到仓库时本地生成物的收口状态。
- **验证证据**：已使用内置浏览器在 `http://localhost:3003` 对 `/sign-in`、`/sign-in-2`、`/sign-up`、`/forgot-password`、`/otp`、`/` 进行 `1920x1080`、`1680x1050`、`390x844` 三组视口验收；已确认 auth 全链路无横向溢出、`/sign-in-2` 双栏宽度恢复正常、`/sign-in` 不再显示 shell 占位文案、dashboard 首页 mobile 无横向溢出，且最终控制台 `warn/error` 日志为空。
- **验证证据**：已执行 `pnpm lint` 与 `pnpm build`；两者均通过，且 `next build` 不再出现 Next ESLint plugin 检测 warning。

## [2026-06-13] - Dashboard 主链修复与 Clerk 移除

### 修复

- **变更摘要**：修正 dashboard 顶部导航中的旧 showcase 假链接，并补上根级 `not-found` 接管，避免点击 `Overview` 等入口时落回 Next 默认 404 文案。
- **变更摘要**：调整 dashboard layout 初始值来源，让 sidebar `variant / collapsible` 在 SSR 与客户端 hydration 间保持一致，修复开发态 `1 Issue` 提示中的 hydration mismatch。
- **变更摘要**：将 Clerk 相关演示从模板主链移除，包括 active routes、导航注册、i18n 文案、运行时文档与 `package.json` 中的 `@clerk/react` 依赖声明。
- **变更摘要**：同步清理 [src/routeTree.gen.ts](/Users/ktlee/coding/shadcn-admin/src/routeTree.gen.ts) 中对已删除 `src/routes/clerk/**` 的历史引用，避免 legacy Vite 参考入口继续保留断链生成物。
- **变更摘要**：为 dashboard 最近销售补齐本地 SVG 头像资源，并将 [src/features/dashboard/components/recent-sales.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/components/recent-sales.tsx) 中不存在的 `/avatars/*.png` 引用改为可用静态资源，收掉首页头像 404。
- **变更摘要**：将 [src/features/dashboard/components/overview.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/components/overview.tsx) 与 [src/features/dashboard/components/analytics-chart.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/components/analytics-chart.tsx) 的图表数据改为固定 demo 值，并增加稳定高度容器与 mounted 后渲染，避免刷新跳数及 Recharts `width(-1)` 开发态 warning。
- **变更摘要**：移除 [middleware.ts](/Users/ktlee/coding/shadcn-admin/middleware.ts) 中“已登录访问 `/sign-in` 自动回 dashboard”的分支，让认证页恢复为可随时查看的模板展示页，同时保留后台受保护路由的未登录跳转逻辑。
- **变更摘要**：收口 dashboard 图表渲染链路，更新 [src/features/dashboard/components/overview.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/components/overview.tsx) 与 [src/features/dashboard/components/analytics-chart.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/components/analytics-chart.tsx) 为容器尺寸测量后再渲染，并直接向 Recharts 传入数值宽高，消除最终交付前的图表渲染不稳与控制台 warning。
- **变更摘要**：更新 [README.md](/Users/ktlee/coding/shadcn-admin/README.md) 与 [docs/template-adoption-guide.md](/Users/ktlee/coding/shadcn-admin/docs/template-adoption-guide.md)，明确 mock auth 的登录规则、权限档位映射，以及认证页同时承担 showcase 的模板口径。
- **影响范围**：影响 dashboard 顶部导航行为、自定义 404 展示、dashboard 壳初始布局一致性，以及模板对第三方认证供应商的默认中立性。
- **验证证据**：已使用内置浏览器在 `http://localhost:3002` 验收 `/` 与一个不存在路径；已确认顶部 `Overview` 点击后仍停留在首页、自定义 404 已接管未知路径、首页已不再出现 `Secured by Clerk` 导航项，且左下角 `1 Issue` 提示已消失。
- **验证证据**：已通过文本检索确认 `src/routeTree.gen.ts`、`src/`、`app/`、`package.json`、`.env.example` 与 active runtime docs 中不再残留 Clerk 主链引用。
- **验证证据**：已使用内置浏览器回归 `http://localhost:3002/`，确认首页 5 个头像均成功加载、`Overview` 图表存在 12 根柱子、`Analytics` 页签图表正常显示；已复核开发服务器日志，确认不再出现 `/avatars/*.png` 404 与 Recharts `width(-1)` warning。
- **验证证据**：已使用内置浏览器回归 `http://localhost:3002/sign-in` 与 `http://localhost:3002/resources`，确认已有登录态时 `/sign-in` 不再回跳 dashboard，且退出登录后访问受保护路由仍会跳到 `/sign-in?redirect=%2Fresources`。
- **验证证据**：已执行 `pnpm build` 与 `pnpm lint`；两者均通过。已在生产模式下用内置浏览器回归 `/sign-in`、`/`、`Analytics` 页签与退出登录后的 `/resources`，确认 dashboard 图表正常显示、认证页展示逻辑正常、受保护路由回跳正常，且最终浏览器控制台 `warn/error` 日志为空。

## [2026-06-13] - 首页与 Clerk 展示一致性修复

### 修复

- **变更摘要**：将 [app/(dashboard)/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/page.tsx) 从 `multishell` 预览页切回原版 [src/features/dashboard/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/index.tsx)，恢复模板首页的 dashboard showcase 展示。
- **变更摘要**：重写 [src/features/clerk/clerk-auth-demo-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/clerk/clerk-auth-demo-layout.tsx) 为原认证页双栏骨架，并调整 [src/features/clerk/sign-in-demo.tsx](/Users/ktlee/coding/shadcn-admin/src/features/clerk/sign-in-demo.tsx)、[src/features/clerk/sign-up-demo.tsx](/Users/ktlee/coding/shadcn-admin/src/features/clerk/sign-up-demo.tsx) 的 fallback 容器宽度，修复 `clerk/*` 在缺少 key 时的明显错位。
- **影响范围**：影响模板首页的默认首屏观感，以及 `clerk/sign-in`、`clerk/sign-up` 作为可选外部认证 demo 的展示质量。
- **验证证据**：已使用内置浏览器在 `http://localhost:3002` 完成 `/`、`/clerk/sign-in`、`/clerk/sign-up` 验收；已确认首页恢复原版 dashboard showcase，且 Clerk 登录/注册页在缺少 key 时不再出现窄列挤压。

## [2026-06-13] - 模板默认身份中性化

### 修改

- **变更摘要**：将 [app/(dashboard)/apps/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/apps/page.tsx)、[app/(dashboard)/tasks/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/tasks/page.tsx)、[app/(dashboard)/users/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/users/page.tsx)、[app/(dashboard)/chats/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/chats/page.tsx) 从 `ModulePlaceholderPage` 切回旧 demo 页面内容，恢复第一批 dashboard showcase 页面。
- **变更摘要**：修正 [src/features/tasks/components/tasks-import-dialog.tsx](/Users/ktlee/coding/shadcn-admin/src/features/tasks/components/tasks-import-dialog.tsx) 对浏览器全局 `FileList` 的直接依赖，改为 SSR-safe 校验，避免 `/tasks` 在 Next 预渲染阶段直接 500。
- **变更摘要**：将 [app/(auth)/sign-in-2/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/sign-in-2/page.tsx)、[app/(auth)/sign-up/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/sign-up/page.tsx)、[app/(auth)/forgot-password/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/forgot-password/page.tsx)、[app/(auth)/otp/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/otp/page.tsx) 从 `AuthPlaceholderPage` 切回旧 auth demo 页面内容，恢复第二批 auth showcase 页面。
- **变更摘要**：修正 [src/features/auth/sign-in/sign-in-2.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/sign-in-2.tsx) 中静态图片在 Next 下被串成 `/[object Object]` 的问题，改为显式使用静态资源 `.src`。
- **变更摘要**：将 [app/(errors)/errors/unauthorized/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(errors)/errors/unauthorized/page.tsx)、[app/(errors)/errors/forbidden/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(errors)/errors/forbidden/page.tsx)、[app/(errors)/errors/not-found/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(errors)/errors/not-found/page.tsx)、[app/(errors)/errors/internal-server-error/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(errors)/errors/internal-server-error/page.tsx)、[app/(errors)/errors/maintenance-error/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(errors)/errors/maintenance-error/page.tsx) 从 `ErrorPlaceholderPage` 切回旧错误页 demo 页面内容，并保留在独立 errors 壳中运行。
- **变更摘要**：更新 [src/features/errors/unauthorized-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/unauthorized-error.tsx)、[src/features/errors/forbidden.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/forbidden.tsx)、[src/features/errors/not-found-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/not-found-error.tsx)、[src/features/errors/general-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/general-error.tsx)、[src/features/errors/maintenance-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/maintenance-error.tsx) 与 [src/features/errors/legacy-error-actions.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/legacy-error-actions.tsx)，为恢复后的错误页补齐模板级 i18n，避免中英文切换覆盖倒退。
- **变更摘要**：新增 [src/features/chats/data/conversations.ts](/Users/ktlee/coding/shadcn-admin/src/features/chats/data/conversations.ts) 并调整 [src/features/chats/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/chats/index.tsx) 的假数据导入方式，收掉 Next 对默认导出 JSON 模块的持续 warning。
- **变更摘要**：将 [app/(dashboard)/help-center/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/help-center/page.tsx) 从 `ModulePlaceholderPage` 切换为 [src/features/help-center/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/help-center/index.tsx) 驱动的静态 showcase 页面，明确它是帮助中心类模块的展示示例，而不是迁移占位页。
- **变更摘要**：将 Clerk 演示路由从 placeholder 恢复为可选外部集成 demo：新增 [app/(auth)/clerk/sign-in/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/clerk/sign-in/page.tsx)、[app/(auth)/clerk/sign-up/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/clerk/sign-up/page.tsx)，并将 [app/(dashboard)/clerk/user-management/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/clerk/user-management/page.tsx) 接回 [src/features/clerk/user-management-demo.tsx](/Users/ktlee/coding/shadcn-admin/src/features/clerk/user-management-demo.tsx)。
- **变更摘要**：新增 [src/features/clerk/clerk-provider-gate.tsx](/Users/ktlee/coding/shadcn-admin/src/features/clerk/clerk-provider-gate.tsx)、[src/features/clerk/clerk-setup-guide.tsx](/Users/ktlee/coding/shadcn-admin/src/features/clerk/clerk-setup-guide.tsx) 与 Clerk auth/demo 相关组件，让 `clerk/*` 在缺少 key 时显示引导页，在提供 key 时恢复真实集成演示。
- **变更摘要**：更新 [.env.example](/Users/ktlee/coding/shadcn-admin/.env.example) 与 [docs/template-runtime-config.md](/Users/ktlee/coding/shadcn-admin/docs/template-runtime-config.md)，补齐 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 入口和当前 optional integration demo 的配置说明。
- **变更摘要**：更新 [docs/template-active-surface.md](/Users/ktlee/coding/shadcn-admin/docs/template-active-surface.md)，将 `apps / tasks / users / chats` 从占位页口径调整为完整 showcase 页面，并明确它们与 `resources / settings / sign-in` 的 reference 分层。
- **影响范围**：影响开源模板默认展示面的完成度、dashboard 主导航页的首屏观感，以及后续 README 中对 `reference pages / showcase pages` 的分层说明基础。
- **影响范围**：影响开源模板中的 auth / errors / help-center / Clerk 示例页可达性、独立壳层的完整度、外部集成演示的语义清晰度，以及多语言覆盖在错误页和帮助中心上的连续性。
- **验证证据**：已完成源码接线与活跃面文档同步；`pnpm dev --port 3001` 日志已确认 `/tasks` 从 `FileList is not defined` 恢复为 `GET /tasks 200`，`/chats` 的 JSON warning 已消失，且 `/sign-in-2` 不再请求 `/[object Object]`；已用内置浏览器回归 `/chats`、`/sign-in-2`、`/sign-up`、`/forgot-password`、`/otp`、五个 `/errors/*` 页面，并将在本轮继续回归 `/help-center` 与 `clerk/*`；本轮未主动重新运行构建或测试。
- **变更摘要**：修正 [src/hooks/use-legacy-search-state.ts](/Users/ktlee/coding/shadcn-admin/src/hooks/use-legacy-search-state.ts) 中 `useMemo` 的复杂依赖表达式，改为稳定 key 派生，消除已知 lint / build 阻塞。
- **变更摘要**：为 [src/main.tsx](/Users/ktlee/coding/shadcn-admin/src/main.tsx) 中的 legacy runtime `console.warn` 增加最小 `no-console` lint 豁免，避免已知构建门禁错误继续保留在工作树中。
- **变更摘要**：将 [src/components/layout/authenticated-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/authenticated-layout.tsx) 中默认渲染 `Outlet` 的职责迁回 [src/routes/_authenticated/route.tsx](/Users/ktlee/coding/shadcn-admin/src/routes/_authenticated/route.tsx) 与 [src/routes/clerk/_authenticated/route.tsx](/Users/ktlee/coding/shadcn-admin/src/routes/clerk/_authenticated/route.tsx)，使 `authenticated-layout` 成为纯布局组件，并移除其对 `@tanstack/react-router` 的 direct import。
- **变更摘要**：更新 [docs/template-active-surface.md](/Users/ktlee/coding/shadcn-admin/docs/template-active-surface.md) 与 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充 `authenticated-layout` 已不再直接依赖 router runtime 的边界说明。
- **变更摘要**：从 [src/routes/__root.tsx](/Users/ktlee/coding/shadcn-admin/src/routes/__root.tsx) 中移除 [src/components/navigation-progress.tsx](/Users/ktlee/coding/shadcn-admin/src/components/navigation-progress.tsx) 的挂载，使其从旧 `TanStack Router` 运行时链路中退役。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md) 与 [docs/template-active-surface.md](/Users/ktlee/coding/shadcn-admin/docs/template-active-surface.md)，补充 `navigation-progress.tsx` 已不再参与 legacy 运行时的边界说明。
- **变更摘要**：更新 [src/features/users/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/users/index.tsx)，复用 [src/hooks/use-legacy-search-state.ts](/Users/ktlee/coding/shadcn-admin/src/hooks/use-legacy-search-state.ts) 向 `UsersTable` 提供 `search/navigate`，移除页面层对 `getRouteApi()` 的直接依赖。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充旧 users 页已进一步脱离 router 运行时的状态说明。
- **变更摘要**：新增 [src/hooks/use-legacy-search-state.ts](/Users/ktlee/coding/shadcn-admin/src/hooks/use-legacy-search-state.ts)，为 legacy 页面提供浏览器原生 `URLSearchParams + history.pushState/replaceState + popstate` 的 `search/navigate` 桥接能力。
- **变更摘要**：更新 [src/features/tasks/components/tasks-table.tsx](/Users/ktlee/coding/shadcn-admin/src/features/tasks/components/tasks-table.tsx)，将其传给 `useTableUrlState()` 的 `search/navigate` 从 `getRouteApi()` 改为 `useLegacySearchState()`。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充旧 `TasksTable` 已进一步脱离 router 运行时的状态说明。
- **变更摘要**：新增 [src/features/apps/legacy-apps-search.ts](/Users/ktlee/coding/shadcn-admin/src/features/apps/legacy-apps-search.ts)，并将 [src/features/apps/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/apps/index.tsx) 的 `filter/type/sort` URL 状态读写从 `getRouteApi().useSearch()/useNavigate()` 切到浏览器原生 `URLSearchParams + history.replaceState`。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充旧 apps 页已进一步脱离 router 运行时的状态说明。
- **变更摘要**：新增 [src/features/auth/legacy-auth-navigation.ts](/Users/ktlee/coding/shadcn-admin/src/features/auth/legacy-auth-navigation.ts)，并将旧 auth 页中的 `redirect` 读取、页面跳转与普通链接切到浏览器原生导航能力。
- **变更摘要**：更新 [src/features/auth/sign-in/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/index.tsx)、[src/features/auth/sign-in/sign-in-2.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/sign-in-2.tsx)、[src/features/auth/sign-in/components/user-auth-form.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/components/user-auth-form.tsx)、[src/features/auth/sign-up/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-up/index.tsx)、[src/features/auth/forgot-password/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/forgot-password/index.tsx)、[src/features/auth/forgot-password/components/forgot-password-form.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/forgot-password/components/forgot-password-form.tsx)、[src/features/auth/otp/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/otp/index.tsx) 与 [src/features/auth/otp/components/otp-form.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/otp/components/otp-form.tsx)，移除旧 auth 页面非测试文件里对 `@tanstack/react-router` 的直接依赖。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充旧 auth 页面已进一步脱离 router 运行时的状态说明。
- **变更摘要**：将 [src/components/layout/top-nav.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/top-nav.tsx) 从 `@tanstack/react-router` 的 `Link` 切到浏览器原生 `href` 导航，并保留 `disabled` 项的点击阻止与弱化样式。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充旧 `TopNav` 已进一步脱离 `@tanstack/react-router` 直接依赖的状态说明。
- **变更摘要**：新增 [src/features/errors/legacy-error-actions.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/legacy-error-actions.tsx)，并将 [src/features/errors/general-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/general-error.tsx)、[src/features/errors/not-found-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/not-found-error.tsx)、[src/features/errors/forbidden.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/forbidden.tsx)、[src/features/errors/unauthorized-error.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/unauthorized-error.tsx) 的“返回上一页 / 回首页”交互改为浏览器原生导航，不再直接依赖 `@tanstack/react-router` hook。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，记录旧错误页虽然仍属于 legacy 参考面，但已进一步脱离旧路由运行时导航 API。
- **变更摘要**：在 [src/routes/__root.tsx](/Users/ktlee/coding/shadcn-admin/src/routes/__root.tsx) 增加统一的 legacy runtime notice，让旧 `TanStack Router` 路由树下的所有页面在启动时都明确标记为 reference runtime，而不是当前正式模板入口。
- **变更摘要**：更新 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充旧 `src/routes/**` 已具备全局 legacy 提示层的状态说明。
- **变更摘要**：收紧 [vite.config.ts](/Users/ktlee/coding/shadcn-admin/vite.config.ts) 中 `@tanstack/router-plugin` 的启用条件，默认不在 `Vitest` 进程里自动启用 legacy 文件路由插件；仅在显式设置 `VITEST_ENABLE_TANSTACK_ROUTER_PLUGIN=true` 时回开。
- **变更摘要**：更新 [README.md](/Users/ktlee/coding/shadcn-admin/README.md) 与 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充当前 `Vitest` 运行时与 legacy `TanStack Router` 文件路由插件的边界说明。
- **变更摘要**：将 [index.html](/Users/ktlee/coding/shadcn-admin/index.html) 标记为 `Legacy Vite reference entry`，并加入显式横幅提示，避免后续接手时把旧 `Vite` 页面入口误判成当前正式模板 runtime。
- **变更摘要**：为 [src/main.tsx](/Users/ktlee/coding/shadcn-admin/src/main.tsx) 增加 legacy 入口注释与运行时 `console.warn`，明确它只作为迁移参考面保留。
- **变更摘要**：更新 [README.md](/Users/ktlee/coding/shadcn-admin/README.md) 与 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，补充“正式入口是 `pnpm dev`，旧 `index.html + src/main.tsx + src/routes/**` 仅为 legacy 参考面”的说明。
- **变更摘要**：将 [src/components/layout/authenticated-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/authenticated-layout.tsx) 从 legacy `src/context` provider 体系切到当前 [src/providers/dashboard-providers.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/dashboard-providers.tsx)，并在 legacy 壳内显式补回 [src/components/command-menu.tsx](/Users/ktlee/coding/shadcn-admin/src/components/command-menu.tsx)。
- **变更摘要**：更新 [docs/template-active-surface.md](/Users/ktlee/coding/shadcn-admin/docs/template-active-surface.md) 与 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，收口 `authenticated-layout` 的边界描述，明确它仍是 legacy layout 面，但已不再直接依赖旧 `src/context/**`。
- **变更摘要**：调整 [src/config/shell.ts](/Users/ktlee/coding/shadcn-admin/src/config/shell.ts) 的默认 shell 用户与团队占位数据，移除上游作者真实姓名和邮箱，改为模板中性默认值。
- **变更摘要**：让 [src/components/profile-dropdown.tsx](/Users/ktlee/coding/shadcn-admin/src/components/profile-dropdown.tsx) 与 [src/components/layout/nav-user.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/nav-user.tsx) 的头像回退字母改为基于当前用户名动态计算，不再写死为 `SN`。
- **变更摘要**：更新 [docs/template-adoption-guide.md](/Users/ktlee/coding/shadcn-admin/docs/template-adoption-guide.md)，将 `src/config/shell.ts` 明确列为模板接管的优先替换入口之一。
- **影响范围**：影响 sidebar 与右上角用户菜单的默认展示内容，以及后续将该仓库直接作为母模板初始化时的默认品牌观感。
- **影响范围**：影响 legacy `TanStack Router` 布局面继续复用当前 dashboard provider 组合的方式，以及后续判定“旧 context 是否还被外部直接消费”的准确性。
- **影响范围**：影响最终交付前的 lint / build 门禁稳定性；这两处修复不改变业务行为，只收敛已知编译阻塞。
- **验证证据**：问题来源于一次意外触发的 `next build` 输出；已按报错位置完成静态源码修复，但未主动重新运行构建或测试。
- **影响范围**：影响旧 authenticated route 壳层中 `Outlet` 的职责归属；当前它已回到 route 文件本身，非 `src/routes/**` 范围内的实际 router direct import 进一步收缩。
- **验证证据**：已通过静态源码检查确认 [src/components/layout/authenticated-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/authenticated-layout.tsx) 已移除 `@tanstack/react-router` import，且两个 authenticated route 文件已自行渲染 `<Outlet />`；未主动运行构建或测试。
- **影响范围**：影响旧 `TanStack Router` 根壳中的顶部加载条展示；当前该组件退役后，将不再占用 legacy 运行时链路中的一个 router 状态依赖点。
- **验证证据**：已通过静态源码检查确认 [src/routes/__root.tsx](/Users/ktlee/coding/shadcn-admin/src/routes/__root.tsx) 已移除 `NavigationProgress` 挂载；后续 `rg -n "NavigationProgress" src app` 仅剩组件定义文件；未主动运行构建或测试。
- **影响范围**：影响旧 users 页向表格传递 URL 状态桥的方式，继续减少非 `src/routes/**` 范围内对 `@tanstack/react-router` 的直接依赖，并验证 `useLegacySearchState()` 的复用性。
- **验证证据**：已通过静态源码检查确认 [src/features/users/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/users/index.tsx) 已移除 `@tanstack/react-router` import，并改为复用 [use-legacy-search-state.ts](/Users/ktlee/coding/shadcn-admin/src/hooks/use-legacy-search-state.ts)；未主动运行构建或测试。
- **影响范围**：影响旧 `TasksTable` 的分页、关键字筛选和 facet 查询参数的初始化与写回方式，并为后续 `users` 等同类页面提供可复用的浏览器 URL 状态桥。
- **验证证据**：已通过静态源码检查确认 [src/features/tasks/components/tasks-table.tsx](/Users/ktlee/coding/shadcn-admin/src/features/tasks/components/tasks-table.tsx) 已移除 `@tanstack/react-router` import，并通过 [use-legacy-search-state.ts](/Users/ktlee/coding/shadcn-admin/src/hooks/use-legacy-search-state.ts) 为 `useTableUrlState()` 提供 `search/navigate`；未主动运行构建或测试。
- **影响范围**：影响旧 apps 页筛选 / 类型 / 排序查询参数的初始化与写回方式，继续减少非 `src/routes/**` 范围内对 `@tanstack/react-router` 的直接依赖。
- **验证证据**：已通过静态源码检查确认 [src/features/apps/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/apps/index.tsx) 已移除 `@tanstack/react-router` import，并通过 [legacy-apps-search.ts](/Users/ktlee/coding/shadcn-admin/src/features/apps/legacy-apps-search.ts) 承载 URL 状态 parse/write；未主动运行构建或测试。
- **影响范围**：影响旧 auth 页面读取 `redirect`、登录后回跳、忘记密码跳 OTP、OTP 回首页和普通文本链接的实现方式，继续减少非 `src/routes/**` 范围内对 `@tanstack/react-router` 的直接依赖。
- **验证证据**：已通过静态源码检查确认 `src/features/auth` 非测试文件中的 `@tanstack/react-router` direct import 已清空；已确认 [legacy-auth-navigation.ts](/Users/ktlee/coding/shadcn-admin/src/features/auth/legacy-auth-navigation.ts) 统一承载 `redirect` 读取和浏览器导航；未主动运行构建或测试。
- **影响范围**：影响旧 dashboard 顶部 `TopNav` 的链接实现方式，继续减少非 `src/routes/**` 范围内对 `@tanstack/react-router` 直接 import 的数量。
- **验证证据**：已通过静态源码检查确认 [src/components/layout/top-nav.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/top-nav.tsx) 已移除 `@tanstack/react-router` import，并改为浏览器原生 `href` 导航；未主动运行构建或测试。
- **影响范围**：影响旧错误页的返回与回首页交互实现方式，继续减少非 `src/routes/**` 范围内对 `@tanstack/react-router` 运行时 API 的直接依赖。
- **验证证据**：已通过静态源码检查确认四个旧错误页已移除 `@tanstack/react-router` import，并统一复用浏览器导航版 [legacy-error-actions.tsx](/Users/ktlee/coding/shadcn-admin/src/features/errors/legacy-error-actions.tsx)；未主动运行构建或测试。
- **影响范围**：影响手动启动旧 `TanStack Router` 路由树时的可见提示方式，进一步降低旧 routes 被误判为正式模板 runtime 的概率。
- **验证证据**：已通过静态源码检查确认 [src/routes/__root.tsx](/Users/ktlee/coding/shadcn-admin/src/routes/__root.tsx) 统一挂载了 legacy runtime notice；未主动运行构建或测试。
- **影响范围**：影响 `Vitest Browser Mode` 与 legacy `TanStack Router` 文件路由插件之间的默认耦合方式，以及后续是否继续保留旧 `src/routes/**` 测试面的判断成本。
- **验证证据**：已通过静态源码检查确认当前测试文件没有直接 import `src/routes/**` 或 `src/routeTree.gen.ts`；已确认 [vite.config.ts](/Users/ktlee/coding/shadcn-admin/vite.config.ts) 增加 `isVitestProcess()` 与 `VITEST_ENABLE_TANSTACK_ROUTER_PLUGIN` 显式回开口；未主动运行构建或测试。
- **影响范围**：影响手动打开旧 `Vite` 入口时的认知提示，以及 AI / 人工接手时对“当前正式运行入口”与“迁移参考入口”的区分成本。
- **验证证据**：已通过静态源码检查确认 `index.html` 仍加载 `/src/main.tsx`，同时新增 legacy 横幅提示；已确认 `src/main.tsx` 启动时会输出 legacy runtime warning；未主动运行构建或测试。
- **验证证据**：已通过静态源码检查确认 `authenticated-layout.tsx` 已改为复用 `DashboardProviders` 并显式渲染 `CommandMenu`；已通过 `rg -n "@/context/" src app --glob '!src/context/**'` 确认当前 direct 引用结果为空。
- **验证证据**：已通过源码引用链确认 `shellUser` / `shellTeams` 会进入 sidebar 与 profile dropdown；本轮新增 `getDisplayNameInitials()` 静态测试样例，但未主动运行测试。

### 文档

- **变更摘要**：新增 [docs/template-legacy-removal-checklist.md](/Users/ktlee/coding/shadcn-admin/docs/template-legacy-removal-checklist.md)，将旧 `Vite + TanStack Router` 残留拆分为“旧入口链”“活跃遗留项”“旧参考页面实现”三类，并明确后续推荐清理顺序。
- **变更摘要**：更新 [README.md](/Users/ktlee/coding/shadcn-admin/README.md)、[docs/template-adoption-guide.md](/Users/ktlee/coding/shadcn-admin/docs/template-adoption-guide.md) 与 [docs/template-active-surface.md](/Users/ktlee/coding/shadcn-admin/docs/template-active-surface.md)，为后续模板接管与 legacy 深清理补充统一入口。
- **影响范围**：影响后续继续收敛仓库结构时的执行顺序判断，以及 AI / 人工接手时对 legacy 文件、依赖和运行时支撑层的识别成本。
- **验证证据**：已通过 `rg` 与 `codegraph` 核对 `src/main.tsx`、`src/routeTree.gen.ts`、`src/routes/**`、旧 context/store/layout 与 Vitest 的 `vite.config.ts` 运行配置关系；未运行构建或测试。

### 修改

- **变更摘要**：将 [src/lib/cookies.ts](/Users/ktlee/coding/shadcn-admin/src/lib/cookies.ts) 中主题/语言主 cookie key 切换为 `template-ui-theme` 与 `template-ui-language`，并保留对旧 `vite-ui-theme` / `vite-ui-language` 的兼容读取和自动迁移。
- **变更摘要**：更新 [app/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/layout.tsx)、[src/providers/theme-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/theme-provider.tsx)、[src/i18n/index.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/index.ts) 与 [src/components/ui/theme-script.tsx](/Users/ktlee/coding/shadcn-admin/src/components/ui/theme-script.tsx)，让服务端首屏、主题 hydration、语言持久化与首屏脚本统一支持兼容迁移。
- **变更摘要**：补充 [src/lib/cookies.test.ts](/Users/ktlee/coding/shadcn-admin/src/lib/cookies.test.ts)、[src/providers/theme-provider.test.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/theme-provider.test.tsx) 与 [src/providers/i18n-provider.test.tsx](/Users/ktlee/coding/shadcn-admin/src/providers/i18n-provider.test.tsx) 的 legacy cookie fallback / migration 样例，并更新 [docs/template-runtime-config.md](/Users/ktlee/coding/shadcn-admin/docs/template-runtime-config.md) 记录当前 cookie key 策略。
- **变更摘要**：将 [src/assets/custom/icon-dir.tsx](/Users/ktlee/coding/shadcn-admin/src/assets/custom/icon-dir.tsx) 的 `Direction` 类型引用从 legacy `src/context` 切到当前 `src/providers`，继续收缩活跃源码对旧 context 体系的反向依赖。
- **影响范围**：影响主题与语言偏好的正式 cookie 命名、旧模板用户的本地偏好继承方式，以及后续继续清理 legacy 命名时的兼容窗口策略。
- **影响范围**：影响当前 config drawer 图标类型依赖的归属，以及后续判定“哪些 `context` 依赖仍是活跃主链”的准确性。
- **验证证据**：已通过源码检查确认主题/语言主链入口都接到新的 `template-ui-*` key，并仍保留对旧 `vite-ui-*` key 的 fallback；本轮补充了迁移测试样例，但未主动运行构建或测试。
- **验证证据**：已通过 `rg -n "@/context/" src app --glob '!src/context/**'` 确认当前非 legacy 主链仅剩旧 `authenticated-layout` 仍依赖 `src/context/**`。

## [2026-06-12] - Vitest 本机浏览器运行时

### 修改

- **变更摘要**：调整 [vite.config.ts](/Users/ktlee/coding/shadcn-admin/vite.config.ts)，让 Vitest Browser Mode 在 macOS 下优先读取系统默认浏览器；当默认浏览器是本机 Edge 或 Chrome 时，直接复用对应 channel，而不是默认拉起 Playwright 自管 Chromium。
- **变更摘要**：为 Vitest 浏览器运行时保留 `VITEST_BROWSER_INSTANCE` / `VITEST_BROWSER_CHANNEL` 显式覆盖口，便于 CI 或特殊机器手动指定浏览器。
- **变更摘要**：补充 `test:browser:chrome` 与 `test:browser:edge` 脚本入口，减少后续手动记忆环境变量的成本。
- **变更摘要**：新增 [src/config/template-modules.ts](/Users/ktlee/coding/shadcn-admin/src/config/template-modules.ts)，为 `resources` reference module 提供模板级启用开关；关闭后 registry、`/resources` 路由与 middleware 会同步收口。
- **变更摘要**：抽出 [src/services/auth/route-access.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/route-access.ts) 统一承载模板公共/受保护路径规则，并新增 `template-modules`、`registry`、`route-access` 三组 reference module 相关测试骨架。
- **变更摘要**：重写根 [README.md](/Users/ktlee/coding/shadcn-admin/README.md) 为当前 Next.js 模板口径，并新增 [docs/template-adoption-guide.md](/Users/ktlee/coding/shadcn-admin/docs/template-adoption-guide.md)、[docs/template-runtime-config.md](/Users/ktlee/coding/shadcn-admin/docs/template-runtime-config.md) 与 [.env.example](/Users/ktlee/coding/shadcn-admin/.env.example)，补齐模板接管与运行时配置文档。
- **变更摘要**：继续清理用户可见的上游残留文案与依赖，将 `TeamSwitcher` 与 `AppTitle` 的默认技术栈口径统一到当前 `Next.js` 模板，并移除 `AppTitle` 对旧 TanStack Router `Link` 的依赖。
- **影响范围**：影响模板后续本地前端测试的浏览器选择策略、Playwright 浏览器下载需求，以及本机 Chrome / Edge 的复用方式。
- **影响范围**：影响参考模块的启停方式，以及业务项目在接管模板时移除 reference module 的成本。
- **影响范围**：影响 middleware 的路径规则组织方式，以及后续 reference module 启停的自动化验证能力。
- **影响范围**：影响后续项目接手模板时的认知成本、环境变量入口与 mock 演示账号理解方式。
- **影响范围**：影响 sidebar 头部默认展示信息，以及后续如果切回 `AppTitle` 变体时的路由与技术栈展示正确性。
- **验证证据**：已确认当前系统默认浏览器 bundle id 为 `com.microsoft.edgemac`；已执行 `pnpm exec playwright uninstall --all` 清理 Playwright 浏览器缓存。

## [2026-06-12] - Next.js M3 壳层一致性落地

### 修改

- **变更摘要**：在 Next 版 dashboard 外层正式接入 `AppSidebar`、`CommandMenu`、`SidebarInset`，并将 `nav-group`、`search`、`theme switch`、`language switch`、`config drawer`、`profile dropdown`、`sign-out dialog` 等壳层组件统一切到 Next 路由原语和 `src/providers/*`。
- **变更摘要**：新增共享 `dashboard-page-shell` 与 dashboard / auth / errors 占位页组件，补齐 `/tasks`、`/apps`、`/chats`、`/users`、`/help-center`、`/clerk/*`、`/sign-in-2`、`/sign-up`、`/forgot-password`、`/otp`、`/errors/*` 等模板路由，避免 sidebar 与 command menu 留下死链接。
- **变更摘要**：新增 `app/(dashboard)/settings/layout.tsx`，并将 `/settings` 及其 `account / language / appearance / notifications / display` 子页正式接回 Next dashboard 壳，恢复 settings 二级导航结构。
- **变更摘要**：修复顶部与侧栏用户头像资源路径，改用仓库内真实存在的 `/images/shadcn-admin.png`，消除开发态头像 404。
- **影响范围**：影响 dashboard 壳结构、settings 信息架构、sidebar/command menu 可达路由、auth/errors 示例页边界，以及主题/语言/登出等模板级交互入口。
- **验证证据**：已通过 `pnpm build`；已用内置浏览器完成 `/`、`/settings`、`/settings/language`、`/sign-in-2`、`/errors/unauthorized` 验收，并确认 settings 语言页可从 `English` 实际切换回 `中文`、dashboard 可实际切到 dark 模式；当前仍保留一个既存的 Next ESLint 插件 warning。

### 修改

- **变更摘要**：新增 `src/modules/types.ts`、`src/modules/registry.ts`、`src/modules/navigation.ts`、`src/config/navigation.ts`、`src/config/shell.ts`，正式建立 M4 的模块注册中心、导航配置层和导航解析层。
- **变更摘要**：为 dashboard/tasks/apps/chats/users/help-center 及 clerk/auth/errors/settings 建立 feature-first manifest，并让 `settings / auth / errors / clerk` 的父子导航从匿名嵌套对象改为显式模块节点。
- **变更摘要**：收缩 [src/components/layout/data/sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts) 为组合层，不再手写业务导航树；`CommandMenu` 改为直接消费解析后的导航结果。
- **变更摘要**：为未注册模块增加导航容错，缺失 manifest 时对应导航项会被跳过，避免单模块缺失导致整个 shell 崩溃。
- **影响范围**：影响 sidebar 与 command menu 的导航数据来源、后续业务模板替换方式，以及模块可注册/可移除的基础结构。
- **验证证据**：已通过 `pnpm build`；已用内置浏览器完成 `/`、`/tasks`、`/settings` 与 command menu 导航项验收，并确认 settings/auth/errors/clerk 等父子模块的子项仍可出现在搜索结果中；当前仍保留一个既存的 Next ESLint 插件 warning。

### 修改

- **变更摘要**：新增 `src/contracts/core/*` 与 `src/contracts/resources/*`，建立模板级 success/error envelope、字段级错误、分页基础 schema，以及 `resources` 参考资源的 list/detail/create/update/delete/bulk 契约。
- **变更摘要**：新增 `src/services/adapters/{types,mock,http,server}` 与 `src/services/query/resources.ts`，建立 `resources` 的 adapter 接口、mock/http/server 骨架，以及统一 query key、query normalize、query serialize、response parse 入口。
- **变更摘要**：为 `mock adapter` 提供最小内存数据集和完整 CRUD/bulk 方法；为 `http/server adapter` 收紧共享 schema 消费路径，避免不同通道复制资源契约。
- **影响范围**：影响后续 reference module 的列表与 CRUD 真相源、请求与响应解析方式、mock/http/server 三种数据通道的一致性，以及后续 Hono/Next handler 的接入边界。
- **验证证据**：已通过 `pnpm build`；已用内置浏览器回归 `/` 与 `/settings`，确认本轮 contract/adapter 改动未影响现有 dashboard 壳与 settings 壳；当前仍保留一个既存的 Next ESLint 插件 warning。

### 修改

- **变更摘要**：新增 `/resources` reference module，接入 `manifest + registry + navigation + route`，让 dashboard 壳里出现第一个真实可运行的列表型业务模块。
- **变更摘要**：新增 `src/features/resources/*`，用 `React Query + createMockResourcesAdapter() + resourcesQueryKeys.list()` 打通 `resources` 列表页，并将搜索、筛选、分页、排序全部收敛到 URL 驱动模式。
- **变更摘要**：扩充 `resources` mock 数据到 14 条，调整共享分页默认 `pageSize` 为 `10`，并补齐 `data-table` 分页文案与 `resources` 模块中英文资源。
- **变更摘要**：将 `useTableUrlState` 改为以 URL 为真相源的表格状态模型，并补充显式 `reset()`，修复列表页点击重置后旧筛选被重新推回 URL 的问题。
- **影响范围**：影响 Next 模板后续列表模块的参考实现方式、共享表格与 URL 状态耦合方式、`resources` 示例数据规模，以及中英双语下的分页与列显示体验。
- **验证证据**：已通过 `pnpm build`；已用内置浏览器完成 `/resources` 的搜索、状态筛选、重置、分页、列显示和中英切换验收，并确认英文态语言菜单仍固定显示“中文 / English”；当前仍保留一个既存的 Next ESLint 插件 warning。

### 修改

- **变更摘要**：为 `/resources` 接入完整 CRUD 工作流，新增 create / update 抽屉、单条删除确认、批量状态更新和批量删除，使其从 reference list 升级为可复用的 reference CRUD module。
- **变更摘要**：新增共享 `AdapterError` 基线，并让 `mock/http resources adapter` 统一归一化错误格式；其中 duplicate slug 现在会返回 `fields.slug`，供表单字段级错误回填。
- **变更摘要**：修复 `resources` 表单提交控制流，移除会吞掉 mutation reject 的 `toast.promise` 关闭路径，改为显式 `try/catch + loading/success/error toast`，确保 duplicate slug 时抽屉保持打开并显示字段错误。
- **影响范围**：影响 `resources` 参考模块的表单提交、删除确认、批量动作、adapter 错误处理方式，以及后续业务模块照抄这套 CRUD 壳时的默认实现质量。
- **验证证据**：已通过 `pnpm build`；已在 `http://localhost:3001/resources` 完成 duplicate slug、create、update、single delete、bulk status、bulk delete 验收，并确认 duplicate slug 会保留抽屉且显示 `Slug already exists.` 字段错误；当前仍保留一个既存的 Next ESLint 插件 warning。

### 修改

- **变更摘要**：新增模板级 auth contract、mock session cookie bridge、`middleware` 鉴权与 `DashboardRouteGuard`，让 dashboard 路由具备真正的未登录重定向和登录后权限裁剪能力。
- **变更摘要**：将 sidebar、command menu、profile dropdown、sign-out dialog 和 `resources` 动作全部切到统一 permission resolver；`resources` 的新建、行操作、批量动作与选择列现在会按 `resources.*` 权限自动裁剪。
- **变更摘要**：为登录页补上可工作的 mock sign-in 表单，并修复登录成功后覆盖 `redirect` 参数的回跳 bug，确保受保护页面能正确回到原目标路由。
- **影响范围**：影响模板的 session 持久化、dashboard 访问边界、导航过滤规则、用户菜单展示、退出登录链路，以及后续业务模块接入动作级权限的默认方式。
- **验证证据**：已通过 `pnpm build`；已在 `http://localhost:3001` 完成未登录访问 `/resources` 重定向、`viewer@template.dev` 的导航/按钮/受限页裁剪，以及 `admin@template.dev` 的权限恢复验收；当前仍保留一个既存的 Next ESLint 插件 warning。

## [2026-06-12] - Next.js M1 基础壳落地

### 新增

- **变更摘要**：新增 `app/`、`next.config.ts`、`postcss.config.mjs`、`next-env.d.ts` 与 `src/providers/*`，将模板根入口切换到 Next.js App Router 的 `M1 Foundation` 形态。
- **变更摘要**：新增最小 Root Layout、ThemeScript、QueryProvider、I18nProvider、Theme/Font/Direction Provider，以及一个仅用于基础链路验收的首页占位页。
- **影响范围**：影响项目根运行入口、全局样式入口、主题首屏初始化、语言 bootstrap、字体加载方式和提示消息装配。
- **验证证据**：已执行 `pnpm install --ignore-scripts` 同步锁文件，并通过 `pnpm build` 完成 M1 命令级验收；当前仍保留一个 Next ESLint 插件未接入的 warning。

### 修改

- **变更摘要**：新增 `(auth) / (dashboard) / (errors)` 三类 route group，并将 `/` 首页迁入 `(dashboard)`，初步建立 Next.js 多壳层结构。
- **变更摘要**：新增 `DashboardProviders`、`DashboardLayoutProvider`、`DashboardSearchProvider`，将 dashboard 专属状态正式下沉到 dashboard 壳内。
- **变更摘要**：新增 `/sign-in` 与 `/404` 的最小占位页，并让 `CommandMenu` 继续留在后续里程碑，避免在 M2 提前混入壳层交互细节。
- **影响范围**：影响首页归属、auth/errors 与 dashboard 的外层边界、sidebar 状态持久化入口，以及 Next 构建产物 `.next/` 的仓库忽略策略。
- **验证证据**：已通过 `pnpm build` 完成 M2 命令级验收；当前仍保留一个 “Next.js plugin was not detected in your ESLint configuration” warning，且尚未做浏览器路径验收。

## [2026-06-11] - Hero Spectrum 全局配色

### 修改

- **变更摘要**：将浅色和深色模式的全局主题 token 调整为 Hero Spectrum 配色方向。
- **变更摘要**：清理 dashboard、应用列表、主题设置和用户管理中的残留硬编码颜色，进一步提升模板复用性。
- **影响范围**：影响背景、卡片、弹层、主色、辅助色、边框、输入框、焦点环、侧边栏和图表语义色。
- **影响范围**：影响图表轴线与数据系列、连接状态按钮、主题预览卡、主题切换浏览器颜色和 destructive 交互态。
- **验证证据**：已完成主题变量完整性和静态 diff 检查；未运行构建或测试。

### 新增

- **变更摘要**：正式接入 `i18next` 模板级多语言基础层，新增 `zh-CN` / `en` 资源、语言检测与中文回退策略。
- **变更摘要**：将设置页语言选项接入全局语言切换，并覆盖侧边栏、命令面板、主题设置、设置中心和主要入口页的首批模板文案。
- **变更摘要**：新增设置页独立“语言”分区与顶栏语言快捷入口，并补齐登录 / 注册 / 忘记密码 / OTP / Clerk 示例页及一批共享控件的中英切换。
- **变更摘要**：统一语言选项标签显示规则，`zh-CN` 在中文和英文模式下都固定展示为“中文”。
- **变更摘要**：继续补齐 `tasks` / `users` 页面剩余模板层文案，并将共享 `data-table` 的筛选、列菜单、批量操作工具栏、任务抽屉、任务导入弹窗和行菜单接入中英切换。
- **影响范围**：影响 `src/i18n` 初始化、语言持久化 cookie、设置页账户表单，以及 dashboard / apps / users / tasks 等模板骨架页面。
- **影响范围**：影响 auth 流程、设置中心信息架构、主框架顶栏、共享弹窗控件，以及 chats / users 等模板演示页面的剩余文案。
- **影响范围**：影响 `tasks` / `users` 的表格筛选、批量操作、任务编辑链路、示例数据标签映射，以及共享 `data-table` 交互文案。
- **验证证据**：已修复 `pnpm` 对 `void-elements@3.1.0` 的完整性校验问题，并完成中文默认态、英文切换态、英文应用页及切回中文首页的浏览器验收；未运行构建或测试。
- **验证证据**：已在 `http://localhost:5173` 完成设置页语言导航、账户页字段收口、登录页中文态、语言切英文后的登录 / 注册页英文态验收；未运行构建或自动化测试。
- **验证证据**：已通过 `CI=true pnpm build`，并在本地预览页完成首页、任务页、用户页与登录页的中英切换验收；开发态 TanStack devtools 文案仍保持英文。

## v2.2.1 (2025-11-06)

### Fix

- **style**: update data attribute class in authenticated layout (#249)
- prevent navigation to 500 page during development (#240)
- **style**: apply variant 'destructive' to sign-out buttons (#236)
- add missing space in profile form (#235)

### Refactor

- enhance tables and update table layout (#234)

## v2.2.0 (2025-10-09)

### Feat

- add analytics tab in dashboard page (#220)
- add extra AppTitle component for sidebar header (#216)
- update 2-column sign in page (#213)

### Fix

- update sidebar menu chevron direction in RTL mode (#229)
- pagination button spacing (#215)
- upgrade lucide-react to solve antivirus warning (#211)

### Refactor

- move sidebar related components into app-sidebar
- change SidebarInset component from 'main' to 'div'
- replace extra main container query with content container query
- replace inline svg logo with logo component (#214)

## v2.1.0 (2025-08-23)

### Feat

- enhance data table pagination with page numbers (#207)
- enhance auth flow with sign-out dialogs and redirect functionality (#206)

### Refactor

- reorganize utility files into `lib/` folder (#209)
- extract data-table components and reorganize structure (#208)

## v2.0.0 (2025-08-16)

### BREAKING CHANGE

- CSS file structure has been reorganized

### Feat

- add search param sync in apps route (#200)
- improve tables and sync table states with search param (#199)
- add data table bulk action toolbar (#196)
- add config drawer and update overall layout (#186)
- RTL support (#179)

### Fix

- adjust layout styles in search and top nav in dashboard page
- update spacing and layout styles
- update faceted icon color
- improve user table hover & selected styles (#195)
- add max-width for large screens to improve responsiveness (#194)
- adjust chat border radius for better responsiveness (#193)
- update hard-coded or inconsistent colors (#191)
- use variable for inset layout height calculation
- faded-bottom overflow issue in inset layout
- hide unnecessary configs on mobile (#189)
- adjust file input text vertical alignment (#188)

### Refactor

- enforce consistency and code quality (#198)
- improve code quality and consistency (#197)
- update error routes (#192)
- remove DirSwitch component and its usage in Tasks (#190)
- standardize using cookie as persist state (#187)
- separate CSS into modular theme and base styles (#185)
- replace tabler icons with lucide icons (#183)

## v1.4.2 (2025-07-23)

### Fix

- remove unnecessary transitions in table (#176)
- overflow background in tables (#175)

## v1.4.1 (2025-06-25)

### Fix

- user list overflow in chat (#160)
- prevent showing collapsed menu on mobile (#155)
- white background select dropdown in dark mode (#149)

### Refactor

- update font config guide in fonts.ts (#164)

## v1.4.0 (2025-05-25)

### Feat

- **clerk**: add Clerk for auth and protected route (#146)

### Fix

- add an indicator for nested pages in search (#147)
- update faded-bottom color with css variable (#139)

## v1.3.0 (2025-04-16)

### Fix

- replace custom otp with input-otp component (#131)
- disable layout animation on mobile (#130)
- upgrade react-day-picker and update calendar component (#129)

### Others

- upgrade Tailwind CSS to v4 (#125)
- upgrade dependencies (#128)
- configure automatic code-splitting (#127)

## v1.2.0 (2025-04-12)

### Feat

- add loading indicator during page transitions (#119)
- add light favicons and theme-based switching (#112)
- add new chat dialog in chats page (#90)

### Fix

- add fallback font for fontFamily (#110)
- broken focus behavior in add user dialog (#113)

## v1.1.0 (2025-01-30)

### Feat

- allow changing font family in setting

### Fix

- update sidebar color in dark mode for consistent look (#87)
- use overflow-clip in table paginations (#86)
- **style**: update global scrollbar style (#82)
- toolbar filter placeholder typo in user table (#76)

## v1.0.3 (2024-12-28)

### Fix

- add gap between buttons in import task dialog (#70)
- hide button sort if column cannot be hidden & update filterFn (#69)
- nav links added in profile dropdown (#68)

### Refactor

- optimize states in users/tasks context (#71)

## v1.0.2 (2024-12-25)

### Fix

- update overall layout due to scroll-lock bug (#66)

### Refactor

- analyze and remove unused files/exports with knip (#67)

## v1.0.1 (2024-12-14)

### Fix

- merge two button components into one (#60)
- loading all tabler-icon chunks in dev mode (#59)
- display menu dropdown when sidebar collapsed (#58)
- update spacing & alignment in dialogs/drawers
- update border & transition of sticky columns in user table
- update heading alignment to left in user dialogs
- add height and scroll area in user mutation dialogs
- update `/dashboard` route to just `/`
- **build**: replace require with import in tailwind.config.js

### Refactor

- remove unnecessary layout-backup file

## v1.0.0 (2024-12-09)

### BREAKING CHANGE

- Restructured the entire folder
hierarchy to adopt a feature-based structure. This
change improves code modularity and maintainability
but introduces breaking changes.

### Feat

- implement task dialogs
- implement user invite dialog
- implement users CRUD
- implement global command/search
- implement custom sidebar trigger
- implement coming-soon page

### Fix

- uncontrolled issue in account setting
- card layout issue in app integrations page
- remove form reset logic from useEffect in task import
- update JSX types due to react 19
- prevent card stretch in filtered app layout
- layout wrap issue in tasks page on mobile
- update user column hover and selected colors
- add setTimeout in user dialog closing
- layout shift issue in dropdown modal
- z-axis overflow issue in header
- stretch search bar only in mobile
- language dropdown issue in account setting
- update overflow contents with scroll area

### Refactor

- update layouts and extract common layout
- reorganize project to feature-based structure

## v1.0.0-beta.5 (2024-11-11)

### Feat

- add multiple language support (#37)

### Fix

- ensure site syncs with system theme changes (#49)
- recent sales responsive on ipad view (#40)

## v1.0.0-beta.4 (2024-09-22)

### Feat

- upgrade theme button to theme dropdown (#33)
- **a11y**: add "Skip to Main" button to improve keyboard navigation (#27)

### Fix

- optimize onComplete/onIncomplete invocation (#32)
- solve asChild attribute issue in custom button (#31)
- improve custom Button component (#28)

## v1.0.0-beta.3 (2024-08-25)

### Feat

- implement chat page (#21)
- add 401 error page (#12)
- implement apps page
- add otp page

### Fix

- prevent focus zoom on mobile devices (#20)
- resolve eslint script issue (#18)
- **a11y**: update default aria-label of each pin-input
- resolve OTP paste issue in multi-digit pin-input
- update layouts and solve overflow issues (#11)
- sync pin inputs programmatically

## v1.0.0-beta.2 (2024-03-18)

### Feat

- implement custom pin-input component (#2)

## v1.0.0-beta.1 (2024-02-08)

### Feat

- update theme-color meta tag when theme is updated
- add coming soon page in broken pages
- implement tasks table and page
- add remaining settings pages
- add example error page for settings
- update general error page to be more flexible
- implement settings layout and settings profile page
- add error pages
- add password-input custom component
- add sign-up page
- add forgot-password page
- add box sign in page
- add email + password sign in page
- make sidebar responsive and accessible
- add tailwind prettier plugin
- make sidebar collapsed state in local storage
- add check current active nav hook
- add loader component ui
- update dropdown nav by default if child is active
- add main-panel in dashboard
- **ui**: add dark mode
- **ui**: implement side nav ui

### Fix

- update incorrect overflow side nav height
- exclude shadcn components from linting and remove unused props
- solve text overflow issue when nav text is long
- replace nav with dropdown in mobile topnav
- make sidebar scrollable when overflow
- update nav link keys
- **ui**: update label style

### Refactor

- move password-input component into custom component dir
- add custom button component
- extract redundant codes into layout component
- update react-router to use new api for routing
- update main panel layout
- update major layouts and styling
- update main panel to be responsive
- update sidebar collapsed state to false in mobile
- update sidebar logo and title
- **ui**: remove unnecessary spacing
- remove unused files
