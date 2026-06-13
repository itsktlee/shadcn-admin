# Spec: template-runtime-config-docs-follow-up

## Goal
- 要解决什么问题：当前模板已经有 reference module 开关、mock auth 账号规则和本机浏览器优先测试运行时，但这些入口主要藏在代码里，不利于后续直接接管。
- 本轮核心目标：把模板级运行时配置整理成显式文档，并补一个最小 `.env.example`。

## Relationship
- 依赖：
  - [template-delivery-audit-prep](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_01-40_template-delivery-audit-prep.md)
  - [vitest-local-browser-runtime-follow-up](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_01-20_vitest-local-browser-runtime-follow-up.md)
  - [reference-module-removability-follow-up](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_02-00_reference-module-removability-follow-up.md)
- 本文只解决：
  - 模板运行时配置文档
  - `.env.example`
- 本文不进入：
  - 新配置项设计
  - build/test 命令执行

## Done Contract
- 完成标准：
  - 存在一份模板运行时配置文档
  - 存在一份最小 `.env.example`
  - README / 模板接管指南已链接到该文档
- 证明方式：
  - 文件存在
  - 交叉链接可见

