# 安装指南 - 修复版本

## 🐛 发现的问题

我发现了代码中的两个关键 BUG：

1. **Logger 初始化顺序错误**：在初始化 Logger 之前就调用了 `Logger.info`
2. **Logger 未初始化保护**：如果 Logger 未初始化会导致崩溃

## ✅ 已修复

- ✅ 调整了 Logger 初始化顺序（现在是第一步）
- ✅ 添加了 Logger 未初始化时的降级处理（输出到控制台）
- ✅ 添加了防重复初始化保护
- ✅ 修复了激活事件配置

**新版本**: `gitdiff-bc-0.1.0.vsix` (31 KB)

---

## 📦 完整安装步骤

### 第 1 步：完全卸载旧版本

#### 在 Cursor 中卸载：

1. 打开扩展面板：`Cmd+Shift+X` (macOS)
2. 在搜索框中输入 "Beyond Compare"
3. 找到 "Beyond Compare Git 比较" 扩展
4. 点击 **卸载**
5. 如果提示需要重新加载，点击 **重新加载**

#### 或使用命令行卸载：

```bash
# 如果安装过旧版本，先卸载
code --uninstall-extension your-publisher-name.gitdiff-bc
```

### 第 2 步：完全退出并重启 Cursor

⚠️ **重要**：不是重新加载窗口，而是完全退出应用！

```bash
# macOS 完全退出 Cursor
killall Cursor

# 或者手动：
# Cmd+Q 完全退出 Cursor
```

等待 5 秒钟，确保进程完全关闭。

### 第 3 步：安装新版本

#### 方法 A - 使用命令面板（推荐）：

1. **重新启动 Cursor**
2. 按 `Cmd+Shift+P` 打开命令面板
3. 输入 "vsix" 并选择 **"Extensions: Install from VSIX..."**
4. 导航到：`/Volumes/Lzf-MoveDisk/workspace/github/diff bc/`
5. 选择 **`gitdiff-bc-0.1.0.vsix`**
6. 等待安装完成提示

#### 方法 B - 使用命令行：

```bash
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
code --install-extension gitdiff-bc-0.1.0.vsix --force
```

### 第 4 步：重启 Cursor（必须！）

安装完成后，**必须重启 Cursor**：

```bash
# macOS
killall Cursor
# 然后手动重新打开 Cursor
```

或者：
- `Cmd+Q` 完全退出
- 重新打开 Cursor

### 第 5 步：验证安装

#### 5.1 检查扩展是否激活

1. 按 `Cmd+Shift+P` 打开命令面板
2. 输入 "Developer: Show Running Extensions"
3. 在列表中查找 **"gitdiff-bc"**
4. 状态应该显示为 **"Activated"**（绿色）

#### 5.2 查看激活日志

1. 打开输出面板：`Cmd+Shift+U`
2. 从下拉菜单选择 **"Beyond Compare Git"**
3. 应该看到类似以下内容：

```
[2025-11-21T...] [INFO ] Beyond Compare Git 扩展已激活
[2025-11-21T...] [INFO ] 所有命令已注册
[2025-11-21T...] [DEBUG] 当前平台: darwin
```

**如果看不到日志输出**：
- 确保已完全重启 Cursor
- 检查输出面板下拉菜单中是否有 "Beyond Compare Git" 选项
- 如果没有，说明扩展没有激活，请重新执行第 1-4 步

#### 5.3 检查命令是否注册

1. 按 `Cmd+Shift+P` 打开命令面板
2. 输入 "compare file"
3. 应该看到：
   - **"Compare File with Git HEAD"**
   - **"Compare Folder with Git HEAD"**

#### 5.4 测试右键菜单

1. 打开一个 Git 仓库
2. 在侧边栏文件浏览器中找到一个文件
3. **右键点击文件**
4. 应该看到菜单项：**"Compare File with Git HEAD"**

### 第 6 步：测试功能

1. 在 Git 仓库中修改一个文件
2. 右键点击该文件
3. 选择 **"Compare File with Git HEAD"**
4. 应该看到：
   - 进度提示："正在准备比较..."
   - Beyond Compare 启动（如果已安装）
   - 或者错误提示（如果 BC 未安装）

---

## 🔍 故障排查

### 问题 1：安装后仍然报 "command not found"

**原因**：Cursor 可能缓存了旧版本

**解决**：
```bash
# 1. 完全卸载
code --uninstall-extension your-publisher-name.gitdiff-bc

# 2. 清理缓存
rm -rf ~/.cursor/extensions/your-publisher-name.gitdiff-bc-*
rm -rf ~/.vscode/extensions/your-publisher-name.gitdiff-bc-*

# 3. 完全退出 Cursor
killall Cursor

# 4. 等待 5 秒

# 5. 重新安装
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
code --install-extension gitdiff-bc-0.1.0.vsix --force

# 6. 启动 Cursor
open -a Cursor
```

### 问题 2：看不到日志输出

**检查清单**：
- [ ] Cursor 是否完全重启？
- [ ] 扩展是否显示为 "Activated"？
- [ ] 输出面板下拉菜单中是否有 "Beyond Compare Git"？

**如果仍然看不到**：
1. 打开开发者工具：Help > Toggle Developer Tools
2. 在 Console 标签查找：`[INFO] Beyond Compare Git 扩展已激活`
3. 如果有错误，截图发送

### 问题 3：扩展无法激活

**调试步骤**：

1. 打开开发者工具（Help > Toggle Developer Tools）
2. 切换到 Console 标签
3. 输入：
   ```javascript
   vscode.extensions.getExtension('your-publisher-name.gitdiff-bc')
   ```
4. 查看返回结果

**如果返回 undefined**：
- 扩展没有正确安装
- 重新执行完整安装步骤

### 问题 4：Beyond Compare 未找到

这是正常的功能性错误（不是 bug），配置 BC 路径：

1. 打开设置：`Cmd+,`
2. 搜索 "Beyond Compare"
3. 设置 `beyondCompare.executablePath`：
   ```
   /Applications/Beyond Compare.app/Contents/MacOS/bcomp
   ```

---

## 📋 快速验证清单

安装后，按顺序检查：

- [ ] 扩展在扩展列表中可见
- [ ] 完全重启了 Cursor
- [ ] "Show Running Extensions" 中显示 "Activated"
- [ ] 输出面板可以选择 "Beyond Compare Git"
- [ ] 日志中显示 "扩展已激活" 和 "所有命令已注册"
- [ ] 命令面板中可以找到 "Compare File with Git HEAD"
- [ ] 右键菜单显示比较选项
- [ ] 点击比较选项有反应（进度提示或错误提示）

如果以上全部 ✅，说明安装成功！

---

## 🆘 仍然无法工作？

### 尝试开发者模式

如果 .vsix 安装仍有问题，尝试开发者模式：

```bash
# 1. 进入项目目录
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"

# 2. 确保依赖已安装
npm install

# 3. 编译
npm run compile

# 4. 在 Cursor 中打开项目
code .

# 5. 按 F5 启动调试
# 这会打开一个新的扩展开发窗口
```

在扩展开发窗口中：
- 所有日志会显示在 Debug Console
- 可以设置断点调试
- 命令会自动注册

### 提供调试信息

如果还是不工作，请提供：

1. **Cursor 版本**：Help > About
2. **扩展状态**：Developer: Show Running Extensions 的截图
3. **开发者工具日志**：Console 标签的完整输出
4. **输出面板**："Beyond Compare Git" 的内容（如果有）

---

## 📝 版本信息

- **文件名**: `gitdiff-bc-0.1.0.vsix`
- **大小**: 31 KB
- **修复日期**: 2025-11-21
- **修复内容**:
  - 修复 Logger 初始化顺序
  - 添加未初始化保护
  - 修复激活事件配置

---

**准备好了吗？开始第 1 步！** 🚀

