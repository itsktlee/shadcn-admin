# Spec: static-completion-audit-checkpoint

## Goal

基于当前工作树做一轮静态完成审计，判断总改造目标距离“代码收口完成”还有没有实质代码缺口，还是已经主要进入“强证据补齐”阶段。

## Inputs

- [nextjs-shell-template-blueprint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_10-15_nextjs-shell-template-blueprint.md)
- [nextjs-shell-template-implementation-checklist](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-12_11-05_nextjs-shell-template-implementation-checklist.md)
- [template-delivery-audit-prep](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_01-40_template-delivery-audit-prep.md)
- 当前工作树源码与文档

## Current Static Findings

### 1. 当前代码收口状态

- 当前非 `src/routes/**` 范围内的 `@tanstack/react-router` direct import 已收缩到：
  - `src/components/navigation-progress.tsx`
  - 以及若干旧测试文件中的 mock/import
- 其中：
  - `navigation-progress.tsx` 已从 `src/routes/__root.tsx` 退役，不再参与旧运行时链路
  - `authenticated-layout.tsx` 的 `Outlet` 职责已迁回 `src/routes/**`
  - 旧 auth / apps / tasks / users / top-nav / errors 页面的 direct import 已被清空

### 2. 模板文档链状态

当前模板接管和交付相关的主文档已齐备：

- `README.md`
- `docs/template-adoption-guide.md`
- `docs/template-runtime-config.md`
- `docs/template-active-surface.md`
- `docs/template-legacy-removal-checklist.md`
- `.env.example`
- `CHANGELOG.md`

### 3. 模板关键中性化 / 可配置化状态

- 默认 shell 身份已中性化：
  - `Template Admin`
  - `Template Workspace`
- 主题 / 语言主 cookie key 已切到：
  - `template-ui-theme`
  - `template-ui-language`
- `resources` reference module 开关已存在：
  - `NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES`

### 4. 当前仍缺强证据的项

基于当前工作树，仍缺的是强证据，而不是明确的静态代码缺口：

1. 当前工作树口径下的最终 `build`
2. 当前工作树口径下的最终 `lint`
3. 当前工作树口径下的最终浏览器烟雾验收
4. `Reference Module` 可移除性的当前工作树运行态证明

## Conclusion

静态审计下，当前仓库已经非常接近“代码收口完成”状态。

更准确地说：

- **代码层剩余缺口**：当前未发现新的明确必改代码缺口
- **主要剩余项**：最终交付强证据不足

这意味着下一阶段不应再继续无目标扩写代码，而应优先补：

- `build / lint / browser acceptance`
- `Reference Module` 可移除性运行态证明

## Constraint Note

根据当前项目规则：

- 不应在未明确授权的情况下主动运行 `build / lint / test`

因此当前可以静态得出的最强结论是：

- **代码收口已接近完成**
- **总目标暂不能宣告完成，主要原因是强证据尚未补齐**

## Next Step

下一轮若继续推进，应优先围绕“交付证据补齐”组织，而不是继续机械性清 legacy。
