# Legacy 清理清单

这份文档面向两个场景：

1. 你后续想把这个仓库继续收成更纯粹的 `Next.js` 母模板
2. 你要让 AI 接着清理旧 `Vite + TanStack Router` 残留，但又不想让它误删当前还在用的东西

核心原则只有一句：

**先区分“旧页面主链”与“当前仍活跃的运行/测试支撑层”，再删。**

## 1. 可以明确视为 legacy 主入口的部分

这些内容已经不属于当前 Next 正式运行主链。

### 1.1 旧前端入口

- `src/main.tsx`
- `src/routeTree.gen.ts`
- `src/routes/**`

这三类本质上是一套旧的 `TanStack Router + Vite` 入口闭环：

- `src/main.tsx` 会创建 `RouterProvider`
- `src/main.tsx` 直接依赖 `src/routeTree.gen.ts`
- `src/routeTree.gen.ts` 由 `src/routes/**` 派生

当前正式模板主链已经是：

- `app/**`
- `app/layout.tsx`
- `middleware.ts`

所以这套旧入口可以作为后续集中清理对象。

补充说明：

- 当前 `index.html` 仍会加载 `/src/main.tsx`
- 但该入口现在只作为显式标注过的 legacy reference entry 保留
- 当前正式开发入口仍是 `pnpm dev`
- `src/routes/__root.tsx` 现在也会为整条旧路由树统一显示 legacy runtime notice

### 1.2 旧 context / store / shell 辅助层

- `src/context/**`
- `src/stores/auth-store.ts`
- `src/components/navigation-progress.tsx`
- `src/components/layout/authenticated-layout.tsx`
- `src/components/layout/top-nav.tsx`

这组文件对应的是旧壳层状态组织方式：

- `context/**` 是旧 provider 体系
- `auth-store.ts` 是旧 `zustand` auth 状态
- `navigation-progress.tsx` 依赖旧 TanStack Router 导航状态
- `authenticated-layout.tsx` / `top-nav.tsx` 是旧 layout 组合

补充说明：

- `authenticated-layout.tsx` 现在虽然仍属于 legacy layout 面，但 provider 组合已经切到当前 `src/providers/**`
- 因此后续如果要删它，重点应看“旧 TanStack Router 页面是否还保留”，而不是再把它当作旧 context 依赖点
- 同时它内部原本的 `Outlet` 职责也已迁回 `src/routes/**`，当前自身已不再直接依赖 `@tanstack/react-router`
- `navigation-progress.tsx` 现在已从 `src/routes/__root.tsx` 退役，当前不再挂载进旧路由树运行时

当前正式主链已经改用：

- `src/providers/**`
- `src/services/auth/**`
- `app/(dashboard)/layout.tsx`

## 2. 仍保留完整 UI，但当前并未接回主链的旧 feature

下面这些 feature 里，很多还保留着比较完整的参考 UI：

- `src/features/dashboard/**`
- `src/features/apps/**`
- `src/features/tasks/**`
- `src/features/users/**`
- `src/features/errors/**`
- `src/features/auth/sign-in/**`
- `src/features/auth/sign-up/**`
- `src/features/auth/forgot-password/**`
- `src/features/auth/otp/**`
- `src/features/clerk/**` 的旧路由配套部分

但要注意：

- 它们很多仍依赖 `@tanstack/react-router`
- 当前 `app/**` 并没有直接把这些页面重新接回 Next 主链
- 现在真正接在路由上的，是：
  - dashboard shell
  - `resources`
  - `settings`
  - `/sign-in`
  - 以及一批 placeholder 页面

所以这类文件的正确定位是：

- **可以继续拿来参考视觉与交互**
- **但不应被当成当前正式页面实现**

补充说明：

- 旧 `src/features/errors/**` 中供 `src/routes/**` 复用的错误页，已经进一步改为使用浏览器原生导航动作
- 它们仍属于 legacy 参考面，但不再直接依赖 `@tanstack/react-router` 的导航 hook
- 旧 `src/components/layout/top-nav.tsx` 也已切到浏览器原生 `href` 导航，不再直接依赖 `@tanstack/react-router` 的 `Link`
- 旧 `src/features/auth/**` 非测试文件中的 `Link / useNavigate / useSearch` 也已切到浏览器原生导航与 `location.search` 读取
- 旧 `src/features/apps/index.tsx` 的 `filter/type/sort` 查询参数也已切到浏览器原生 `URLSearchParams + history.replaceState`
- 旧 `src/features/tasks/components/tasks-table.tsx` 已改为通过 `use-legacy-search-state.ts` 使用浏览器原生 URL 状态桥，不再直接依赖 `getRouteApi()`
- 旧 `src/features/users/index.tsx` 也已复用 `use-legacy-search-state.ts`，不再直接依赖 `getRouteApi()`

## 3. 现在不要直接删的部分

有些东西虽然带着 legacy 痕迹，但当前还不能直接删。

### 3.1 manifest 层

- `src/features/apps/manifest.ts`
- `src/features/tasks/manifest.ts`
- `src/features/users/manifest.ts`
- `src/features/auth/manifest.ts`
- `src/features/errors/manifest.ts`
- `src/features/clerk/manifest.ts`

原因：

- `src/modules/registry.ts` 当前仍会注册这些模块
- sidebar / command menu / 路由占位页 / 受保护路径规则仍会消费它们

也就是说：

- 旧页面实现可以是 legacy
- 但 `manifest.ts` 仍可能是当前导航链的活跃部分

### 3.2 Vitest 运行时相关

- `vite.config.ts`
- `vite`
- `@vitejs/plugin-react`
- `@vitest/browser-playwright`
- `vitest`

原因：

- 当前自动化测试仍走 `Vitest Browser Mode`
- 运行配置入口就是 `vite.config.ts`
- 当前 `vite.config.ts` 里的 `tanstackRouter` 文件路由插件已经进一步收紧为：
  - 默认不在 `Vitest` 进程里启用
  - 只有显式设置 `VITEST_ENABLE_TANSTACK_ROUTER_PLUGIN=true` 时才为 legacy route 测试回开

因此现在不能把“旧 Vite 路由入口”与“Vitest 的 Vite 运行时”混为一谈。

可以删的是旧 Vite 页面主链；  
不能现在就删的是支撑测试的 Vite 运行配置。

### 3.3 legacy 命名但当前仍保留兼容的 cookie 名

- `src/lib/cookies.ts`
  - 兼容读取旧的 `vite-ui-theme`
  - 兼容读取旧的 `vite-ui-language`

这两个名字已经不再是当前模板主链的正式 key，但兼容读取仍然保留。

这意味着：

- 它们是**兼容遗留命名**
- 不是当前就应立刻从迁移层完全删掉的残留

如果后续要改名，应该做成一次有兼容窗口的迁移，而不是简单替换字符串。

## 4. 依赖层的清理顺序

建议按下面顺序推进，而不是直接从 `package.json` 开砍。

### 阶段 A：先清源码入口

目标对象：

- `src/main.tsx`
- `src/routeTree.gen.ts`
- `src/routes/**`
- `src/context/**`
- 旧 layout / old shell 辅助文件

前提：

- 你确认当前 `app/**` 已完全覆盖需要保留的页面入口
- 或者你已接受这些旧页面只保留文档/截图，不再保留源码参考

### 阶段 B：再清旧 feature 页面实现

目标对象：

- 仍依赖 `@tanstack/react-router` 的旧 feature 页面和测试

前提：

- 你已经决定不再把这些旧 UI 当作源码级参考
- 或者你已经把需要保留的参考模式转写到新的 reference module / docs 中

### 阶段 C：最后清依赖

候选依赖：

- `@tanstack/react-router`
- `@tanstack/react-router-devtools`
- `@tanstack/router-plugin`
- `zustand`
- `react-top-loading-bar`

这一步只有在对应源码真正消失后才适合做。

不要反过来先删依赖，否则只会把仓库推到半坏状态。

## 5. 当前可直接执行的删除前检查

如果下一轮真的要开始删，先做这几件事：

1. 检查 `src/modules/registry.ts` 中哪些 `manifest.ts` 仍在当前导航链使用
2. 检查 `app/**` 是否已有对应页面或 placeholder 承接
3. 检查测试是否还显式 mock / import `@tanstack/react-router`
4. 检查 `vite.config.ts` 是否仍承担 Vitest 浏览器运行配置
5. 检查是否有 active config 仍保留 legacy 兼容层，例如 cookie fallback key

## 6. 推荐的实际清理顺序

如果后续继续推进，我建议这样做：

1. 先删 `src/main.tsx`、`src/routeTree.gen.ts`、`src/routes/**` 这一整条旧入口链
2. 再删 `src/context/**`、`src/stores/auth-store.ts`、`src/components/navigation-progress.tsx`
3. 再按模块删旧 feature 页面实现
4. 最后再清 `package.json` 里的 legacy 依赖
5. 如果要做 cookie 名去 legacy，再单独开一轮兼容迁移

## 7. 一句话结论

当前仓库的 legacy 残留大致分三类：

- **可作为首批清理目标的旧入口链**：`src/main.tsx`、`src/routeTree.gen.ts`、`src/routes/**`
- **还在被当前模板能力间接消费的活跃遗留项**：`manifest.ts`、`vite.config.ts`、cookie fallback/兼容层
- **还能当参考，但已不在主链的旧页面实现**：旧 `dashboard/apps/tasks/users/auth/errors/clerk` 页面树
