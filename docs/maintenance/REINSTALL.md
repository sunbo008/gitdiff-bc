# 完全重新安装指南

当扩展调试时正常但安装后出现 `command 'extension.compareFileWithHead' not found` 错误时，按照以下步骤操作。

## 问题原因

- 扩展缓存未清理
- Cursor/VSCode 没有完全重启
- 旧版本残留
- 扩展激活时机问题

## 完整清理步骤

### 1. 完全卸载旧版本

```bash
# 方法 A：使用命令行
cursor --uninstall-extension your-publisher-name.gitdiff-bc

# 方法 B：在 UI 中卸载
# 1. 打开扩展面板 (Cmd+Shift+X)
# 2. 搜索 "gitdiff-bc"
# 3. 点击卸载
```

### 2. 清理扩展缓存

```bash
# 查找并删除所有相关缓存
rm -rf ~/.cursor/extensions/your-publisher-name.gitdiff-bc-*
rm -rf ~/.vscode/extensions/your-publisher-name.gitdiff-bc-*

# 清理 Cursor 的缓存目录
rm -rf ~/Library/Application\ Support/Cursor/CachedExtensions/your-publisher-name.gitdiff-bc-*
rm -rf ~/Library/Application\ Support/Cursor/CachedExtensionVSIXs/your-publisher-name.gitdiff-bc-*
```

### 3. 完全退出 Cursor

**重要**：不是关闭窗口，而是完全退出应用！

```bash
# 方法 A：菜单退出
# Cursor → Quit Cursor (或按 Cmd+Q)

# 方法 B：命令行强制退出
killall Cursor

# 等待 5 秒钟
sleep 5
```

### 4. 安装新版本

```bash
# 进入项目目录
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"

# 安装扩展
cursor --install-extension gitdiff-bc-0.1.0.vsix --force
```

### 5. 再次完全重启 Cursor

```bash
# 完全退出
killall Cursor
sleep 3

# 重新打开
open -a Cursor
```

## 验证安装

### 检查扩展是否激活

1. 打开 Cursor
2. 按 `Cmd+Shift+P` 打开命令面板
3. 输入 **"Developer: Show Running Extensions"**
4. 找到 **"gitdiff-bc"**
5. 状态应该显示为 **"Activated"**

### 检查命令是否注册

1. 打开命令面板 (`Cmd+Shift+P`)
2. 输入 "compare"
3. 应该能看到：
   - ✅ Compare File with Git HEAD
   - ✅ Compare Folder with Git HEAD

### 查看激活日志

1. 打开输出面板：`Cmd+Shift+U`
2. 从下拉菜单选择：**"Beyond Compare Git"**
3. 应该看到类似日志：

```
[INFO] Beyond Compare Git 扩展已激活
[INFO] 所有命令已注册
```

### 测试右键菜单

1. 打开一个 Git 仓库
2. 右键点击一个已提交的文件
3. 应该看到：**"Compare File with Git HEAD"**

## 如果还是不工作

### 方案 1：检查 Cursor 开发者工具

1. 菜单：**Help → Toggle Developer Tools**
2. 切换到 **Console** 标签
3. 查找任何与扩展相关的错误
4. 右键点击文件触发命令
5. 观察控制台输出

### 方案 2：手动触发激活

有时扩展需要手动触发激活：

```bash
# 1. 打开命令面板 (Cmd+Shift+P)
# 2. 输入 "Developer: Reload Window"
# 3. 重新加载窗口
```

### 方案 3：改用 * 激活事件（不推荐但有效）

如果问题持续，可以修改 `package.json`：

```json
"activationEvents": [
  "*"
]
```

然后重新打包和安装。注意：这会让扩展在启动时立即激活，可能影响启动性能。

### 方案 4：检查扩展主机进程

```bash
# 查看扩展主机进程
ps aux | grep "extensionHost"

# 如果有多个进程，可能需要重启系统
```

### 方案 5：使用 F5 调试安装的扩展

1. 打开扩展项目
2. 在 `src/extension.ts` 的 `activate` 函数开头添加断点
3. 按 **F5** 启动调试
4. 观察扩展是否被激活

## 终极解决方案：开发模式使用

如果正式安装始终有问题，可以使用开发模式：

```bash
# 1. 进入项目目录
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"

# 2. 在 Cursor 中打开项目
cursor .

# 3. 按 F5 启动调试
# 4. 在扩展开发窗口中工作
```

开发模式下扩展总是会正确激活。

## 常见问题对比

| 问题 | 调试模式 | 安装模式 | 解决方法 |
|------|---------|---------|---------|
| 命令未找到 | ✅ 正常 | ❌ 错误 | 完全重启 + 清理缓存 |
| 扩展未激活 | ✅ 正常 | ❌ 错误 | 检查 activationEvents |
| 右键菜单不显示 | ✅ 正常 | ❌ 错误 | 重新安装 + 重启 |
| Beyond Compare 未启动 | ❌ 错误 | ❌ 错误 | 检查 BC 路径配置 |

## 检查清单

安装前：
- [ ] 完全卸载旧版本
- [ ] 清理所有缓存目录
- [ ] 完全退出 Cursor（Cmd+Q）

安装：
- [ ] 使用 `--force` 参数安装
- [ ] 等待安装完成确认

安装后：
- [ ] 再次完全重启 Cursor
- [ ] 打开 Git 仓库测试
- [ ] 检查输出面板日志
- [ ] 验证命令已注册

## 调试信息收集

如果问题仍然存在，请收集以下信息：

```bash
# 1. Cursor 版本
cursor --version

# 2. 已安装扩展列表
cursor --list-extensions --show-versions | grep gitdiff-bc

# 3. 扩展目录内容
ls -la ~/.cursor/extensions/ | grep gitdiff-bc

# 4. 查看扩展清单
cat ~/.cursor/extensions/your-publisher-name.gitdiff-bc-*/package.json
```

## 联系支持

如果以上所有方法都不工作，可能是 Cursor 特有的 bug。请提供：
- Cursor 版本号
- macOS 版本号
- 完整的控制台错误日志
- "Beyond Compare Git" 输出面板日志

---

**记住**：每次重新安装后，**必须完全重启 Cursor**（不是重新加载窗口）！



