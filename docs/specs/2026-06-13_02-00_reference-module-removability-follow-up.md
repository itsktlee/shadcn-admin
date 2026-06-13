# Spec: reference-module-removability-follow-up

## Goal
- 要解决什么问题：当前 `resources` 作为 reference module 虽然已经通过 `manifest + registry + route` 接入，但“可移除性”仍主要停留在结构层，没有显式模板开关。
- 本轮核心目标：为 reference module 提供一个模板级启用开关，让后续项目可以先关掉参考模块，而不需要物理删除文件。

## Relationship
- 依赖：
  - [nextjs-m9-template-hardening-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_00-40_nextjs-m9-template-hardening-implementation-checkpoint.md)
  - [template-delivery-audit-prep](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_01-40_template-delivery-audit-prep.md)
- 本文只解决：
  - `resources` 的模板级启用开关
  - registry / route / middleware 对该开关的消费
- 本文不进入：
  - 物理删除 `resources` 目录
  - 第二示例模块
  - 构建或测试命令

## Done Contract
- 完成标准：
  - 存在模板级 reference module 开关配置
  - `resources` 关闭时不会出现在导航注册中心
  - `/resources` 路由关闭时不再渲染页面主体
  - middleware 不再把关闭的 reference module 当成受保护模板入口
- 证明方式：
  - 配置与代码引用证据
  - spec 回写依赖面结论

## Canonical Decisions

### 1. 先提供“禁用开关”，不做真删除工具
- 当前阶段重点是模板交付能力
- 关掉 reference module 已足够证明壳层与参考模块解耦

### 2. 开关从配置层统一读
- 不把 `resources enabled` 判断散落在多个组件里
- registry / route / middleware 都消费同一配置

### 3. 默认保持启用
- 不破坏当前模板演示体验
- 后续业务项目可显式关闭

## Implementation Result

### 模板级 reference module 开关
- [src/config/template-modules.ts](/Users/ktlee/coding/shadcn-admin/src/config/template-modules.ts)
  - 已新增 `templateModuleFlags`
  - 当前默认：
    - `resources: process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES !== 'false'`

### registry 接线
- [src/modules/registry.ts](/Users/ktlee/coding/shadcn-admin/src/modules/registry.ts)
  - `resourcesManifest` 不再无条件注册
  - 现在只有在 `isTemplateModuleEnabled('resources')` 为真时才进入模块注册中心

### route 接线
- [app/(dashboard)/resources/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/resources/page.tsx)
  - 已在页面入口消费同一开关
  - `resources` 被关闭时直接 `notFound()`

### middleware 接线
- [middleware.ts](/Users/ktlee/coding/shadcn-admin/middleware.ts)
  - `/resources` 不再硬编码为永远受保护
  - 当 reference module 关闭时，它也会从 protected prefix 列表移除
- [src/services/auth/route-access.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/route-access.ts)
  - 已抽出可测试的 public/protected path 逻辑
  - middleware 现在消费同一份路径访问规则

## Validation Evidence

### 静态交叉引用证据
- `isTemplateModuleEnabled('resources')` 当前已出现在：
  - [src/modules/registry.ts](/Users/ktlee/coding/shadcn-admin/src/modules/registry.ts)
  - [app/(dashboard)/resources/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/resources/page.tsx)
  - [src/services/auth/route-access.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/route-access.ts)
- 已新增自动化测试骨架：
  - [src/config/template-modules.test.ts](/Users/ktlee/coding/shadcn-admin/src/config/template-modules.test.ts)
  - [src/modules/registry.test.ts](/Users/ktlee/coding/shadcn-admin/src/modules/registry.test.ts)
  - [src/services/auth/route-access.test.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/route-access.test.ts)

### 结论
- 当前模板已经具备“禁用 reference module 而不伤壳层主路径”的最小机制。
- 这为后续业务项目接管模板时先关掉 `resources`、再替换成真实业务模块提供了直接入口。

## Current Conclusion
- `Reference Module 可移除性` 已从结构层约定提升为模板级配置能力。
- 后续最终交付审计时，只需再补运行态强证据，而不是重新设计机制。
