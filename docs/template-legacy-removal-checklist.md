# Legacy 清理清单

这份文档是一个**可选裁剪路线**，只面向两个场景：

1. 你后续想把这个仓库继续收成更纯粹的 `Next.js` 母模板
2. 你要让 AI 接着清理旧残留，但又不想让它误删当前还在用的东西

如果你只是把当前仓库当成完整展示面的开源模板来接管，这份文档不是默认起点。

核心原则只有一句：

**先区分“已经退役并删除的旧链”和“仍保留参考价值的 remaining legacy 面”，再继续删。**

## 1. 已完成退役的首批 legacy 链

这一批已经从仓库中物理移除，不再属于当前 Next 正式运行主链：

- `src/routes/**`
- `src/routeTree.gen.ts`
- `src/stores/auth-store.ts`
- `src/components/navigation-progress.tsx`
- `src/features/auth/sign-in/components/user-auth-form.tsx`

这批文件删除的原因分别是：

- `src/routes/** + src/routeTree.gen.ts`：旧 `TanStack Router` 路由树已经不再承担任何入口职责
- `auth-store.ts`：旧 `zustand` 认证状态已不允许继续挂回当前认证主链
- `navigation-progress.tsx`：已完全退役，不再保留“可能重新接线”的意义
- `user-auth-form.tsx`：它的唯一核心状态依赖就是已删除的 `auth-store`，且当前 `/sign-in`、`/sign-in-2` 已改走正式 `template-sign-in-form`

## 2. 当前仍保留的 legacy 参考面

这部分才是后续继续清理时真正需要评估的对象。

### 2.1 Retired legacy notice entry

- `index.html`
- `src/main.tsx`

当前这条链只承担一个职责：

- 显式说明旧 Vite 入口已经退役

它不是第二套应用，也不再连接任何旧路由运行时。

### 2.2 剩余旧 shell 辅助层

- `src/components/layout/top-nav.tsx`

当前剩余 shell 辅助层已经缩到这一项。

补充说明：

- `top-nav.tsx` 当前仍被 `src/features/dashboard/index.tsx` 使用，所以它不是当前可删对象

### 2.3 仍可参考但不应当成正式模板实现的旧 feature

下面这些 feature 里，很多还保留着比较完整的参考 UI：

- `src/features/dashboard/**`
- `src/features/apps/**`
- `src/features/tasks/**`
- `src/features/users/**`
- `src/features/chats/**`
- `src/features/help-center/**`
- `src/features/errors/**`
- `src/features/auth/sign-up/**`
- `src/features/auth/forgot-password/**`
- `src/features/auth/otp/**`

但要注意：

- 它们很多仍依赖 `@tanstack/react-router`
- 其中一部分已经接回当前 `app/**` 主链，作为 showcase demo 页面存在
- 当前真正可直接作为模板工程参考的主链还是 `resources / settings / sign-in`

所以这类文件的正确定位是：

- **可以继续拿来参考视觉与交互**
- **即使已经接在当前主链上，也不等于它们都是首选工程基线**

## 3. 现在不要直接删的部分

有些东西虽然带着 legacy 痕迹，但当前还不能直接删。

### 3.1 manifest 层

- `src/features/apps/manifest.ts`
- `src/features/tasks/manifest.ts`
- `src/features/users/manifest.ts`
- `src/features/auth/manifest.ts`
- `src/features/errors/manifest.ts`
- `src/features/chats/manifest.ts`
- `src/features/help-center/manifest.ts`
- `src/features/dashboard/manifest.ts`
- `src/features/resources/manifest.ts`
- `src/features/settings/manifest.ts`

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
- 当前 `vite.config.ts` 已不再承载 legacy `TanStack Router` 文件路由插件

因此现在不能把“旧 Vite 入口”与“Vitest 的 Vite 运行时”混为一谈。

### 3.3 legacy 命名但当前仍保留兼容的 cookie 名

- `src/lib/cookies.ts`
  - 兼容读取旧的 `vite-ui-theme`
  - 兼容读取旧的 `vite-ui-language`

这两个名字已经不再是当前模板主链的正式 key，但兼容读取仍然保留。

如果后续要改名，应该做成一次有兼容窗口的迁移，而不是简单替换字符串。

## 4. 依赖层的清理顺序

建议按下面顺序推进，而不是直接从 `package.json` 开砍。

### 阶段 A：先清 remaining legacy 源码

目标对象：

- `src/main.tsx`
- 旧 layout / old shell 辅助文件

前提：

- 你确认 retired legacy notice entry 也不再需要保留
- 或者你已接受旧入口只保留在 git 历史里，不再保留源码参考

### 阶段 B：再清旧 feature 页面实现

目标对象：

- 仍依赖 `@tanstack/react-router` 的旧 feature 页面和测试

前提：

- 你已经决定不再把这些旧 UI 当作源码级参考
- 或者你已经把需要保留的参考模式转写到新的 reference module / docs 中

### 阶段 C：最后清依赖

本阶段已经完成以下清理：

- `@tanstack/react-router`
- `@tanstack/react-router-devtools`
- `@tanstack/router-plugin`
- `zustand`
- `react-top-loading-bar`

完成前提是：

- 活跃运行代码中的 direct import 已清空
- 剩余两处测试持有点已改到 `navigateLegacyAuth(...)` 语义上

当前 remaining legacy 已不再依赖这批旧包。

## 5. 当前可直接执行的删除前检查

如果下一轮真的要开始删，先做这几件事：

1. 检查 `src/modules/registry.ts` 中哪些 `manifest.ts` 仍在当前导航链使用
2. 检查 `app/**` 是否已有对应页面承接，以及这些页面是否仍承担开源展示面职责
3. 检查测试是否还显式 mock / import `@tanstack/react-router`
4. 检查 `vite.config.ts` 是否仍承担 Vitest 浏览器运行配置
5. 检查是否有 active config 仍保留 legacy 兼容层，例如 cookie fallback key

## 6. 推荐的实际清理顺序

如果后续继续推进，我建议这样做：

1. 先判断 `src/main.tsx` 的 retired notice 是否还要继续保留
2. 再判断哪些旧 shell 文件已经既不服务运行面、也不服务展示面
3. 再按模块删旧 feature 页面实现
4. 最后再清 `package.json` 里的 legacy 依赖
5. 如果要做 cookie 名去 legacy，再单独开一轮兼容迁移

## 7. 一句话结论

当前仓库的 legacy 残留大致分三类：

- **已完成退役的旧链**：`src/routes/**`、`src/routeTree.gen.ts`、`src/stores/auth-store.ts`、`src/components/navigation-progress.tsx`、`src/context/**`、`src/components/layout/authenticated-layout.tsx`
- **还在被当前模板能力间接消费的活跃遗留项**：`manifest.ts`、`vite.config.ts`、cookie fallback/兼容层
- **还能当参考，但不一定是首选工程基线的旧页面实现**：`src/main.tsx`、以及若干以 showcase 角色保留的 feature 页面树
