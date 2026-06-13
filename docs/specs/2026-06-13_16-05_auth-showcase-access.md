# Spec: auth-showcase-access

## Goal

让模板中的认证页恢复为“随时可查看的展示页”逻辑，而不是在已有登录态时强制回跳 dashboard。

## Scope

- 调整认证页访问策略
- 保持 dashboard 受保护逻辑不变
- 不改认证页样式、表单结构和导航结构
- 不主动运行 build / lint

## Done Contract

完成标准：

1. 已登录状态下访问 `/sign-in` 不再自动跳回 `/`
2. 认证页可像原版模板一样随时查看展示效果
3. 未登录访问受保护后台页时，仍然会跳到登录页

## Change Log

- 移除 [middleware.ts](/Users/ktlee/coding/shadcn-admin/middleware.ts) 中“已登录访问 `/sign-in` 就强制回 `/`”的分支
- 保留 public / protected path 的原有边界，继续让后台页在未登录时跳回登录页

## Validation

- 浏览器回归通过：已有登录态时直接访问 `http://localhost:3002/sign-in`，页面停留在 `/sign-in`，并正常显示认证页内容
- 浏览器回归通过：退出登录后访问 `http://localhost:3002/resources`，页面跳转到 `/sign-in?redirect=%2Fresources`
