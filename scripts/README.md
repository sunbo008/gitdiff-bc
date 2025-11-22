# 脚本工具

本目录包含用于开发、调试和维护的实用脚本。

## 📂 目录结构

### install/
安装和部署相关的脚本

- **`build-and-install.sh`** - 🚀 **推荐** 一键构建并安装扩展
  - 自动编译和打包 VSIX
  - 卸载旧版本
  - 清理缓存
  - 安装新版本
  - 重启 Cursor
  
  使用方法：
  ```bash
  # 从项目根目录运行
  ./scripts/install/build-and-install.sh
  ```
  
  这是最方便的方式，适合开发调试时使用。

- **`quick-reinstall.sh`** - 快速重新安装扩展（需要 VSIX 已存在）
  - 自动卸载旧版本
  - 清理缓存
  - 自动查找 dist/*.vsix 文件并安装
  - 重启 Cursor
  
  使用方法：
  ```bash
  # 从项目根目录运行
  ./scripts/install/quick-reinstall.sh
  
  # 或从任意位置运行
  /path/to/gitdiff-bc/scripts/install/quick-reinstall.sh
  ```
  
  注意：使用通配符自动匹配 VSIX 文件，无需指定版本号

### debug/
调试和测试工具

- **`view-logs.sh`** - 查看扩展日志
  - 自动查找日志文件
  - 显示最新日志内容
  - 提供实时监控命令
  
  使用方法：
  ```bash
  # 从项目根目录运行
  ./scripts/debug/view-logs.sh
  
  # 或从任意位置运行
  /path/to/gitdiff-bc/scripts/debug/view-logs.sh
  ```

- **`test-git-archive.sh`** - 测试 git archive 功能
  - 验证 git archive 命令是否正常
  - 测试文件夹导出
  - 诊断路径问题
  
  使用方法：
  ```bash
  # 在需要测试的 Git 仓库中运行
  cd <your-git-repo>
  /path/to/gitdiff-bc/scripts/debug/test-git-archive.sh
  ```

## 🔧 使用前提

所有脚本需要在 macOS/Linux 环境下运行，并确保：
- ✅ Bash shell 可用
- ✅ Git 已安装
- ✅ Cursor 已安装并配置了 `cursor` 命令

## 💡 提示

如果脚本没有执行权限，运行：
```bash
chmod +x scripts/**/*.sh
```

