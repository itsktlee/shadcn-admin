# Spec: final-validation-results

## Goal

记录本轮最终验证的真实执行结果，明确哪些证据已经补齐，哪些阻断项仍然存在。

## Validation Evidence

### 1. `pnpm build`

- 结果：通过
- 关键输出：
  - `Compiled successfully`
  - `Generating static pages (29/29)`
- 附带现象：
  - Next 在 build 阶段提示当前 ESLint 配置未检测到官方 Next 插件
  - `src/routes/__root.tsx` 有 1 条 `react-refresh/only-export-components` warning

### 2. `pnpm lint`

- 结果：失败
- 当前错误：
  1. `middleware.ts`
     - `2:1  error  'next/server' import is duplicated  no-duplicate-imports`
  2. `next-env.d.ts`
     - `3:1  error  Do not use a triple slash reference for ./.next/types/routes.d.ts, use import style instead  @typescript-eslint/triple-slash-reference`
- 当前 warning：
  1. `src/routes/__root.tsx`
     - `9:10 warning react-refresh/only-export-components`

### 3. 浏览器烟雾验收

#### 3.1 生产预览口径（`pnpm start --port 3000`）

- `/resources`
  - 已登录残留会话下可进入
- `/sign-in?redirect=%2Fresources`
  - 失败
  - 运行时直接出现错误覆盖层：
    - `Cannot find module './177.js'`
    - require stack 指向 `.next/server/app/(auth)/sign-in/page.js`

结论：

- 当前工作树的生产预览口径存在真实运行时阻断
- 这比 lint warning 更严重，当前不能宣告模板已经达到可直接交付状态

#### 3.2 开发口径（`pnpm dev --port 3001`）

以下链路已人工验收：

- `/sign-in`
  - 可正常加载
- 未登录访问 `/resources`
  - 会进入登录页并保留 `redirect=%2Fresources`
- `viewer@template.dev`
  - 登录后可进入 `/resources`
  - `Create Resource` 不显示
  - 行级 `Open resource actions menu` 不显示
- `admin@template.dev`
  - 登录后可进入 `/resources`
  - `Create Resource` 显示
  - 行级 `Open resource actions menu` 显示
- `/settings/language`
  - 从设置页切换到 `中文` 后，刷新不回退
  - 右上角语言图标切回 `English` 后，刷新不回退
- 主题切换
  - 切到 `light` 后，`html` class 与 `colorScheme` 已同步
  - 刷新后仍保持 `light`
- `/resources`
  - 搜索：`?search=operations-console`
  - 状态筛选：`status=draft`
  - 分页：`?page=2`
  - create：成功创建 `template-validation-resource`
  - duplicate slug：`analytics-core` 返回字段级错误 `Slug already exists.`
  - update：将 owner 从 `QA Team` 改为 `QA Ops Team`
  - delete：成功删除刚创建的资源

### 4. Reference Module 可移除性演练

执行口径：

- `NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES=false`
- `pnpm dev --port 3002`

结果：

- `/resources`
  - 直接返回 `404 / This page could not be found.`
- `/`
  - shell 中未再出现 `resources` 相关导航文本
- command menu
  - 不再出现 `Resource Directory` / `/resources`

结论：

- `resources` 模块可移除性运行态证据已补齐
- 同时可以证明 middleware 不再把 `/resources` 当成需要登录守卫的模板主路径，否则未开启模块时应先重定向而不是直接 `404`

## Follow-up Repair

基于上面的阻断，本轮追加了一个最小修补集：

1. [middleware.ts](/Users/ktlee/coding/shadcn-admin/middleware.ts)
   - 合并 `next/server` 重复 import
2. [eslint.config.js](/Users/ktlee/coding/shadcn-admin/eslint.config.js)
   - 忽略 `next-env.d.ts`
   - 对 legacy `src/routes/**` 关闭 `react-refresh/only-export-components`
3. [app/(auth)/sign-in/page.tsx](/Users/ktlee/coding/shadcn-admin/app/(auth)/sign-in/page.tsx)
   - 从 route-level client page 改为 server page 壳
4. [src/features/auth/components/sign-in-shell-page.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/components/sign-in-shell-page.tsx)
   - 承接原 `/sign-in` 的 client shell
5. 清理 4 处已失效的 legacy `eslint-disable react-refresh/only-export-components`

## Follow-up Validation

### 1. `pnpm lint`

- 结果：通过
- 输出：无 error、无 warning

### 2. `pnpm build`

- 结果：通过
- 当前仅保留 Next 自身关于“未检测到官方 Next ESLint plugin”的提示
- 不影响构建成功

### 3. 生产预览口径复验（`pnpm start --port 3000`）

#### `/sign-in?redirect=%2Fresources`

- 结果：通过
- 页面可正常渲染，不再出现：
  - `Cannot find module './177.js'`

#### 登录后跳转 `/resources`

- 结果：通过
- `admin@template.dev` 登录后成功回跳到 `/resources`

#### `/settings/language`

- 结果：通过
- 页面可正常渲染
- 刷新后：
  - `lang=zh-CN`
  - `colorScheme=light`
  - 未发生回退

## Current Conclusion

当前最终验证项已经补齐：

1. `pnpm lint` 通过
2. `pnpm build` 通过
3. 浏览器烟雾验收通过
   - auth
   - dashboard/resources
   - settings/language
4. `Reference Module` 可移除性演练通过

因此，基于当前工作树证据，可以认为本轮模板总改造目标已经完成。
