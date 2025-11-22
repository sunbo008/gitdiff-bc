# 更新日志

本文档记录 Beyond Compare Git 比较扩展的所有重要更改。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 修复
- 修复 Windows 上 WSL bash 冲突导致文件夹比较失败的问题
  - 现在明确使用 Git Bash 而不是 WSL bash 执行管道命令
  - 自动从 Git 安装路径推断 Git Bash 位置

### 新增
- 初始版本开发中

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

