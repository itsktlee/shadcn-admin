# Spec: navigation-progress-retirement

## Goal

将旧 `TanStack Router` 根壳中的 `NavigationProgress` 停用，使其从旧路由树运行时链路中退出，继续压缩当前仍处于“实际参与 legacy 运行时”的 router 相关组件数量。

## Scope

- 修改 `src/routes/__root.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `docs/template-active-surface.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不删除 `src/components/navigation-progress.tsx`
- 不改 `NavigationProgress` 组件内部实现
- 不改 `authenticated-layout.tsx`
- 不主动运行测试或构建

## Facts

- `NavigationProgress` 当前只在 `src/routes/__root.tsx` 中被挂载
- 它依赖 `useRouterState()`，属于旧 TanStack Router 运行时组件
- 现阶段它不是当前 Next 主链需要保留的模板能力

## Plan

1. 从 `src/routes/__root.tsx` 移除 `NavigationProgress`
2. 将该组件定位更新为“纯 legacy 留存组件，当前未接入运行时”
3. 回写 active surface / checklist / changelog

## Done Contract

- `NavigationProgress` 不再被旧根路由壳挂载
- 文档能说明它已从 legacy 运行时链路中退役
- 剩余非 `src/routes/**` 范围内的 router 直接使用面进一步收缩

## Validation

- 静态检查 `src/routes/__root.tsx` 是否移除了 `NavigationProgress`
- 静态检查 `rg -n "NavigationProgress" src app` 结果是否只剩组件定义
- 静态检查文档与 changelog 是否同步说明

## Result

- `src/routes/__root.tsx` 已移除 `NavigationProgress` 挂载
- `rg -n "NavigationProgress" src app` 当前仅剩组件定义文件
- 当前非 `src/routes/**` 范围内剩余的 `@tanstack/react-router` direct import 已收缩到：
  - `src/components/navigation-progress.tsx`（已退役，未挂载）
  - `src/components/layout/authenticated-layout.tsx`（旧路由树仍需的 `Outlet` 壳）
- 文档与 changelog 已同步记录该状态

## Resume

- 完成后，下一步应重新审计剩余的 direct import 面；若只剩 `authenticated-layout`，可转入更明确的最终收口判断
