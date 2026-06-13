# Spec: nextjs-m7-reference-crud-implementation-checkpoint

## Goal
- 要解决什么问题：把 `resources` 从只读列表推进到可长期复用的参考 CRUD 模块，覆盖 create / update / delete / bulk actions / 字段级错误映射。
- 最终目标：形成一套可以直接迁移到后续业务资源模块的 `List + CRUD Workflow` 参考实现，而不是停留在列表展示层。
- 本轮核心目标：完成 `M7 - Reference Module CRUD Workflow` 的最小可运行闭环。
- 验收结果：`/resources` 已具备真实抽屉表单、行级删除、批量状态更新、批量删除和 adapter 字段级错误回填。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m5-contracts-adapters-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_00-05_nextjs-m5-contracts-adapters-implementation-checkpoint.md)
  - [nextjs-m6-reference-list-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_21-19_nextjs-m6-reference-list-implementation-checkpoint.md)
- 本文只解决：
  - `resources` create / update / delete
  - bulk status / bulk delete
  - adapter error -> form field error 映射
- 本文不进入：
  - 详情页
  - 真实 Hono API
  - 权限动作守卫
  - 文件上传、复杂联动校验

## Done Contract
- 完成标准：
  - `/resources` 存在 create / update 抽屉
  - 存在单条 delete confirm
  - 存在 bulk status 与 bulk delete
  - duplicate slug 能映射到 `slug` 字段错误，不只 toast
  - 所有 mutation 都经过 shared adapter / query key 失效刷新
- 证明方式：
  - `pnpm build` 通过
  - 内置浏览器完成 CRUD 与批量动作验收
  - 代码证据能说明 mock/http adapter 使用统一 `AdapterError`
- 仍算未完成的情况：
  - 提交错误只显示 toast，不落到表单字段
  - 批量动作执行后列表不刷新或选择态不清空
  - CRUD 交互绕开 shared adapter

## Canonical Decisions

### 1. CRUD 形态继续复用原模板交互语法
- create / update 使用 `Sheet` 抽屉
- delete 使用 confirm dialog
- bulk actions 沿用共享 table toolbar

### 2. mutation 真相源固定为 React Query + shared adapter
- `create / update / delete / bulkDelete / bulkUpdateStatus`
- 全部通过 `useResourcesMutations`
- 完成后统一 `invalidateQueries(resourcesQueryKeys.all)`

### 3. adapter error 统一收敛到 `AdapterError`
- `mock adapter` 和 `http adapter` 都返回统一错误形态
- UI 层只识别 `isAdapterError`
- 字段级错误从 `error.apiError.fields` 回填到表单

### 4. 表单错误必须留在抽屉里
- 本轮修复点：`toast.promise` 不再作为提交控制流真相源
- 改为显式 `toast.loading -> try/catch -> toast.success/error`
- 确保 server/conflict error 不会误走成功关闭路径

## Proposed File Scope

### 新增
- `src/features/resources/components/resources-provider.tsx`
- `src/features/resources/hooks/use-resources-mutations.ts`
- `src/features/resources/components/resources-primary-buttons.tsx`
- `src/features/resources/components/resources-row-actions.tsx`
- `src/features/resources/components/resources-delete-dialog.tsx`
- `src/features/resources/components/resources-multi-delete-dialog.tsx`
- `src/features/resources/components/resources-bulk-actions.tsx`
- `src/features/resources/components/resources-dialogs.tsx`

### 修改
- `src/features/resources/index.tsx`
- `src/features/resources/components/resources-columns.tsx`
- `src/features/resources/components/resources-table.tsx`
- `src/features/resources/components/resources-mutate-drawer.tsx`
- `src/services/adapters/error.ts`
- `src/services/adapters/index.ts`
- `src/services/adapters/http/resources.ts`
- `src/services/adapters/mock/resources.ts`
- `src/services/query/resources.ts`
- `src/i18n/resources/zh-CN.ts`
- `src/i18n/resources/en.ts`

## Implementation Result

### 已落地范围
- 已为 `resources` 建立完整 CRUD 交互层：
  - [src/features/resources/components/resources-provider.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-provider.tsx)
  - [src/features/resources/hooks/use-resources-mutations.ts](/Users/ktlee/coding/shadcn-admin/src/features/resources/hooks/use-resources-mutations.ts)
  - [src/features/resources/components/resources-primary-buttons.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-primary-buttons.tsx)
  - [src/features/resources/components/resources-row-actions.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-row-actions.tsx)
  - [src/features/resources/components/resources-delete-dialog.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-delete-dialog.tsx)
  - [src/features/resources/components/resources-multi-delete-dialog.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-multi-delete-dialog.tsx)
  - [src/features/resources/components/resources-bulk-actions.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-bulk-actions.tsx)
  - [src/features/resources/components/resources-dialogs.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-dialogs.tsx)
  - [src/features/resources/components/resources-mutate-drawer.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-mutate-drawer.tsx)

### adapter / error 统一结果
- 已新增 [src/services/adapters/error.ts](/Users/ktlee/coding/shadcn-admin/src/services/adapters/error.ts) 作为共享错误基线。
- `http adapter` 已能把 error envelope 归一化成 `AdapterError`。
- `mock adapter` 已支持：
  - duplicate slug -> `CONFLICT` + `fields.slug`
  - missing resource -> `NOT_FOUND`
- `resources` 抽屉已使用 `applyFieldErrors()` 将 `fields.slug` 回填到 `FormMessage`。

### 本轮关键修复
- [src/features/resources/components/resources-mutate-drawer.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-mutate-drawer.tsx)
  - 已移除以 `toast.promise` 作为表单控制流真相源的写法
  - 改为显式 `toast.loading / success / error`
  - 现在 duplicate slug 不会误关抽屉，字段错误会留在表单里

## Validation Evidence

### 技术验收
- `pnpm build` 已在 2026-06-12 22:30 HKT 再次通过。
- 既存 warning 仍在：
  - `The Next.js plugin was not detected in your ESLint configuration`

### 浏览器验收
- 由于本次会话曾在 `3000` 端口出现 dev chunk / HMR 混态，最终验收口径固定为 `http://localhost:3001/resources` 的生产预览服务。
- 已完成验收：
  - duplicate slug：
    - 抽屉保持打开
    - `Slug already exists.` 出现在表单错误
    - 总数保持 `14`
  - create：
    - 新建 `qaresource`
    - 总数 `14 -> 15`
    - 出现 `Resource created.`
  - update：
    - `qaresource` 状态改为 `Active`
    - 行文本已反映 `Active`
    - 出现 `Resource updated.`
  - single delete：
    - 删除 `qaresource`
    - 总数 `15 -> 14`
    - 行已消失
    - 出现 `Resource deleted.`
  - bulk status：
    - `operations-console` 与 `infrastructure-hub` 已批量改为 `Active`
    - 选择态已清空
  - bulk delete：
    - 删除 `support-command` 与 `asset-catalog`
    - 总数 `14 -> 12`
    - 两行已消失
    - 选择态已清空

## Current Conclusion
- `M7 - Reference Module CRUD Workflow` 已达到当前阶段目标。
- 下一轮可以进入：
  - `M8` 级别的 detail/workflow 扩展，或后续 shell/template 收口事项。
