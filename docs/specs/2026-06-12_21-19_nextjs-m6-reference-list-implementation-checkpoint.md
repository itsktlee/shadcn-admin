# Spec: nextjs-m6-reference-list-implementation-checkpoint

## Goal
- 要解决什么问题：把 `resources` 做成 Next.js 模板里的第一个可运行参考业务模块，验证配置驱动导航、共享 contract、adapter 和列表壳的衔接方式。
- 最终目标：形成一个后续可直接照抄扩展的 `List Module` 参考实现，而不是继续停留在 dashboard 占位页。
- 本轮核心目标：完成 `M6 - Reference Module List` 的最小可运行闭环。
- 验收结果：`/resources` 具备真实列表交互，且能作为后续 CRUD 工作流的稳定起点。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m4-navigation-registry-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_23-05_nextjs-m4-navigation-registry-implementation-checkpoint.md)
  - [nextjs-m5-contracts-adapters-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_00-05_nextjs-m5-contracts-adapters-implementation-checkpoint.md)
- 本文只解决：
  - `resources` reference module 的列表页
  - 导航注册、route 接入、React Query 接线
  - URL 驱动的搜索 / 筛选 / 分页 / 排序
- 本文不进入：
  - `resources` create / update / delete UI
  - 真实 Hono API
  - 表单抽屉、权限动作、资源详情页

## Done Contract
- 完成标准：
  - 存在真实 `/resources` 页面，不再是占位页
  - sidebar 与 command menu 能解析到 `resources`
  - 列表数据来自 `resources` shared adapter，而不是本地写死表格数组
  - 搜索、筛选、分页、排序能驱动 URL 与 query key
  - 切换分页 / 搜索 / 筛选时，列表容器稳定，不整页 loading、不塌陷
- 证明方式：
  - `pnpm build` 通过
  - 内置浏览器完成 `/resources` 视觉与交互验收
  - 代码证据能说明列表没有绕开 M5 的 shared contracts
- 仍算未完成的情况：
  - `/resources` 仍是占位页
  - 页面数据不经过 `resources` adapter / query key
  - 搜索筛选只在前端局部状态生效，URL 与 query key 不同步
  - 交互时整页闪烁或表格容器明显塌陷

## Canonical Decisions

### 1. `resources` 是 M6 的唯一 reference module
- 不替换 `tasks/users`
- 不把 `tasks/users` 反向改造成 contract 驱动
- 先让 `resources` 成为未来模块迁移的参照样板

### 2. 优先复用现有 data-table 组件与 URL 状态 hook
- 复用：
  - `useTableUrlState`
  - `DataTableToolbar`
  - `DataTablePagination`
  - `DataTableColumnHeader`
  - `DataTableViewOptions`
- 只补最薄的一层 Next route search 适配，不重写通用表格体系

### 3. 数据通道固定为 React Query + mock adapter
- 当前列表先接 `createMockResourcesAdapter()`
- query key 固定消费 `resourcesQueryKeys.list(query)`
- 不绕开 `normalizeResourcesListQuery()`

### 4. 列表是“远端列表模式”而不是本地一次性表格
- `pagination / search / filters / sort` 都以 query 为真相源
- 列表页采用 manual table state，避免当前页数据再被前端二次分页切片
- UI 交互时保留旧数据，占位在同一容器内刷新

### 5. 本轮允许顺手补齐与 M6 直接相关的共享表格文案
- 若 `resources` 页会直接暴露共享表格中的未汉化文案，可在本轮一并补齐
- 但不进入新的全局 i18n 扫描专项

## Proposed File Scope

### 建议新建
- `src/features/resources/manifest.ts`
- `src/features/resources/index.tsx`
- `src/features/resources/data/data.ts`
- `src/features/resources/hooks/use-resources-route-state.ts`
- `src/features/resources/components/resources-columns.tsx`
- `src/features/resources/components/resources-table.tsx`
- `app/(dashboard)/resources/page.tsx`

### 建议修改
- `src/modules/registry.ts`
- `src/config/navigation.ts`
- `src/services/adapters/mock/resources.ts`
- `src/services/query/resources.ts`
- `src/contracts/core/pagination.ts`
- `src/components/data-table/pagination.tsx`
- `src/components/data-table/view-options.tsx`
- `src/i18n/resources/zh-CN.ts`
- `src/i18n/resources/en.ts`
- `CHANGELOG.md`

## Validation Contract

### 技术验收
1. `pnpm build`

### 浏览器验收
1. 打开 `/resources`
2. 验证 sidebar 与 command menu 可进入
3. 验证搜索
4. 验证状态或分类筛选
5. 验证分页与每页条数切换
6. 验证列显示菜单
7. 验证交互过程中表格容器稳定

## Next Action
- 当前已经到达：`M6 实施前 checkpoint 完成`
- 下一步唯一正确动作：
  - 按本文落地 `resources` list module
  - 完成构建、浏览器验收和阶段回写

## Implementation Result

### 已落地范围
- 已新增 `resources` reference module：
  - [src/features/resources/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/resources/manifest.ts)
  - [src/features/resources/index.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/index.tsx)
  - [src/features/resources/data/data.ts](/Users/ktlee/coding/shadcn-admin/src/features/resources/data/data.ts)
  - [src/features/resources/hooks/use-resources-route-state.ts](/Users/ktlee/coding/shadcn-admin/src/features/resources/hooks/use-resources-route-state.ts)
  - [src/features/resources/components/resources-columns.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-columns.tsx)
  - [src/features/resources/components/resources-table.tsx](/Users/ktlee/coding/shadcn-admin/src/features/resources/components/resources-table.tsx)
- 已新增 Next route：
  - [app/(dashboard)/resources/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(dashboard)/resources/page.tsx)
- 已接入导航注册：
  - [src/modules/registry.ts](/Users/ktlee/coding/shadcn-admin/src/modules/registry.ts)
  - [src/config/navigation.ts](/Users/ktlee/coding/shadcn-admin/src/config/navigation.ts)

### 本轮形成的 reference list 范式
- `/resources` 已不再是占位页，而是实际渲染 `React Query + shared adapter` 的列表模块。
- 数据列表固定走：
  - `resourcesQueryKeys.list(search)`
  - `createMockResourcesAdapter()`
  - `normalizeResourcesListQuery()`
- 表格采用 manual list 模式：
  - URL 驱动搜索 / 筛选 / 分页 / 排序
  - 不对当前页数据再做前端二次分页切片
  - 用 `keepPreviousData` 保留旧数据，避免交互时整页闪烁

### 共享层补充
- `pagePaginationSchema` 默认 `pageSize` 已从 `20` 调整为 `10`，与现有模板表格分页习惯对齐：
  - [src/contracts/core/pagination.ts](/Users/ktlee/coding/shadcn-admin/src/contracts/core/pagination.ts)
  - [src/services/query/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/query/resources.ts)
- `resources` mock 数据已扩充为 14 条，保证分页、筛选与搜索有真实验收样本：
  - [src/services/adapters/mock/resources.ts](/Users/ktlee/coding/shadcn-admin/src/services/adapters/mock/resources.ts)
- `DataTablePagination` 已补齐分页相关 i18n 文案：
  - [src/components/data-table/pagination.tsx](/Users/ktlee/coding/shadcn-admin/src/components/data-table/pagination.tsx)
- `DataTableViewOptions` 已支持从 column meta 读取运行时翻译 key，避免列菜单文案在切语言后冻结：
  - [src/components/data-table/view-options.tsx](/Users/ktlee/coding/shadcn-admin/src/components/data-table/view-options.tsx)
- `useTableUrlState` 已改成“URL 为真相源”的无本地副本模式，并补充显式 `reset()`，解决 reset 后旧筛选被重新推回 URL 的问题：
  - [src/hooks/use-table-url-state.ts](/Users/ktlee/coding/shadcn-admin/src/hooks/use-table-url-state.ts)
  - [src/components/data-table/toolbar.tsx](/Users/ktlee/coding/shadcn-admin/src/components/data-table/toolbar.tsx)

### i18n 补充
- 已新增 `resources` 模块所需中英文本：
  - sidebar nav
  - page title / desc
  - filters / columns / loading / total
  - status / category labels
- 同时补齐共享 `data-table` 分页文案：
  - [src/i18n/resources/zh-CN.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/zh-CN.ts)
  - [src/i18n/resources/en.ts](/Users/ktlee/coding/shadcn-admin/src/i18n/resources/en.ts)

### 浏览器验收结果
- 已用内置浏览器验收 `/resources`：
  - 中文态正常渲染 sidebar、page header、filters、table、pagination
  - 搜索 `workspace` 后 URL 正确进入 `?search=workspace`
  - 状态筛选后 URL 正确带上 `?status=...`
  - 点击重置后 URL 能回到 `/resources`，且总数恢复为 `14`
  - 分页交互后 URL 正确进入 `?page=2`
  - 列显示菜单可隐藏列，`标签` 列已验证可切换
  - 切换到英文后，`Resource Directory / Rows per page / Resources` 等文案正常生效
  - 英文态语言菜单仍保持 `中文` 与 `English` 两个固定标签

### 技术验收结果
- `pnpm build` 已通过
- 当前仍保留一个既存 warning：
  - `The Next.js plugin was not detected in your ESLint configuration`

### 当前结论
- `M6 - Reference Module List` 已达到本阶段目标
- 下一轮可以进入：
  - `M7 - Reference Module CRUD Workflow`
