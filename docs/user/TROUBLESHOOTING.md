# 故障排查指南

## 问题：`command 'extension.compareFileWithHead' not found`

### 原因分析

这个错误表示扩展的命令没有被正确注册，通常是因为扩展还没有激活。

### ✅ 已修复

我已经修复了这个问题，原因是 `activationEvents` 配置不当：

**修复前**:
```json
"activationEvents": [
  "onCommand:extension.compareFileWithHead",
  "onCommand:extension.compareFolderWithHead"
]
```

**修复后**:
```json
"activationEvents": [
  "onStartupFinished"
]
```

使用 `onStartupFinished` 可以确保扩展在 VSCode/Cursor 启动完成后就激活，不会影响启动性能，同时保证在右键点击时命令已经注册。

### 解决步骤

#### 1. 卸载旧版本

在 VSCode/Cursor 中：
1. 打开扩展面板（Ctrl+Shift+X 或 Cmd+Shift+X）
2. 找到 "Beyond Compare Git 比较" 扩展
3. 点击 **卸载**
4. **重启编辑器**（重要！）

#### 2. 安装新版本

**方法 A - 通过命令面板**:
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
2. 输入 "Install from VSIX"
3. 选择 **新的** `gitdiff-bc-0.1.0.vsix` 文件
4. 重启编辑器

**方法 B - 通过命令行**:
```bash
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
code --install-extension gitdiff-bc-0.1.0.vsix --force
```

#### 3. 验证安装

1. 重启 VSCode/Cursor
2. 打开输出面板：`Ctrl+Shift+U` (或 `Cmd+Shift+U`)
3. 选择 "Beyond Compare Git" 频道
4. 应该看到类似以下日志：
   ```
   [2025-11-21T...] [INFO ] Beyond Compare Git 扩展已激活
   [2025-11-21T...] [INFO ] 所有命令已注册
   ```

#### 4. 测试功能

1. 在一个 Git 仓库中打开文件
2. 右键点击文件
3. 应该看到 "Compare File with Git HEAD" 选项
4. 点击后 Beyond Compare 应该启动

### 其他可能的问题

#### 问题：右键菜单没有出现命令

**检查**:
- 确保文件在 Git 仓库中
- 确保右键点击的是文件（不是文件夹）
- 文件夹比较使用 "Compare Folder with Git HEAD"

#### 问题：扩展没有激活

**调试步骤**:
1. 打开命令面板（Ctrl+Shift+P）
2. 运行 "Developer: Show Running Extensions"
3. 查找 "gitdiff-bc"
4. 应该显示为 "Activated"

**如果显示未激活**:
- 检查扩展是否正确安装
- 查看 Developer Console（Help > Toggle Developer Tools）是否有错误

#### 问题：Beyond Compare 启动失败

**检查**:
1. 确保已安装 Beyond Compare
2. 配置自定义路径：
   - 打开设置（Ctrl+,）
   - 搜索 "Beyond Compare"
   - 设置 `beyondCompare.executablePath`

**不同平台的路径**:
```json
// Windows
"beyondCompare.executablePath": "C:\\Program Files\\Beyond Compare 4\\BCompare.exe"

// macOS
"beyondCompare.executablePath": "/Applications/Beyond Compare.app/Contents/MacOS/bcomp"

// Linux
"beyondCompare.executablePath": "/usr/bin/bcompare"
```

### 日志查看

开启详细日志：
1. 打开设置
2. 搜索 `beyondCompare.logLevel`
3. 设置为 "debug"
4. 重启编辑器
5. 查看输出面板的 "Beyond Compare Git" 频道

### 完全重置

如果以上都不工作，尝试完全重置：

```bash
# 1. 卸载扩展
code --uninstall-extension your-publisher-name.gitdiff-bc

# 2. 清理缓存（可选）
rm -rf ~/.vscode/extensions/your-publisher-name.gitdiff-bc-*

# 3. 重启编辑器

# 4. 重新安装
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"
code --install-extension gitdiff-bc-0.1.0.vsix --force

# 5. 再次重启编辑器
```

### 开发者模式测试

如果你是在开发模式中测试：

```bash
# 1. 进入项目目录
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"

# 2. 确保依赖已安装
npm install

# 3. 编译代码
npm run compile

# 4. 在 VSCode/Cursor 中按 F5 启动调试
# 这会打开一个新的扩展开发窗口
```

在扩展开发窗口中：
- 命令会自动注册
- 可以在 Debug Console 查看详细日志
- 修改代码后需要重新加载窗口（Ctrl+R）

### 还是不工作？

如果问题仍然存在：

1. **检查 VSCode/Cursor 版本**:
   - 需要 1.60.0 或更高版本
   - Help > About 查看版本号

2. **查看扩展日志**:
   - 输出面板 > "Beyond Compare Git"
   - Developer Console（Help > Toggle Developer Tools）

3. **检查冲突**:
   - 其他扩展可能有冲突
   - 尝试禁用其他 Git 或比较工具相关的扩展

4. **系统权限**:
   - macOS: 可能需要授予完全磁盘访问权限
   - Linux: 检查文件执行权限

### 版本信息

- **当前版本**: 0.1.0
- **修复日期**: 2025-11-21
- **修复内容**: 更改激活事件为 `onStartupFinished`

---

**如果问题仍未解决，请提供以下信息**:
1. VSCode/Cursor 版本
2. 操作系统版本
3. "Beyond Compare Git" 输出面板的完整日志
4. Developer Console 中的错误信息（如有）

