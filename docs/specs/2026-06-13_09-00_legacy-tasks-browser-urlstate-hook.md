# Spec: legacy-tasks-browser-urlstate-hook

## Goal

为旧表格页提供一个浏览器原生 URL 状态桥，并先接到 `src/features/tasks/components/tasks-table.tsx`，把该页从 `getRouteApi().useSearch()/useNavigate()` 上拆下来，同时为后续 `users` 页复用留接口。

## Scope

- 新增 `src/hooks/use-legacy-search-state.ts`
- 修改 `src/features/tasks/components/tasks-table.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不改 `src/routes/_authenticated/tasks/index.tsx`
- 不改 `useTableUrlState` 公共签名
- 不顺手处理 `users` 页
- 不主动运行测试或构建

## Facts

- `TasksTable` 当前只用 `route.useSearch()` 和 `route.useNavigate()` 作为 `useTableUrlState()` 的输入
- `useTableUrlState()` 需要的是 `search` 对象和一个 `NavigateFn`
- 这层桥可以由浏览器原生 `URLSearchParams + history.pushState/replaceState + popstate` 提供

## Plan

1. 新增通用 `useLegacySearchState()` hook
2. 让 `TasksTable` 通过该 hook 向 `useTableUrlState()` 提供 `search/navigate`
3. 回写 checklist / changelog

## Done Contract

- `src/features/tasks/components/tasks-table.tsx` 不再直接 import `@tanstack/react-router`
- `TasksTable` 仍保留当前过滤、分页、筛选与 URL 同步行为
- 新 hook 可在后续复用于 `users` 等同类 legacy 页面

## Validation

- 静态检查 `tasks-table.tsx` 是否移除 `@tanstack/react-router` import
- 静态检查 `use-legacy-search-state.ts` 是否承载 parse/write/popstate 逻辑
- 静态检查 checklist / changelog 是否同步说明

## Resume

- 完成后，下一步可优先让 `users` 页复用同一 hook，再继续压缩其 `getRouteApi()` 依赖
