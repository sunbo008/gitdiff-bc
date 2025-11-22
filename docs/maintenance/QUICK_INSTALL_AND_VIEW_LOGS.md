# 快速安装和查看日志指南

## 🎯 更新内容

这个版本包含了强大的日志功能：

✅ **三重日志输出**：
- 输出到 VSCode/Cursor 输出面板
- 输出到文件系统（持久化）
- 输出到浏览器控制台

✅ **详细的激活日志**：
- 记录每个激活步骤
- 显示命令注册过程
- 验证命令是否真的注册成功

✅ **便捷的日志查看**：
- 命令面板直接打开日志文件
- 自动化脚本查看日志
- 实时日志监控

✅ **修复中文文件名问题**：
- Unicode NFC 规范化
- 多重文件跟踪检查

## 🚀 快速安装（3 步）

### 步骤 1：完全卸载旧版本

```bash
# 卸载
cursor --uninstall-extension your-publisher-name.gitdiff-bc

# 清理缓存
rm -rf ~/.cursor/extensions/your-publisher-name.gitdiff-bc-*

# 完全退出 Cursor
killall Cursor
sleep 5
```

### 步骤 2：安装新版本

```bash
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
cursor --install-extension gitdiff-bc-0.1.0.vsix --force
```

### 步骤 3：完全重启并验证

```bash
# 再次退出
killall Cursor
sleep 3

# 重新启动
open -a Cursor
```

## ✅ 验证安装（打开 Cursor 后）

### 方法 1：查看激活提示

- 启动后应该看到提示：**"Beyond Compare Git 扩展已激活"**
- 点击 **"查看日志"** 按钮

### 方法 2：检查输出面板

1. 按 `Cmd+Shift+U` 打开输出面板
2. 选择 **"Beyond Compare Git"** 频道
3. 应该看到：

```
=================================================
Logger 初始化 (首次初始化)
时间: 2025-11-21T...
日志级别: info
日志文件: /tmp/gitdiff-bc-logs/gitdiff-bc-2025-11-21-*.log
VSCode 版本: ...
平台: darwin
=================================================
=== Beyond Compare Git 扩展开始激活 ===
扩展 ID: gitdiff-bc
...
✓ 所有命令已注册完成
已注册的扩展命令: extension.compareFileWithHead, extension.compareFolderWithHead, ...
=== Beyond Compare Git 扩展激活完成 ===
```

### 方法 3：检查命令是否注册

1. 按 `Cmd+Shift+P` 打开命令面板
2. 输入 "compare"
3. 应该看到：
   - ✅ Compare File with Git HEAD
   - ✅ Compare Folder with Git HEAD

4. 输入 "beyond"，应该看到：
   - ✅ Beyond Compare Git: 显示日志文件
   - ✅ Beyond Compare Git: 打开日志目录

## 📋 查看日志的 4 种方法

### 方法 1：输出面板（最简单）

```
按 Cmd+Shift+U → 选择 "Beyond Compare Git"
```

### 方法 2：命令面板（最方便）

```
按 Cmd+Shift+P → 输入 "Beyond Compare Git: 显示日志文件"
```

### 方法 3：命令行脚本（最强大）

```bash
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
./view-logs.sh
```

### 方法 4：实时监控（适合调试）

```bash
# 先获取日志文件路径
./view-logs.sh

# 然后实时监控
tail -f /tmp/gitdiff-bc-logs/gitdiff-bc-*.log
```

## 🧪 测试功能

### 测试 1：比较中文文件名

```bash
# 进入 GhostNote 项目
cd /Volumes/Lzf-MoveDisk/workspace/github/GhostNote

# 在 Cursor 中打开
cursor .
```

1. 找到 `docs/api/HTTP_API文档.md`
2. 右键点击文件
3. 选择 **"Compare File with Git HEAD"**
4. 查看输出面板的日志：

```
[INFO ] 执行命令: compareFileWithHead, 文件: .../HTTP_API文档.md
[DEBUG] 检查文件跟踪状态: docs/api/HTTP_API文档.md
[DEBUG] 文件已跟踪 (status): docs/api/HTTP_API文档.md
[INFO ] 成功获取 HEAD 版本文件内容: docs/api/HTTP_API文档.md
```

### 测试 2：查看日志文件

```
按 Cmd+Shift+P → "Beyond Compare Git: 显示日志文件"
```

应该弹出对话框，可以：
- 打开日志文件（在编辑器中）
- 打开日志目录（在 Finder 中）
- 复制路径到剪贴板

## 🔍 如果还是不工作

### 检查清单

```bash
# 1. 检查扩展是否安装
cursor --list-extensions | grep gitdiff-bc
# 预期输出: your-publisher-name.gitdiff-bc

# 2. 检查扩展文件
ls -la ~/.cursor/extensions/your-publisher-name.gitdiff-bc-*/

# 3. 查看日志
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
./view-logs.sh
```

### 开发者工具诊断

如果日志文件都不存在：

1. **打开开发者工具**：
   - Help → Toggle Developer Tools
   - 或按 `Cmd+Option+I`

2. **查看 Console 标签**

3. **重新加载窗口**：
   - 按 `Cmd+Shift+P`
   - 输入 "Developer: Reload Window"

4. **观察控制台输出**：
   - 应该看到扩展激活日志
   - 如果有错误，会显示在这里

### 如果看到 "command not found" 错误

这说明扩展**没有被激活**。检查：

1. **激活事件配置**：
   ```bash
   cat ~/.cursor/extensions/your-publisher-name.gitdiff-bc-*/package.json | grep -A 3 "activationEvents"
   ```
   
   应该是：
   ```json
   "activationEvents": [
     "onStartupFinished"
   ]
   ```

2. **扩展主机日志**：
   - 按 `Cmd+Shift+P`
   - "Developer: Show Logs" → "Extension Host"
   - 查找错误信息

3. **运行扩展列表**：
   - 按 `Cmd+Shift+P`
   - "Developer: Show Running Extensions"
   - 找到 "gitdiff-bc"
   - 状态应该是 "Activated"

## 🎉 成功标志

安装成功的标志：

1. ✅ 启动时看到 "Beyond Compare Git 扩展已激活" 提示
2. ✅ 输出面板有详细的激活日志
3. ✅ 命令面板能找到所有命令
4. ✅ 右键菜单出现比较选项
5. ✅ 日志文件存在且有内容
6. ✅ 能成功比较中文文件名的文件

## 📞 获取帮助

如果问题仍然存在，收集以下信息：

```bash
# 生成诊断报告
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"

{
  echo "=== 系统信息 ==="
  sw_vers
  echo ""
  
  echo "=== Cursor 版本 ==="
  cursor --version
  echo ""
  
  echo "=== 扩展状态 ==="
  cursor --list-extensions | grep gitdiff-bc
  echo ""
  
  echo "=== 扩展目录 ==="
  ls -la ~/.cursor/extensions/ | grep gitdiff-bc
  echo ""
  
  echo "=== 日志内容 ==="
  ./view-logs.sh
} > diagnostic-report.txt

# 查看报告
cat diagnostic-report.txt
```

## 🔧 一键重新安装脚本

如果需要完全重新安装：

```bash
# 使用自动化脚本
/tmp/reinstall-gitdiff-bc.sh
```

或手动执行：

```bash
# 完全卸载
cursor --uninstall-extension your-publisher-name.gitdiff-bc
rm -rf ~/.cursor/extensions/your-publisher-name.gitdiff-bc-*
killall Cursor && sleep 5

# 重新安装
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
cursor --install-extension gitdiff-bc-0.1.0.vsix --force

# 重启
killall Cursor && sleep 3 && open -a Cursor
```

---

**记住**：每次安装后必须**完全重启 Cursor**（Cmd+Q），不是重新加载窗口！

**祝您使用愉快！** 🚀


