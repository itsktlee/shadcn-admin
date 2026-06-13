# Spec: cookie-key-compat-migration

## 1. 目标

- 要解决什么问题：`vite-ui-theme` / `vite-ui-language` 仍是当前模板主链实际使用的 cookie key，命名已经不符合当前 `Next.js` 模板口径。
- 本轮目标：将主题和语言 cookie 切到模板命名，同时保留对旧 key 的兼容读取和自动迁移。

## 2. 已知事实

- 当前活跃读取链包括：
  - `app/layout.tsx`
  - `src/providers/theme-provider.tsx`
  - `src/i18n/index.ts`
  - `src/components/ui/theme-script.tsx`
- 当前 cookie 常量定义在 `src/lib/cookies.ts`。
- 旧 `src/context/**` 里也有硬编码的 `vite-ui-theme`，但它们属于 legacy 面，不在当前正式运行主链。

## 3. Done Contract

- 完成标志：
  - 当前模板主链改用新的主题/语言 cookie key。
  - 若用户本地仍只有旧 `vite-ui-*` cookie，模板仍能正确读取。
  - 用户进入当前主链后，会把旧 key 迁移到新 key。
  - 文档说明新的 cookie key 与兼容策略。
- 完成证据：
  - `src/lib/cookies.ts`
  - `app/layout.tsx`
  - `src/providers/theme-provider.tsx`
  - `src/i18n/index.ts`
  - `src/components/ui/theme-script.tsx`
  - 相关测试与文档

## 4. 本轮最小动作

1. 在 `src/lib/cookies.ts` 加入新 key、legacy fallback key 与通用兼容 helper。
2. 更新主题/语言主链读写入口。
3. 补充静态测试样例与运行时文档。
4. 回写 CHANGELOG 与 spec。

## 5. 验证方式

- `rg -n "vite-ui-theme|vite-ui-language|template-ui-theme|template-ui-language" src app docs`
- 静态查看主题/语言主链的读写入口
- 测试文件覆盖 fallback 读取与 legacy 清理样例

## 6. Reverse Sync

- 已更新：
  - `src/lib/cookies.ts`
  - `app/layout.tsx`
  - `src/providers/theme-provider.tsx`
  - `src/providers/i18n-provider.tsx`
  - `src/i18n/index.ts`
  - `src/components/ui/theme-script.tsx`
  - `src/lib/cookies.test.ts`
  - `src/providers/theme-provider.test.tsx`
  - `src/providers/i18n-provider.test.tsx`
  - `src/components/config-drawer.test.tsx`
  - `docs/template-runtime-config.md`
  - `docs/template-legacy-removal-checklist.md`
  - `CHANGELOG.md`
- 本轮结论：
  - 当前主题/语言主 cookie key 已切换为 `template-ui-theme` 与 `template-ui-language`
  - 服务端首屏读取、主题 hydration、语言持久化和首屏主题脚本都已保留对旧 `vite-ui-*` key 的 fallback
  - 当前主链完成 hydration 或用户交互后，会把旧 key 迁移到新的 `template-ui-*` key
  - 旧 `vite-ui-*` 命名已从“当前正式 key”降级为“兼容遗留 key”
- 验证证据：
  - 已通过 `rg -n "template-ui-theme|template-ui-language|vite-ui-theme|vite-ui-language"` 核对新旧 key 分布
  - 已静态确认 `app/layout.tsx`、`src/providers/theme-provider.tsx`、`src/i18n/index.ts` 与 `src/components/ui/theme-script.tsx` 全部接入兼容读取
  - 已补充 cookies / theme-provider / i18n-provider / config-drawer 的迁移测试样例，但未主动运行测试
