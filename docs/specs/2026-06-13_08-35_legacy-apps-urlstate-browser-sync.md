# Spec: legacy-apps-urlstate-browser-sync

## Goal

将旧 `src/features/apps/index.tsx` 的筛选 / 类型 / 排序 URL 状态，从 `getRouteApi().useSearch()/useNavigate()` 改为浏览器原生 `URLSearchParams + history.replaceState`，继续减少非 `src/routes/**` 范围内的 `@tanstack/react-router` 直接依赖。

## Scope

- 新增 `src/features/apps/legacy-apps-search.ts`
- 修改 `src/features/apps/index.tsx`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不改 `src/routes/_authenticated/apps/index.tsx`
- 不删除旧 route search schema
- 不改 apps 页视觉结构
- 不主动运行测试或构建

## Facts

- 旧 apps 页只用 `route.useSearch()` 读取 `filter/type/sort`
- 旧 apps 页只用 `route.useNavigate()` 写回查询参数
- 这些行为本质上可以由 `URLSearchParams` 与 `history.replaceState` 完成

## Plan

1. 抽出 `legacy-apps-search.ts`
2. 让 `Apps` 组件改用浏览器原生查询参数读写
3. 保留当前筛选 / 类型 / 排序行为
4. 回写 checklist / changelog

## Done Contract

- `src/features/apps/index.tsx` 不再直接 import `@tanstack/react-router`
- `filter/type/sort` 仍可初始化自 URL，并在交互时写回 URL
- 文档能反映旧 apps 页已进一步脱离 router 运行时

## Validation

- 静态检查 `src/features/apps/index.tsx` 是否移除 `@tanstack/react-router` import
- 静态检查 `legacy-apps-search.ts` 是否承载 parse/write 逻辑
- 静态检查 checklist / changelog 是否同步说明

## Result

- `src/features/apps/index.tsx` 对 `@tanstack/react-router` 的 direct import 当前为空结果
- `legacy-apps-search.ts` 已统一承载 `filter/type/sort` 的 parse/write 逻辑
- 旧 apps 页仍保留 URL 初始化与交互时写回 URL 的行为
- checklist / changelog 已同步记录该状态

## Resume

- 完成后，下一步可继续处理 `users/tasks` 的同类 `getRouteApi()` 依赖，或回到 `navigation-progress`
