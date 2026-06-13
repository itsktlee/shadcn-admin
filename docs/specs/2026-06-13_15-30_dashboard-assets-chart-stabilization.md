# Spec: dashboard-assets-chart-stabilization

## Goal

修复 dashboard 首页当前两处展示质量问题：

1. `Recent Sales` 引用不存在的 `/avatars/*.png`，导致静态资源 404
2. `Overview / Analytics` 图表使用随机数据且容器不够稳，影响模板展示一致性

## Scope

- 为 dashboard 最近销售补齐本地可用头像资源
- 稳定 dashboard 图表数据与容器高度
- 不调整 dashboard 的信息架构、文案层级和交互结构
- 不主动运行 build / lint

## Done Contract

完成标准：

1. dashboard 首页不再请求不存在的 `/avatars/*.png`
2. `Overview` 与 `Analytics` 图表稳定可见，刷新后不再随机跳数
3. 浏览器回归通过

## Change Log

- 为 `Recent Sales` 补齐 5 个本地 SVG 头像资源，并将引用从不存在的 `.png` 改为可用的 `.svg`
- 将 `Overview` 与 `Analytics` 的 demo 图表数据改为固定值，避免刷新后随机跳数
- 为两个图表增加稳定高度容器，并在 mounted 之后再渲染 Recharts，收掉开发态 `width(-1) / height(-1)` warning

## Validation

- 浏览器回归通过：dashboard 首页 5 个头像均成功加载，本地资源路径为 `/avatars/01.svg` 至 `/avatars/05.svg`
- 浏览器回归通过：`Overview` 图表存在 12 根柱子，容器高度为 `350`
- 浏览器回归通过：切到 `Analytics` 页签后图表正常显示，曲线区域节点数量为 `4`，容器高度为 `300`
- 开发服务器日志复核通过：刷新首页后不再出现 `/avatars/*.png` 404，也不再出现 Recharts `width(-1)` warning
