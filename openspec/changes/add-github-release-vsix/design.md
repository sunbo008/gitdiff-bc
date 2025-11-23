# 设计文档: GitHub Releases VSIX 自动发布

## Context

VSCode Marketplace 移除了 VSIX 下载按钮后，用户只能通过复杂的 API URL 下载扩展的 VSIX 文件。为了改善用户体验，我们需要在 GitHub Releases 中提供 VSIX 文件的直接下载链接。

**背景信息**：
- VSCode Marketplace API URL 格式复杂，不便于普通用户使用
- 企业内网用户、离线环境用户需要 VSIX 文件进行手动安装
- GitHub Releases 是开源项目分发二进制文件的标准方式
- 当前发布流程使用 `vsce publish` 命令直接发布到 Marketplace

## Goals / Non-Goals

**Goals**：
- 在每次版本发布时自动将 VSIX 文件上传到 GitHub Releases
- 提供清晰的离线安装文档
- 保持现有发布流程的简单性
- 自动生成 Release notes（从 CHANGELOG.md 提取）

**Non-Goals**：
- 不替换现有的 Marketplace 发布流程（两者并行）
- 不支持预发布版本的自动发布（仅正式版本）
- 不创建复杂的多平台构建矩阵（VSIX 文件是跨平台的）

## Decisions

### 决策 1: 使用 GitHub Actions 自动化发布

**理由**：
- GitHub Actions 原生支持 GitHub Releases
- 可以与 Git tag 推送事件无缝集成
- 免费且无需额外配置服务器
- 社区有成熟的 Actions 可以直接使用

**触发条件**：推送 `v*` 格式的 Git tag（例如 `v0.1.5`）

**工作流步骤**：
1. Checkout 代码
2. 安装 Node.js 依赖
3. 编译 TypeScript 代码
4. 使用 `vsce package` 打包 VSIX
5. 从 CHANGELOG.md 提取当前版本的说明
6. 创建 GitHub Release 并上传 VSIX 文件

**替代方案考虑**：
- ❌ **手动上传**：容易遗忘，不可靠
- ❌ **使用 npm scripts**：需要在本地环境配置 GitHub token，不够自动化

### 决策 2: 发布流程保持双轨制

**当前流程**：开发者运行 `npm run publish:patch` → 直接发布到 Marketplace

**新流程**：
```
开发者操作：
1. 更新 CHANGELOG.md
2. 提交代码
3. 创建并推送 Git tag: git tag v0.1.5 && git push origin v0.1.5

自动化：
4. GitHub Actions 自动触发
5. 自动打包 VSIX
6. 自动创建 GitHub Release
7. 自动上传 VSIX 到 Release

手动操作（如需要）：
8. 运行 npm run publish:patch 发布到 Marketplace（可选择手动触发或集成到 GitHub Actions）
```

**理由**：
- 保留手动发布到 Marketplace 的灵活性（避免 token 管理复杂性）
- GitHub Release 的自动化更简单且风险更低
- 允许在 GitHub Release 后验证再发布到 Marketplace

**未来优化方向**：可以将 Marketplace 发布也集成到 GitHub Actions，但需要安全地管理 VSCE_PAT token。

### 决策 3: 从 CHANGELOG.md 自动提取 Release Notes

**实现方式**：
- 使用正则表达式从 CHANGELOG.md 提取对应版本的更新内容
- 格式要求：遵循 [Keep a Changelog](https://keepachangelog.com/) 格式
- 提取逻辑：查找 `## [版本号]` 到下一个 `## [版本号]` 之间的内容

**理由**：
- 避免重复编写 Release notes
- 保持 CHANGELOG 和 GitHub Releases 的一致性
- 鼓励开发者维护规范的 CHANGELOG

**替代方案考虑**：
- ❌ **手动编写 Release notes**：重复劳动，容易遗漏
- ❌ **使用 Git commit 历史**：信息过于详细且技术化，不适合用户阅读

### 决策 4: VSIX 命名规范

**格式**：`gitdiff-bc-<version>.vsix`

**示例**：`gitdiff-bc-0.1.5.vsix`

**理由**：
- 包含扩展名称，便于识别
- 包含版本号，方便版本管理
- 符合 VSCode 扩展命名惯例

## Risks / Trade-offs

### 风险 1: GitHub Actions 失败导致 Release 不完整

**影响**：用户可能看到没有 VSIX 文件的 Release

**缓解措施**：
- 在工作流中添加详细的错误日志
- 失败时发送通知（GitHub 自动通知）
- 可以手动重新触发工作流

### 风险 2: CHANGELOG.md 格式不规范导致提取失败

**影响**：Release notes 可能为空或格式错误

**缓解措施**：
- 在文档中明确 CHANGELOG 格式要求
- 提供 CHANGELOG 模板
- 如果提取失败，使用默认的简短说明

### 权衡 1: 双轨发布流程增加复杂度

**权衡**：
- ✅ **好处**：GitHub Release 和 Marketplace 发布独立，降低耦合
- ❌ **代价**：需要两步操作（推送 tag + 手动发布 Marketplace）

**决策**：当前阶段保持双轨，未来可以考虑完全自动化

### 权衡 2: Git tag 推送即触发发布

**权衡**：
- ✅ **好处**：简单直观，符合开源项目惯例
- ❌ **代价**：误推送 tag 会触发不必要的 Release（可以手动删除）

**决策**：采用 `v*` 格式限制，减少误触发风险

## Migration Plan

### 阶段 1: 实施 GitHub Actions（立即）

1. 创建 `.github/workflows/release.yml` 文件
2. 配置必要的工作流步骤
3. 测试工作流（使用测试 tag 验证）

### 阶段 2: 更新文档（立即）

1. ✅ 在 README.md 顶部添加 GitHub Release 版本徽章
2. ✅ 在 README.md 添加"安装"章节，包含：
   - 从 Marketplace 安装的说明
   - 离线安装（从 VSIX）的详细步骤
   - GitHub Releases 下载链接
   - VSIX 文件安装方法（UI 和命令行）
   - 离线安装的适用场景说明
3. 更新 docs/PUBLISH.md 发布流程文档
4. 说明如何使用 Git tag 触发发布

### 阶段 3: 首次发布验证（下次版本发布）

1. 推送新版本 tag
2. 验证 GitHub Actions 成功执行
3. 检查 GitHub Release 中的 VSIX 文件和 Release notes
4. 下载 VSIX 文件测试安装

### 阶段 4: 后续优化（可选）

1. 考虑将 Marketplace 发布也集成到 GitHub Actions
2. 添加版本号自动提取和 tag 创建的辅助脚本
3. 考虑支持预发布版本（pre-release）

### 回滚计划

如果 GitHub Actions 发布出现问题：
1. 可以手动删除错误的 Release
2. 可以禁用工作流，恢复纯手动发布流程
3. VSIX 文件也可以手动构建和上传

## Open Questions

1. **是否需要同时将 Marketplace 发布也集成到 GitHub Actions？**
   - 当前决策：暂不集成，保持手动发布的灵活性
   - 原因：需要安全管理 VSCE_PAT token，增加配置复杂度

2. **是否需要支持预发布版本（pre-release）？**
   - 当前决策：暂不支持
   - 原因：项目当前阶段不需要频繁的预发布版本

3. **CHANGELOG.md 提取失败时的回退策略？**
   - 当前决策：使用简短的默认说明（"Release version X.Y.Z"）
   - 原因：确保 Release 始终有 notes，即使格式不完美


