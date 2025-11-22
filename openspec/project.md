# Project Context

## Purpose

VSCode Beyond Compare Git 比较扩展 - 一个 Visual Studio Code / Cursor 扩展,允许用户通过右键菜单快速调用 Beyond Compare 比较文件或文件夹与 Git HEAD 版本,提升代码审查和差异分析效率。

**兼容性**: 完全支持 VSCode 1.60.0+ 和 Cursor（基于相同的扩展 API）。

## Tech Stack

- **语言**: TypeScript
- **运行时**: Node.js
- **平台**: VSCode Extension API
- **依赖库**:
  - `vscode` - VSCode 扩展 API
  - `simple-git` - Git 操作库
  - `@types/node` - Node.js 类型定义
  - `@types/vscode` - VSCode API 类型定义

## Project Conventions

### Code Style

- 使用 TypeScript 严格模式 (`strict: true`)
- 遵循 ESLint 推荐规则
- 使用 2 空格缩进
- 命名规范:
  - 类名使用 PascalCase
  - 函数和变量使用 camelCase
  - 常量使用 UPPER_SNAKE_CASE
  - 私有成员使用下划线前缀 `_`

### Architecture Patterns

- **单一职责**: 每个模块只负责一个功能
- **依赖注入**: 通过参数传递依赖,避免硬编码
- **错误优先**: 使用 try-catch 处理所有异步操作
- **日志记录**: 所有关键操作记录日志到 Output Channel
- **目录结构**:
  ```
  src/
  ├── extension.ts          # 扩展入口点
  ├── commands/             # 命令实现
  │   ├── compareFile.ts
  │   └── compareFolder.ts
  ├── utils/                # 工具函数
  │   ├── bcPath.ts         # Beyond Compare 路径检测
  │   ├── gitOps.ts         # Git 操作封装
  │   └── tempFile.ts       # 临时文件管理
  └── types/                # TypeScript 类型定义
      └── config.ts
  ```

### Testing Strategy

- **单元测试**: 使用 Mocha + Chai 测试工具函数
- **集成测试**: 使用 VSCode Extension Test Runner 测试命令执行
- **手动测试**: 在 Windows/macOS/Linux 上进行跨平台测试
- **测试覆盖率**: 目标 80% 以上代码覆盖率
- **边界测试**: 重点测试错误场景 (无 Git 仓库、未安装 BC 等)

### Git Workflow

- **主分支**: `main` - 稳定版本
- **开发分支**: `develop` - 开发版本
- **功能分支**: `feature/<feature-name>` - 新功能开发
- **修复分支**: `fix/<bug-description>` - Bug 修复
- **提交规范**: 使用中文简体编写提交消息
  - 格式: `<类型>: <描述>`
  - 类型: 新增、修复、重构、文档、测试、发布
  - 示例: `新增: 实现 Beyond Compare 路径检测功能`

## Domain Context

### Beyond Compare

- **工具定位**: 专业的文件和文件夹比较工具
- **跨平台**: 支持 Windows、macOS、Linux
- **命令行接口**: 通过 `bcomp` (macOS/Linux) 或 `BCompare.exe` (Windows) 调用
- **常用参数**:
  - 文件比较: `bcomp <file1> <file2>`
  - 文件夹比较: `bcomp <folder1> <folder2>`

### Git 工作流

- **HEAD**: 当前分支的最新提交
- **工作区**: 用户编辑的当前文件状态
- **比较场景**: 开发者需要查看当前修改相对于上次提交的差异

### VSCode 扩展机制

- **激活事件**: 扩展在特定条件下激活 (如 `onCommand`)
- **命令注册**: 通过 `vscode.commands.registerCommand` 注册命令
- **菜单贡献**: 在 `package.json` 中声明 `contributes.menus`
- **配置项**: 通过 `contributes.configuration` 定义用户配置

## Important Constraints

- **外部依赖**: 必须依赖用户安装的 Beyond Compare 和 Git
- **文件系统访问**: 需要读取文件和创建临时文件的权限
- **进程执行**: 需要能够启动外部进程 (Beyond Compare)
- **跨平台兼容**: 必须在三大主流操作系统上正常工作
- **扩展大小**: 发布包大小应控制在合理范围 (< 5MB)
- **启动性能**: 扩展激活时间应尽可能短,避免影响 VSCode 性能

## External Dependencies

- **Beyond Compare**: 
  - 版本要求: v3.x 或 v4.x
  - 用户需自行购买和安装
  - 官网: https://www.scootersoftware.com/
  
- **Git**: 
  - 版本要求: 2.0 或更高
  - 通常随系统或开发工具安装
  - 官网: https://git-scm.com/
  
- **VSCode / Cursor**: 
  - VSCode 最低版本: 1.60.0 (根据 API 使用情况确定)
  - Cursor: 完全兼容（基于 VSCode 构建）
  - 扩展引擎: `^1.60.0`

## Release Strategy

- **初始版本**: v0.1.0 (Beta 测试)
- **稳定版本**: v1.0.0 (功能完整并经过充分测试)
- **发布平台**: VSCode Marketplace
- **更新频率**: 
  - Bug 修复: 按需发布 patch 版本
  - 新功能: 每 2-3 个月发布 minor 版本
  - 破坏性变更: 谨慎发布 major 版本,提前通知用户
