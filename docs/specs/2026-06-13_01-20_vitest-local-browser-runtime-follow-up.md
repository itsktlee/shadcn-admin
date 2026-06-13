# Spec: vitest-local-browser-runtime-follow-up

## Goal
- 要解决什么问题：当前 Vitest Browser Mode 默认走 Playwright 自管 Chromium，导致本机明明已有 Chrome / Edge 仍会触发浏览器二进制下载。
- 本轮核心目标：把测试运行时改成优先复用本机默认浏览器，并清理刚下载的 Playwright 浏览器缓存。

## Relationship
- 依赖：
  - [nextjs-m9-template-hardening-implementation-checkpoint](/Users/ktlee/coding/shadcn-admin/docs/specs/2026-06-13_00-40_nextjs-m9-template-hardening-implementation-checkpoint.md)
- 本文只解决：
  - `vite.config.ts` 中 Vitest Browser runtime 选择策略
  - Playwright 浏览器缓存清理
- 本文不进入：
  - 业务代码
  - 参考模块功能
  - 新的测试用例

## Done Contract
- 完成标准：
  - Vitest Browser Mode 在当前 macOS 环境下会优先读取系统默认浏览器
  - 当默认浏览器是本机 Chrome / Edge 时，直接复用对应 channel
  - 已执行 Playwright 浏览器缓存卸载
- 证明方式：
  - 配置代码证据
  - 本机默认浏览器读取证据
  - `playwright uninstall --all` 执行结果

## Canonical Decisions

### 1. 本轮只做“local-first”策略，不做跨平台复杂探测
- 当前用户环境是 macOS
- 默认浏览器探测只针对当前环境提供最小实现

### 2. 优先复用系统默认 Chrome / Edge
- `com.microsoft.edgemac` -> `msedge`
- `com.google.Chrome*` -> `chrome`
- 其他默认浏览器暂不强行映射 branded channel

### 3. 保留显式覆盖口
- 允许通过环境变量覆盖 `browser/channel`
- 模板在 CI 或特殊机器上仍可手动指定运行时

## Validation Plan
- 静态验证：
  - 读取当前系统默认浏览器 bundle id
  - 检查 `vite.config.ts` 的 runtime 选择逻辑
- 命令验证：
  - `pnpm exec playwright uninstall --all`

## Implementation Result

### 运行时选择策略
- [vite.config.ts](/Users/ktlee/coding/shadcn-admin/vite.config.ts)
  - 已新增 macOS 默认浏览器 bundle id 探测
  - 已建立 bundle id 到 Playwright channel 的最小映射：
    - `com.microsoft.edgemac` -> `msedge`
    - `com.google.Chrome*` -> `chrome`
  - 默认浏览器若命中上述映射，Vitest Browser Mode 会优先复用本机已安装浏览器
  - 未命中时回退到普通 `chromium` 运行时

### 显式脚本入口
- [package.json](/Users/ktlee/coding/shadcn-admin/package.json)
  - 已补充：
    - `test:browser:chrome`
    - `test:browser:edge`
  - 保留：
    - `test`
    - `test:watch`
    - `test:ui`
    - `test:coverage`

## Validation Evidence

### 默认浏览器读取
- 当前系统默认浏览器配置读取结果：
  - `LSHandlerRoleAll = "com.microsoft.edgemac"`
- 结论：
  - 当前机器默认浏览器是 Microsoft Edge
  - 按本轮配置，Vitest Browser Mode 会优先走 `msedge` channel

### Playwright 缓存卸载
- 已执行：
  - `pnpm exec playwright uninstall --all`
- 输出证据：
  - `Removing unused browser at /Users/ktlee/Library/Caches/ms-playwright/chromium-1217`
  - `Removing unused browser at /Users/ktlee/Library/Caches/ms-playwright/chromium_headless_shell-1217`
  - `Removing unused browser at /Users/ktlee/Library/Caches/ms-playwright/ffmpeg-1011`

### 卸载后目录检查
- 当前 `/Users/ktlee/Library/Caches/ms-playwright`
  - 仅剩空目录 `.links`
  - `du -sh` 结果为 `0B`
- 结论：
  - 本轮下载的 Playwright 浏览器二进制已清理干净

## Current Conclusion
- 本轮已把模板测试运行时调整为“本机浏览器优先”。
- 当前机器的默认路径会落到 Edge channel，而不会再默认拉 Playwright 自管 Chromium。
