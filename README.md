# GitDiff BC - Beyond Compare Git 对比工具

一个 VSCode / Cursor 扩展，使用 Beyond Compare 快速比较文件/文件夹与 Git 历史版本。

## 功能特性

✨ **右键菜单集成** - 在资源管理器中右键即可快速比较  
🔍 **文件比较** - 比较单个文件与 Git HEAD 版本  
📁 **文件夹比较** - 比较整个文件夹与 Git HEAD 版本  
🌍 **跨平台支持** - 完美支持 Windows、macOS 和 Linux  
🎯 **自动检测** - 自动检测 Beyond Compare 安装路径  
⚙️ **灵活配置** - 支持自定义 Beyond Compare 路径和日志级别  
🌐 **多语言支持** - 支持中英文界面，自动适配 VSCode 语言设置  

## 兼容性

- ✅ **VSCode** 1.60.0 或更高版本
- ✅ **Cursor** 完全兼容（基于 VSCode 构建）
- ✅ **Windows** / **macOS** / **Linux**

## 前置要求

1. **Beyond Compare** - 需要安装 Beyond Compare（v3 或 v4）
   - 下载地址: https://www.scootersoftware.com/
   
2. **Git** - 需要安装 Git 2.0 或更高版本
   - 下载地址: https://git-scm.com/

## 使用方法

### 比较文件

1. 在 VSCode/Cursor 资源管理器中找到要比较的文件
2. 右键点击文件
3. 选择 **"Compare File with Git HEAD"**
4. Beyond Compare 会自动打开，显示文件与 Git HEAD 版本的差异

### 比较文件夹

1. 在资源管理器中右键点击文件夹
2. 选择 **"Compare Folder with Git HEAD"**
3. Beyond Compare 会打开文件夹比较视图

## 配置

在 VSCode/Cursor 设置中搜索 "Beyond Compare" 可以找到以下配置项：

### `beyondCompare.executablePath`

自定义 Beyond Compare 可执行文件路径。留空则自动检测。

**默认值**: `""`（自动检测）

**示例**:
- Windows: `"C:\\Program Files\\Beyond Compare 4\\BCompare.exe"`
- macOS: `"/Applications/Beyond Compare.app/Contents/MacOS/bcomp"`
- Linux: `"/usr/bin/bcompare"`

### `beyondCompare.logLevel`

设置日志输出级别，用于问题排查。

**可选值**: `"error"`, `"warn"`, `"info"`, `"debug"`  
**默认值**: `"info"`

查看日志：打开 **输出面板** (Ctrl+Shift+U / Cmd+Shift+U)，选择 **"Beyond Compare Git"** 频道。

## 自动检测路径

扩展会按以下顺序查找 Beyond Compare：

1. ✅ **用户配置** - 检查 `beyondCompare.executablePath` 设置
2. ✅ **默认安装路径** - 检查系统默认安装位置
   - Windows: `C:\Program Files\Beyond Compare 4\BCompare.exe`
   - macOS: `/Applications/Beyond Compare.app/Contents/MacOS/bcomp`
   - Linux: `/usr/bin/bcompare`
3. ✅ **PATH 环境变量** - 从系统 PATH 中查找

## 常见问题

### ❓ 提示"未找到 Beyond Compare"

**解决方法**:
1. 确认已安装 Beyond Compare
2. 在设置中手动配置 `beyondCompare.executablePath`
3. 检查文件路径是否正确（注意 Windows 路径需要双反斜杠 `\\`）

### ❓ 提示"文件不在 Git 版本控制中"

**原因**: 该文件是新创建的，尚未提交到 Git

**解决方法**: 先将文件添加到 Git 并提交：
```bash
git add <文件名>
git commit -m "提交说明"
```

### ❓ 提示"当前目录不是 Git 仓库"

**原因**: 文件所在的目录不是 Git 仓库

**解决方法**: 在该目录下初始化 Git 仓库：
```bash
git init
```

## 📚 文档

### 📖 深入了解
- 📌 **[项目指南](PROJECT_GUIDE.md)** - 项目全面介绍和开发指南
- 📑 [文档索引](docs/README.md) - 完整文档导航

### 用户文档
- 📖 [快速开始指南](docs/user/QUICKSTART.md) - 5分钟上手教程
- 📥 [安装指南](docs/user/INSTALL_GUIDE.md) - 详细的安装步骤
- 🌐 [国际化指南](docs/user/I18N_GUIDE.md) - 多语言支持说明
- 🔧 [故障排查](docs/user/TROUBLESHOOTING.md) - 常见问题解决方案

### 开发者文档
- 🏗️ [构建指南](docs/developer/BUILD_GUIDE.md) - 构建和打包流程
- 🛠️ [脚本使用说明](scripts/USAGE.md) - 开发和调试工具

### 维护文档
- 🔄 [重新安装指南](docs/maintenance/REINSTALL.md) - 完全重新安装步骤
- ⚙️ [设置修复](docs/maintenance/SETTINGS_FIX.md) - 配置问题修复

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 问题反馈

如果遇到问题或有功能建议，欢迎在 GitHub 仓库提交 Issue。

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史。

---

**享受更高效的代码比较体验！** 🚀

