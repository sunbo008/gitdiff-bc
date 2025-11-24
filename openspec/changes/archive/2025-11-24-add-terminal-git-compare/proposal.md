# Change: 终端 Git 文件比较

## Why

用户在终端运行 `git status` 后，需要频繁地在资源管理器中找到修改的文件并右键比较。这个流程繁琐且低效。通过在终端右键菜单中添加比较功能，用户可以直接右键点击 `git status` 输出中的文件路径，立即启动 Beyond Compare 进行比较，大幅提升工作效率。

## What Changes

- 在终端右键菜单中添加 "与 Git HEAD 比较文件" 命令
- 支持单个文件比较：右键点击单个文件路径，直接比较
- **支持批量文件比较**：选中多行文本包含多个文件路径，批量比较每个文件
- 支持检测和解析 `git status` 输出的多种文件路径格式（带 modified: 前缀、纯路径、带缩进等）
- 当右键点击位置对应有效文件路径时，动态显示比较菜单项
- 复用现有的文件比较逻辑，保持功能一致性
- 提供友好的错误处理（文件不存在、不在 Git 仓库中等）
- 批量比较时显示进度和摘要信息

## Impact

- affected specs: `beyondcompare-integration`
- affected code: 
  - `package.json` - 添加终端右键菜单贡献点
  - `src/extension.ts` - 注册新的终端比较命令
  - 新增 `src/utils/terminalPathParser.ts` - 终端路径解析工具
  - `src/commands/compareFile.ts` - 可能需要增强以支持从路径字符串调用
  - 国际化文件 - 添加新的命令标题和提示消息

