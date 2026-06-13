# Spec: shell-identity-neutralization

## 1. 目标

- 要解决什么问题：当前模板默认 shell 里还残留上游作者的个人身份信息，且头像回退字母写死为 `SN`。这会直接影响模板作为长期复用母板的默认观感。
- 本轮目标：把默认 shell 身份改成模板中性占位数据，并让头像回退字母随当前用户名称动态变化。

## 2. 已知事实

- 默认用户数据定义在 `src/config/shell.ts`。
- 这些默认值会被：
  - `src/components/profile-dropdown.tsx`
  - `src/components/layout/data/sidebar-data.ts`
  - `src/components/layout/nav-user.tsx`
  消费。
- 当前头像回退字母在 `profile-dropdown` 与 `nav-user` 中都写死为 `SN`。
- `src/lib/utils.ts` 已经存在 `getDisplayNameInitials()`，可以直接复用。

## 3. Done Contract

- 完成标志：
  - 默认 shell 用户不再展示上游作者真实姓名和邮箱。
  - 默认团队名改成模板中性占位值。
  - 头像回退字母不再写死，改为由当前用户名动态生成。
  - 模板接管文档明确把 `src/config/shell.ts` 列为优先替换入口。
- 完成证据：
  - `src/config/shell.ts`
  - `src/components/profile-dropdown.tsx`
  - `src/components/layout/nav-user.tsx`
  - `docs/template-adoption-guide.md`
  - `CHANGELOG.md`

## 4. 本轮最小动作

1. 中性化默认 shell 用户与团队占位数据。
2. 接线 `getDisplayNameInitials()` 到两个头像回退位。
3. 补一组 `utils` 静态测试样例。
4. 回写接管文档与变更记录。

## 5. 验证方式

- 检索证据：
  - `rg -n "satnaing|satnaingdev@gmail.com|>SN<" src`
- 结构证据：
  - 查看上述文件当前源码
- 测试证据：
  - 本轮只补测试文件，不主动运行

## 6. Reverse Sync

- 已更新：
  - `src/config/shell.ts`
  - `src/components/profile-dropdown.tsx`
  - `src/components/layout/nav-user.tsx`
  - `src/lib/utils.test.ts`
  - `docs/template-adoption-guide.md`
  - `CHANGELOG.md`
- 本轮结论：
  - 默认 shell 用户已改为模板中性占位身份：`Template Admin / admin@template.dev`
  - 默认团队名已改为模板中性占位值：`Template Workspace / Operations / Sandbox`
  - 头像回退字母已统一接入 `getDisplayNameInitials()`，不再写死 `SN`
  - `src/config/shell.ts` 已明确成为模板接管的优先替换入口之一
- 静态验证结果：
  - `rg -n "satnaing|satnaingdev@gmail.com|>SN<" src` 已无命中
  - 当前仅 `README.md` 仍保留 `satnaing/shadcn-admin` 的上游来源说明；这是仓库来源归属，不属于模板默认身份泄漏
  - 本轮补充了 `getDisplayNameInitials()` 的测试样例，但未主动运行测试
