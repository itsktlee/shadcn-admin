# Spec: template-delivery-audit-prep

## Goal
- 要解决什么问题：当前 Next.js 母模板的功能里程碑已经基本落地，但距离“可长期复用、可直接交付”的最终状态，还缺一轮面向交付的审计与证据收口。
- 本轮核心目标：把最终交付前的剩余验证项、证据要求和优先顺序明确下来，作为后续收口唯一清单。

## Relationship
- 依赖：
  - [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
  - [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
  - [nextjs-m9-template-hardening-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_00-40_nextjs-m9-template-hardening-implementation-checkpoint.md)
  - [vitest-local-browser-runtime-follow-up](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_01-20_vitest-local-browser-runtime-follow-up.md)
- 本文只解决：
  - 最终模板交付前的审计清单
  - 剩余验证项排序
  - 哪些项已有证据，哪些项仍缺强证据
- 本文不进入：
  - 新功能开发
  - 大规模重构
  - 第二维示例模块扩展

## Done Contract
- 完成标准：
  - 已明确“模板母版可交付”所需的剩余证据清单
  - 每项证据都绑定到对应的验证方式
  - 已区分“已有证据”和“待补证据”
- 证明方式：
  - 本文档落盘
  - 与当前代码 / 既有 spec 的交叉引用

## Current Audit Snapshot

### 已有较强证据
- `M1-M8` 功能链路
  - 已有实现 checkpoint 文档
  - 已有多轮 build / 浏览器验收记录
- `M9` 最小自动回归
  - 已有 7 个测试文件、16 个测试通过证据
- 本机浏览器优先测试运行时
  - 已有默认浏览器探测与 Playwright 缓存卸载证据

### 仍缺强证据的项
1. 当前工作树口径下的最终 `build`
2. 当前工作树口径下的最终 `lint`
3. 当前工作树口径下的最终浏览器烟雾验收
4. `Reference Module 可移除性` 的运行态演练证据
5. 最终“可交付母模板”结论的完整 requirement-by-requirement audit

## Recent Progress
- 用户可见的上游技术栈残留已继续收口：
  - [src/config/shell.ts](/Users/ktlee/coding/shadcn-admin/src/config/shell.ts)
  - [src/components/layout/app-title.tsx](/Users/ktlee/coding/shadcn-admin/src/components/layout/app-title.tsx)
- `Reference Module 可移除性` 的模板机制已补齐：
  - [reference-module-removability-follow-up](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_02-00_reference-module-removability-follow-up.md)
- 这意味着当前缺口已经从“没有机制”收敛为“缺运行态强证据”。
- `Reference Module` 禁用后的路径访问逻辑已抽出成可测试模块，并已有测试骨架：
  - [src/services/auth/route-access.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/route-access.ts)
  - [src/services/auth/route-access.test.ts](/Users/ktlee/coding/shadcn-admin/src/services/auth/route-access.test.ts)
- README 与模板接管文档已补齐：
  - [README.md](/Users/ktlee/coding/shadcn-admin/README.md)
  - [docs/template-adoption-guide.md](/Users/ktlee/coding/shadcn-admin/docs/template-adoption-guide.md)
- 运行时配置文档与 `.env.example` 已补齐：
  - [docs/template-runtime-config.md](/Users/ktlee/coding/shadcn-admin/docs/template-runtime-config.md)
  - [.env.example](/Users/ktlee/coding/shadcn-admin/.env.example)

## Final Delivery Checklist

### A. 技术收口
- `pnpm build`
- `pnpm lint`
- 核心测试基线保持可通过

### B. 交互收口
- dashboard shell 不闪烁 / 不塌陷
- navigation config 仍生效
- i18n / theme 不回退
- auth / permission 基线仍生效
- `resources` 参考模块 CRUD 关键路径仍可跑

### C. 模板交付收口
- `resources` 作为 reference module 的可移除性得到证明
- 文档链路完整：
  - 蓝图
  - 实施清单
  - 各阶段 checkpoint
  - README 与真实技术栈一致
  - 模板接管指南存在
  - 运行时配置文档存在
  - `.env.example` 存在
  - 最终收尾结论

## Next Actions
1. 先做当前工作树的最终交付审计前置检查。
2. 在允许的前提下补 `build / lint / browser acceptance` 强证据。
3. 进行 `Reference Module 可移除性` 演练或最小证明。
4. 输出最终 completion audit。

## Resume / Handoff
- 当前状态：功能实施已基本到位，正在转入最终交付审计阶段。
- 当前边界：不再扩展新能力，优先补强证据。
- 下一步唯一动作：按本清单做最终模板交付审计。
