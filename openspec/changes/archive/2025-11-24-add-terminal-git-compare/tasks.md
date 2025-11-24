# 实现任务清单

## 1. 基础设施

- [x] 1.1 创建终端路径解析器 `src/utils/terminalPathParser.ts`
  - 实现 `parseFilePathFromLine(line: string): string | null` - 从终端行提取文件路径
  - **实现 `parseMultipleFilePaths(text: string): string[]`** - 从多行文本提取所有文件路径
  - 实现 `cleanGitStatusPrefix(line: string): string` - 清理 git status 前缀
  - 实现 `resolveFilePath(relativePath: string, workspaceFolders: readonly vscode.WorkspaceFolder[]): vscode.Uri | null` - 解析为绝对路径
  - 实现 `validateFilePath(uri: vscode.Uri): Promise<boolean>` - 验证文件存在且在 Git 仓库中

- [ ] 1.2 为路径解析器编写单元测试
  - 测试 git status 各种格式的路径提取（单行）
  - **测试多行文本的批量路径提取**
  - 测试带空格的文件路径
  - 测试相对路径和绝对路径
  - 测试多工作区场景
  - 测试边界情况（空行、纯空白、无效路径等）
  - **测试混合有效和无效路径的场景**

## 2. 命令实现

- [x] 2.1 增强 `src/commands/compareFile.ts`
  - 修改 `compareFileWithHead` 函数签名，支持可选的 `filePath?: string` 参数
  - 当提供 `filePath` 时，从字符串路径构造 `vscode.Uri`
  - 保持向后兼容，现有调用方式不受影响

- [x] 2.2 创建终端比较命令处理器
  - 在 `src/extension.ts` 中注册新命令 `extension.compareFileFromTerminal`
  - 实现命令逻辑：
    1. 获取活动终端实例
    2. **检测是否有文本选中（`getTerminalSelection()`）**
    3. **如果有选中文本**：
       - 调用 `parseMultipleFilePaths()` 提取所有文件路径
       - 过滤出有效文件（存在且在 Git 仓库中）
       - **如果文件数量 > 20，显示确认对话框**
       - 批量调用 `compareFileWithHead()`，显示进度
    4. **如果无选中文本**：
       - 读取光标所在行的文本
       - 调用 `parseFilePathFromLine()` 提取单个文件路径
       - 如果路径无效，显示友好提示并返回
       - 如果路径有效，调用 `compareFileWithHead()` 进行比较
  
- [x] 2.3 实现批量比较的进度管理
  - 使用 `vscode.window.withProgress()` 显示进度条
  - 显示当前进度："正在比较第 {current}/{total} 个文件: {filename}"
  - 支持用户取消操作（`cancellationToken`）
  - 完成后显示摘要信息

- [x] 2.4 添加错误处理和日志
  - 记录路径解析过程的详细日志
  - 捕获所有异常并显示用户友好的错误消息
  - 复用现有的错误处理逻辑
  - **批量比较时记录跳过的无效路径（警告级别）**
  - **批量比较完成时记录摘要统计**

## 3. 菜单集成

- [x] 3.1 在 `package.json` 中添加终端右键菜单贡献
  - 在 `contributes.menus` 中添加 `"terminal/context"` 配置
  - 配置命令 ID 为 `extension.compareFileFromTerminal`
  - 设置 `when` 条件为 `terminalFocus` 确保仅在终端显示
  - 设置 `group` 为 `navigation` 或 `compare` 保持菜单组织合理

- [x] 3.2 确保命令在 `package.json` 的 `contributes.commands` 中注册
  - 添加命令定义，使用国际化标题
  - 命令标题复用现有的 `%command.compareFileWithHead%` 国际化键

## 4. 国际化

- [x] 4.1 在 `package.nls.json` 中添加英文文本
  - 添加终端比较命令的标题（如果需要独立的话）
  - 添加错误提示："No valid file path detected"
  - 添加进度提示："Parsing file path from terminal..."
  - **添加批量比较提示**：
    - "Comparing file {current}/{total}: {filename}"
    - "Successfully compared {success} files"
    - "Successfully compared {success} files, skipped {skipped} invalid paths"
    - "Detected {count} files. Continue batch comparison? This may open multiple Beyond Compare windows."

- [x] 4.2 在 `package.nls.zh-cn.json` 中添加中文文本
  - 添加终端比较命令的标题（如果需要独立的话）
  - 添加错误提示："未检测到有效的文件路径"
  - 添加进度提示："正在从终端解析文件路径..."
  - **添加批量比较提示**：
    - "正在比较第 {current}/{total} 个文件: {filename}"
    - "成功比较 {success} 个文件"
    - "成功比较 {success} 个文件，跳过 {skipped} 个无效路径"
    - "检测到 {count} 个文件，是否继续批量比较？这可能会打开多个 Beyond Compare 窗口"

- [x] 4.3 在代码中使用国际化函数 `t()`
  - 所有用户可见的字符串都使用 `t()` 包裹
  - 确保动态生成的消息支持参数插值

## 5. 文档更新

- [x] 5.1 更新 `README.md`
  - 在"功能"部分添加"从终端比较文件"的说明
  - **说明单文件和批量比较两种模式**
  - 添加使用示例和截图（展示终端右键菜单）
  - 说明支持的路径格式
  - **添加批量比较的使用场景示例（如 git status 多个文件）**

- [x] 5.2 更新 `CHANGELOG.md`
  - 添加新功能条目："新增：支持在终端右键菜单中比较 git status 输出的文件"
  - **添加条目："新增：支持在终端中选中多个文件批量比较"**
  - 说明支持的使用场景

- [ ] 5.3 更新用户文档 `docs/user/QUICKSTART.md`
  - 添加"从终端比较"章节
  - 提供详细的使用步骤
  - 说明常见的路径格式和注意事项

## 6. 测试

- [ ] 6.1 手动测试 - 基本功能（单文件）
  - 在终端运行 `git status`，右键点击 modified 文件路径（不选中文本）
  - 验证 Beyond Compare 正常启动并显示文件差异
  - 测试 new file、带缩进、纯路径等各种格式

- [ ] 6.2 手动测试 - 批量比较功能
  - 在终端运行 `git status`，选中 3-5 个文件路径
  - 右键选择"与 Git HEAD 比较文件"
  - 验证进度提示正确显示
  - 验证 Beyond Compare 依次打开每个文件的比较窗口
  - 验证完成后显示正确的摘要信息

- [ ] 6.3 手动测试 - 批量比较边界情况
  - **选中 20+ 个文件**，验证显示确认对话框
  - **选中包含部分无效路径的文本**，验证跳过无效路径并显示摘要
  - **在批量比较进行中点击取消**，验证停止后续比较
  - 选中空行和注释行混合的文本，验证正确过滤

- [ ] 6.4 手动测试 - 错误场景
  - 右键点击非文件路径的行（无选中文本），验证提示信息
  - 右键点击不存在的文件路径，验证错误提示
  - 右键点击非 Git 仓库中的文件，验证错误提示

- [ ] 6.5 手动测试 - 多工作区
  - 打开多个工作区，在终端比较不同工作区的文件
  - 验证路径解析正确
  - **批量比较来自不同工作区的文件**

- [ ] 6.6 手动测试 - 跨平台
  - 在 Windows 上测试（如有环境）
  - 在 macOS 上测试
  - 在 Linux 上测试（如有环境）
  - **各平台测试批量比较功能**

- [ ] 6.7 手动测试 - 国际化
  - 切换 VSCode 语言为英文，验证命令名称和提示
  - 切换 VSCode 语言为中文，验证命令名称和提示
  - **验证批量比较的进度和摘要提示国际化正确**

## 7. 清理和优化

- [x] 7.1 代码审查
  - 检查代码风格是否符合项目规范
  - 确保所有公共 API 都有 JSDoc 注释
  - 确保日志记录完整且有意义

- [x] 7.2 性能优化
  - 确保路径解析不阻塞 UI
  - 避免不必要的文件系统访问
  - 考虑缓存终端路径解析结果（如果频繁调用）

- [x] 7.3 Linter 检查
  - TypeScript 编译成功，无错误
  - 项目未配置 ESLint（跳过）

## 8. 完成

- [x] 8.1 最终验证
  - ✅ 所有实现任务已完成
  - ✅ `npm run compile` 编译成功
  - ⏳ 本地功能测试待用户执行
  - ✅ CHANGELOG.md 已更新

> **注意**：代码提交和版本发布由维护者手动执行，不在此任务列表中。

