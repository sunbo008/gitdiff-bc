## ADDED Requirements

### Requirement: GitHub Releases VSIX 文件发布

扩展 SHALL 在每次版本发布时自动将 VSIX 安装包上传到 GitHub Releases，以便用户进行离线安装。

#### Scenario: Git tag 触发自动发布

- **WHEN** 开发者推送 `v*` 格式的 Git tag（例如 `v0.1.5`）
- **THEN** GitHub Actions 工作流应自动触发
- **AND** 自动编译、打包和上传 VSIX 文件到 GitHub Releases

#### Scenario: GitHub Release 包含 VSIX 资产

- **WHEN** GitHub Actions 成功完成发布流程
- **THEN** 对应版本的 GitHub Release 应包含 VSIX 文件
- **AND** VSIX 文件命名格式为 `gitdiff-bc-<version>.vsix`（例如 `gitdiff-bc-0.1.5.vsix`）

#### Scenario: 自动生成 Release Notes

- **WHEN** GitHub Actions 创建 Release
- **THEN** 应从 CHANGELOG.md 中提取对应版本的更新说明
- **AND** 使用提取的内容作为 Release notes
- **AND** 如果提取失败，使用默认简短说明

#### Scenario: 用户从 GitHub 下载 VSIX

- **WHEN** 用户访问 GitHub Releases 页面
- **THEN** 应能看到每个版本的 VSIX 文件下载链接
- **AND** 点击下载后应获得可安装的 .vsix 文件

### Requirement: 离线安装文档

扩展的 README SHALL 包含清晰的离线安装指南，说明如何从 GitHub Releases 下载和安装 VSIX 文件。

#### Scenario: README 包含离线安装章节

- **WHEN** 用户阅读 README.md
- **THEN** 应有"离线安装"或"手动安装"章节
- **AND** 章节应包含 GitHub Releases 页面链接
- **AND** 章节应说明 VSIX 文件的安装步骤

#### Scenario: 安装步骤清晰易懂

- **WHEN** 用户按照文档操作
- **THEN** 文档应包含：
  1. 如何访问 GitHub Releases 页面
  2. 如何选择并下载对应版本的 VSIX 文件
  3. 如何在 VSCode/Cursor 中从 VSIX 安装扩展
- **AND** 步骤应包含必要的截图或命令示例

#### Scenario: 文档说明离线安装的适用场景

- **WHEN** 用户考虑是否使用离线安装
- **THEN** 文档应说明离线安装的适用场景：
  - 企业内网环境
  - 无法访问 Marketplace 的环境
  - 需要安装特定历史版本
  - 需要在多台机器批量安装

### Requirement: GitHub Actions 工作流配置

扩展仓库 SHALL 包含 GitHub Actions 工作流文件，实现 VSIX 文件的自动构建和发布。

#### Scenario: 工作流文件存在且配置正确

- **WHEN** 仓库中存在 `.github/workflows/release.yml` 文件
- **THEN** 文件应配置为监听 `v*` 格式的 tag 推送事件
- **AND** 工作流应包含以下步骤：
  - Checkout 代码
  - 安装 Node.js 和依赖
  - 编译 TypeScript
  - 打包 VSIX
  - 创建 GitHub Release
  - 上传 VSIX 到 Release

#### Scenario: 工作流使用稳定的 Actions

- **WHEN** 定义工作流步骤
- **THEN** 应使用社区认可的稳定 Actions：
  - `actions/checkout` - 代码检出
  - `actions/setup-node` - Node.js 环境
  - `softprops/action-gh-release` 或 `ncipollo/release-action` - 创建 Release
- **AND** Actions 版本应使用具体版本号或主版本号（如 `@v3`）

#### Scenario: 工作流失败通知

- **WHEN** GitHub Actions 工作流执行失败
- **THEN** GitHub 应自动向仓库所有者发送失败通知
- **AND** 工作流日志应包含详细的错误信息便于排查

#### Scenario: 手动重新触发工作流

- **WHEN** GitHub Actions 工作流失败或需要重新发布
- **THEN** 应能够通过 GitHub UI 手动重新触发工作流
- **OR** 可以删除 Release 和 tag 后重新推送 tag

### Requirement: 发布流程文档更新

扩展的发布文档 SHALL 更新为包含 GitHub Releases 自动发布的说明。

#### Scenario: PUBLISH.md 包含 Git tag 发布流程

- **WHEN** 开发者查阅 `docs/PUBLISH.md`
- **THEN** 文档应包含使用 Git tag 触发自动发布的步骤
- **AND** 说明如何创建和推送 tag
- **AND** 说明 tag 命名规范（`v*` 格式）

#### Scenario: 文档说明双轨发布流程

- **WHEN** 开发者执行发布流程
- **THEN** 文档应明确说明两个发布渠道：
  1. GitHub Releases（自动，通过 Git tag 触发）
  2. VSCode Marketplace（手动或自动，通过 `vsce publish` 或集成到 Actions）
- **AND** 说明两者的执行顺序和依赖关系

#### Scenario: 文档包含故障排查指南

- **WHEN** GitHub Actions 发布失败
- **THEN** 文档应提供常见问题的排查步骤：
  - 如何查看 Actions 日志
  - 如何删除错误的 Release
  - 如何重新触发工作流
  - 如何手动构建和上传 VSIX


