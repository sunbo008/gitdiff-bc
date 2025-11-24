# 更新日志

本文档记录 Beyond Compare Git 比较扩展的所有重要更改。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

### 新增
- 🆕 **从终端比较文件与 Git HEAD**
  - 支持在终端右键菜单中直接比较 `git status` 输出的文件
  - **单文件比较**：鼠标选中单个文件路径，右键选择"与 Git HEAD 比较文件"（自动获取选中文本）
  - **批量文件比较**：鼠标选中多个文件路径，右键选择"与 Git HEAD 比较文件"（自动批量比较）
  - 智能路径解析：支持 git status 多种输出格式（带前缀、带缩进、纯路径等）
  - 完整的错误处理：跳过无效路径，显示操作摘要

- 🆕 **比较任意两个文件**
  - 方式1（推荐）：按住 Ctrl/Cmd 同时选中两个文件，右键"比较选中的文件"直接比较
  - 方式2（备选）：分两步选择文件进行比较，先"选择此文件进行比较"，再"与已选文件比较"
  - 无需 Git 仓库依赖，可比较工作区中的任意两个文件
  - 状态栏显示当前已选中的文件，点击可清除选择
  - 智能菜单显示：仅在合适的情况下显示相应的命令选项
  - 完整的错误处理和用户反馈机制

## [0.1.5] - 2025-11-23

### 新增
- 🚀 **GitHub Releases 自动发布**
  - 推送 `v*` 格式的 Git tag 自动触发 GitHub Actions 工作流
  - 自动编译、打包 VSIX 文件并上传到 GitHub Releases
  - 从 CHANGELOG.md 自动提取版本说明作为 Release notes
  - 为离线安装、企业内网环境提供便捷的 VSIX 下载途径
- 📦 **离线安装文档**
  - README 中添加完整的离线安装指南
  - 提供 GitHub Releases 页面链接和下载说明
  - 支持 UI 和命令行两种 VSIX 安装方式
  - 说明离线安装的适用场景（企业内网、离线环境、特定版本、批量部署）
- 📄 **发布流程文档更新**
  - 完善双轨发布流程说明（GitHub Releases + VSCode Marketplace）
  - 添加 Git tag 发布流程详细步骤
  - 提供 GitHub Actions 故障排查指南
  - 说明手动备用发布方案

## [0.1.4] - 2025-11-23

### 优化
- 优化扩展市场元数据，提升可发现性
  - 添加 "SCM Providers" 分类，更精确的分类定位
  - 扩充关键词列表：gitdiff, gitdiff-bc, beyond-compare, bc, git diff, file compare, folder compare, version control 等
  - 改进在 Cursor 和 VSCode 扩展商店的搜索匹配度

## [0.1.3] - 2025-11-23

### 修复
- 修复 Windows 上 WSL bash 冲突导致文件夹比较失败的问题
  - 现在明确使用 Git Bash 而不是 WSL bash 执行管道命令
  - 自动从 Git 安装路径推断 Git Bash 位置

## [0.1.2] - 2025-11-22

### 修复
- 修复在资源管理器空白区域右键"比较文件夹"时报错的问题
  - 现在可以在空白区域右键快速比较整个工作区根目录与 Git HEAD
- 修复文件夹路径为目录时 Git 仓库检测失败的问题
  - 现在 `GitOperations.isInGitRepo()` 和 `getRepoRoot()` 能正确处理目录路径
- 改进未入库文件夹的错误提示
  - 现在会在执行 git archive 前检查文件夹是否存在于 Git HEAD 中
  - 未入库文件夹会显示友好的错误信息，而不是技术细节

## [0.1.0] - 待发布

### 新增
- 右键菜单命令：比较文件与 Git HEAD
- 右键菜单命令：比较文件夹与 Git HEAD
- 自动检测 Beyond Compare 安装路径（Windows/macOS/Linux）
- 支持自定义 Beyond Compare 可执行文件路径配置
- Git 仓库和文件跟踪状态检测
- 临时文件自动管理和清理
- 详细的日志记录功能
- 可配置的日志级别（error/warn/info/debug）
- 操作进度提示
- 友好的错误提示消息
- 完全兼容 VSCode 和 Cursor

### 技术实现
- 使用 TypeScript 开发
- 集成 simple-git 进行 Git 操作
- 跨平台路径处理
- 异步错误处理机制

### 文档
- 完整的 README 使用文档
- 配置说明和常见问题解答
- MIT 开源许可证

---

## 版本说明

- **[未发布]**: 正在开发中的功能
- **[0.1.0]**: 首个 Beta 测试版本

