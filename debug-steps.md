# 调试步骤：为什么正常模式下菜单不显示

## 可能的原因

1. **扩展未激活** - 检查扩展是否在正常模式下正确激活
2. **缓存问题** - VSCode/Cursor 可能缓存了旧的菜单配置
3. **上下文条件** - 菜单的 `when` 条件可能不满足

## 诊断步骤

### 1. 检查扩展是否激活

在正常模式下：
1. 打开输出面板（`Ctrl+Shift+U`）
2. 从下拉菜单选择 **"Beyond Compare Git"**
3. 查看是否有类似以下的激活日志：
   ```
   [INFO] === Beyond Compare Git 扩展开始激活 ===
   [DEBUG] ✓ 命令已注册: extension.revertFileToHead
   [DEBUG] ✓ 命令已注册: extension.revertFolderToHead
   [DEBUG] ✓ 命令已注册: extension.revertFileFromTerminal
   [INFO] ✓ 所有命令已注册完成
   [INFO] === Beyond Compare Git 扩展激活完成 ===
   ```

### 2. 强制清除缓存并重新加载

尝试以下步骤：
1. 关闭所有 VSCode/Cursor 窗口
2. 删除以下文件夹（如果存在）：
   - Windows: `%APPDATA%\Code\Cache` 或 `%APPDATA%\Cursor\Cache`
   - Mac: `~/Library/Application Support/Code/Cache` 或 `~/Library/Application Support/Cursor/Cache`
   - Linux: `~/.config/Code/Cache` 或 `~/.config/Cursor/Cache`
3. 重新启动 VSCode/Cursor

### 3. 手动触发命令测试

在正常模式下：
1. 按 `Ctrl+Shift+P`（或 `Cmd+Shift+P`）
2. 输入 "Revert" 或"撤销"
3. 看看命令面板中是否能看到：
   - "撤销对文件的修改" (Revert File to HEAD)
   - "撤销对文件夹的修改" (Revert Folder to HEAD)
   - "撤销文件修改" (Revert File to HEAD - 终端版本)

如果命令面板中能看到命令，说明命令已注册，问题可能是菜单配置。

### 4. 检查文件上下文

右键菜单可能需要满足特定条件才显示：
- 必须在 **Git 仓库**中
- 必须右键点击**文件或文件夹**（不是空白区域）

### 5. 验证 package.json 是否被正确加载

运行以下命令检查：
```bash
# 在项目目录下执行
node -e "console.log(JSON.stringify(require('./package.json').contributes.menus, null, 2))"
```

应该能看到类似输出：
```json
{
  "explorer/context": [
    ...
    {
      "command": "extension.revertFileToHead",
      "when": "!explorerResourceIsFolder",
      "group": "git"
    },
    {
      "command": "extension.revertFolderToHead",
      "when": "explorerResourceIsFolder",
      "group": "git"
    }
  ],
  "terminal/context": [
    ...
    {
      "command": "extension.revertFileFromTerminal",
      "group": "z_commands"
    }
  ]
}
```

## 如果以上都正常但菜单仍不显示

可能是 VSCode/Cursor 的菜单分组问题。尝试修改 `group`:
- 将 `"group": "git"` 改为 `"group": "compare"`
- 或者改为 `"group": "navigation"`

这样菜单项会和其他命令显示在一起。









