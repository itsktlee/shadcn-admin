# Spec: auth-responsive-audit-and-fix-plan

## Goal

修复当前模板在认证展示页与移动端布局上的剩余适配问题，优先恢复与原版 `shadcn-admin` 接近的展示逻辑，并补齐多视口验收覆盖。

## Scope

- 仅处理本轮审计确认的问题：
  - auth 路由组布局基线
  - auth 页语言切换入口定位
  - auth 卡片页移动端宽度
  - `/sign-in` 仍为 shell 占位的问题
  - dashboard 首页移动端轻微横向溢出
- 本轮不引入新功能，不改认证策略，不改业务结构
- 在用户确认前不进入代码实现

## Done Contract

完成标准：

1. `/sign-in-2` 在桌面 `16:9` 与 `16:10` 下恢复双栏展示，不再被 `max-w-md` 压缩
2. `/sign-in`、`/sign-up`、`/forgot-password`、`/otp` 的语言切换入口位于页面级右上角，而不是局部卡片区右上角
3. `sign-up`、`forgot-password`、`otp` 在手机竖屏下表单卡片宽度不再异常收缩
4. `/sign-in` 恢复为可直接展示的原版登录页，而不是 shell 占位页
5. `/` 在手机竖屏下不存在横向溢出
6. 完成后用浏览器对 `1920x1080`、`1680x1050`、`390x844` 三组视口重新验收

## Facts

- 当前本地验证使用 `http://localhost:3002`
- `(auth)` 路由组外层布局会把子页面包进窄容器
- 普通 auth 页共用 `src/features/auth/auth-layout.tsx`
- `/sign-in-2` 是独立双栏展示页，不应继承窄卡片限制

## Audit Findings

### 1. 双栏登录被外层 auth layout 压坏

- [app/(auth)/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/layout.tsx) 当前使用居中窄容器包裹所有 auth 页面
- 这会导致 [src/features/auth/sign-in/sign-in-2.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/sign-in-2.tsx) 失去全屏双栏结构

### 2. 语言切换入口挂错层级

- [src/features/auth/auth-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/auth-layout.tsx) 中语言切换目前相对局部容器定位
- 结果是桌面端入口停留在中间卡片区域右上角，而不是页面级右上角

### 3. 部分 auth 卡片移动端宽度异常收缩

- [src/features/auth/sign-up/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-up/index.tsx)
- [src/features/auth/forgot-password/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/forgot-password/index.tsx)
- [src/features/auth/otp/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/otp/index.tsx)
- 上述页面在手机竖屏下存在 card 未按可用宽度展开的问题

### 4. `/sign-in` 仍然是 shell 占位实现

- [app/(auth)/sign-in/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/sign-in/page.tsx) 当前仍走 `SignInShellPage`
- 这与模板展示页目标不一致

### 5. dashboard 首页存在轻微移动端横向溢出

- `/` 在 `390x844` 视口下存在轻微 `overflow-x`
- 需要在 auth 修复后定位具体触发元素并收口

## Proposed Fix

1. 调整 [app/(auth)/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/layout.tsx)，移除对全部 auth 页面统一套用的窄宽度约束
2. 把普通 auth 卡片页的宽度控制下沉到各自页面实现
3. 调整 [src/features/auth/auth-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/auth-layout.tsx)，将语言切换入口提升为页面级定位
4. 恢复 `/sign-in` 使用真实展示页实现，并保持“已登录也可查看”的 showcase 逻辑
5. 单独修复 dashboard 首页的移动端横向溢出

## Validation Plan

- 浏览器验收视口：
  - `1920x1080`
  - `1680x1050`
  - `390x844`
- 覆盖路径：
  - `/sign-in`
  - `/sign-in-2`
  - `/sign-up`
  - `/forgot-password`
  - `/otp`
  - `/`
- 验收重点：
  - 双栏比例
  - 语言入口位置
  - 卡片宽度
  - 是否横向滚动
  - 文案与展示是否仍为原版模板语义

## Change Log

- 已将 [app/(auth)/layout.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/layout.tsx) 改为仅提供页面级 `min-h-svh` 容器，不再对所有 auth 页面强加统一窄宽度
- 已调整 [src/features/auth/auth-layout.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/auth-layout.tsx)，将语言切换入口提升到页面级右上角，并让普通 auth 页在独立页面壳内居中展示
- 已更新 [app/(auth)/sign-in/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/sign-in/page.tsx)，将 `/sign-in` 从 shell 占位页切回真实登录展示页
- 已更新 [src/features/auth/sign-in/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/index.tsx)、[src/features/auth/sign-up/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-up/index.tsx)、[src/features/auth/forgot-password/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/forgot-password/index.tsx)、[src/features/auth/otp/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/otp/index.tsx)，让卡片在移动端使用 `w-full` 并保留各自最大宽度
- 已对 [src/components/layout/header.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/header.tsx)、[src/components/search.tsx](/Users/ktlee/coding/shadcn-admin/src/components/search.tsx)、[src/features/dashboard/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/index.tsx) 做最小响应式收口，消除 dashboard 首页手机竖屏横向溢出

## Validation

- 浏览器多视口审计通过：
  - `1920x1080`：`/sign-in`、`/sign-in-2`、`/sign-up`、`/forgot-password`、`/otp`、`/` 均无横向溢出；`/sign-in-2` 右侧双栏面板宽度恢复为 `960px`
  - `1680x1050`：auth 全链路无横向溢出；`/sign-in-2` 右侧双栏面板宽度为 `840px`
  - `390x844`：`/sign-in`、`/sign-up`、`/forgot-password`、`/otp` 的主卡片均恢复正常可用宽度，页面级语言入口位于右上角，dashboard 首页无横向溢出
- 浏览器截图人工复核通过：
  - 双栏登录桌面截图：右侧预览区恢复半屏结构
  - 注册页手机竖屏截图：语言入口在页面右上角，表单卡片不再异常收缩
  - dashboard 手机竖屏截图：内容纵向排列正常，无横向顶出
- 浏览器控制台复核通过：`/sign-in-2`、`/sign-up`、`/` 在本轮验收时 `warn/error` 日志为空
