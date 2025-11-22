# GitDiff BC 项目指南

欢迎来到 GitDiff BC（Beyond Compare Git 对比工具）项目！本文档提供项目的全面介绍和深入了解。

## 📖 项目概述

GitDiff BC 是一个强大的 VSCode/Cursor 扩展，它将 Beyond Compare 的专业对比功能无缝集成到你的编辑器工作流中。通过简单的右键菜单，你就可以使用 Beyond Compare 比较文件或文件夹与 Git 历史版本。

### 核心特性

- 🎯 **无缝集成** - 在编辑器中直接调用 Beyond Compare
- 📁 **智能对比** - 支持文件和文件夹的 Git 版本对比
- 🌍 **跨平台** - Windows、macOS、Linux 全平台支持
- ⚡ **高性能** - 使用 git archive 高效处理大型文件夹
- 🔧 **灵活配置** - 可自定义路径和日志级别

### 技术架构

```
├── TypeScript 开发     - 类型安全、易于维护
├── VSCode Extension API - 标准的扩展开发框架
├── Git 命令行集成     - 原生 Git 操作支持
└── Beyond Compare CLI  - 调用专业对比工具
```

## 📂 项目结构

```
gitdiff-bc/
├── 📄 核心文件
│   ├── README.md              # 项目主页（快速上手）
│   ├── CHANGELOG.md           # 版本更新日志
│   ├── PROJECT_GUIDE.md       # 📌 本文档（详细指南）
│   ├── AGENTS.md              # OpenSpec 规范
│   ├── LICENSE                # MIT 许可证
│   ├── package.json           # 项目配置
│   └── tsconfig.json          # TypeScript 配置
│
├── 📂 源代码 (src/)
│   ├── extension.ts           # 扩展入口
│   ├── commands/              # 命令实现
│   │   ├── compareFile.ts     # 文件对比
│   │   └── compareFolder.ts   # 文件夹对比
│   ├── utils/                 # 工具模块
│   │   ├── bcPath.ts         # BC 路径检测
│   │   ├── gitOps.ts         # Git 操作
│   │   ├── logger.ts         # 日志系统
│   │   └── tempFile.ts       # 临时文件管理
│   └── types/                 # 类型定义
│       └── config.ts
│
├── 📂 构建产物
│   ├── out/                   # TypeScript 编译输出
│   └── dist/                  # VSIX 打包文件
│       ├── README.md          # 构建说明
│       └── gitdiff-bc-*.vsix  # 扩展安装包
│
├── 📂 文档中心 (docs/)
│   ├── README.md              # 文档索引
│   ├── user/                  # 用户文档
│   │   ├── QUICKSTART.md      # 快速开始
│   │   ├── INSTALL_GUIDE.md   # 安装指南
│   │   └── TROUBLESHOOTING.md # 故障排查
│   ├── developer/             # 开发者文档
│   │   └── BUILD_GUIDE.md     # 构建指南
│   └── maintenance/           # 维护文档
│       ├── REINSTALL.md
│       ├── SETTINGS_FIX.md
│       └── ...
│
├── 📂 脚本工具 (scripts/)
│   ├── README.md              # 脚本说明
│   ├── USAGE.md               # 使用指南
│   ├── CHANGELOG.md           # 脚本更新记录
│   ├── install/               # 安装脚本
│   │   ├── build-and-install.sh    # 🚀 一键构建安装
│   │   └── quick-reinstall.sh      # 快速重装
│   └── debug/                 # 调试工具
│       ├── view-logs.sh       # 查看日志
│       └── test-git-archive.sh # 测试 Git Archive
│
└── 📂 OpenSpec (openspec/)
    ├── AGENTS.md              # AI 助手规范
    ├── project.md             # 项目规范
    └── changes/               # 变更提案
```

## 🚀 快速开始

### 用户使用

如果你是**普通用户**，想要使用这个扩展：

1. **安装** - 参考 [快速开始指南](docs/user/QUICKSTART.md)
2. **使用** - 右键文件选择 "Compare File with Git HEAD"
3. **配置** - 可选配置 Beyond Compare 路径
4. **问题** - 查看 [故障排查](docs/user/TROUBLESHOOTING.md)

### 开发调试

如果你是**开发者**，想要修改或贡献代码：

```bash
# 1. 克隆仓库
git clone <repo-url>
cd gitdiff-bc

# 2. 安装依赖
npm install

# 3. 编译
npm run compile

# 4. 调试（方式一：使用 F5）
# 在 VSCode/Cursor 中按 F5 启动调试

# 5. 调试（方式二：打包安装）
./scripts/install/build-and-install.sh
```

详细的开发指南请参考 [构建指南](docs/developer/BUILD_GUIDE.md)。

## 🔧 开发工作流

### 日常开发

```bash
# 1. 启动监视模式（自动编译）
npm run watch

# 2. 使用 F5 在调试模式下启动扩展

# 3. 修改代码后，重新加载窗口测试
#    按 Cmd+R (macOS) 或 Ctrl+R (Windows/Linux)
```

### 完整测试流程

```bash
# 1. 构建并安装
./scripts/install/build-and-install.sh

# 2. 等待 Cursor 启动后测试功能

# 3. 查看日志
./scripts/debug/view-logs.sh

# 4. 如有问题，查看实时日志
tail -f /tmp/gitdiff-bc-logs/*.log
```

## 📦 构建和发布

### 构建命令

```bash
npm run compile    # 编译 TypeScript → JavaScript (out/)
npm run watch      # 监视模式，自动重新编译
npm run package    # 打包 VSIX 文件 (dist/)
npm run test       # 运行测试
npm run lint       # 代码检查
```

### 构建产物

- **编译输出**: `out/` - 用于开发调试
- **打包文件**: `dist/gitdiff-bc-*.vsix` - 用于分发安装

### 发布流程

1. 更新版本号（`package.json`）
2. 更新 [CHANGELOG.md](CHANGELOG.md)
3. 运行 `npm run package` 生成 VSIX
4. 测试 VSIX 包
5. 发布到 VSCode Marketplace（可选）

## 🎯 核心功能实现

### 文件对比流程

```
用户右键文件
    ↓
检测是否在 Git 仓库中
    ↓
获取文件的 Git HEAD 版本
    ↓
保存到临时文件
    ↓
调用 Beyond Compare
    ↓
清理临时文件
```

### 文件夹对比流程

```
用户右键文件夹
    ↓
使用 git archive 导出 HEAD 版本
    ↓
解压到临时目录
    ↓
调用 Beyond Compare 比较两个文件夹
    ↓
清理临时目录
```

### Beyond Compare 路径检测

1. 检查用户配置的路径
2. 检查系统默认安装路径
3. 从 PATH 环境变量中查找
4. 如果都找不到，提示用户配置

## 🧪 测试和调试

### 查看日志

```bash
# 方法 1：使用脚本
./scripts/debug/view-logs.sh

# 方法 2：在编辑器中查看
# 按 Cmd+Shift+U 打开输出面板，选择 "Beyond Compare Git"

# 方法 3：实时监控
tail -f /tmp/gitdiff-bc-logs/*.log
```

### 测试 Git Archive

```bash
cd <测试的 Git 仓库>
/path/to/gitdiff-bc/scripts/debug/test-git-archive.sh
```

## 📚 文档导航

### 按用户类型

**普通用户** 👤
- [快速开始](docs/user/QUICKSTART.md) - 5分钟上手
- [安装指南](docs/user/INSTALL_GUIDE.md) - 详细安装
- [故障排查](docs/user/TROUBLESHOOTING.md) - 问题解决

**开发者** 👨‍💻
- [构建指南](docs/developer/BUILD_GUIDE.md) - 构建和打包
- [脚本使用](scripts/USAGE.md) - 开发工具

**维护人员** 🔧
- [重新安装](docs/maintenance/REINSTALL.md) - 完全重装
- [设置修复](docs/maintenance/SETTINGS_FIX.md) - 配置修复

### 按主题

**安装部署**
- [快速开始](docs/user/QUICKSTART.md)
- [安装指南](docs/user/INSTALL_GUIDE.md)
- [脚本工具](scripts/README.md)

**开发构建**
- [构建指南](docs/developer/BUILD_GUIDE.md)
- [脚本使用](scripts/USAGE.md)

**问题排查**
- [故障排查](docs/user/TROUBLESHOOTING.md)
- [日志查看](scripts/debug/view-logs.sh)

## 🤝 贡献指南

我们欢迎各种形式的贡献！

### 报告问题

1. 查看 [故障排查文档](docs/user/TROUBLESHOOTING.md)
2. 搜索现有 Issues，避免重复
3. 提供详细的复现步骤和日志

### 提交代码

1. Fork 仓库
2. 创建特性分支
3. 编写清晰的提交信息
4. 确保代码通过 lint 检查
5. 提交 Pull Request

### 改进文档

文档和代码同样重要！欢迎：
- 修正错别字
- 补充示例
- 翻译文档
- 改进说明

## 🔐 安全和隐私

- **本地运行** - 所有操作都在本地执行
- **无数据上传** - 不收集任何用户数据
- **开源透明** - 代码完全开源，可审计
- **临时文件清理** - 比较完成后自动清理临时文件

## 🌟 项目亮点

### 用户体验

- **零配置使用** - 自动检测 Beyond Compare 路径
- **右键菜单** - 集成到编辑器自然工作流
- **快速响应** - 高效的 Git 操作和临时文件管理

### 代码质量

- **TypeScript** - 类型安全，减少运行时错误
- **模块化设计** - 清晰的职责划分
- **错误处理** - 完善的异常捕获和用户提示
- **日志系统** - 多级别日志便于问题排查

### 项目管理

- **清晰结构** - 文档、代码、脚本分类明确
- **自动化脚本** - 一键构建、安装、调试
- **详细文档** - 用户、开发、维护文档齐全

## 📊 技术细节

### 依赖项

```json
{
  "生产依赖": "无（纯 VSCode API）",
  "开发依赖": [
    "TypeScript",
    "ESLint",
    "VSCode Types",
    "Mocha (测试)"
  ]
}
```

### 系统要求

- **Node.js** 14.x 或更高
- **VSCode/Cursor** 1.60.0 或更高
- **Git** 2.0 或更高
- **Beyond Compare** 3.x 或 4.x

## 📝 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🔗 相关资源

- **Beyond Compare**: https://www.scootersoftware.com/
- **VSCode Extension API**: https://code.visualstudio.com/api
- **Git 文档**: https://git-scm.com/doc

---

**感谢使用 GitDiff BC！** 🚀

如有问题或建议，欢迎在 GitHub 仓库提交 Issue 或 Pull Request。

