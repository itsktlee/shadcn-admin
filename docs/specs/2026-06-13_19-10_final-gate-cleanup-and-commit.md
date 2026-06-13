# Spec: final-gate-cleanup-and-commit

## Goal

完成当前模板的最终工程门禁验证、提交前本地清理和 git 提交准备，确保上传到仓库的内容干净、完整、可复用。

## Scope

- 更新 `.gitignore`，补充本地生成物忽略规则
- 清理确认不需要保留的本地生成物
- 执行 `pnpm build` 与 `pnpm lint`
- 复核 `git status`
- 在门禁通过后完成 git 提交

## Done Contract

完成标准：

1. `.gitignore` 已覆盖确认不应入库的本地生成物
2. 本地不必要生成物已清理
3. `pnpm build` 与 `pnpm lint` 结果明确且可接受
4. `git status` 中不再出现应被忽略但未忽略的本地生成物
5. 已完成 git 提交

## Facts

- 当前已确认 `.codegraph/` 属于本地索引生成目录，不应进入仓库
- 当前 `.gitignore` 已忽略 `.next`、`dist`、`node_modules`、`.pnpm-store`、`.tanstack`、`pnpm-workspace.yaml`
- 本轮允许执行最终工程门禁和提交前清理

## Plan

1. 将 `.codegraph/` 加入 `.gitignore`
2. 删除本地 `.codegraph/` 目录及其它确认无须保留的本地生成物
3. 执行 `pnpm build`
4. 执行 `pnpm lint`
5. 复核 `git status` 后准备提交

## Change Log

- 已更新 [.gitignore](/Users/ktlee/coding/shadcn-admin/.gitignore)，补充 `.codegraph/` 忽略规则
- 已清理本地 `.codegraph/`、`.DS_Store`，并在最终门禁后再次清理 `.next`、`dist`、`.tanstack`、`pnpm-workspace.yaml` 等生成物
- 已新增 `@next/eslint-plugin-next` 开发依赖，并调整 [eslint.config.js](/Users/ktlee/coding/shadcn-admin/eslint.config.js) 的 flat config 结构，修复 Next ESLint 插件检测、全局忽略生效和测试文件规则边界
- 已更新 [src/components/auth/permission-denied-state.tsx](/Users/ktlee/coding/shadcn-admin/src/components/auth/permission-denied-state.tsx)、[src/features/auth/sign-in/sign-in-2.tsx](/Users/ktlee/coding/shadcn-admin/src/features/auth/sign-in/sign-in-2.tsx)、[src/features/chats/components/new-chat.tsx](/Users/ktlee/coding/shadcn-admin/src/features/chats/components/new-chat.tsx) 与 [next.config.ts](/Users/ktlee/coding/shadcn-admin/next.config.ts)，收掉 Next lint 接入后新增的 `Link` / `Image` / remote image 配置问题

## Validation

- `pnpm lint` 通过
- `pnpm build` 通过
- `next build` 不再出现 “The Next.js plugin was not detected in your ESLint configuration” warning
- 当前提交前工作区只需保留源码与文档改动，生成产物已在忽略或已清理范围内
