# Spec: nextjs-m5-contracts-adapters-implementation-checkpoint

## Goal
- 要解决什么问题：把模板里的参考资源数据契约、错误格式、adapter 接口和 mock/http/server 分层落成共享真相源，为后续 `resources` 列表页和 CRUD 工作流提供统一基础。
- 最终目标：后续 `form / query / adapter / handler` 都消费同一份 schema，不再出现 mock 一套、http 一套、server 又一套的分裂状态。
- 本轮核心目标：完成 `M5 - Shared Contracts + Adapters` 的最小代码骨架和验证闭环。
- 验收结果：形成可直接供 `M6/M7` 复用的 contract + adapter 基线。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m4-navigation-registry-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_23-05_nextjs-m4-navigation-registry-implementation-checkpoint.md)
- 本文只解决：
  - shared contract/schema
  - `resources` 参考资源契约
  - adapter 分层骨架
- 本文不进入：
  - `resources` 列表页 UI
  - `resources` CRUD 表单
  - auth / permission 真实行为

## Done Contract
- 完成标准：
  - 存在共享 `core` contract
  - 存在共享 `resources` contract/schema
  - 存在统一 adapter 接口
  - 存在 `mock / http / server` 三种 adapter 骨架
  - query key / request parsing / response parsing 具备统一入口
- 证明方式：
  - `pnpm build` 通过
  - 关键 contract 可被前端与 adapter 共同引用
  - 至少能用代码证据说明 mock/http/server 没有复制 schema
- 仍算未完成的情况：
  - mock adapter 自己写字段结构，没走共享 schema
  - http adapter 和 server adapter 的输入输出不共用同一套 zod schema
  - 只写类型定义，没有可复用的解析或导出入口

## Canonical Decisions

### 1. `resources` 作为 M5/M6/M7 的唯一 Reference Resource
- M5 不直接迁现有 `tasks/users/apps`
- M5 新建一套独立 `resources` 契约
- 后续 `M6/M7` 围绕这套 reference resource 做列表与 CRUD

### 2. contract 分层
- `src/contracts/core/*`
  - 包含：
    - 分页 schema
    - 包络 schema
    - error schema
    - 字段级错误 schema
- `src/contracts/resources/*`
  - 包含：
    - resource entity schema
    - list query schema
    - list response schema
    - detail response schema
    - create input schema
    - update input schema

### 3. adapter 分层
- `src/services/adapters/types.ts`
  - 放 adapter 共用接口
- `src/services/adapters/mock/*`
- `src/services/adapters/http/*`
- `src/services/adapters/server/*`
- 每层都只消费共享 contract，不单独复制 schema

### 4. query / parse 统一入口
- `M5` 就先建立：
  - query key 入口
  - query 参数 normalize/parse 入口
  - response parse 入口
- `M6` 再把它们接进 React Query 和列表页

### 5. server adapter 本轮只做占位骨架
- 本轮不写真实 route handler
- 但要有稳定接口和 TODO 边界，保证后续 Hono / Next handler 都能对接

## Proposed File Scope

### 建议新建
- `src/contracts/core/error.ts`
- `src/contracts/core/pagination.ts`
- `src/contracts/core/envelope.ts`
- `src/contracts/resources/schema.ts`
- `src/contracts/resources/index.ts`
- `src/services/adapters/types.ts`
- `src/services/adapters/mock/resources.ts`
- `src/services/adapters/http/resources.ts`
- `src/services/adapters/server/resources.ts`
- `src/services/query/resources.ts`

### 本轮明确不做
- `app/(dashboard)/resources/page.tsx`
- 真实 Hono handler
- 真实 Next route handler
- CRUD 抽屉 / 表单 UI

## Validation Contract

### 技术验收
1. `pnpm build`

### 代码证据验收
- `resources` 的 list/detail/create/update/error schema 只定义一份
- mock/http/server adapter 都引用同一 contract
- query key 和 parse 逻辑具备单一入口

## Next Action
- 当前已经到达：`M5 实施前 checkpoint 完成`
- 下一步唯一正确动作：
  - 按本文落地 contract + adapter 代码
  - 完成构建与阶段回写

## Implementation Result

### 已落地范围
- 已新增 `core` contract 层：
  - [src/contracts/core/error.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/core/error.ts)
  - [src/contracts/core/pagination.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/core/pagination.ts)
  - [src/contracts/core/envelope.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/core/envelope.ts)
  - [src/contracts/core/index.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/core/index.ts)
- 已新增 `resources` 参考资源 contract 层：
  - [src/contracts/resources/schema.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/resources/schema.ts)
  - [src/contracts/resources/index.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/resources/index.ts)
- 已新增 adapter 与 query 基础层：
  - [src/services/adapters/types.ts](/Users/ktlee/coding/shadcn-admin/src/services/adapters/types.ts)
  - [src/services/adapters/mock/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/adapters/mock/resources.ts)
  - [src/services/adapters/http/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/adapters/http/resources.ts)
  - [src/services/adapters/server/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/adapters/server/resources.ts)
  - [src/services/adapters/index.ts](/Users/ktlee/coding/shadcn-admin/src/services/adapters/index.ts)
  - [src/services/query/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/query/resources.ts)

### 本轮建立的共享契约
- `resources` 已具备统一 schema：
  - entity schema
  - list query schema
  - list response schema
  - detail response schema
  - create input schema
  - update input schema
  - delete / bulk-delete / bulk-update-status input/output schema
  - error envelope schema
- `core` 已具备统一基础：
  - success envelope helper
  - error envelope
  - field-level error map
  - page pagination schema
  - sort order schema

### adapter 分层结果
- `mock adapter`
  - 已提供最小可运行内存数据集
  - 已实现 list/detail/create/update/delete/bulk-delete/bulk-update-status 全部方法
- `http adapter`
  - 已固定消费共享 schema 与统一 parse/serialize 入口
  - 尚未绑定真实后端，仅保留 `/api/resources*` 默认请求路径
- `server adapter`
  - 已通过 handler 注入模式建立骨架
  - 后续 Hono / Next handler 可直接复用

### 统一入口结果
- [src/services/query/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/query/resources.ts)
  - 已建立：
    - `resourcesQueryKeys`
    - `normalizeResourcesListQuery`
    - `serializeResourcesListQuery`
    - list/detail/mutation/delete/bulk 响应 parse 入口

### 代码证据
- mock/http/server 三层没有复制 schema，均直接引用 [src/contracts/resources/schema.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/resources/schema.ts)
- query key、query normalize、query serialize、response parse 已收敛到 [src/services/query/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/query/resources.ts)
- `deleteResource` 的 response 包络已单独使用 `resourceDeleteResponseSchema`，未再和 bulk-delete 混淆

### 验证证据
- 技术验收：
  - `pnpm build` 已两次通过
  - 当前仍保留一个既存 warning：`The Next.js plugin was not detected in your ESLint configuration`
- 内置浏览器回归：
  - `/`：dashboard 壳与 sidebar 正常
  - `/settings`：settings 页面与 6 个二级导航项正常
- 本轮没有新增可见 UI，因此浏览器仅做回归，不做新交互验收

### 当前结论
- `M5 - Shared Contracts + Adapters` 已达到本阶段目标
- 下一轮可以进入：
  - `M6 - Reference Module List`
