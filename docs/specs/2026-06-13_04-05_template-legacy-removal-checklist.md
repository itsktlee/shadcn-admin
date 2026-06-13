# Spec: template-legacy-removal-checklist

## 1. 目标

- 要解决什么问题：当前仓库已经有了清晰的 Next 主链，但 legacy 残留还停留在“知道有一堆旧文件”。要把它推进到“后续可以按清单执行删除”。
- 本轮目标：产出一份模板级 legacy removal checklist，明确每类残留的当前状态、删除前提、风险点和建议顺序。

## 2. 已知事实

- `src/routes/**`、`src/main.tsx`、`src/routeTree.gen.ts` 仍构成旧 `TanStack Router + Vite` 入口。
- `src/context/**`、`src/stores/auth-store.ts`、`src/components/navigation-progress.tsx` 属于旧状态/壳层体系。
- `src/features/dashboard|apps|tasks|users|errors|auth/*|clerk` 中有一批旧页面实现仍依赖 `@tanstack/react-router`。
- `vite.config.ts`、`vite`、`@vitejs/plugin-react` 目前仍承担 `Vitest Browser Mode` 的运行配置职责，不能与旧路由入口一刀切一起删。
- `src/lib/cookies.ts` 里的 `vite-ui-theme` / `vite-ui-language` 已进入兼容迁移层，不再是当前主 cookie key，但 fallback 仍保留。

## 3. Done Contract

- 完成标志：
  - 有一份文档把 legacy 残留分成“可直接目标化清理”“暂时保留”“改名前需要兼容”的几类。
  - 文档包含删除顺序和前提，不只是文件罗列。
  - 接管文档或模板边界文档能够链接到这份 checklist。
- 完成证据：
  - 新增 checklist 文档
  - 更新的文档入口
- 未完成判定：
  - 如果文档没有区分“Vitest 仍依赖的 Vite 运行时”和“已不在 Next 主链的旧页面入口”，则仍未完成。

## 4. 本轮最小动作

1. 盘点 legacy 文件层和依赖层残留。
2. 梳理各类残留的引用关系与可删除前提。
3. 落盘 checklist 并回链到现有文档。

## 5. 验证方式

- `rg --files` 检查 legacy 目录分布。
- `rg -n "@tanstack/react-router|routeTree.gen|import.meta.env.VITE_|vite-ui-theme|vite-ui-language"` 检查旧依赖与兼容遗留命名。
- `codegraph_explore` 复核：
  - `src/main.tsx`
  - `src/routeTree.gen.ts`
  - `src/routes/**`
  - `src/components/layout/authenticated-layout.tsx`
  - `src/components/navigation-progress.tsx`

## 6. Reverse Sync

- 已新增：
  - `docs/template-legacy-removal-checklist.md`
- 已更新：
  - `README.md`
  - `docs/template-adoption-guide.md`
  - `docs/template-active-surface.md`
  - `CHANGELOG.md`
- 本轮确认的结构结论：
  - `src/main.tsx + src/routeTree.gen.ts + src/routes/**` 仍构成完整的旧 `TanStack Router + Vite` 入口链，可作为后续首批清理目标。
  - `src/context/**`、`src/stores/auth-store.ts`、`src/components/navigation-progress.tsx` 属于旧状态/壳层辅助层，可在旧入口链之后继续清理。
  - `manifest.ts`、`vite.config.ts` 与 legacy cookie fallback 目前仍属于“兼容保留项”，不应与旧页面主链一并删除。
  - `dashboard/apps/tasks/users/auth/errors/clerk` 等旧 feature 页面树仍可作为视觉参考，但不在当前 Next 路由主链。
- 验证证据：
  - 已通过 `rg --files` 盘点 legacy 文件分布
  - 已通过 `rg -n "@tanstack/react-router|routeTree.gen|import.meta.env.VITE_|vite-ui-theme|vite-ui-language"` 验证旧依赖与兼容遗留命名
  - 已通过 `codegraph_explore` 复核 `src/main.tsx`、`src/routeTree.gen.ts`、`src/routes/**` 与旧 clerk/authenticated 布局之间的旧入口关系
- 本轮未运行构建或测试；原因：本轮仅做文档级收口，没有改动运行行为
