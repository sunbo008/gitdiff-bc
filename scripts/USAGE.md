# 脚本使用指南

快速参考：如何使用项目中的各种脚本。

## 🚀 最常用的命令

### 开发调试时

```bash
# 一键构建并安装（最推荐）
./scripts/install/build-and-install.sh
```

这个命令会：
1. 自动编译 TypeScript 代码
2. 打包成 VSIX 文件到 `dist/` 目录
3. 卸载旧版本并清理缓存
4. 安装新版本
5. 重启 Cursor

### 只重新安装（VSIX 已存在）

```bash
# 快速重新安装
./scripts/install/quick-reinstall.sh
```

适合已经构建好 VSIX，只需要重新安装的场景。

### 查看日志

```bash
# 查看扩展日志
./scripts/debug/view-logs.sh
```

自动查找并显示最新的日志文件内容。

## 📋 完整工作流示例

### 场景 1：第一次开发

```bash
# 1. 克隆仓库
git clone <repo-url>
cd gitdiff-bc

# 2. 安装依赖
npm install

# 3. 构建并安装
./scripts/install/build-and-install.sh

# 4. 等待 Cursor 启动后测试功能
# 打开一个 Git 仓库，右键文件 -> Compare File with Git HEAD
```

### 场景 2：修改代码后测试

```bash
# 1. 修改源代码
vim src/extension.ts

# 2. 重新构建并安装
./scripts/install/build-and-install.sh

# 3. 查看日志确认
./scripts/debug/view-logs.sh
```

### 场景 3：调试问题

```bash
# 1. 查看扩展日志
./scripts/debug/view-logs.sh

# 2. 如果需要，实时监控日志
tail -f /tmp/gitdiff-bc-logs/*.log

# 3. 测试 git archive 功能
cd <test-git-repo>
/path/to/gitdiff-bc/scripts/debug/test-git-archive.sh
```

## 🔧 手动构建流程

如果你想手动控制每一步：

```bash
# 1. 编译
npm run compile

# 2. 打包
npm run package

# 3. 安装
cursor --install-extension dist/gitdiff-bc-*.vsix

# 4. 重启 Cursor
killall Cursor && sleep 3 && open -a Cursor
```

## 📂 构建产物位置

```
gitdiff-bc/
├── out/              # TypeScript 编译输出（.js 文件）
└── dist/             # VSIX 打包文件
    └── gitdiff-bc-*.vsix
```

## 💡 提示

1. **使用通配符**：所有脚本都使用 `dist/gitdiff-bc-*.vsix` 通配符，不需要担心版本号变化

2. **自动路径检测**：脚本会自动检测项目根目录，可以从任意位置运行

3. **错误处理**：如果找不到 VSIX 文件，脚本会提示需要先运行构建

4. **日志查看**：开发时建议开启实时日志监控：
   ```bash
   tail -f /tmp/gitdiff-bc-logs/*.log
   ```

## ⚠️ 注意事项

- 构建前确保已运行 `npm install`
- 确保 Cursor 的命令行工具 `cursor` 已正确安装
- macOS 用户需要确保脚本有执行权限（通常已设置好）
- Windows 用户请使用 Git Bash 或 WSL 运行这些脚本

## 🔗 相关文档

- [构建指南](../docs/developer/BUILD_GUIDE.md) - 详细的构建配置说明
- [README](README.md) - 脚本功能详细说明
- [快速开始](../docs/user/QUICKSTART.md) - 用户快速上手指南


