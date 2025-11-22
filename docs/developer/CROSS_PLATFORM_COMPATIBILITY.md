# 跨平台兼容性说明

本文档说明了项目中所有脚本的跨平台兼容性改进。

## 📋 改进概览

所有 Bash 脚本已经过优化，现在支持以下操作系统：
- ✅ **Windows** (Git Bash / MSYS / MinGW / Cygwin)
- ✅ **macOS**
- ✅ **Linux**

## 🔧 主要改进

### 1. 操作系统自动检测

所有脚本现在都包含自动操作系统检测功能：

```bash
detect_os() {
    case "$(uname -s)" in
        MINGW*|MSYS*|CYGWIN*)
            echo "windows"
            ;;
        Darwin*)
            echo "macos"
            ;;
        Linux*)
            echo "linux"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

OS_TYPE=$(detect_os)
```

### 2. 跨平台命令替换

#### 终止进程
- **macOS**: `killall Cursor`
- **Windows**: `taskkill //F //IM Cursor.exe`
- **Linux**: `pkill -9 cursor` 或 `killall -9 cursor`

#### 启动应用程序
- **macOS**: `open -a Cursor`
- **Windows**: `start "" "Cursor"` 或 `cmd //c start Cursor`
- **Linux**: `cursor &`

#### 打开目录
- **macOS**: `open "$DIR"`
- **Windows**: `explorer "$DIR"`
- **Linux**: `xdg-open "$DIR"` 或 `nautilus "$DIR"`

#### 文件路径
- **macOS/Linux**: `~/.cursor/extensions/`
- **Windows**: `$USERPROFILE/.cursor/extensions/`

#### 临时目录
- **macOS/Linux**: `${TMPDIR:-/tmp}`
- **Windows**: `${TEMP:-/tmp}`

#### 文件信息获取
- **macOS**: `stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file"`
- **Windows**: `date -r "$file" "+%Y-%m-%d %H:%M:%S"`
- **Linux**: `stat -c "%y" "$file"`

### 3. 快捷键提示自适应

脚本会根据操作系统显示正确的快捷键：
- **macOS**: `Cmd+Shift+P`, `Cmd+Shift+U`
- **Windows/Linux**: `Ctrl+Shift+P`, `Ctrl+Shift+U`

## 📁 已更新的脚本

### 1. `scripts/install/build-and-install.sh`
**功能**: 构建并安装扩展

**改进内容**:
- 自动检测操作系统
- 跨平台的进程终止
- 跨平台的应用启动
- 跨平台的路径处理
- 快捷键提示自适应

### 2. `scripts/install/quick-reinstall.sh`
**功能**: 快速重新安装扩展

**改进内容**:
- 自动检测操作系统
- 跨平台的进程终止
- 跨平台的应用启动
- 跨平台的路径处理
- 快捷键提示自适应

### 3. `scripts/debug/view-logs.sh`
**功能**: 查看扩展日志

**改进内容**:
- 自动检测操作系统
- 跨平台的临时目录处理
- 跨平台的文件信息获取（大小、修改时间）
- 跨平台的目录打开命令
- 快捷键提示自适应

### 4. `scripts/debug/test-git-archive.sh`
**功能**: 测试 Git Archive 功能

**改进内容**:
- 自动检测操作系统
- 跨平台的临时目录处理

### 5. `package.json`
**功能**: NPM 包配置

**改进内容**:
- 移除了 `mkdir -p dist` 命令（在 Windows 的某些环境下会出错）
- `vsce` 工具会自动创建输出目录

## 🎯 使用方式

### 前置要求

#### Windows 用户
1. 安装 [Git for Windows](https://git-scm.com/download/win)（包含 Git Bash）
2. 使用 **Git Bash** 运行脚本（不要使用 PowerShell 或 CMD）

#### macOS 用户
- 使用系统自带的终端即可

#### Linux 用户
- 使用系统自带的 bash 终端

### 运行脚本

所有脚本现在都可以直接运行，会自动检测并适配当前操作系统：

```bash
# 构建并安装
./scripts/install/build-and-install.sh

# 快速重新安装
./scripts/install/quick-reinstall.sh

# 查看日志
./scripts/debug/view-logs.sh

# 测试 Git Archive
./scripts/debug/test-git-archive.sh
```

## ⚠️ 注意事项

### Windows 用户特别说明

1. **必须使用 Git Bash**
   - ❌ 不要使用 CMD（命令提示符）
   - ❌ 不要使用 PowerShell
   - ✅ 使用 Git Bash

2. **路径分隔符**
   - Git Bash 会自动处理 Windows 路径（`C:\` 转换为 `/c/`）
   - 脚本已经过测试，可以正确处理

3. **进程管理**
   - Windows 下使用 `taskkill` 命令终止 Cursor
   - 如果自动启动失败，请手动启动 Cursor

### macOS 用户特别说明

1. **应用启动**
   - 使用 `open -a Cursor` 命令启动应用
   - 确保 Cursor 已正确安装在 `/Applications` 目录

### Linux 用户特别说明

1. **应用启动**
   - 确保 `cursor` 命令在 PATH 中
   - 或者手动启动 Cursor

## 🐛 故障排除

### 脚本无法执行
```bash
# 添加执行权限
chmod +x scripts/install/*.sh
chmod +x scripts/debug/*.sh
```

### Windows 下提示 "command not found"
- 确保使用的是 **Git Bash**，而不是 CMD 或 PowerShell
- 检查 Git Bash 是否正确安装

### 自动启动 Cursor 失败
- 脚本会显示警告信息
- 请手动启动 Cursor

### 路径相关错误
- 确保在项目根目录下运行脚本
- 或者使用脚本的完整路径

## 📝 技术细节

### 为什么不使用 Node.js 脚本？

虽然 Node.js 脚本天然跨平台，但 Bash 脚本有以下优势：
1. 更适合系统级操作（进程管理、文件操作）
2. 不需要额外的依赖
3. 在 Git Bash 中运行非常流畅
4. 可以直接调用系统命令

### 测试覆盖

所有脚本都在以下环境中经过测试：
- ✅ Windows 10/11 + Git Bash
- ✅ macOS (多个版本)
- ✅ Linux (Ubuntu, Debian, Fedora)

## 🔄 未来改进

- [ ] 考虑提供 Node.js 版本的脚本作为备选
- [ ] 添加更详细的错误提示
- [ ] 支持更多的 Linux 发行版特定优化
- [ ] 添加自动测试流程

## 📚 相关文档

- [构建指南](BUILD_GUIDE.md)
- [快速安装指南](../user/INSTALL_GUIDE.md)
- [故障排除](../user/TROUBLESHOOTING.md)









