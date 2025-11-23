# Change: 添加 GitHub Releases VSIX 文件自动发布

## Why

VSCode Marketplace 已经移除了扩展页面的直接 VSIX 下载按钮，这是 Microsoft 对所有扩展的统一变更。用户现在无法直接从 Marketplace 页面下载 VSIX 文件进行离线安装。这导致：

1. **离线安装困难**：用户需要使用复杂的 API URL 才能下载 VSIX 文件
2. **用户体验下降**：没有直观的下载入口
3. **使用场景受限**：企业内网、离线环境、特定版本安装等场景受阻

通过在 GitHub Releases 中提供 VSIX 文件下载，可以为用户提供更便捷的离线安装途径。

## What Changes

- 创建 GitHub Actions 工作流，在发布新版本时自动构建和上传 VSIX 文件到 GitHub Releases
- 在 README 中添加"离线安装"章节，指导用户从 GitHub Releases 下载 VSIX
- 更新发布工作流文档，包含 GitHub Releases 相关说明
- 配置自动化发布流程：
  - 推送带 `v*` 标签时触发 GitHub Actions
  - 自动编译、打包、创建 Release 并上传 VSIX
  - 自动从 CHANGELOG.md 提取版本说明作为 Release notes

## Impact

- **受影响的 specs**: beyondcompare-integration
- **受影响的代码**: 
  - 新增 `.github/workflows/release.yml` (GitHub Actions 工作流)
  - 修改 `README.md` (添加离线安装说明)
  - 修改 `docs/PUBLISH.md` (更新发布流程文档)
- **用户影响**: ✅ 提供更便捷的离线安装方式
- **向后兼容性**: ✅ 完全兼容，纯增加功能
- **发布流程影响**: 需要使用 Git tag 触发自动发布


