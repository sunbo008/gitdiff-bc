# Change: 添加 Git Revert 右键菜单功能

## Why

用户在开发过程中经常需要放弃对文件或文件夹的修改,恢复到 Git HEAD 版本。目前扩展只支持比较功能,缺少直接撤销修改的能力。参考 TortoiseGit 的 Revert 功能,在右键菜单中添加此功能可以提高用户的工作效率。

## What Changes

- 在资源管理器右键菜单中添加"撤销对文件的修改"命令(针对文件)
- 在资源管理器右键菜单中添加"撤销对文件夹的修改"命令(针对文件夹)
- 在终端右键菜单中添加"撤销文件修改"命令(支持从终端文本中解析文件路径)
- 实现 Git 恢复操作,使用 `git restore` 或 `git checkout HEAD --` 命令
- 执行前显示确认对话框,避免误操作
- 支持中英文国际化
- 记录详细的操作日志

## Impact

- 受影响的 specs: `beyondcompare-integration`
- 受影响的代码:
  - `package.json` - 添加新命令和菜单配置
  - `src/extension.ts` - 注册新命令
  - `src/commands/` - 添加 revert 命令实现文件
  - `src/utils/gitOps.ts` - 添加 Git revert 工具方法
  - `package.nls.json` 和 `package.nls.zh-cn.json` - 添加国际化文本











