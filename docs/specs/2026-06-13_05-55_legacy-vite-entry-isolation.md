# Spec: legacy-vite-entry-isolation

## Goal

在不删除旧 `TanStack Router + Vite` 入口链、也不影响当前 Vitest 运行时的前提下，把 `index.html -> src/main.tsx` 这条旧入口显式标记为 legacy，减少后续接手者把它误判成当前正式运行入口的概率。

## Scope

- 修改 `index.html`
- 修改 `src/main.tsx`
- 更新 `README.md`
- 更新 `docs/template-legacy-removal-checklist.md`
- 更新 `CHANGELOG.md`

## Non-Goals

- 不删除 `src/main.tsx`
- 不删除 `src/routeTree.gen.ts`
- 不删除 `src/routes/**`
- 不移除 `vite.config.ts` 或 `Vitest Browser Mode`

## Facts

- 默认脚本已经是 `next dev / next build / next start`
- `tsconfig.json` 已把 `src/main.tsx`、`src/routeTree.gen.ts`、`src/routes/**` 排除出当前主编译面
- `index.html` 仍会直接加载 `/src/main.tsx`
- `vite.config.ts` 当前仍是 Vitest Browser Mode 的运行配置入口，不能与旧前端入口一并处理

## Plan

1. 在 `index.html` 加入明确的 legacy 入口提示
2. 在 `src/main.tsx` 启动时输出 legacy 警告
3. 在 README / checklist / changelog 中补上这层隔离状态

## Done Contract

- 手动打开旧 Vite 入口时，能明显看到它不是当前正式模板 runtime
- 当前正式命令入口仍保持 `pnpm dev`
- 文档能反映“旧入口链已被声明性隔离，但未删除”

## Validation

- 静态检查 `index.html` 是否仍加载 `/src/main.tsx`，同时带有 legacy 提示
- 静态检查 `src/main.tsx` 是否包含 legacy runtime warning
- 静态检查 README / checklist / changelog 是否同步描述

## Result

- `index.html` 仍保留 `/src/main.tsx` 加载链，但标题、描述、OG/Twitter 元信息和页面横幅都已明确标记为 legacy reference entry
- `src/main.tsx` 已补充 legacy 注释和启动时 `console.warn`
- `README.md` 与 `docs/template-legacy-removal-checklist.md` 已明确当前正式入口是 `pnpm dev`
- 当前旧 `TanStack Router + Vite` 入口链处于“保留但已声明性隔离”的状态

## Resume

- 完成后，下一步应继续收紧旧入口链本身，或转入最终验证证据整理
