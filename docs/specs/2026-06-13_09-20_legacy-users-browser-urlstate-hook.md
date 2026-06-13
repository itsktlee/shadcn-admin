# Spec: legacy-users-browser-urlstate-hook

## Goal

复用已有 `useLegacySearchState()`，将旧 `src/features/users/index.tsx` 传给 `UsersTable` 的 `search/navigate` 从 `getRouteApi()` 切到浏览器原生 URL 状态桥，继续减少非 `src/routes/**` 范围内的 `@tanstack/react-router` 直接依赖。

## Scope

- 修改 `src/features/users/index.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不改 `UsersTable` 内部逻辑
- 不改 `src/routes/_authenticated/users/index.tsx`
- 不主动运行测试或构建

## Facts

- `UsersTable` 需要的只是 `search` 对象和 `navigate` 函数
- 上一轮已新增 `useLegacySearchState()`，并已在 `TasksTable` 中落地
- users 路由查询参数键集是 `page/pageSize/username/status/role`

## Plan

1. 在 `Users` 页面复用 `useLegacySearchState()`
2. 保持 `UsersTable` 的 props 形状不变
3. 回写 checklist / changelog

## Done Contract

- `src/features/users/index.tsx` 不再直接 import `@tanstack/react-router`
- `UsersTable` 仍能拿到同形状的 `search/navigate`
- 文档能反映旧 users 页已进一步脱离 router 运行时

## Validation

- 静态检查 `src/features/users/index.tsx` 是否移除 `@tanstack/react-router` import
- 静态检查 `useLegacySearchState()` 是否被 users 复用
- 静态检查 checklist / changelog 是否同步说明

## Result

- `src/features/users/index.tsx` 对 `@tanstack/react-router` 的 direct import 当前为空结果
- `Users` 页面已复用 `useLegacySearchState()` 向 `UsersTable` 提供 `search/navigate`
- `UsersTable` 的 props 形状保持不变
- checklist / changelog 已同步记录该状态

## Resume

- 完成后，下一步可回头处理 `navigation-progress`，或继续压缩 `tasks/users/apps` 外剩余的 router 直接使用面
