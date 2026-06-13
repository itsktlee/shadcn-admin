# Spec: build-surfaced-lint-fixes

## Goal

修复一次意外 `next build` 暴露出来的两处真实 lint 阻塞，避免当前工作树在最终交付审计前带着已知编译门禁错误继续累积。

## Scope

- 修改 `src/hooks/use-legacy-search-state.ts`
- 修改 `src/main.tsx`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不主动重新运行 `build`
- 不处理仅告警级别的 `react-refresh` warning
- 不扩大到其他无关 lint 清理

## Facts

- 意外触发的 `next build` 报出了两类阻塞：
  - `use-legacy-search-state.ts` 的 `useMemo` 依赖数组包含复杂表达式
  - `src/main.tsx` 的 `console.warn` 违反 `no-console`
- 这两项都属于确定性的源码问题，可直接静态修复

## Plan

1. 将 `useLegacySearchState()` 的依赖稳定化逻辑改成简单表达式依赖
2. 为 legacy runtime warning 加最小 lint 豁免
3. 回写 changelog

## Done Contract

- 已知 build 阻塞中的两处 error 具备明确源码修复
- 不新增额外行为变化
- 当前剩余问题收敛到非阻塞 warning 或未重新验证状态

## Validation

- 静态检查 `use-legacy-search-state.ts` 不再在依赖数组里使用复杂表达式
- 静态检查 `src/main.tsx` 的 `console.warn` 已有最小 lint 豁免

## Resume

- 完成后继续回到最终静态完成审计，判断是否只剩强证据缺口
