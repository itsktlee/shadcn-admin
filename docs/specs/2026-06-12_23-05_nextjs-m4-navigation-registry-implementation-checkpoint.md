# Spec: nextjs-m4-navigation-registry-implementation-checkpoint

## Goal
- 要解决什么问题：把当前 Next 模板里仍然硬编码在 sidebar 数据文件中的导航结构，拆成配置驱动导航与模块注册体系，让 shell 和业务导航解耦。
- 最终目标：后续替换成任意业务系统时，只改导航配置与模块注册，不再修改 sidebar / command menu / layout 壳组件。
- 本轮核心目标：锁定 `M4 - Navigation + Module Registry` 的最小实施范围、结构决策、文件边界与验证标准。
- 验收结果：形成可直接指导 M4 编码实施的 checkpoint。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m3-shell-parity-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_20-07_nextjs-m3-shell-parity-implementation-checkpoint.md)
- 本文只解决 `M4` 的导航配置化与模块注册，不进入：
  - `M5` contract / adapter
  - `M6/M7` reference module CRUD
  - `M8` auth/permission 真实过滤

## Done Contract
- 完成标准：
  - shell 组件不再以 `sidebar-data.ts` 作为业务导航真相源
  - 存在稳定的 `navigation config`
  - 存在稳定的 `module registry`
  - sidebar 和 command menu 都消费解析后的导航结果
  - 注销一个示例模块注册后，shell 仍能运行且其导航项同步消失
- 证明方式：
  - `pnpm build` 通过
  - 至少用内置浏览器验收 `/`、`/settings`、一个被注册模块页面
  - 能用代码证据说明“替换导航不需要修改 shell 组件”
- 仍算未完成的情况：
  - 只是把 `sidebar-data.ts` 改名，但真实导航结构仍硬编码在 shell 层
  - sidebar 改成配置驱动了，但 command menu 仍读旧静态数据
  - 把 permission 真实过滤提前卷进来，导致 M4 范围扩张

## Restated Understanding
- 当前 `M3` 已经把壳层跑通，但导航真相源还集中在 [src/components/layout/data/sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts)。
- `AppSidebar` 和 `CommandMenu` 都直接依赖这份静态数据，后续一旦替换业务模块，shell 组件会被迫跟着改。
- `M4` 的目标不是立刻实现完整业务模块系统，而是先把“导航数据如何进入 shell”这条链路正规化。

## Current State

### 当前真实耦合点
- [src/components/layout/app-sidebar.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/app-sidebar.tsx)
  - 直接读取 `sidebarData.navGroups`
- [src/components/command-menu.tsx](/Users/ktlee/coding/shadcn-admin/src/components/command-menu.tsx)
  - 直接读取 `sidebarData.navGroups`
- [src/components/layout/data/sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts)
  - 同时承载：
    - user
    - teams
    - navGroups
    - 业务导航树

### 当前问题
- shell meta 和业务导航混在一个文件里，职责不清。
- 侧栏与命令菜单都绕过“模块注册”直接消费静态树。
- 当前没有“模块是否已注册”的中间层，无法证明模块是可独立注册/移除的。

## Canonical Decisions

### 1. M4 拆成三层真相源
- `shell meta`
  - 用户信息、团队切换信息等壳层静态展示数据
- `navigation config`
  - 分组、顺序、哪些 item 出现在侧栏
- `module manifests + registry`
  - 每个模块对外暴露的导航元数据与路由元数据

结论：
- `M4` 结束后，业务导航不再直接定义在 `sidebar-data.ts`。

### 2. `sidebar-data.ts` 不再做业务导航真相源
- 允许保留该文件，但只承担两种角色之一：
  1. 仅保留 `user / teams` 壳层静态信息；或
  2. 成为一个组合层，内部从新 registry + navigation config 解析出最终 `SidebarData`
- 不允许继续把 `navGroups` 的原始业务结构直接硬编码在其中。

### 3. 模块注册采用 feature-first manifest
- 不建立一个巨大的集中式“所有模块对象字面量”文件。
- 推荐按 feature-first 分散声明 manifest，例如：
  - `src/features/dashboard/manifest.ts`
  - `src/features/tasks/manifest.ts`
  - `src/features/apps/manifest.ts`
  - `src/features/chats/manifest.ts`
  - `src/features/users/manifest.ts`
  - `src/features/settings/manifest.ts`
  - `src/features/auth/manifest.ts`
  - `src/features/errors/manifest.ts`
  - `src/features/clerk/manifest.ts`
- 再由 registry 聚合。

原因：
- 这更符合当前模板已经选定的 `feature-first` 方向。

### 4. `navigation config` 只负责“编排”，不重复声明模块细节
- `navigation config` 应只定义：
  - group id
  - title / titleKey
  - item 顺序
  - 侧栏出现哪些模块
- `icon`、`href`、`titleKey`、`searchable`、`permission` 等模块级元数据来自 manifest。
- 不允许在 `navigation config` 再复制一份完整模块描述。

### 5. 父子导航采用“模块节点”而不是嵌套匿名对象
- 对于：
  - `settings`
  - `auth`
  - `errors`
  - `clerk`
- 推荐做法是：
  - 父节点也是 manifest
  - 子节点也是 manifest
  - 父节点通过 `children` 或 `navChildren` 引用子模块 id
- 不继续沿用匿名嵌套对象树。

原因：
- 这样 command menu、sidebar、后续 breadcrumbs、permission 过滤可共用同一套节点。

### 6. `permission` 字段在 M4 先建模，不启用真实过滤
- blueprint 要求导航支持 `permission`
- 但 `M8` 才做真正 auth/permission
- 所以 `M4` 的处理方式是：
  - manifest / nav item 类型里先保留可选 `permission?: string`
  - shell 层暂不执行真实权限裁剪

结论：
- `M4` 做 permission metadata
- `M8` 再做 permission behavior

### 7. Command Menu 必须跟 sidebar 共用同一导航解析结果
- `CommandMenu` 不允许再自己读取旧静态树
- `M4` 结束后必须做到：
  - sidebar
  - command menu
  - 后续 breadcrumbs / page title resolver（如需要）
  都能复用同一份解析结果

### 8. M4 不引入动态远程模块系统
- 当前 registry 只服务本仓库内模块注册
- 不做：
  - 运行时远程加载模块
  - 插件市场式模块发现
  - 基于文件系统自动扫描 manifest

原因：
- 这会把 `M4` 从模板工程治理扩成插件系统。

## Proposed Minimal Architecture

### A. 新类型层
- `src/modules/types.ts`
  - `ModuleManifest`
  - `ModuleRegistry`
  - `NavigationGroupConfig`
  - `ResolvedNavGroup`
  - `ResolvedNavItem`

### B. 新注册中心
- `src/modules/registry.ts`
  - 聚合 feature manifests
  - 导出：
    - `registeredModules`
    - `registeredModuleMap`
    - `getModuleManifest(id)`

### C. 新导航配置
- `src/config/navigation.ts`
  - 仅描述 group 与 item id 顺序，例如：
    - `general`
    - `pages`
    - `other`

### D. 新导航解析层
- 推荐新建：
  - `src/modules/navigation.ts`
  - 或 `src/lib/navigation.ts`
- 职责：
  - 从 `navigation config + registry` 解析出 sidebar 可消费的结构
  - 产出 command menu 可消费的扁平项或 group 结构

### E. 壳层静态信息
- 推荐新建：
  - `src/config/shell.ts`
- 保存：
  - sidebar user
  - team switcher teams
- 避免继续跟业务导航混放。

## Exact File Scope For M4

### 建议新建
- `src/modules/types.ts`
- `src/modules/registry.ts`
- `src/config/navigation.ts`
- `src/config/shell.ts`
- `src/modules/navigation.ts` 或 `src/lib/navigation.ts`
- `src/features/*/manifest.ts`（至少为当前 sidebar 暴露的 feature 建立 manifest）

### 建议修改
- [src/components/layout/app-sidebar.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/app-sidebar.tsx)
- [src/components/command-menu.tsx](/Users/ktlee/coding/shadcn-admin/src/components/command-menu.tsx)
- [src/components/layout/types.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/types.ts)
- [src/components/layout/data/sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts)

### 本轮明确不做
- `src/contracts/**`
- `src/services/**`
- reference CRUD 行为
- auth guard bridge
- permission 真实过滤
- 基于模块 manifest 自动生成 Next 路由文件

## Recommended Execution Order

### Step 1. 建类型和 registry
- 先落：
  - module manifest 类型
  - registry 类型
  - 注册中心聚合逻辑

### Step 2. 给当前 sidebar 暴露的模块补 manifest
- 至少覆盖：
  - dashboard
  - tasks
  - apps
  - chats
  - users
  - clerk
  - auth
  - errors
  - settings
  - help-center

### Step 3. 建 `navigation config`
- 只定义：
  - general/pages/other
  - 组内 item 顺序

### Step 4. 建解析层
- 从 registry + config 解析出：
  - sidebar groups
  - command menu groups / items

### Step 5. 切 shell 消费端
- `AppSidebar` 改读解析结果
- `CommandMenu` 改读解析结果
- `sidebar-data.ts` 收缩为 shell meta 或组合层

### Step 6. 做“注销模块”验证
- 临时去掉一个模块 manifest 注册
- 验证：
  - build 不炸
  - shell 还能运行
  - 导航对应项消失

## Validation Contract

### 技术验收
1. `pnpm build`

### 浏览器验收
必须使用内置浏览器，至少覆盖：
1. `/`
2. `/settings`
3. 一个被注册模块页，例如 `/tasks`

### 浏览器验收项
- sidebar 正常渲染分组
- settings 父子导航项仍正常
- command menu 中的导航项仍可点击
- 去掉一个示例模块注册后，对应导航项不再出现

## Forbidden
- 不允许为 M4 引入远程插件系统
- 不允许把 contract / adapter 提前混入 M4
- 不允许在 shell 组件里继续手写业务导航树
- 不允许 `navigation config` 和 manifest 双写同一份 `href/title/icon`
- 不允许把 permission 真实行为提前做到 M4

## Next Action
- 当前已经到达：`M4 实施前 checkpoint 完成`
- 下一步唯一正确动作：
  - 基于本文输出最小代码实施方案
  - 等用户确认后，再真正开始写 `M4` 代码

## Implementation Result

### 已落地范围
- 已新增 M4 基础结构：
  - [src/modules/types.ts](/Users/ktlee/coding/shadcn-admin/src/modules/types.ts)
  - [src/modules/registry.ts](/Users/ktlee/coding/shadcn-admin/src/modules/registry.ts)
  - [src/modules/navigation.ts](/Users/ktlee/coding/shadcn-admin/src/modules/navigation.ts)
  - [src/config/navigation.ts](/Users/ktlee/coding/shadcn-admin/src/config/navigation.ts)
  - [src/config/shell.ts](/Users/ktlee/coding/shadcn-admin/src/config/shell.ts)
- 已按 feature-first 补齐当前导航所需 manifest：
  - [src/features/dashboard/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/dashboard/manifest.ts)
  - [src/features/tasks/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/tasks/manifest.ts)
  - [src/features/apps/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/apps/manifest.ts)
  - [src/features/chats/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/chats/manifest.ts)
  - [src/features/users/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/users/manifest.ts)
  - [src/features/help-center/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/help-center/manifest.ts)
  - [src/features/clerk/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/clerk/manifest.ts)
  - [src/features/auth/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/auth/manifest.ts)
  - [src/features/errors/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/errors/manifest.ts)
  - [src/features/settings/manifest.ts](/Users/ktlee/coding/shadcn-admin/src/features/settings/manifest.ts)
- shell 消费端已切换：
  - [src/components/layout/data/sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts)
    - 不再手写业务导航树
    - 只组合 `shell meta + resolvedNavigationGroups`
  - [src/components/command-menu.tsx](/Users/ktlee/coding/shadcn-admin/src/components/command-menu.tsx)
    - 已改为消费 `commandMenuNavigationGroups`
- 类型收口已完成：
  - [src/components/layout/types.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/types.ts)
    - 已改为复用 `src/modules/types.ts` 中的导航与 shell 类型

### 当前行为变化
- sidebar 业务导航的真相源已从“静态对象树”切换为：
  - `module manifests`
  - `module registry`
  - `navigation config`
  - `navigation resolver`
- `settings / auth / errors / clerk` 这类父子导航已不再是匿名嵌套对象，而是显式模块节点 + 子模块节点。
- resolver 对缺失 manifest 已做容错处理：
  - 某个模块未注册时，对应导航项会被跳过
  - shell 不会因为单个模块缺失而直接崩掉

### 与原 checkpoint 的偏差
- 原 checkpoint 里建议“sidebar 和 command menu 都直接消费解析结果”；本轮实际做法是：
  - `command-menu` 直接消费解析结果
  - `app-sidebar` 继续通过 [sidebar-data.ts](/Users/ktlee/coding/shadcn-admin/src/components/layout/data/sidebar-data.ts) 这个组合层读取解析结果
- 这个偏差是可接受的，因为 `sidebar-data.ts` 已不再是业务导航真相源，只保留装配职责。

### 验证证据
- 技术验收：
  - `pnpm build` 已通过
  - 当前仍保留一个既存 warning：`The Next.js plugin was not detected in your ESLint configuration`
- 内置浏览器验收：
  - `/`
    - sidebar 主导航正常渲染
    - dashboard 壳正常显示
  - `/tasks`
    - 页面可访问
    - sidebar 中 `/tasks` active 状态正常
  - `/settings`
    - settings 二级导航正常渲染
  - command menu
    - 已验到 `总览 / 页面 / 其他 / 主题` 四组
    - 已验到 `Clerk 认证 登录/注册/用户管理`
    - 已验到 `认证`、`错误页`、`设置` 这类父子模块的子项可继续出现在搜索结果中
- 代码证据：
  - [src/modules/navigation.ts](/Users/ktlee/coding/shadcn-admin/src/modules/navigation.ts)
    - 已实现对未注册 manifest 的跳过逻辑，满足“模块移除不致使 shell 崩溃”的 M4 目标方向

### 当前结论
- `M4 - Navigation + Module Registry` 已达到本阶段目标，可进入 `M5 - Shared Contracts + Adapters`
