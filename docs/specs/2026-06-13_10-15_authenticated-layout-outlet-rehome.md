# Spec: authenticated-layout-outlet-rehome

## Goal

将旧 `authenticated-layout` 中默认渲染 `Outlet` 的职责迁回 `src/routes/**`，让该组件彻底变成纯布局组件，并移除它对 `@tanstack/react-router` 的 direct import。

## Scope

- 修改 `src/components/layout/authenticated-layout.tsx`
- 修改 `src/routes/_authenticated/route.tsx`
- 修改 `src/routes/clerk/_authenticated/route.tsx`
- 更新 `docs/template-active-surface.md`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不删除旧 route 文件
- 不改 `src/routes/clerk/route.tsx` 的缺失 key 页面
- 不主动运行测试或构建

## Facts

- `authenticated-layout` 当前被两个旧 route 文件直接作为 `component` 使用
- 它内部唯一不属于纯布局职责的部分，是 `children ?? <Outlet />`
- `Outlet` 归属 route 文件本身更合理

## Plan

1. 让 `authenticated-layout` 只接受显式 children
2. 在 `src/routes/_authenticated/route.tsx` 与 `src/routes/clerk/_authenticated/route.tsx` 中自行渲染 `<Outlet />`
3. 回写文档，刷新剩余 direct import 面

## Done Contract

- `src/components/layout/authenticated-layout.tsx` 不再直接 import `@tanstack/react-router`
- 旧 route 行为仍保持不变
- 非 `src/routes/**` 范围内的 router direct import 只剩退役的 `navigation-progress.tsx`

## Validation

- 静态检查 `authenticated-layout.tsx` 是否移除 router import
- 静态检查两个 route 文件是否改为自行渲染 `<Outlet />`
- 静态检查剩余 direct import 面是否只剩退役组件

## Resume

- 完成后，应进入一轮更完整的当前状态审计，判断是否已经达到“代码收口完成、仅剩验证证据不足”的阶段
