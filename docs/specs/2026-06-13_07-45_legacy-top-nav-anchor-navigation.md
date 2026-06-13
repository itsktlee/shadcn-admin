# Spec: legacy-top-nav-anchor-navigation

## Goal

将旧 `TopNav` 组件从 `@tanstack/react-router` 的 `Link` 依赖切到浏览器原生 `href` 导航，继续减少非 `src/routes/**` 范围内的直接 router import。

## Scope

- 修改 `src/components/layout/top-nav.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不改旧 dashboard 页面结构
- 不调整旧 `TopNavProps` 的数据形状
- 不改 Next 主链 header / sidebar
- 不主动运行测试或构建

## Facts

- `TopNav` 当前只被 `src/features/dashboard/index.tsx` 使用
- 该组件只负责展示一组导航项，不依赖路由 loader、search param 或嵌套路由能力
- 其 `href` 当前本身就是字符串

## Plan

1. 将 `TopNav` 的 `Link` 改为 `<a href>`
2. 保留 `disabled` 状态的视觉和点击阻止
3. 回写 checklist / changelog

## Done Contract

- `TopNav` 不再直接 import `@tanstack/react-router`
- 仍保留桌面 / 移动下拉两种展示形态
- `disabled` 链接不会真正触发跳转

## Validation

- 静态检查 `src/components/layout/top-nav.tsx` 是否移除 `@tanstack/react-router` import
- 静态检查 `TopNav` 是否改为 `href` 导航且处理 `disabled`
- 静态检查 checklist / changelog 是否同步说明

## Result

- `src/components/layout/top-nav.tsx` 对 `@tanstack/react-router` 的 direct import 当前为空结果
- `TopNav` 已改为浏览器原生 `href` 导航
- `disabled` 项保留了视觉弱化与 `preventDefault()` 阻止
- checklist / changelog 已同步记录该状态

## Resume

- 完成后，下一步可继续处理剩余 router 直接使用面，例如 `navigation-progress` 或旧 apps/auth/users/tasks feature
