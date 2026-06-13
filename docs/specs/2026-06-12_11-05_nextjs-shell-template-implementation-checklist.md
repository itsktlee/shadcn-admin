# Spec: nextjs-shell-template-implementation-checklist

## Goal
- 要解决什么问题：把已确定的 Next.js 母模板蓝图，进一步拆成可执行的实施清单。
- 最终目标：后续任何实现阶段，都能按里程碑、任务、验证、禁止事项直接推进，而不是边做边重新定架构。
- 本轮核心目标：为 `M1 ~ M9` 建立执行级 checklist、依赖顺序和阶段出口条件。
- 验收结果：已完成实施清单。

## Done Contract
- 什么算完成：文档中每个里程碑都具备明确的输入、任务、产物、验证、风险与禁止事项。
- 由什么证明：后续执行者可直接按文档逐阶段实现，无需再次重定义模板基线。
- 哪些情况仍算未完成：某里程碑仍依赖“实现时再决定”的关键架构判断；或没有明确出口条件。

## Relationship To Blueprint
- 本文是 [`nextjs-shell-template-blueprint`](./2026-06-12_10-15_nextjs-shell-template-blueprint.md) 的执行清单。
- 蓝图负责定义“做什么”与“为什么”。
- 本文负责定义“按什么顺序做”“做到什么程度算完成”“每一步不能做什么”。
- 若本文与蓝图冲突，以蓝图中的架构决策为准；本文只负责执行层细化，不负责推翻基线。

## Global Execution Rules

### 1. 先壳后业务
- 所有阶段都先保住 Shell 一致性，再接模块内容。
- 不允许为了先跑通业务而破坏导航、布局、主题、语言或表格交互基线。

### 2. 一次只推进一个里程碑
- 不允许跨 `M1 ~ M9` 同时大面积并行改造。
- 每个里程碑完成后，模板必须处于“可运行、可验证”的状态。

### 3. 不在迁移阶段顺手换栈
- 不更换：
  - `TanStack Table`
  - `React Query`
  - `react-hook-form`
  - `zod`
- 不把迁移任务扩成“迁移 + 技术栈重构”。

### 4. 不提前做可选增强
- 第一版母模板基线以蓝图为准。
- 下面这些能力不提前进入实施：
  - 冻结列
  - 列拖拽
  - 用户视图保存
  - 高级筛选构造器
  - 详情页型 CRUD 作为默认模式

### 5. 任何新增能力必须先归类
- 每次新增功能前，必须先明确它属于：
  - 模板基线
  - 可选扩展
  - 业务模块定制

## Phase Map

```text
M1 基础工程 -> M2 壳层布局 -> M3 壳层对齐 -> M4 导航与模块注册
-> M5 契约与 adapter -> M6 Reference 列表 -> M7 Reference CRUD
-> M8 Auth/Permission -> M9 硬化与交付
```

## M1 - Next Foundation

### Goal
- 建立 `Next.js App Router` 基础工程，并把母模板所需的全局基础能力落稳。

### Inputs
- 蓝图中的：
  - 单仓单应用
  - feature-first
  - 最小 Root Layout
  - 非路由型 i18n
  - cookie 优先偏好持久化

### Tasks
1. 初始化 Next.js 项目骨架
2. 配置 TypeScript、路径别名、ESLint、Prettier
3. 接入 Tailwind 与 `shadcn/ui`
4. 建立 `src/` 目录主骨架：
   - `components`
   - `features`
   - `config`
   - `contracts`
   - `services`
   - `providers`
5. 建立最小 `app/layout.tsx`
6. 落地全局基础 provider：
   - theme bootstrap
   - i18n bootstrap
   - query provider
   - toaster
7. 确认 cookie 优先的主题/语言读取策略

### Deliverables
- 一个能运行的 Next.js 工程
- 最小 Root Layout
- 可工作的主题与语言初始化链路

### Exit Criteria
- 项目可启动
- `app/layout.tsx` 不含 dashboard 专属逻辑
- 首屏主题与语言无明显闪动

### Validation
- build 通过
- 打开页面可看到基础内容
- 主题切换后刷新仍生效
- 语言切换后刷新仍生效

### Forbidden
- 不引入 sidebar / dashboard layout
- 不引入真实业务模块
- 不在此阶段引入 auth guard

## M2 - Multi-shell Layout

### Goal
- 建立 `auth / dashboard / errors` 三类壳层，并把 dashboard 专属 provider 下沉。

### Inputs
- M1 产物

### Tasks
1. 建立 `app/(auth)` 壳
2. 建立 `app/(dashboard)` 壳
3. 建立 `app/(errors)` 壳
4. 创建 dashboard shell provider 组合：
   - sidebar provider
   - layout provider
   - search provider
5. 定义 Root Layout 与 Dashboard Shell 的边界

### Deliverables
- 多壳层 layout 结构
- dashboard shell provider 装配层

### Exit Criteria
- auth 页面不加载 dashboard 壳
- error 页面不加载 dashboard 壳
- dashboard 壳具备稳定内容容器

### Validation
- 进入 auth / dashboard / errors 三类页面，外层布局显著不同
- 切换页面时 shell 边界符合预期

### Forbidden
- 不在 Root Layout 中挂 dashboard 专属 provider
- 不把 auth 页混进 dashboard route group

## M3 - Shell Parity

### Goal
- 把当前 Vite 模板的视觉与交互壳迁入 Next.js，并保持可感知行为一致。

### Inputs
- M2 产物
- 当前 Vite 模板的 shell 结构和样式 token

### Tasks
1. 迁移 sidebar 结构
2. 迁移 header 结构
3. 迁移 theme switch
4. 迁移 language switch
5. 迁移 search 入口
6. 迁移 settings shell
7. 校准 spacing、container、scroll、sticky header 行为

### Deliverables
- Next 版 dashboard shell
- 壳层主题/语言/搜索/设置入口

### Exit Criteria
- 侧栏、顶栏、设置入口、主题、语言交互可用
- 对用户可见的交互方式与当前 Vite 模板一致

### Validation
- 手动验收：
  - 侧栏展开/收起
  - 顶栏稳定性
  - 主题切换
  - 语言切换
  - 搜索入口

### Forbidden
- 不允许仅“视觉类似”但交互方式不同
- 不允许出现 shell 切换闪烁

## M4 - Navigation + Module Registry

### Goal
- 建立配置驱动导航和完整模块注册体系，使壳与业务解耦。

### Inputs
- M3 产物
- 蓝图中的导航和模块 manifest 决策

### Tasks
1. 定义 `navigation config`
2. 定义 `module manifest`
3. 建立模块注册中心
4. 让 sidebar 只消费配置与 manifest
5. 接入 `titleKey / icon / navGroup / permission`
6. 支持 Reference Module 的独立注册和移除

### Deliverables
- `navigation config`
- `module registry`
- 配置驱动 sidebar

### Exit Criteria
- 替换导航不需要修改 Shell 组件
- Reference Module 可独立注册/移除

### Validation
- 注释掉示例模块注册后，shell 仍可运行
- 导航分组、标题、图标可从配置渲染

### Forbidden
- 不允许把业务导航写死在 sidebar 组件
- 不允许模块页面和导航强耦合到 layout

## M5 - Shared Contracts + Adapters

### Goal
- 建立模板级数据契约与 adapter 分层，确保 Hono / Next / mock 三者都基于同一真相源。

### Inputs
- M4 产物
- 蓝图中的 contract 决策

### Tasks
1. 定义共享 contract/schema
2. 建立 `resources` 参考资源契约：
   - list query
   - list response
   - detail response
   - create input
   - update input
   - error shape
3. 建立 adapter 接口
4. 建立：
   - `mock adapter`
   - `http adapter`
   - `server adapter` 占位
5. 统一 query key 和 request/response 解析规则

### Deliverables
- 共享 contract 层
- adapter 分层
- resources 标准 schema

### Exit Criteria
- form / adapter / handler 三层均可消费同一 contract
- response 包络和字段级错误格式稳定

### Validation
- 类型检查通过
- contract 可被前端与后端共同引用

### Forbidden
- 不允许前后端各自复制一份 schema
- 不允许 mock adapter 定义和 http adapter 不同的资源契约

## M6 - Reference Module List

### Goal
- 先把列表页跑通，验证模板在 Next.js 下仍保持当前 Vite 模板那种列表体验。

### Inputs
- M5 产物

### Tasks
1. 创建 `resources` Reference Module
2. 落地列表页面结构
3. 接入：
   - 搜索
   - 筛选
   - 排序
   - 分页
   - 列显示控制
   - 导出
4. 接入 React Query 查询
5. 实现 query state 与页面行为对齐
6. 保证请求过程容器稳定，不清空旧数据

### Deliverables
- 可工作的 `resources` 列表页
- mock / http adapter 下都可跑的列表工作流

### Exit Criteria
- 列表页功能齐备
- 切换筛选、分页、搜索时不闪、不塌

### Validation
- mock adapter 下可跑
- http adapter 下可跑
- 手动验收列表交互稳定性

### Forbidden
- 不允许请求时整体卸载列表容器
- 不允许分页/筛选时整页 loading

## M7 - Reference Module CRUD

### Goal
- 在列表页上补齐标准 CRUD 工作流，形成模板级可复用基线。

### Inputs
- M6 产物

### Tasks
1. 实现创建抽屉
2. 实现编辑抽屉
3. 实现删除确认
4. 实现批量删除
5. 实现至少一种非破坏性批量动作
6. 接入字段级错误映射
7. 接入成功/失败反馈与 loading 状态

### Deliverables
- 完整 `List + CRUD Workflow`

### Exit Criteria
- CRUD 流程完整
- 表单、批量操作、删除确认可稳定工作

### Validation
- create / edit / delete / bulk-delete / bulk-action 全流程验收
- 表单字段错误正确映射

### Forbidden
- 不允许把 create/edit 改成独立详情页模式
- 不允许只做弹窗外观，不做真正 contract 映射

## M8 - Auth + Permission Baseline

### Goal
- 建立 auth contract 和动作级权限渲染基线，使模板具备受保护页面和动作裁剪能力。

### Inputs
- M7 产物

### Tasks
1. 定义 auth contract
2. 提供服务端可读会话接口
3. 为 dashboard shell 接入受保护逻辑
4. 建立 permission resolver
5. 对导航、按钮、行操作、批量操作接入动作级权限

### Deliverables
- auth contract
- permission resolver
- dashboard guard

### Exit Criteria
- 页面和动作可按权限裁剪
- template shell 仍不绑定具体 auth provider

### Validation
- 不同权限集下：
  - 导航可正确过滤
  - 按钮可正确显隐
  - 批量操作可正确裁剪

### Forbidden
- 不允许直接绑定某个具体 auth SDK
- 不允许权限逻辑散落在组件内部无法复用

## M9 - Template Hardening

### Goal
- 把模板从“已可运行”提升到“可交付、可复用、可回归”。

### Inputs
- M8 产物

### Tasks
1. 建立模板最小测试基线
2. 补齐 shell smoke tests
3. 补齐 Reference Module CRUD flow tests
4. 补齐 permission rendering tests
5. 补齐 theme / i18n hydration smoke tests
6. 验证 Reference Module 可移除性
7. 收口文档

### Deliverables
- 最小回归测试基线
- 最终模板文档

### Exit Criteria
- 模板具备基础回归保护
- Reference Module 可移除且不伤壳

### Validation
- build
- test
- Reference Module 删除演练
- 手动烟雾验收

### Forbidden
- 不允许把“人工看起来没问题”当成最终交付标准

## Reference Module Baseline

### Resource Name
- `resources`

### Baseline Fields
- `id`
- `name`
- `status`
- `type`
- `owner`
- `updatedAt`

### Baseline Actions
- `resources.view`
- `resources.create`
- `resources.edit`
- `resources.delete`
- `resources.export`

### Baseline Screens
- list page
- create drawer
- edit drawer
- delete confirm

## Cross-phase Validation Matrix

| Area | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 |
|---|---|---|---|---|---|---|---|---|---|
| build | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| shell stability | - | Y | Y | Y | Y | Y | Y | Y | Y |
| navigation config | - | - | - | Y | Y | Y | Y | Y | Y |
| i18n/theme | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| contracts | - | - | - | - | Y | Y | Y | Y | Y |
| list workflow | - | - | - | - | - | Y | Y | Y | Y |
| CRUD workflow | - | - | - | - | - | - | Y | Y | Y |
| auth/permission | - | - | - | - | - | - | - | Y | Y |
| tests baseline | - | - | - | - | - | - | - | - | Y |

## Stage Exit Checklist

每个里程碑结束前，必须逐条确认：

1. 当前阶段是否仍在蓝图边界内
2. 是否没有提前引入下阶段复杂度
3. 模板是否处于可运行状态
4. 核心交互是否没有因迁移而退化
5. 当前阶段产物是否可被下一阶段直接复用

## Resume / Handoff
- 当前状态：实施清单已建立，后续阶段可直接执行
- 当前卡点：无
- 下一步唯一动作：从 `M1 - Next Foundation` 开始实施
- 下一轮核心目标：把 `M1` 进一步拆成具体文件级任务清单
