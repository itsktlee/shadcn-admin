# Spec: build-typecheck-fix

## Goal

修复当前 `pnpm build` 被 `@tanstack/react-table` 的 `ColumnMeta` 扩展声明阻断的问题。

## Scope

- 补全 `src/tanstack-table.d.ts` 中的 `ColumnMeta` 自定义字段声明
- 不修改表格业务逻辑
- 重新运行 `pnpm build`

## Done Contract

完成标准：

1. `tasks-table.tsx` 中的 `meta.className / thClassName / tdClassName` 不再触发类型错误
2. `pnpm build` 通过

## Change Log

- 为 `@tanstack/react-table` 的 `ColumnMeta` 模块增强补充 `labelKey?: string`
- 保持资源列表列定义与视图列开关逻辑不变，仅修复类型面

## Validation

- `pnpm build`：通过
