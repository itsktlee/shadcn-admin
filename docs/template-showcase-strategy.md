# 模板展示面策略

这份文档只回答一个问题：**这个仓库为什么要同时保留完整 demo admin 展示面，以及工程基线页面。**

## 1. 当前默认定位

当前仓库的默认定位是：

- 一个可以直接开源的完整后台模板
- 一个保留原 `shadcn-admin` 视觉观感的 Next.js 版本
- 一个允许后续业务项目逐步接管的母模板

这意味着它**不是**默认朝“极简空壳”方向继续收缩的仓库。

## 2. 三层分工

为了同时满足“能展示”和“能接管”，当前页面分成三层。

### 2.1 Showcase Demo

这类页面的职责是：

- 维持开源模板的完整展示面
- 让接手者一拉下来就能看到完整后台观感
- 提供视觉布局、信息密度和交互组织参考

当前主要包括：

- `/`
- `/apps`
- `/tasks`
- `/users`
- `/chats`
- `/help-center`
- `/sign-in-2`
- `/sign-up`
- `/forgot-password`
- `/otp`
- `/errors/*`

### 2.2 Engineering Baseline

这类页面的职责是：

- 作为后续业务开发时更稳定的工程参考
- 提供相对清晰的模块边界、路由接入、权限、数据契约和 provider 接法

当前主要包括：

- `/resources`
- `/settings/*`
- `/sign-in`

其中：

- `resources` 负责演示列表、CRUD、adapter、query、字段级错误、权限动作位
- `settings` 负责演示 dashboard 内二级导航和表单页组织
- `sign-in` 负责演示当前正式认证主链

### 2.3 Optional Legacy Reference

这类内容的职责是：

- 作为迁移痕迹或历史参考保留
- 避免接手者误判为当前正式主链

当前主要包括：

- `index.html`
- `src/main.tsx`
- 若干未再接回 `app/**` 主链的旧参考实现

## 3. 对开源模板意味着什么

如果你准备把这个仓库开源，默认应该保留：

- showcase demo
- engineering baseline
- 文档中的接管说明

这样新的使用者第一次打开时，就能同时理解：

1. 这个模板长什么样
2. 该从哪里开始接管
3. 哪些内容是展示，哪些内容是工程基线

## 4. 什么时候才需要继续裁剪

只有在以下情况，才建议进入更激进的 legacy / 展示面清理：

- 你明确要做“极简母模板”分支
- 你不再需要完整 demo admin 展示面
- 你已经把展示价值转写到新的 reference module 或文档中

否则，默认建议是：

- 保留完整展示面
- 优先替换导航、manifest、reference module 和 mock 层
- 不要把“继续删”当成接手模板的第一步
