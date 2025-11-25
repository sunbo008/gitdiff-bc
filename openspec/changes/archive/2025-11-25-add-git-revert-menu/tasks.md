# 实现任务清单

## 1. 命令实现

- [x] 1.1 在 `src/utils/gitOps.ts` 中添加 `revertFile()` 方法
  - 执行 `git restore <file>` (Git 2.23+) 或回退到 `git checkout HEAD -- <file>`
  - 处理文件和文件夹两种情况
  - 记录日志并返回操作结果

- [x] 1.2 在 `src/utils/gitOps.ts` 中添加 `revertFolder()` 方法
  - 执行 `git restore <folder>` 或 `git checkout HEAD -- <folder>`
  - 递归处理文件夹中的所有修改
  - 记录日志并返回操作结果

- [x] 1.3 创建 `src/commands/revertFile.ts` 文件
  - 实现 `revertFileToHead()` 函数
  - 显示确认对话框,列出将要撤销的文件
  - 调用 `GitOperations.revertFile()`
  - 显示成功或失败提示
  - 添加错误处理逻辑

- [x] 1.4 创建 `src/commands/revertFolder.ts` 文件
  - 实现 `revertFolderToHead()` 函数
  - 显示确认对话框,列出将要撤销的文件夹
  - 调用 `GitOperations.revertFolder()`
  - 显示成功或失败提示
  - 添加错误处理逻辑

- [x] 1.5 在 `src/commands/revertFileFromTerminal.ts` 中实现终端 revert 功能
  - 复用现有的终端路径解析逻辑
  - 解析终端选中的文本获取文件路径
  - 调用 `revertFileToHead()` 执行撤销
  - 支持批量选中多个文件路径

## 2. 扩展注册

- [x] 2.1 在 `package.json` 中添加命令定义
  - `extension.revertFileToHead` - 撤销文件修改
  - `extension.revertFolderToHead` - 撤销文件夹修改
  - `extension.revertFileFromTerminal` - 从终端撤销文件修改

- [x] 2.2 在 `package.json` 中添加右键菜单配置
  - `explorer/context` 中添加文件 revert 菜单项 (条件: `!explorerResourceIsFolder`)
  - `explorer/context` 中添加文件夹 revert 菜单项 (条件: `explorerResourceIsFolder`)
  - `terminal/context` 中添加终端 revert 菜单项

- [x] 2.3 在 `src/extension.ts` 中注册命令
  - 注册 `extension.revertFileToHead` 命令
  - 注册 `extension.revertFolderToHead` 命令
  - 注册 `extension.revertFileFromTerminal` 命令
  - 添加到 `context.subscriptions`

## 3. 国际化

- [x] 3.1 在 `package.nls.json` 中添加英文文本
  - 命令标题: "Revert File to HEAD", "Revert Folder to HEAD"
  - 确认对话框文本
  - 成功/失败提示文本

- [x] 3.2 在 `package.nls.zh-cn.json` 中添加中文文本
  - 命令标题: "撤销对文件的修改", "撤销对文件夹的修改"
  - 确认对话框文本
  - 成功/失败提示文本

- [x] 3.3 在 `src/utils/i18n.ts` 中添加更多国际化文本
  - 错误消息
  - 进度提示
  - 确认对话框详细信息

## 4. 测试

- [ ] 4.1 手动测试资源管理器文件 revert
  - 修改一个文件后右键选择 revert
  - 验证确认对话框显示正确
  - 验证文件恢复到 HEAD 版本
  - 验证成功提示显示

- [ ] 4.2 手动测试资源管理器文件夹 revert
  - 修改文件夹中的多个文件
  - 右键文件夹选择 revert
  - 验证确认对话框列出所有修改的文件
  - 验证所有文件恢复到 HEAD 版本

- [ ] 4.3 手动测试终端 revert
  - 在终端运行 `git status`
  - 选中文件路径后右键选择 revert
  - 验证文件成功恢复
  - 测试批量选中多个文件路径

- [ ] 4.4 测试错误场景
  - 未修改的文件执行 revert (应提示无需撤销)
  - 未跟踪的新文件执行 revert (应提示无法撤销)
  - 非 Git 仓库中执行 revert (应提示错误)
  - Git 命令执行失败的场景

- [ ] 4.5 测试国际化
  - 切换 VSCode 语言到英文,验证所有文本显示正确
  - 切换 VSCode 语言到中文,验证所有文本显示正确

## 5. 文档

- [x] 5.1 更新 README.md
  - 在功能列表中添加 Git Revert 功能说明
  - 添加使用说明和警告提示
  - 说明确认对话框的作用

- [x] 5.2 更新 CHANGELOG.md
  - 添加新功能条目
  - 说明功能细节和使用场景

- [ ] 5.3 更新用户文档 (如果有)
  - 说明如何使用 revert 功能
  - 说明与 TortoiseGit 的相似性
  - 提供故障排查指南

