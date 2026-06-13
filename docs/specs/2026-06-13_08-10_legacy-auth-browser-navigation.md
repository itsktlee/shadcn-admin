# Spec: legacy-auth-browser-navigation

## Goal

将旧 `src/features/auth/**` 页面里用于读 `redirect`、页面跳转和普通链接的 `@tanstack/react-router` 直接依赖改为浏览器原生导航能力，继续收缩非 `src/routes/**` 范围内的 router import。

## Scope

- 新增 `src/features/auth/legacy-auth-navigation.ts`
- 修改 `src/features/auth/sign-in/index.tsx`
- 修改 `src/features/auth/sign-in/sign-in-2.tsx`
- 修改 `src/features/auth/sign-in/components/user-auth-form.tsx`
- 修改 `src/features/auth/sign-up/index.tsx`
- 修改 `src/features/auth/forgot-password/index.tsx`
- 修改 `src/features/auth/forgot-password/components/forgot-password-form.tsx`
- 修改 `src/features/auth/otp/index.tsx`
- 修改 `src/features/auth/otp/components/otp-form.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不改 Next 主链登录页
- 不改旧 auth 页面视觉结构
- 不主动修改旧测试文件
- 不主动运行测试或构建

## Facts

- 旧 auth 页面当前主要用到 `Link`、`useNavigate()`、`useSearch()`
- 这些用途本质上只是：
  - 读 `redirect` 查询参数
  - 跳到 `/`、`/otp` 等普通路径
  - 渲染普通文本链接
- 这些交互都可以用浏览器原生 `window.location` 与 `<a href>` 完成

## Plan

1. 抽出 `legacy-auth-navigation.ts`
2. 将旧 auth 页的 `Link / useNavigate / useSearch` 替换为浏览器导航 helper 或原生 `<a>`
3. 回写 checklist / changelog

## Done Contract

- `src/features/auth/**` 非测试文件里不再直接 import `@tanstack/react-router`
- 旧 auth 页面仍保留原有的跳转目标和普通链接行为
- 文档能反映旧 auth 页面已进一步脱离 router 运行时

## Validation

- 静态检查 `src/features/auth` 非测试文件里的 `@tanstack/react-router` 直接 import 是否清空
- 静态检查 `legacy-auth-navigation.ts` 是否承载 redirect 读取和浏览器跳转
- 静态检查 checklist / changelog 是否同步说明

## Result

- `src/features/auth` 非测试文件里的 `@tanstack/react-router` direct import 当前为空结果
- `legacy-auth-navigation.ts` 已统一承载 `redirect` 查询参数读取与浏览器导航
- 旧 auth 页面里的普通文本链接已改为原生 `<a href>`
- checklist / changelog 已同步记录该状态

## Resume

- 完成后，下一步可继续处理剩余 router 直接使用面，例如 `navigation-progress`、旧 apps/users/tasks feature
