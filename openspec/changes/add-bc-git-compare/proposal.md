# Change: 添加 VSCode Beyond Compare Git 比较功能

## Why

开发者在使用 VSCode 时经常需要比较文件或文件夹与 Git HEAD 的差异。虽然 VSCode 内置了基本的 diff 工具,但 Beyond Compare 提供了更强大的可视化比较功能。通过右键菜单直接调用 Beyond Compare 进行比较,可以大幅提升代码审查和差异分析的效率。

## What Changes

- 创建一个 VSCode 扩展,提供右键菜单命令
- 支持单文件与 Git HEAD 的比较
- 支持文件夹与 Git HEAD 的比较
- 自动检测 Beyond Compare 安装路径
- 支持配置自定义 Beyond Compare 可执行文件路径
- 提供友好的错误提示和日志记录

## Impact

- Affected specs: `beyondcompare-integration` (新增)
- Affected code: 
  - `src/extension.ts` - 扩展入口点
  - `src/commands/` - 命令实现
  - `src/utils/` - 工具函数(Git、Beyond Compare 路径检测)
  - `package.json` - 扩展配置和命令声明
  - `.vscodeignore` - 发布配置

