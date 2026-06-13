# Spec: authenticated-layout-provider-alignment

## Goal

在不扩大清理范围的前提下，把 legacy `src/components/layout/authenticated-layout.tsx` 从旧 `src/context/**` provider 体系切到当前 `src/providers/**` 组合，继续收缩活跃源码对旧 context 的直接依赖。

## Scope

- 修改 `src/components/layout/authenticated-layout.tsx`
- 更新 `docs/template-active-surface.md`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不删除 `src/context/**`
- 不删除 `src/routes/**`
- 不调整旧 TanStack Router 页面结构
- 不主动运行 build / test

## Facts

- 当前 Next 主链 dashboard 壳使用 `src/providers/dashboard-providers.tsx`
- 旧 `authenticated-layout.tsx` 仍直接引用 `@/context/layout-provider` 与 `@/context/search-provider`
- 旧 `SearchProvider` 会内嵌渲染 `CommandMenu`
- 新 `DashboardSearchProvider` 不会自动渲染 `CommandMenu`

## Plan

1. 让 `authenticated-layout.tsx` 复用 `DashboardProviders`
2. 在 legacy 壳内显式补回 `CommandMenu`
3. 回写边界文档，更新“剩余 direct context 引用”的结论

## Done Contract

- `authenticated-layout.tsx` 不再直接 import `@/context/*`
- legacy layout 仍保留 sidebar + command menu 组合能力
- 文档与 changelog 能反映这次边界收缩

## Validation

- 使用 `rg -n "@/context/" src app --glob '!src/context/**'` 检查 direct 引用面
- 静态核对 `authenticated-layout.tsx` 的 provider 组合与 `app/(dashboard)/layout.tsx` 一致性

## Result

- `authenticated-layout.tsx` 已改为复用 `DashboardProviders`
- legacy 壳内已显式补回 `CommandMenu`
- `rg -n "@/context/" src app --glob '!src/context/**'` 当前为空结果
- 当前仓库里旧 `src/context/**` 的 direct 引用已收缩到该目录自身及旧测试面

## Resume

- 如果本轮完成，下一步应回到旧入口链隔离或最终交付证据整理
