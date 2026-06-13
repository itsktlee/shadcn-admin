# Spec: final-validation-execution-plan

## Goal

把当前模板母版进入封板前需要补齐的强证据，整理成一份可直接执行的最终验证清单。本文不执行命令，只定义执行顺序、页面路径、通过标准和证据落点。

## Preconditions

执行本清单前，需要用户明确放行：

- `pnpm build`
- `pnpm lint`
- 浏览器烟雾验收
- `Reference Module` 可移除性运行态演练

## Validation Sequence

### 1. 技术门禁

按这个顺序执行：

1. `pnpm build`
2. `pnpm lint`

通过标准：

- `build` 完成且无 error
- `lint` 完成且无 error
- 若仍存在 warning，需要逐条判断是否属于可接受历史 warning，不能直接略过

## 2. 浏览器烟雾验收

建议基于当前正式主链页面检查：

### A. Dashboard Shell

- `/`
- `/settings`
- `/settings/language`

检查点：

- shell 不闪烁
- sidebar / header 稳定
- theme 切换后刷新不回退
- language 切换后刷新不回退

### B. Auth / Permission

- `/sign-in`
- `/resources`

检查点：

- 未登录访问受保护页时重定向逻辑仍成立
- `viewer@template.dev` 权限裁剪仍成立
- `admin@template.dev` 权限恢复仍成立

### C. Reference Module

- `/resources`

检查点：

- 列表加载
- 搜索
- 状态筛选
- 分页
- create
- update
- delete
- duplicate slug 字段错误

## 3. Reference Module 可移除性演练

执行方式：

1. 将 `NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES=false`
2. 启动当前工作树
3. 验证：
   - sidebar 中不再出现 `resources`
   - command menu 中不再出现 `resources`
   - 访问 `/resources` 返回 `notFound`
   - middleware 不再把 `/resources` 当主模板路径

通过标准：

- 以上四项全部成立

## 4. 证据记录方式

最终 completion audit 至少应引用：

- `build` 输出结论
- `lint` 输出结论
- 浏览器验收涉及页面与关键结果
- `Reference Module` 可移除性演练结果

## Current Status

在本文落盘时：

- 静态代码收口已接近完成
- 当前尚未补齐上述强证据
- 因此当前还不能宣告总目标完成

## Next Step

一旦获得执行放行，下一轮应严格按本文顺序补齐证据，而不是再继续扩展新代码。
