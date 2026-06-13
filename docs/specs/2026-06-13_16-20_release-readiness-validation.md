# Spec: release-readiness-validation

## Goal

执行当前模板的发布前收口验证，确认它是否具备“可提交、可开源、可复用”的交付状态。

## Scope

- 运行 `pnpm build`
- 运行 `pnpm lint`
- 做一轮关键路径浏览器验收
- 检查并按需补齐 README / 模板说明文档
- 如果验证发现代码问题，先停在问题清单，不直接扩大改动

## Done Contract

完成标准：

1. `build` 与 `lint` 结果明确
2. 关键模板路径浏览器验收结果明确
3. README / 模板说明不存在明显误导口径
4. 本轮结果回写到 spec / changelog

## Change Log

- 对 dashboard 图表渲染链路做了发布前收口：移除 `setState in effect` 临时修法，改为容器尺寸测量后再渲染，并直接向 Recharts 传入数值 `width / height`
- 补充 README 与模板使用指南中的 mock auth 规则、权限档位映射，以及“认证页兼具 showcase 作用”的口径说明

## Validation

- `pnpm build` 通过；当前仍有一个既存非阻塞 warning：Next.js ESLint plugin 尚未接入配置
- `pnpm lint` 通过
- 生产模式浏览器验收通过：
  - `/sign-in` 可正常展示登录表单
  - 登录后 `/` 的 dashboard 柱状图正常显示，柱子数量为 `12`
  - `Analytics` 页签图表正常显示，面积图节点数量为 `4`
  - 已登录状态下再次访问 `/sign-in` 仍可继续查看认证页
  - 退出登录后访问 `/resources` 会跳到 `/sign-in?redirect=%2Fresources`
- 浏览器控制台复核通过：本轮最终验收时 `warn/error` 日志为空
