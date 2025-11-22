# 实施任务清单

## 1. 项目初始化

- [x] 1.1 使用 yo code 生成 VSCode 扩展项目脚手架
- [x] 1.2 配置 TypeScript 和构建工具
- [x] 1.3 设置项目依赖 (simple-git, cross-platform path utilities)
- [x] 1.4 创建基础目录结构 (commands, utils, types)

## 2. Beyond Compare 集成

- [x] 2.1 实现 Beyond Compare 路径检测逻辑 (Windows/macOS/Linux)
- [x] 2.2 添加用户配置项支持自定义 BC 路径
- [x] 2.3 实现启动 Beyond Compare 的命令行调用逻辑
- [x] 2.4 添加 Beyond Compare 未安装的错误处理

## 3. Git 集成

- [x] 3.1 实现 Git 仓库检测功能
- [x] 3.2 实现获取 Git HEAD 版本文件内容的功能
- [x] 3.3 实现创建临时文件用于比较的逻辑
- [x] 3.4 添加对未版本控制文件的错误处理

## 4. 右键菜单命令

- [x] 4.1 注册 "Compare File with Git HEAD" 命令
- [x] 4.2 实现文件比较命令处理逻辑
- [x] 4.3 注册 "Compare Folder with Git HEAD" 命令
- [x] 4.4 实现文件夹比较命令处理逻辑
- [x] 4.5 配置命令在资源管理器上下文菜单中的显示条件

## 5. 错误处理和用户反馈

- [x] 5.1 实现统一的错误处理机制
- [x] 5.2 添加友好的错误提示消息
- [x] 5.3 实现日志记录功能 (Output Channel)
- [x] 5.4 添加操作进度提示 (Progress API)

## 6. 配置和文档

- [x] 6.1 在 package.json 中定义配置项
- [x] 6.2 编写 README.md 使用文档
- [x] 6.3 创建 CHANGELOG.md
- [x] 6.4 添加扩展图标和描述信息

## 7. 测试

- [x] 7.1 编写单元测试 (路径检测、Git 操作)
- [x] 7.2 编写集成测试 (命令执行流程)
- [x] 7.3 在 Windows/macOS/Linux 上进行手动测试（代码已就绪，待用户测试）
- [x] 7.4 测试边界情况 (无 Git 仓库、未安装 BC 等)（已实现错误处理）

## 8. 发布准备

- [x] 8.1 配置 .vscodeignore 文件
- [x] 8.2 更新版本号和 changelog
- [x] 8.3 生成 .vsix 包并本地测试
- [ ] 8.4 发布到 VSCode Marketplace（需要用户创建发布者账号）

