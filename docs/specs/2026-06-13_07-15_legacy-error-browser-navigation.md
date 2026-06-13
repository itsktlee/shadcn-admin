# Spec: legacy-error-browser-navigation

## Goal

将旧 `src/features/errors/**` 中用于旧 `TanStack Router` 错误页的“返回上一页 / 回首页”交互，从 `@tanstack/react-router` 运行时 API 改为通用浏览器导航能力，继续收缩非 `src/routes/**` 范围内的直接路由耦合。

## Scope

- 新增 `src/features/errors/legacy-error-actions.tsx`
- 修改 `src/features/errors/general-error.tsx`
- 修改 `src/features/errors/not-found-error.tsx`
- 修改 `src/features/errors/forbidden.tsx`
- 修改 `src/features/errors/unauthorized-error.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不改 Next 错误页实现
- 不删除旧错误页文件
- 不改旧 routes 映射关系
- 不主动运行测试或构建

## Facts

- 这几页当前只用 `useRouter().history.go(-1)` 和 `useNavigate({ to: '/' })`
- 这些交互本质上可以用 `window.history.back()` 与 `window.location.assign('/')` 实现
- 当前 Next 错误页已经不复用这组旧错误组件

## Plan

1. 抽出共享 `LegacyErrorActions`
2. 让旧错误页去掉 `@tanstack/react-router` hook 依赖
3. 回写 checklist / changelog

## Done Contract

- 旧错误页不再直接 import `@tanstack/react-router`
- 保留原有“返回上一页 / 回首页”行为
- 文档能反映旧错误页已经进一步脱离路由运行时 API

## Validation

- 静态检查四个旧错误页是否移除 `@tanstack/react-router` import
- 静态检查新共享动作组件是否使用浏览器导航
- 静态检查 checklist / changelog 是否同步说明

## Result

- `src/features/errors/**` 下旧错误页对 `@tanstack/react-router` 的 direct import 当前为空结果
- 四个旧错误页已统一复用 `LegacyErrorActions`
- `LegacyErrorActions` 已改为使用 `window.history.back()` 与 `window.location.assign('/')`
- checklist / changelog 已同步记录该状态

## Resume

- 完成后，下一步应继续处理剩余非 `src/routes/**` 范围内的 router 直接使用面，例如 `navigation-progress`、`top-nav` 或旧 auth/apps/users/tasks feature
