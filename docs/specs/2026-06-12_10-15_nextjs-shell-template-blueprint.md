# Spec: nextjs-shell-template-blueprint

## Goal
- 要解决什么问题：将当前 `Vite + React + TanStack Router` 的后台模板壳，重建为一个可长期复用的 `Next.js` 母模板。
- 最终目标：形成一个 **Next.js Shell Template + 最小 Reference Module**，既可对接 `Hono API` 做前后端分离，也可扩展到 `Next.js` 全栈实现。
- 本轮核心目标：沉淀一份足够精细、可直接指导后续实施阶段的迁移蓝图。
- 验收结果：已完成蓝图基线收敛。

## Done Contract
- 什么算完成：蓝图明确模板目标、运行时分层、模块注册、权限模型、数据契约、Reference Module 范围、实施里程碑和每阶段验收标准。
- 由什么证明：文档内存在稳定的设计决策、里程碑、边界、禁止事项和验证要求。
- 哪些情况仍算未完成：仍然存在“实现时再决定”的关键架构空白；或里程碑定义无法直接指导实施。

## Scope
- In:
  - Next.js 模板目标形态
  - Shell / Module / Adapter 分层
  - 导航、权限、表格、CRUD、i18n、主题、auth contract
  - Reference Module 的契约与范围
  - 后续实施里程碑与验收清单
- Out:
  - 本轮不改代码
  - 本轮不直接创建 Next.js 项目
  - 本轮不实施 monorepo

## Restated Understanding
- 这不是“把 Vite 项目自动转换成 Next.js”，而是“在 Next.js 上重建同一套后台模板壳”。
- 目标是保留当前模板的用户可感知行为和交互质感，而不是只复刻页面外观。
- 后续业务项目应该只替换导航配置、模块注册和业务内容，不重写 Shell。

## Canonical Decisions

### 1. 模板定位
- 目标形态：`Shell Template + 最小 Reference Module`
- 不做成内置完整业务系统
- Reference Module 只负责证明模板的标准接法

### 2. 渲染策略
- 基线：`Persistent Client-first Shell`
- Shell 默认 client-first
- 模块允许渐进式 server 化
- 不允许出现整页闪烁、容器塌陷、切换时整体重挂载

### 3. 主参考后端模式
- 主基线：`Next.js UI + Hono API`
- 并行保留：`Next.js` 全栈 adapter 能力
- 模板本身不绑定某一种最终后端实现

### 4. Auth 模型
- `Auth-agnostic Shell + 最小 auth contract`
- 不绑定 Clerk / NextAuth / Lucia / 自定义实现
- auth contract 必须支持：
  - `getServerSession()`
  - `getClientSession()`
  - `hasPermission()`
  - `signIn()`
  - `signOut()`
- dashboard shell 默认受保护

### 5. 交互行为基准
- 后续 Next.js 模板的用户交互表现，以当前 Vite 模板为基准
- 包括：
  - 搜索
  - 筛选
  - 排序
  - 分页
  - tab 切换
  - 主题切换
  - 语言切换
  - 抽屉/弹窗/批量操作工作流

### 6. Reference Module 类型
- `列表型模块`
- `List + CRUD Workflow`
- 数据模型采用：`通用资源模型`
- 默认工作流采用：`列表页内抽屉 / 弹窗模式`
- 删除语义基线：`硬删除`
- Reference Module 必须是：`独立、可移除、零壳层侵入`

### 7. 导航与模块体系
- 导航必须：`配置驱动`
- 模块必须：`完整注册`
- 不允许 Shell 组件硬编码业务导航
- 替换业务项目时，只改：
  - 导航配置
  - 模块注册
  - 业务模块目录

### 8. 权限模型
- 默认采用：`动作级权限`
- 权限 key 规则：`resource.action`
- 示例：
  - `resources.view`
  - `resources.create`
  - `resources.edit`
  - `resources.delete`
  - `resources.export`
- 导航过滤、按钮显隐、行操作、批量操作统一走同一模型

### 9. 表格与 CRUD 技术栈
- 固定沿用：
  - `TanStack Table`
  - `React Query`
  - `react-hook-form`
  - `zod`
- 不在迁移阶段更换核心列表/CRUD 栈

### 10. 表单技术栈
- 模板默认表单栈固定为：
  - `react-hook-form + zod`
- CRUD 抽屉、设置表单、筛选表单都遵循同一模式

### 11. 列表页表格基线能力
- 第一版母模板内建：
  - 搜索
  - 筛选
  - 排序
  - 分页
  - 行操作
  - 批量操作
  - 列显示控制
  - 导出
- 不进入第一版基线：
  - 列拖拽
  - 冻结列
  - 用户自定义视图保存
  - 高级筛选构造器

### 12. 路由与壳层布局
- 采用：`Next.js App Router`
- 采用：`多壳层布局`
- 至少拆分：
  - `(auth)`
  - `(dashboard)`
  - `(errors)`
- `root layout` 只承载全局基础能力

### 13. Provider 分层
- Root Layout 只放最小全局能力：
  - theme bootstrap
  - i18n bootstrap
  - query provider
  - toaster
  - 全局样式
- Dashboard Shell 下沉专属 provider：
  - sidebar provider
  - layout provider
  - search provider
  - auth guard bridge

### 14. 代码组织方式
- 采用：`feature-first`
- `app/` 只负责：
  - route entry
  - shell layout
  - 页面装配
- 主要可复用资产放在：
  - `src/features/*`
  - `src/components/*`
  - `src/services/*`
  - `src/contracts/*`
  - `src/config/*`

### 15. 数据获取基线
- 列表型模块默认：`客户端首屏请求`
- 服务端预取：只作为后续可选增强
- 目标是保住壳层稳定和局部刷新体验

### 16. 仓库形态
- 模板仓库本身：`单仓单应用`
- 不直接做成 monorepo
- 真项目需要前后端分离时，再升级成 monorepo

### 17. 多语言策略
- 采用：`非路由型语言切换`
- 语言属于壳层偏好
- 不进入 URL 路径结构

### 18. 偏好持久化策略
- 采用：`cookie 优先的本地持久化`
- 适用：
  - 主题
  - 语言
  - 侧栏状态
  - 布局偏好
- 不默认绑定用户级服务端偏好

### 19. Reference Module 数据源策略
- 支持双 adapter：
  - `mock adapter`
  - `http adapter`
- 主基线：`http adapter (Hono API)`
- `mock adapter` 仅用于开箱演示和本地开发 fallback

### 20. 测试基线
- 母模板必须内建最小测试基线
- 至少覆盖：
  - shell smoke tests
  - reference module CRUD flow
  - permission rendering
  - table query state
  - theme / i18n hydration smoke tests

## Data Contract Blueprint

### 1. API 风格
- 默认采用：`资源型 HTTP JSON 契约`
- Reference Module 资源名：`resources`

### 2. 默认接口
- `GET /resources`
- `GET /resources/:id`
- `POST /resources`
- `PATCH /resources/:id`
- `DELETE /resources/:id`
- `POST /resources/bulk-delete`
- `POST /resources/bulk-update-status`

### 3. 分页模型
- 默认采用：`页码分页`
- 请求参数：
  - `page`
  - `pageSize`
  - `search`
  - `sortBy`
  - `sortOrder`
  - 业务筛选字段（平铺 query）
- 返回字段：
  - `items`
  - `total`
  - `page`
  - `pageSize`

### 4. 查询参数策略
- 模板统一列表查询参数格式
- 采用平铺 query 参数
- 不使用整块 JSON filters 字符串
- 多选筛选字段采用重复 key 形式

### 5. 响应包络
- 成功：
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

- 失败：
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed"
  }
}
```

- 同时保留标准 HTTP status

### 6. 字段级错误格式
- 表单校验失败统一采用：
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "fields": {
      "name": ["Name is required"]
    }
  }
}
```

### 7. Contract 单一真相源
- Reference Module 的以下 schema 必须共享：
  - list query
  - list response
  - detail response
  - create input
  - update input
  - error shape
- 前端表单、client adapter、server adapter、Hono handler 均基于同一 contract/schema

## Target Project Shape

```text
app/
  layout.tsx
  (auth)/
    layout.tsx
    sign-in/
    sign-up/
    forgot-password/
    otp/
  (dashboard)/
    layout.tsx
    page.tsx
    resources/
    settings/
    ...
  (errors)/
    layout.tsx
    401/
    403/
    404/
    500/

src/
  components/
    ui/
    layout/
    data-table/
  config/
    navigation.ts
    modules.ts
  contracts/
    core/
    resources/
  features/
    auth/
    dashboard/
    resources/
    settings/
  hooks/
  lib/
    auth/
    i18n/
    theme/
  providers/
    app-providers.tsx
    dashboard-providers.tsx
  services/
    adapters/
      mock/
      http/
      server/
    contracts/
    query/
  stores/
  types/
```

## Module Manifest Baseline

每个模块至少声明：

- `id`
- `basePath`
- `titleKey`
- `icon`
- `navGroup`
- `page`
- `permission`
- `listView config`
- `data adapter token`
- `breadcrumb`
- `page title`
- `optional create/edit entrypoints`

约束：
- 模块必须通过统一 manifest 注册
- 导航从 manifest / navigation config 派生
- Reference Module 删除时，不允许改 Shell 组件

## Shell Non-negotiables

以下为实施硬约束：

1. 不允许因为切换到 Next.js 而让 shell 重挂载
2. 不允许列表筛选/分页/切 tab 时整页闪烁
3. 不允许请求时清空旧数据再重撑开容器
4. 不允许把业务导航硬写进 Shell 组件
5. 不允许 auth 实现反向绑死模板
6. 不允许把 mock 逻辑污染正式 http adapter 契约
7. 不允许在迁移阶段更换核心表格/CRUD 技术栈

## Implementation Milestones

### M1. Next Foundation
- 交付物：
  - Next.js App Router 基础工程
  - Tailwind / shadcn / path alias / theme / i18n bootstrap
  - Root Layout 最小 provider 结构
- 完成定义：
  - 项目可运行
  - 主题、语言、全局样式正常
  - 不包含 dashboard shell
- 验证：
  - build 通过
  - 主题/语言首屏无明显闪动

### M2. Multi-shell Layout
- 交付物：
  - `(auth)` / `(dashboard)` / `(errors)` 三类 shell
  - dashboard shell provider 下沉完成
- 完成定义：
  - auth 页、dashboard 页、error 页 layout 分离
  - shell 边界稳定
- 验证：
  - 页面切换时 shell 不重挂载
  - auth 不加载后台壳

### M3. Shell Parity
- 交付物：
  - sidebar
  - header
  - search
  - theme switch
  - language switch
  - settings shell
- 完成定义：
  - 视觉结构和交互方式对齐当前 Vite 模板
- 验证：
  - 手动验收侧栏、顶栏、主题、语言、搜索

### M4. Navigation + Module Registry
- 交付物：
  - 配置驱动导航
  - 完整模块注册
  - 权限感知导航过滤
- 完成定义：
  - 替换导航不需要修改 Shell 组件
- 验证：
  - 删除/新增示例模块只改配置与注册层

### M5. Shared Contracts + Adapters
- 交付物：
  - shared contracts/schema
  - mock adapter
  - http adapter
  - server adapter 占位
- 完成定义：
  - 同一 contract 可被前端和后端共同消费
- 验证：
  - 类型和 schema 可在 adapter / form / handler 三层复用

### M6. Reference Module List
- 交付物：
  - `resources` 列表型 Reference Module
  - 搜索/筛选/排序/分页/列控制/导出
  - query state 行为对齐当前模板
- 完成定义：
  - Reference Module 列表功能可跑通
  - 请求时不闪、不塌
- 验证：
  - mock adapter 和 http adapter 都可工作

### M7. Reference Module CRUD
- 交付物：
  - 创建抽屉
  - 编辑抽屉
  - 删除确认
  - 批量删除
  - 批量状态更新
- 完成定义：
  - 完整 List + CRUD Workflow 跑通
- 验证：
  - 表单字段错误可正确映射
  - 动作反馈与 loading 行为稳定

### M8. Auth + Permission Baseline
- 交付物：
  - auth contract
  - dashboard guard
  - 动作级权限渲染
- 完成定义：
  - 页面、按钮、批量操作可按权限裁剪
- 验证：
  - permission tests 通过

### M9. Template Hardening
- 交付物：
  - 最小测试基线
  - 文档收口
  - Reference Module 可移除验证
- 完成定义：
  - 模板可作为母模板交付
- 验证：
  - shell smoke tests
  - CRUD flow tests
  - i18n/theme hydration smoke tests

## Execution Rules For Later Phases

后续实施必须遵守：

1. 每个里程碑完成后，必须保证模板处于可运行状态
2. 不允许跨多个里程碑同时大改
3. 先保壳层一致性，再接真实数据
4. 先实现标准路径，再实现扩展能力
5. 任何新增能力都必须说明属于：
   - 模板基线
   - 可选扩展
   - 业务模块定制

## Validation Baseline

后续每阶段至少验证：
- build
- shell 稳定性
- 不闪烁 / 不塌陷
- 导航配置生效
- i18n / theme 不回退
- Reference Module 的关键流程可跑

## Open Questions
- 后续是否需要为 monorepo 演进补一份单独迁移附录
- 后续是否需要增加详情页型模块作为第二示例模块

## Resume / Handoff
- 当前状态：Next.js 母模板蓝图已完成，可直接作为后续实施依据
- 下一步唯一动作：按里程碑从 M1 开始实施，不跳阶段
- 下一轮核心目标：将蓝图转成具体实施清单，开始 M1
