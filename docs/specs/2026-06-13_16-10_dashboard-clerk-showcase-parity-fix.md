# Spec: dashboard-clerk-showcase-parity-fix

## Goal

修复模板当前两处展示回退问题：

1. `/` 首页应恢复为原版 dashboard showcase，而不是 multishell 预览页。
2. `clerk/sign-in` 与 `clerk/sign-up` 应恢复到接近原 auth 双栏页的展示结构，避免缺少 key 时出现明显错位。

## Scope

- 将 [app/(dashboard)/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/page.tsx) 切回原版 dashboard 组件入口
- 重写 [src/features/clerk/clerk-auth-demo-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/clerk/clerk-auth-demo-layout.tsx) 为原 auth 双栏骨架
- 调整 `clerk` 登录/注册 fallback 容器宽度，使 `ClerkSetupGuide` 在中英文下都可正常阅读
- 不改动 `clerk/user-management` 的业务逻辑

## Done Contract

完成标准：

1. `/` 首页恢复原版 dashboard 卡片、tabs、overview 与 recent sales 展示
2. `/clerk/sign-in` 与 `/clerk/sign-up` 的整体骨架与原认证页风格一致
3. 缺少 Clerk key 时，说明内容不再出现明显宽度错位或一字一行式挤压
4. 完成浏览器视觉验收

## Change Log

- 将 `/` 首页入口切回原版 `Dashboard` showcase 组件
- 将 `clerk` auth 页改为独立视口双栏壳，避免继续受 `(auth)` 通用窄布局约束
- 调整 `ClerkSetupGuide` 的说明文案排版与 fallback 卡片容器宽度

## Validation

- 内置浏览器验收通过：`/`、`/clerk/sign-in`、`/clerk/sign-up`
- 已确认 `/` 恢复原版 dashboard 的统计卡、tabs、overview/recent sales 结构
- 已确认 `clerk/sign-in` 与 `clerk/sign-up` 在缺少 key 时恢复为正常双栏展示，不再出现窄列挤压
