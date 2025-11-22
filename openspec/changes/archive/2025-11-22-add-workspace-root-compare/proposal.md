# Change: 修复空白区域比较文件夹功能

## Why

当前用户在资源管理器空白区域右键点击"与 Git HEAD 比较文件夹"时，会报错：**"比较文件夹失败: 当前文件不在 Git 仓库中。"**

问题原因：
1. **菜单已存在**：VSCode 在空白区域也会显示"与 Git HEAD 比较文件夹"菜单项
2. **参数为空**：空白区域触发时，命令的 uri 参数为 undefined
3. **处理缺失**：`compareFolderWithHead` 函数没有处理 uri 为空的情况
4. **用户困惑**：用户期望在空白处右键能比较整个工作区根目录

修复此问题可以让用户在空白处右键时正确比较工作区根目录，而不是报错。

## What Changes

- 修改 `compareFolderWithHead` 函数，支持 uri 参数为可选
- 当 uri 为 undefined 时，自动使用工作区根目录
- 添加错误处理：当无工作区时显示友好提示
- 保持现有的文件夹右键菜单功能不变（带 uri 参数的调用）

## Impact

- **受影响的 specs**: `beyondcompare-integration` (修改)
- **受影响的代码**:
  - `src/commands/compareFolder.ts` - 修改函数签名和逻辑以支持可选 uri
  - `src/extension.ts` - 命令注册保持不变
- **用户体验**: 
  - 修复空白区域右键时的错误
  - 用户可以在空白处右键快速比较整个工作区
  - 不影响现有的文件夹右键功能
- **破坏性变更**: 否

