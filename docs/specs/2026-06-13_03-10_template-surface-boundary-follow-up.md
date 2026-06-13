# Spec: template-surface-boundary-follow-up

## 1. 目标

- 要解决什么问题：当前仓库已经以 `Next.js App Router` 为正式模板壳，但仓库里仍保留一批旧 `Vite + TanStack Router` 参考代码。若不把边界写清楚，后续接管时很容易误从 legacy 面开始改。
- 本轮目标：补一份“当前活跃模板面 vs legacy 参考面”的正式说明，并接到模板使用指南里。

## 2. 已知事实

- 正式运行入口已经是 `app/** + app/layout.tsx + middleware.ts`。
- dashboard 壳、settings、resources、mock auth、providers、module registry、i18n、theme 等都已经接到 Next 运行链路。
- 仓库内仍保留 `src/routes/**`、`src/context/**` 以及多组旧 `@tanstack/react-router` 页面实现，主要用于迁移参考，当前不应视为模板主入口。
- 但部分 legacy feature 的 `manifest.ts` 仍然是活跃的，因为当前 sidebar / command menu / 路由占位页依赖这些模块注册信息。

## 3. Done Contract

- 完成标志：
  - 有一份文档清楚说明当前模板活跃运行面、当前真实页面覆盖范围、legacy 参考面、以及后续接管时该从哪里开始。
  - `docs/template-adoption-guide.md` 明确链接到这份边界说明。
- 完成证据：
  - 新文档内容
  - 接管指南新增入口链接
- 未完成判定：
  - 若文档仍把 `src/routes/**` 与 `app/**` 混在一起描述，或没有说明 manifest 与旧页面实现之间的边界，就仍未完成。

## 4. 本轮最小动作

1. 根据当前源码入口梳理 Next 活跃运行面。
2. 根据当前残留 import 和目录结构梳理 legacy 参考面。
3. 落盘文档并回链到接管指南。

## 5. 验证方式

- 结构证据：
  - `app/layout.tsx`
  - `app/(dashboard)/layout.tsx`
  - `app/(dashboard)/**`
  - `middleware.ts`
  - `src/modules/registry.ts`
- 检索证据：
  - `rg` 检查 `app/**` 当前引用的 feature/provider/config/service
  - `rg` 检查 `@tanstack/react-router` 仍残留在 `src/routes/**` 与旧 feature 中的分布

## 6. Reverse Sync

- 已新增：
  - `docs/template-active-surface.md`
- 已更新：
  - `docs/template-adoption-guide.md`
- 本轮确认的结构结论：
  - 当前正式运行入口是 `app/layout.tsx`、`app/(dashboard)/layout.tsx` 与 `middleware.ts`
  - 当前真实接线页面以 `resources`、`settings`、`/sign-in` 和 dashboard shell 为主
  - `src/modules/registry.ts` 仍会消费多组 `manifest.ts`，因此“导航注册仍活跃”与“旧页面实现仍活跃”必须分开判断
  - `src/routes/**`、`src/context/**` 以及多组旧 feature 页面实现仍保留 `@tanstack/react-router` 范式，应视为 legacy 参考面
- 验证证据：
  - `codegraph_explore` 校验了 `middleware.ts`、`src/features/resources/index.tsx`、`src/features/settings/index.tsx`
  - 源码检查确认：
    - `app/(dashboard)/page.tsx` 当前接 `src/features/multishell/dashboard-page-shell.tsx`
    - 旧 `src/features/dashboard/index.tsx` 仍存在，但不在当前 Next 路由主链
