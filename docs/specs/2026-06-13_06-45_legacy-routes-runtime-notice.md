# Spec: legacy-routes-runtime-notice

## Goal

为 `src/routes/**` 这条旧 `TanStack Router` 路由树增加统一的 runtime notice，让任何通过旧路由树启动的页面都明确显示“这是 legacy reference runtime，不是当前正式 Next.js 模板入口”。

## Scope

- 修改 `src/routes/__root.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不逐页修改 `src/routes/**`
- 不删除旧路由文件
- 不调整旧页面内部业务逻辑
- 不主动运行测试或构建

## Facts

- `src/routes/__root.tsx` 是整个旧 `TanStack Router` 路由树的统一根壳
- 当前 `index.html` 与 `src/main.tsx` 已经被标记为 legacy reference entry
- 旧路由树本身之前还缺少统一的可见 runtime notice

## Plan

1. 在 `src/routes/__root.tsx` 增加统一 `LegacyRouteRuntimeNotice`
2. 让 notice 在旧路由树所有页面上方固定显示
3. 回写 checklist / changelog，记录旧 routes 已具备全局提示层

## Done Contract

- 旧 `TanStack Router` 路由树一旦被运行，所有页面都会带统一 legacy notice
- 提示文案能明确指出正式入口是 `pnpm dev`
- 文档能反映旧 routes 已被进一步声明性隔离

## Validation

- 静态检查 `src/routes/__root.tsx` 是否挂载全局 legacy notice
- 静态检查 checklist / changelog 是否同步说明

## Result

- `src/routes/__root.tsx` 已统一挂载 `LegacyRouteRuntimeNotice`
- 旧 `TanStack Router` 路由树下的页面现在会共享同一条可见 runtime 提示
- `docs/template-legacy-removal-checklist.md` 与 `CHANGELOG.md` 已同步记录该状态

## Resume

- 完成后，下一步应继续评估 `src/routes/**` / `src/routeTree.gen.ts` 是否能进一步压缩到更少实际运行职责
