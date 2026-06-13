# Spec: vitest-tanstack-router-plugin-isolation

## Goal

在保留当前 `Vitest Browser Mode` 运行时的前提下，把 `vite.config.ts` 里对 legacy `TanStack Router` 文件路由插件的启用条件收紧到“默认只用于非 Vitest 进程；只有显式需要 legacy route 测试时才开启”。

## Scope

- 修改 `vite.config.ts`
- 更新 `README.md`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不移除 `@tanstack/react-router` 依赖
- 不删除 `src/routes/**`
- 不删除 `src/routeTree.gen.ts`
- 不调整现有 `Vitest Browser Mode` 浏览器选择逻辑

## Facts

- 当前默认脚本已全部切到 `next dev / next build / next start`
- 当前 `Vitest` 仍复用 `vite.config.ts` 作为运行时配置入口
- 当前测试文件没有直接 import `src/routes/**` 或 `src/routeTree.gen.ts`
- 仓库里仍有部分 legacy feature 使用 `getRouteApi()` / `useSearch()` 等 `@tanstack/react-router` 运行时 API，但这不等于必须启用文件路由插件

## Plan

1. 为 `tanstackRouter` 插件增加 `isVitestProcess()` 检测
2. 默认在 Vitest 进程中关闭该插件
3. 保留 `VITEST_ENABLE_TANSTACK_ROUTER_PLUGIN=true` 的显式回开口
4. 同步 README / checklist / changelog

## Done Contract

- `vite.config.ts` 默认不会在 Vitest 进程里无差别启用 `tanstackRouter` 插件
- legacy route 测试仍可通过显式环境变量回开
- 文档能说明“Vitest 运行时”与“legacy route 插件”已经进一步分离

## Validation

- 静态检查 `vite.config.ts` 是否存在 Vitest 进程检测与显式回开逻辑
- 静态检查 README / checklist / changelog 是否同步说明

## Result

- `vite.config.ts` 已增加 `isVitestProcess()` 与 `shouldEnableTanstackRouterPlugin()`
- 当前 `Vitest` 进程默认不会自动启用 `tanstackRouter` 文件路由插件
- 保留了 `VITEST_ENABLE_TANSTACK_ROUTER_PLUGIN=true` 的显式回开口
- 当前测试文件对 `src/routes/**` / `src/routeTree.gen.ts` 的 direct import 仍为空结果

## Resume

- 完成后，下一步应继续评估 `src/routes/**` / `src/routeTree.gen.ts` 是否还能进一步收缩，或转向最终交付验证
